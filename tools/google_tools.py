import re
from langchain_community.tools import DuckDuckGoSearchRun

def get_google_data(name: str, address: str) -> dict:
    """
    Returns Real-Time Web Verification data using DuckDuckGo.
    Replaces static mocks with actual search results.
    """
    try:
        search = DuckDuckGoSearchRun()
        query = f"{name} {address} phone number address"
        results = search.run(query)
        
        # Simple extraction logic (improvised for hackathon)
        # Extract phone (US format)
        phone_match = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', results)
        found_phone = phone_match.group(0) if phone_match else None
        
        # Check if name/address appears in snippet
        name_match = name.split()[-1] in results # Check last name
        address_match = address.split()[0] in results if address else False
        
        match_type = "Live Web Verification"
        reliability = 0.95
        
        if not name_match:
            match_type = "Partial/Unverified"
            reliability = 0.5
            
        return {
            "google_phone": found_phone or "Not found in snippets",
            "google_address": address if address_match else "Address not verified in top results", 
            "google_specialty": None,
            "source_reliability": reliability,
            "match_type": match_type,
            "search_snippet": results[:200] + "..." # Context for UI
        }
        
    except Exception as e:
        print(f"Google Tool Error: {e}")
        return {
            "google_phone": None,
            "google_address": None,
            "source_reliability": 0.0,
            "match_type": "Search Failed",
            "error": str(e)
        }
