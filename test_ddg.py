from langchain_community.tools import DuckDuckGoSearchRun

try:
    search = DuckDuckGoSearchRun()
    print("Searching for 'Dr. John Doe NPI'...")
    res = search.run("Dr. John Doe New York Cardiology NPI")
    print(f"Result: {res[:200]}...")
except Exception as e:
    print(f"Error: {e}")
