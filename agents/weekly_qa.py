# weekly_qa.py

import sqlite3
from datetime import datetime, timedelta

DB_PATH = "provider_system.db"


def generate_weekly_summary():
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # if you don't have timestamps, this will just use all rows
    try:
        one_week_ago = datetime.utcnow() - timedelta(days=7)
        cur.execute(
            """
            SELECT confidence, risk, verified
            FROM provider_results
            WHERE created_at >= ?
            """,
            (one_week_ago.isoformat(),),
        )
    except Exception:
        cur.execute("SELECT confidence, risk, verified FROM provider_results")

    rows = cur.fetchall()
    conn.close()

    if not rows:
        print("No data in DB yet.")
        return

    total = len(rows)
    avg_conf = sum(r[0] for r in rows) / total
    high_risk = sum(1 for r in rows if r[1] == "HIGH")
    verified = sum(1 for r in rows if r[2] == 1)

    print("\n📊 Weekly QA Summary")
    print("--------------------")
    print(f"Total profiles reviewed: {total}")
    print(f"Average confidence: {avg_conf:.1f}%")
    print(f"Verified profiles: {verified}")
    print(f"High-risk profiles: {high_risk}")


if __name__ == "__main__":
    generate_weekly_summary()
