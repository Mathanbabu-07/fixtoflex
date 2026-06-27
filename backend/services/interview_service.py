import json
import logging
from typing import Dict, Any, List, Optional
import google.generativeai as genai
from config.database import settings, get_supabase_client

logger = logging.getLogger("backend.services.interview_service")

class InterviewService:
    def __init__(self):
        self.supabase = get_supabase_client()
        self.gemini_key = settings.GEMINI_INTERVIEW_API_KEY
        if self.gemini_key and self.gemini_key != "your-gemini-interview-api-key":
            genai.configure(api_key=self.gemini_key)
        self.model_name = "gemini-2.5-flash" # fallback for standard flash if 3.1 flash lite not avail
        # Task specifies Gemini 3.1 Flash Lite. 
        if settings.GEMINI_MODEL:
             self.model_name = settings.GEMINI_MODEL
             
        self.model = genai.GenerativeModel(self.model_name)

    async def _get_candidate_profile(self, user_id: str) -> Dict[str, Any]:
        """Loads cached profile data from existing analysis."""
        profile_data = {}
        
        try:
            # User Basic Info
            user_res = self.supabase.table("users").select("*").eq("id", user_id).execute()
            if user_res.data:
                profile_data["user"] = user_res.data[0]
        except Exception as e:
            logger.warning(f"Failed to fetch user info: {e}")
            
        try:
            # Resume Summary
            resume_res = self.supabase.table("resume_analysis_results").select("gemini_summary").eq("user_id", user_id).order('created_at', desc=True).limit(1).execute()
            if resume_res.data and resume_res.data[0].get("gemini_summary"):
                profile_data["resume"] = resume_res.data[0]["gemini_summary"]
        except Exception as e:
            logger.warning(f"Failed to fetch resume summary: {e}")
            
        try:
            # Portfolio Summary
            portfolio_res = self.supabase.table("portfolio_analysis_history").select("summary_json").eq("user_id", user_id).order('created_at', desc=True).limit(1).execute()
            if portfolio_res.data and portfolio_res.data[0].get("summary_json"):
                 profile_data["portfolio"] = portfolio_res.data[0]["summary_json"]
        except Exception as e:
            logger.warning(f"Failed to fetch portfolio summary: {e}")
             
        try:
            # LinkedIn/Career Intelligence (Experience, Skills, Certifications are usually here or in resume)
            linkedin_res = self.supabase.table("linkedin_analysis_results").select("summary_json").eq("user_id", user_id).order('created_at', desc=True).limit(1).execute()
            if linkedin_res.data and linkedin_res.data[0].get("summary_json"):
                 profile_data["linkedin"] = linkedin_res.data[0]["summary_json"]
        except Exception as e:
            logger.warning(f"Failed to fetch linkedin analysis: {e}")

        return profile_data

    async def start_interview(self, user_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        difficulty = payload.get("difficulty", "Easy")
        total_questions = payload.get("total_questions", 5)
        
        # Create session
        session_res = self.supabase.table("interview_sessions").insert({
            "user_id": user_id,
            "difficulty": difficulty,
            "total_questions": total_questions,
            "overall_score": 0,
            "final_report_json": {}
        }).execute()
        
        if not session_res.data:
            raise Exception("Failed to create interview session")
            
        session_id = session_res.data[0]["id"]
        
        # Generate first question
        question = await self.generate_next_question(user_id, session_id, difficulty, [])
        
        return {
            "session_id": session_id,
            "question": question,
            "question_number": 1,
            "total_questions": total_questions
        }

    async def generate_next_question(self, user_id: str, session_id: str, difficulty: str, previous_questions: List[str]) -> str:
        if not self.gemini_key or self.gemini_key == "your-gemini-interview-api-key":
             return "Can you tell me about yourself and your background? (Mock Question - API Key missing)"
             
        profile_data = await self._get_candidate_profile(user_id)
        
        prompt = f"""
        You are an expert HR and Technical Interviewer at a top software company.
        You are interviewing a candidate for a software engineering role.
        
        Candidate Profile Summary (Use this to personalize the question):
        {json.dumps(profile_data)[:3000]}
        
        Interview Difficulty: {difficulty}
        Previous Questions Asked (Do not repeat these): {json.dumps(previous_questions)}
        
        Generate ONE personalized interview question for this candidate.
        The question should be based on their resume, portfolio, skills, projects, experience, or certifications.
        If this is the first question, you can start with a variation of "Tell me about yourself" but try to incorporate their background.
        
        Return ONLY the question text. Keep it concise, natural, and conversational.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            logger.error(f"Error generating question with Gemini: {e}")
            return "Could you describe your most recent project and the technologies you used?"

    async def evaluate_answer(self, user_id: str, session_id: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        question_text = payload.get("question_text", "")
        transcript = payload.get("transcript", "")
        
        # Evaluate with Gemini
        evaluation = await self._evaluate_with_gemini(question_text, transcript)
        
        # Save to DB
        self.supabase.table("interview_questions").insert({
            "session_id": session_id,
            "question_text": question_text,
            "transcript": transcript,
            "evaluation_score": evaluation.get("score", 0),
            "feedback_json": evaluation
        }).execute()
        
        # Check if we need to generate next question
        session_res = self.supabase.table("interview_sessions").select("*").eq("id", session_id).execute()
        session = session_res.data[0]
        total_questions = session["total_questions"]
        
        questions_res = self.supabase.table("interview_questions").select("question_text").eq("session_id", session_id).execute()
        questions_asked_count = len(questions_res.data)
        previous_questions = [q["question_text"] for q in questions_res.data]
        
        if questions_asked_count < total_questions:
             next_question = await self.generate_next_question(user_id, session_id, session["difficulty"], previous_questions)
             return {
                 "status": "continue",
                 "question": next_question,
                 "question_number": questions_asked_count + 1,
                 "evaluation": evaluation # return evaluation of previous answer optionally
             }
        else:
             # End of interview, generate final report
             report = await self.generate_final_report(session_id)
             return {
                 "status": "completed",
                 "report": report
             }
             
    async def _evaluate_with_gemini(self, question: str, transcript: str) -> Dict[str, Any]:
        if not self.gemini_key or self.gemini_key == "your-gemini-interview-api-key":
             return {
                 "score": 75,
                 "feedback": "This is mock feedback because the Gemini API key is missing. Good attempt.",
                 "hr_perspective": "Try to structure your answers more clearly.",
                 "categories": {
                     "Technical Knowledge": 80,
                     "Communication": 70,
                     "Confidence": 75
                 }
             }
             
        prompt = f"""
        You are an expert HR and Technical Interviewer. Evaluate the candidate's spoken answer to the interview question.
        
        Question: {question}
        Candidate's Answer (Transcript): {transcript}
        
        Evaluate the answer strictly and provide actionable feedback.
        Score the following categories out of 100: Technical Knowledge, Problem Solving, Decision Making, Communication, Confidence, Content Delivery, Practical Thinking.
        Calculate an overall average score (0-100).
        Provide a specific HR Perspective (what recruiters would think).
        Provide a "Preferred Answer Style" showing how they could have structured it better (e.g., STAR method, Problem/Solution/Result).
        
        Return the result as a raw JSON object (without markdown code blocks) matching this schema:
        {{
            "score": <overall_score_int>,
            "feedback": "<general feedback on the answer>",
            "hr_perspective": "<recruiter's perspective>",
            "preferred_answer_style": "<how to structure it better>",
            "categories": {{
                 "Technical Knowledge": <int>,
                 "Problem Solving": <int>,
                 "Decision Making": <int>,
                 "Communication": <int>,
                 "Confidence": <int>,
                 "Content Delivery": <int>,
                 "Practical Thinking": <int>
            }}
        }}
        """
        try:
             response = self.model.generate_content(prompt)
             text = response.text.strip()
             if text.startswith("```json"):
                 text = text[7:-3]
             elif text.startswith("```"):
                 text = text[3:-3]
             return json.loads(text.strip())
        except Exception as e:
             logger.error(f"Error evaluating answer: {e}")
             return {"score": 50, "feedback": "Failed to evaluate answer.", "hr_perspective": "", "categories": {}}

    async def generate_final_report(self, session_id: str) -> Dict[str, Any]:
        questions_res = self.supabase.table("interview_questions").select("*").eq("session_id", session_id).execute()
        questions = questions_res.data
        
        if not questions:
            return {}
            
        total_score = sum(q.get("evaluation_score", 0) for q in questions)
        overall_score = int(total_score / len(questions))
        
        # Calculate average category scores
        category_totals = {}
        category_counts = {}
        
        for q in questions:
            cats = q.get("feedback_json", {}).get("categories", {})
            for cat, score in cats.items():
                if isinstance(score, (int, float)):
                    category_totals[cat] = category_totals.get(cat, 0) + score
                    category_counts[cat] = category_counts.get(cat, 0) + 1
                    
        category_averages = {cat: int(category_totals[cat] / category_counts[cat]) for cat in category_totals}
        
        # Generate summary (Strengths, Areas to Improve) based on all answers
        # For simplicity in this iteration without making another Gemini call for the overall report, 
        # we will aggregate them programmatically or return the detailed question feedback.
        
        final_report = {
            "overall_score": overall_score,
            "performance_breakdown": category_averages,
            "detailed_feedback": questions, # The frontend will render strengths/weaknesses from this
            "hiring_recommendation": "Likely to clear Round 1" if overall_score > 70 else "Needs improvement before Technical Round 2",
            "preparation_plan": {
                 "Technical Topics": "Medium",
                 "Communication": "High" if category_averages.get("Communication", 100) < 70 else "Low",
                 "Mock Practice": "High"
            }
        }
        
        # Update session
        self.supabase.table("interview_sessions").update({
            "overall_score": overall_score,
            "final_report_json": final_report
        }).eq("id", session_id).execute()
        
        return final_report
        
    async def get_history(self, user_id: str) -> List[Dict[str, Any]]:
        res = self.supabase.table("interview_sessions").select("*").eq("user_id", user_id).order('created_at', desc=True).execute()
        return res.data
