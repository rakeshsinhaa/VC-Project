from pydantic import BaseModel, HttpUrl
from typing import List, Optional

class EnrichmentRequest(BaseModel):
    url: HttpUrl

class DataSource(BaseModel):
    url: str
    timestamp: str

class EnrichmentResponse(BaseModel):
    summary: str
    what_they_do: List[str]
    keywords: List[str]
    derived_signals: List[str]
    sources: List[DataSource]
    icon_url: Optional[str] = None
    banner_url: Optional[str] = None
