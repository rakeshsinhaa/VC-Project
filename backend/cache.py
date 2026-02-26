from typing import Dict, Optional
from models import EnrichmentResponse

# Simple in-memory cache for the MVP
# Maps URL string to EnrichmentResponse
_cache: Dict[str, EnrichmentResponse] = {}

def get_cached_enrichment(url: str) -> Optional[EnrichmentResponse]:
    """Retrieve an enrichment response from the cache if it exists."""
    return _cache.get(url)

def set_cached_enrichment(url: str, response: EnrichmentResponse) -> None:
    """Store an enrichment response in the cache."""
    _cache[url] = response
