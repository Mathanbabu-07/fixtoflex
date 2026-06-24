import logging
from typing import Dict, Any
import io

logger = logging.getLogger("backend.services.analysis.resume_extractor")

class ResumeExtractor:
    """
    Parses raw Resume (PDF/DOCX) bytes and extracts plain text.
    """
    
    @staticmethod
    def extract(file_bytes: bytes, filename: str) -> Dict[str, Any]:
        logger.info(f"Extracting data from resume: {filename}")
        
        text_content = ""
        
        try:
            if filename.lower().endswith(".pdf"):
                import fitz
                doc = fitz.open(stream=file_bytes, filetype="pdf")
                for page in doc:
                    text_content += page.get_text() + "\n"
                doc.close()
            elif filename.lower().endswith(".docx"):
                import docx
                doc = docx.Document(io.BytesIO(file_bytes))
                for para in doc.paragraphs:
                    text_content += para.text + "\n"
            else:
                logger.warning(f"Unsupported file format: {filename}, attempting to decode as utf-8")
                text_content = file_bytes.decode('utf-8', errors='ignore')
                
        except Exception as e:
            logger.error(f"Error during Resume parsing: {e}")
            
        data = {
            "filename": filename,
            "raw_text": text_content.strip()
        }
            
        logger.info(f"Extracted {len(data['raw_text'])} characters from resume.")
        return data
