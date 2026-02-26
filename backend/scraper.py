import requests
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin

def scrape_website_text(url: str) -> dict:
    """
    Fetches the HTML of the given URL and extracts meaningful text, icon, and banner.
    Returns a dictionary with extracted data.
    """
    if not url.startswith('http'):
        url = 'https://' + url

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Extract metadata for banner and icon
        icon_url = None
        banner_url = None
        
        # Look for favicon
        icon_tag = soup.find('link', rel=lambda x: x and 'icon' in x.lower())
        if icon_tag and icon_tag.get('href'):
            icon_url = urljoin(url, icon_tag['href'])
            
        # Look for OpenGraph or Twitter images
        og_image = soup.find('meta', property='og:image')
        if not og_image:
            og_image = soup.find('meta', attrs={'name': 'twitter:image'})
            
        if og_image and og_image.get('content'):
            banner_url = urljoin(url, og_image['content'])
            
        # Remove script and style elements
        for script_or_style in soup(['script', 'style', 'noscript', 'meta', 'link', 'header', 'footer']):
            script_or_style.decompose()
            
        # Extract text structure
        text = soup.get_text(separator=' ')
        
        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        # Truncate to avoid massive token usage (MVP focus)
        return {
            'text': text[:5000],
            'icon_url': icon_url,
            'banner_url': banner_url
        }
    except Exception as e:
        print(f"Scraping error for {url}: {e}")
        return {
            'text': "",
            'icon_url': None,
            'banner_url': None
        }
