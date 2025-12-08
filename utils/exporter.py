# utils/exporter.py

import json
import csv
from pathlib import Path
from typing import List, Dict, Any

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def mask_phone(phone: str | None) -> str | None:
    if not phone:
        return None
    digits = "".join(ch for ch in phone if ch.isdigit())
    if len(digits) <= 4:
        return "****" + digits
    return "****" + digits[-4:]


def mask_license(license_id: str | None) -> str | None:
    if not license_id:
        return None
    if len(license_id) <= 4:
        return "****"
    return "****" + license_id[-4:]


def export_csv(rows: List[Dict[str, Any]], path: str) -> str:
    if not rows:
        return path
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)
    return str(p)


def export_json(obj: Any, path: str) -> str:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open("w", encoding="utf-8") as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)
    return str(p)


def export_summary_pdf(summary_rows: List[Dict[str, Any]], path: str) -> str:
    """
    Very simple PDF report: one provider per line.
    Heavy styling is not needed – EY just wants PDF capability.
    """
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)

    c = canvas.Canvas(str(p), pagesize=A4)
    width, height = A4
    y = height - 50

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "Provider Directory QA Summary")
    y -= 30

    c.setFont("Helvetica", 10)
    for row in summary_rows:
        line = f"{row.get('Provider Name')} | {row.get('Status')} | " \
               f"Conf: {row.get('Overall Confidence')} | Risk: {row.get('Risk Level')}"
        if y < 80:
            c.showPage()
            y = height - 50
            c.setFont("Helvetica", 10)
        c.drawString(50, y, line)
        y -= 15

    c.showPage()
    c.save()
    return str(p)
