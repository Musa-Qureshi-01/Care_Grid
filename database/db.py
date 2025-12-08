import sqlite3
import json
from datetime import datetime

DB_PATH = "provider_system.db"


# ---------------------------------------------------
# CREATE CONNECTION
# ---------------------------------------------------
def get_connection():
    return sqlite3.connect(DB_PATH, check_same_thread=False)


# ---------------------------------------------------
# CREATE TABLES
# ---------------------------------------------------
def init_db():
    conn = get_connection()
    cur = conn.cursor()

    # Master result of each provider
    cur.execute("""
        CREATE TABLE IF NOT EXISTS provider_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            provider_id INTEGER,
            name TEXT,
            address TEXT,
            phone TEXT,
            specialty TEXT,
            license TEXT,
            confidence REAL,
            risk_level TEXT,
            status TEXT,
            enriched_json TEXT,
            validated_json TEXT,
            quality_json TEXT,
            fraud_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Batch-level summary
    cur.execute("""
        CREATE TABLE IF NOT EXISTS batch_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            batch_id TEXT,
            total INTEGER,
            verified INTEGER,
            high_risk INTEGER,
            avg_confidence REAL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Fraud detection results
    cur.execute("""
        CREATE TABLE IF NOT EXISTS fraud_signals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            provider_id INTEGER,
            fraud_score REAL,
            fraud_flags TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # Weekly QA rollups
    cur.execute("""
        CREATE TABLE IF NOT EXISTS qa_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            providers_checked INTEGER,
            avg_confidence REAL,
            high_risk_count INTEGER
        )
    """)

    conn.commit()
    conn.close()


# ---------------------------------------------------
# INSERT PROVIDER RESULT
# ---------------------------------------------------
def save_provider_result(provider_id, base, validated, enriched, quality, fraud):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO provider_results (
            provider_id, name, address, phone, specialty, license,
            confidence, risk_level, status,
            enriched_json, validated_json, quality_json, fraud_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        provider_id,
        base.get("name"),
        enriched.get("address"),
        enriched.get("phone"),
        enriched.get("specialty"),
        enriched.get("license"),

        quality["confidence_scores"]["overall"],
        quality["risk_level"],
        "Verified" if not quality["needs_manual_review"] else "Review",

        json.dumps(enriched),
        json.dumps(validated),
        json.dumps(quality),
        json.dumps(fraud)
    ))

    conn.commit()
    conn.close()


# ---------------------------------------------------
# INSERT BATCH SUMMARY
# ---------------------------------------------------
def save_batch_summary(batch_id, total, verified, high_risk, avg_conf):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO batch_runs (
            batch_id, total, verified, high_risk, avg_confidence
        ) VALUES (?, ?, ?, ?, ?)
    """, (batch_id, total, verified, high_risk, avg_conf))

    conn.commit()
    conn.close()


# ---------------------------------------------------
# INSERT FRAUD RESULT
# ---------------------------------------------------
def save_fraud(provider_id, score, flags):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO fraud_signals (
            provider_id, fraud_score, fraud_flags
        ) VALUES (?, ?, ?)
    """, (provider_id, score, json.dumps(flags)))

    conn.commit()
    conn.close()


# ---------------------------------------------------
# INSERT WEEKLY QA
# ---------------------------------------------------
def save_qa_result(providers_checked, avg_conf, high_risk):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO qa_runs (
            date, providers_checked, avg_confidence, high_risk_count
        ) VALUES (?, ?, ?, ?)
    """, (datetime.now().strftime("%Y-%m-%d"),
          providers_checked, avg_conf, high_risk))

    conn.commit()
    conn.close()
