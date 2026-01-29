import os
import requests
import base64
from typing import Optional
from fastmcp import FastMCP

mcp = FastMCP("DataForSEO")

BASE_URL = "https://api.dataforseo.com/v3"

def get_auth_header():
    """Get base64 encoded auth header"""
    login = os.getenv("DATAFORSEO_LOGIN")
    password = os.getenv("DATAFORSEO_PASSWORD")
    credentials = f"{login}:{password}"
    encoded = base64.b64encode(credentials.encode()).decode()
    return f"Basic {encoded}"

@mcp.tool()
def serp_google_organic(
    keyword: str,
    location_code: int = 2840,  # USA
    language_code: str = "en",
    depth: int = 10
) -> str:
    """
    Get Google organic search results for a keyword.
    
    Args:
        keyword: Search keyword
        location_code: Location code (2840=USA, 2826=UK, 2036=Canada)
        language_code: Language (en, es, fr, de, etc.)
        depth: Number of results (10-100)
    """
    headers = {"Authorization": get_auth_header()}
    payload = [{
        "keyword": keyword,
        "location_code": location_code,
        "language_code": language_code,
        "depth": depth
    }]
    
    response = requests.post(
        f"{BASE_URL}/serp/google/organic/live/advanced",
        json=payload,
        headers=headers,
        timeout=30
    )
    return str(response.json())

@mcp.tool()
def keywords_for_keywords(
    keywords: str,
    location_code: int = 2840,
    language_code: str = "en"
) -> str:
    """
    Get keyword suggestions and search volume data.
    
    Args:
        keywords: Comma-separated keywords
        location_code: Location code
        language_code: Language code
    """
    headers = {"Authorization": get_auth_header()}
    keyword_list = [k.strip() for k in keywords.split(",")]
    payload = [{
        "keywords": keyword_list,
        "location_code": location_code,
        "language_code": language_code
    }]
    
    response = requests.post(
        f"{BASE_URL}/keywords_data/google_ads/keywords_for_keywords/live",
        json=payload,
        headers=headers,
        timeout=30
    )
    return str(response.json())

@mcp.tool()
def serp_competitors(
    keyword: str,
    location_code: int = 2840,
    language_code: str = "en"
) -> str:
    """
    Get competitors ranking for a keyword.
    
    Args:
        keyword: Search keyword
        location_code: Location code
        language_code: Language code
    """
    headers = {"Authorization": get_auth_header()}
    payload = [{
        "keyword": keyword,
        "location_code": location_code,
        "language_code": language_code
    }]
    
    response = requests.post(
        f"{BASE_URL}/dataforseo_labs/google/competitors_domain/live",
        json=payload,
        headers=headers,
        timeout=30
    )
    return str(response.json())

@mcp.tool()
def domain_overview(
    target: str
) -> str:
    """
    Get domain overview including traffic and rankings.
    
    Args:
        target: Domain name (e.g., example.com)
    """
    headers = {"Authorization": get_auth_header()}
    payload = [{
        "target": target
    }]
    
    response = requests.post(
        f"{BASE_URL}/dataforseo_labs/google/domain_whois_overview/live",
        json=payload,
        headers=headers,
        timeout=30
    )
    return str(response.json())

@mcp.tool()
def backlinks_summary(
    target: str
) -> str:
    """
    Get backlink summary for a domain.
    
    Args:
        target: Domain name
    """
    headers = {"Authorization": get_auth_header()}
    payload = [{
        "target": target
    }]
    
    response = requests.post(
        f"{BASE_URL}/backlinks/summary/live",
        json=payload,
        headers=headers,
        timeout=30
    )
    return str(response.json())

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    
    mcp.run(
        transport="streamable-http",
        host="0.0.0.0",
        port=port
    )
