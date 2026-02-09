import pandas as pd
import io
import json
from typing import List, Dict, Any

class ExportService:
    """
    Service to handle data export operations.
    Follows Single Responsibility Principle for data formatting.
    """

    @staticmethod
    def to_csv(data: List[Dict[str, Any]]) -> str:
        """
        Convert a list of dictionaries to CSV string.
        """
        if not data:
            return ""
        
        df = pd.DataFrame(data)
        return df.to_csv(index=False)

    @staticmethod
    def to_json(data: List[Dict[str, Any]]) -> str:
        """
        Convert a list of dictionaries to JSON string.
        """
        if not data:
            return "[]"
        
        # Use pandas for consistent serialization of dates etc.
        df = pd.DataFrame(data)
        return df.to_json(orient="records", date_format="iso")

    @staticmethod
    def export_provider_data(providers: List[Dict[str, Any]], format: str) -> Dict[str, Any]:
        """
        Export provider data in the requested format.
        Returns dictionary with 'content' and 'media_type'.
        """
        if format.lower() == 'csv':
            content = ExportService.to_csv(providers)
            return {
                "content": content,
                "media_type": "text/csv",
                "filename": "providers_export.csv"
            }
        elif format.lower() == 'json':
            content = ExportService.to_json(providers)
            return {
                "content": content,
                "media_type": "application/json",
                "filename": "providers_export.json"
            }
        else:
            raise ValueError(f"Unsupported export format: {format}")
