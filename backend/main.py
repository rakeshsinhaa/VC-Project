from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from models import EnrichmentRequest, EnrichmentResponse
from scraper import scrape_website_text
from ai_extractor import extract_company_data
from cache import get_cached_enrichment, set_cached_enrichment

app = FastAPI(title="VC Intelligence API", version="1.0.0")

# CORS setup to allow the frontend to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "VC Intelligence API is running."}

@app.post("/enrich", response_model=EnrichmentResponse)
async def enrich_company(request: EnrichmentRequest = Body(...)):
    """
    Enrich a company profile by fetching data from their website and
    using AI to extract structured signals and summaries.
    """
    url_str = str(request.url)
    
    # 1. Check Cache
    cached = get_cached_enrichment(url_str)
    if cached:
        print(f"Cache hit for {url_str}")
        return cached
        
    print(f"Cache miss for {url_str}. Starting enrichment pipeline...")

    # 2. Scrape Website
    scraped_data = scrape_website_text(url_str)
    text = scraped_data.get('text', '')
    icon_url = scraped_data.get('icon_url')
    banner_url = scraped_data.get('banner_url')
    
    if not text:
        raise HTTPException(
            status_code=400, 
            detail="Failed to retrieve or parse text from the provided URL."
        )
        
    # 3. Extract Structured AI Data
    try:
        result = await extract_company_data(url_str, text, icon_url, banner_url)
        
        # 4. Cache and Return
        set_cached_enrichment(url_str, result)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
