import logging

logger = logging.getLogger("backend.services.analysis.portfolio_extractor")

class PortfolioExtractor:
    """
    Parses and cleans raw Jina AI Reader Markdown content.
    """
    
    @staticmethod
    def clean_markdown(markdown_content: str) -> str:
        """
        Cleans Jina's extracted markdown by removing redundant whitespace,
        empty lines, and formatting relics.
        """
        logger.info("Cleaning raw Portfolio Markdown content")
        if not markdown_content:
            return ""
            
        lines = []
        for line in markdown_content.splitlines():
            cleaned_line = line.strip()
            if cleaned_line:
                lines.append(cleaned_line)
                
        # Join lines back with single line breaks
        cleaned_content = "\n".join(lines)
        logger.info(f"Cleaned markdown content: {len(cleaned_content)} characters.")
        return cleaned_content
