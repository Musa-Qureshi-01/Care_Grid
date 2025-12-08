# tools/web_scraper.py

import requests
from bs4 import BeautifulSoup

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/123.0 Safari/537.36"
)

HEADERS = {"User-Agent": USER_AGENT}


def _safe_get(url: str) -> str:
    """Small helper with guardrails so scrape never crashes the pipeline."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=5)
        if resp.status_code == 200:
            return resp.text
    except Exception:
        return ""
    return ""


def scrape_example_directory(name: str) -> dict:
    """
    Minimal real scraping example.

    For hackathon/demo, this hits a neutral public page that
    mimics a provider directory layout (you can later switch
    to Healthgrades / any real site).

    Returns:
      {
        "scraped_phone": ...,
        "scraped_address": ...,
        "scraped_name": ...
      }
    """
    # Demo: use a public HTML sample that always exists
    url = "https://httpbin.org/html"
    html = _safe_get(url)
    if not html:
        return {}

    soup = BeautifulSoup(html, "html.parser")

    # This is just a pattern demo – adjust to real site if needed
    scraped_name = soup.find("h1").get_text(strip=True) if soup.find("h1") else None

    # Fake defaults just to show the structure
    return {
        "scraped_name": scraped_name or name,
        "scraped_address": None,
        "scraped_phone": None,
    }
