from langchain_community.tools import DuckDuckGoSearchRun
from langchain.tools import Tool
from langchain_community.utilities import WikipediaAPIWrapper
from langchain_community.tools import WikipediaQueryRun

def get_search_tools():
    """
    Returns a list of search-related tools for the research agent.
    """
    tools = []
    
    # 1. Wikipedia Tool
    try:
        wiki = WikipediaAPIWrapper(top_k_results=1, doc_content_chars_max=1000)
        tools.append(WikipediaQueryRun(api_wrapper=wiki))
    except Exception as e:
        print(f"Wikipedia tool not available: {e}")

    # 2. Web Search Tool (DuckDuckGo)
    try:
        search = DuckDuckGoSearchRun()
        tools.append(Tool(
            name="WebSearch",
            func=search.run,
            description="Search the web for current medical information, latest drug research, clinical guidelines, and healthcare topics. Use this for questions about recent developments."
        ))
    except Exception as e:
        print(f"DuckDuckGo search not available: {e}")
        
    return tools
