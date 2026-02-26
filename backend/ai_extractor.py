import os
import json
from google import genai
from google.genai import types
from datetime import datetime
from models import EnrichmentResponse, DataSource
from dotenv import load_dotenv

load_dotenv()

# Initialize Gemini client
# Requires GEMINI_API_KEY environment variable
gemini_client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def extract_company_data(url: str, text: str, icon_url: str = None, banner_url: str = None) -> EnrichmentResponse:
    """
    Sends the scraped text to an LLM to extract structured data.
    """
    if not text:
        return EnrichmentResponse(
            summary="Could not extract text from the website.",
            what_they_do=["N/A"],
            keywords=["N/A"],
            derived_signals=["N/A"],
            sources=[DataSource(url=url, timestamp=datetime.utcnow().isoformat())],
            icon_url=icon_url,
            banner_url=banner_url
        )

    system_prompt = """
    You are a VC intelligence analyst. Given the scraped text of a company's website, extract the following structured information in JSON format:
    {
        "summary": "A 1-2 sentence high-level summary of the company.",
        "what_they_do": ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"], // Exactly 3-6 bullets
        "keywords": ["keyword1", "keyword2", ...], // Exactly 5-10 keywords representing tech stack, industry, or domain
        "derived_signals": ["signal1", "signal2"] // Exactly 2-4 inferred signals (e.g., 'B2B SaaS', 'Enterprise focus', 'AI Native')
    }
    Make sure to return valid JSON ONLY.
    """

    try:
        response = gemini_client.models.generate_content(
            model='gemini-2.5-flash',
            contents=f"Website Text (Truncated):\n{text}",
            config=types.GenerateContentConfig(
                system_instruction=system_prompt,
                temperature=0.2,
                response_mime_type="application/json",
            ),
        )

        content = response.text
        data = json.loads(content)
        
        # Build the final Pydantic model response
        return EnrichmentResponse(
            summary=data.get("summary", "N/A"),
            what_they_do=data.get("what_they_do", []),
            keywords=data.get("keywords", []),
            derived_signals=data.get("derived_signals", []),
            sources=[DataSource(url=url, timestamp=datetime.utcnow().isoformat())],
            icon_url=icon_url,
            banner_url=banner_url
        )
    except Exception as e:
        print(f"AI Extraction error for {url}: {repr(e)}")
        # Return fallback mock data if LLM call fails
        return EnrichmentResponse(
            summary="Failed to analyze company using AI.",
            what_they_do=["Error parsing website content"],
            keywords=["Error"],
            derived_signals=["Error"],
            sources=[DataSource(url=url, timestamp=datetime.utcnow().isoformat())],
            icon_url=icon_url,
            banner_url=banner_url
        )
