from langgraph.graph import StateGraph, START, END

from agents.agent_1 import validation_agent
from agents.agent_2 import enrichment_agent
from agents.agent_3 import quality_agent
from agents.agent_4 import directory_agent


# --------------------------------------------
# Global Pipeline State
# --------------------------------------------
class ProviderState(dict):
    provider: dict
    validated_data: dict
    enriched_data: dict
    quality_data: dict
    final_profile: dict
    summary_report: dict


# --------------------------------------------
# Node Wrappers — merge agent output into state
# --------------------------------------------

def validate_node(state: ProviderState):
    """Runs Agent-1 and stores validation output."""
    out = validation_agent(state)
    return {
        **state,
        "validated_data": out.get("validated_data"),
        "google_result": out.get("google_result"),
        "npi_result": out.get("npi_result")
    }


def enrich_node(state: ProviderState):
    """Runs Agent-2 and stores enrichment output."""
    out = enrichment_agent(state)
    return {
        **state,
        "enriched_data": out.get("enriched_data")
    }


def quality_node(state: ProviderState):
    """Runs Agent-3 (QA + confidence engine)."""
    out = quality_agent(state)
    return {
        **state,
        "quality_data": out.get("quality_data")
    }


def directory_node(state: ProviderState):
    """Runs Agent-4 (directory generator)."""
    out = directory_agent(state)
    return {
        **state,
        "final_profile": out.get("final_profile"),
        "summary_report": out.get("summary_report")
    }


# --------------------------------------------
# Build Pipeline Graph
# --------------------------------------------

def build_pipeline():
    graph = StateGraph(ProviderState)

    graph.add_node("validate", validate_node)
    graph.add_node("enrich", enrich_node)
    graph.add_node("quality", quality_node)
    graph.add_node("directory", directory_node)

    graph.add_edge(START, "validate")
    graph.add_edge("validate", "enrich")
    graph.add_edge("enrich", "quality")
    graph.add_edge("quality", "directory")
    graph.add_edge("directory", END)

    return graph.compile()
