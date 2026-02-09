import requests
import json

url = "http://localhost:8000/api/run-stream"

payload = {
    "name": "Dr. Test Stream",
    "npi": "1234567890",
    "state": "CA",
    "specialty": "Cardiology"
}

print(f"Connecting to {url}...")

try:
    with requests.post(url, json=payload, stream=True) as response:
        if response.status_code == 200:
            print("Connected! Listening for events...")
            for line in response.iter_lines():
                if line:
                    decoded = line.decode('utf-8')
                    if decoded.startswith("data: "):
                        data_str = decoded[6:]
                        if data_str == "[DONE]":
                            print("\nStream finished.")
                            break
                        try:
                            data = json.loads(data_str)
                            event_type = data.get("type", "unknown")
                            name = data.get("name", "unnamed")
                            print(f"Event: {event_type} | Node: {name}")
                            if event_type == "on_chain_end" and name in ["validate", "enrich", "quality", "directory"]:
                                print(f"--- DATA FOR {name} ---")
                                print(json.dumps(data, indent=2))
                                print("-----------------------")
                        except json.JSONDecodeError:
                            print(f"Raw: {decoded}")
        else:
            print(f"Failed to connect. Status: {response.status_code}")
            print(response.text)
except Exception as e:
    print(f"Error: {e}")
