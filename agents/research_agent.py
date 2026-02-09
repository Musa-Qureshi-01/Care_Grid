# agents.research_agent.py
import os
from langchain.agents import AgentExecutor, create_react_agent
from langchain.prompts import PromptTemplate
from langchain.tools import Tool
from langchain_google_genai import ChatGoogleGenerativeAI

from tools.search_tools import get_search_tools

# Data Tools (Internal)
# We can import these from your existing modules if needed, 
# or keep the simple lookups here if they are specific to research.
# For now, we'll implement the simple lookups here to match previous logic,
# but nicely encapsulated.

# --- Internal Knowledge Base Helpers ---

def lookup_drug(query: str):
    """Refined drug lookup"""
    q = query.lower()
    db = {
        "aspirin": "**Aspirin**\n- Class: NSAID\n- Uses: Pain, Fever, Anti-platelet\n- Warning: Bleeding risk",
        "ibuprofen": "**Ibuprofen**\n- Class: NSAID\n- Uses: Inflammation, Pain\n- Warning: Stomach ulcers",
        "lisinopril": "**Lisinopril**\n- Class: ACE Inhibitor\n- Uses: Hypertension, Heart Failure\n- Warning: Dry cough, Potassium levels",
        "metformin": "**Metformin**\n- Class: Biguanide\n- Uses: Type 2 Diabetes\n- Warning: Lactic acidosis (rare)",
        "atorvastatin": "**Atorvastatin**\n- Class: Statin\n- Uses: High Cholesterol\n- Warning: Muscle pain",
        "amoxicillin": "**Amoxicillin**\n- Class: Antibiotic\n- Uses: Bacterial Infections\n- Warning: Penicillin allergy"
    }
    for drug, info in db.items():
        if drug in q:
            return info
    return None

def lookup_customer_care(query: str):
    """Platform support lookup"""
    q = query.lower()
    kb = {
        "update provider": "To update a provider: Go to Dashboard > Agent Operations > Select Provider > Run Analysis.",
        "add provider": "To add a provider: Import a CSV in the Batch Processing tab or use the API.",
        "export": "To export data: Go to Dashboard > Export, select format (CSV/JSON/PDF) and click Download.",
        "api key": "To manage API keys: Go to Settings > Security > API Keys.",
        "billing": "For billing inquiries, please contact finance@ey-caregrid.com."
    }
    for key, info in kb.items():
        if key in q:
            return info
    return None

def drug_tool(query):
    return lookup_drug(query) or "Drug not found in internal DB. Try WebSearch."

def care_tool(query):
    return lookup_customer_care(query) or "No internal support article found. Try WebSearch."


def build_research_agent():
    """
    Constructs and returns the LangChain AgentExecutor for Research.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        return None

    # 1. LLM
    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=api_key, temperature=0.3)

    # 2. Tools
    tools = get_search_tools() # From tools/search_tools.py
    
    # Add internal tools
    tools.append(Tool(name="DrugDatabase", func=drug_tool, description="Look up drug information"))
    tools.append(Tool(name="CustomerCare", func=care_tool, description="Platform support questions"))

    tool_names = [t.name for t in tools]

    # 3. Prompt
    template = """You are CareGrid Research Assistant, an AI agent helping with medical research, drug information, and healthcare platform support.

**Your Tools:**
{tools}

**Available Tool Names:** {tool_names}

**Instructions:**
- For medical topics (diseases, conditions): Use Wikipedia or WebSearch
- For drug information: Check DrugDatabase first, then WebSearch for latest research
- For platform questions (how to update providers, export data): Use CustomerCare
- Always provide detailed, accurate information
- Cite sources when using Wikipedia or WebSearch
- For medical advice, include disclaimer to consult healthcare providers

**Reasoning Format (ReAct):**
Question: the input question you must answer
Thought: think about which tool to use
Action: the tool name from [{tool_names}]
Action Input: the query for the tool
Observation: the tool's result
... (repeat Thought/Action/Observation as needed)
Thought: I now know the final answer
Final Answer: a detailed, helpful response

**Begin:**
Question: {input}
{agent_scratchpad}"""

    prompt = PromptTemplate.from_template(template)

    # 4. Agent
    from langchain.agents import create_react_agent
    agent = create_react_agent(llm, tools, prompt)

    # 5. Executor
    return AgentExecutor(
        agent=agent, 
        tools=tools, 
        verbose=True, 
        handle_parsing_errors=True,
        max_iterations=5
    )
