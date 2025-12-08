import random
from tools.web_scraper import scrape_example_directory

def get_google_data(name: str, address: str) -> dict:
    # existing synthetic / mock logic ...
    google_result = {
        "google_phone": "...",
        "google_address": "...",
        "google_name": name,
    }

    # 🔹 Add real scrape enrichment (non-blocking)
    scraped = scrape_example_directory(name)
    # Prefer real scraped values if present
    if scraped.get("scraped_phone"):
        google_result["google_phone"] = scraped["scraped_phone"]
    if scraped.get("scraped_address"):
        google_result["google_address"] = scraped["scraped_address"]

    return google_result

def get_google_data(name, address):
    """
    Returns synthetic Google My Business validation data.
    """

    phones = [
        "(549) 736-9965", "(480) 660-6800", "(429) 481-6247",
        "(664) 227-4222", "(425) 636-2017", "(671) 471-1010"
    ]

    street_suffixes = ["Drive", "St", "Ave", "Blvd"]
    states = ["PA", "FL", "TX", "MI", "GA", "NY", "OH", "NC", "CA", "IL"]

    scenarios = [
        # 40% = perfect
        {
            "google_phone": random.choice(phones),
            "google_address": address,
            "google_specialty": None,
            "source_reliability": 0.9
        },

        # 30% = different address
        {
            "google_phone": random.choice(phones),
            "google_address": f"{random.randint(1000,9000)} Oak {random.choice(street_suffixes)}, {random.choice(states)}",
            "google_specialty": None,
            "source_reliability": 0.75
        },

        # 20% missing phone
        {
            "google_phone": None,
            "google_address": address,
            "google_specialty": None,
            "source_reliability": 0.5
        },

        # 10% = no result
        {
            "google_phone": None,
            "google_address": None,
            "google_specialty": None,
            "source_reliability": 0.2
        }
    ]

    return random.choice(scenarios)
