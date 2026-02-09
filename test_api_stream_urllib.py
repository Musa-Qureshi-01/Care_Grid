import urllib.request
import json
import sys

def test_stream_input(name, address, npi=None):
    url = "http://localhost:8000/api/run-stream"
    payload = {
        "name": name,
        "address": address,
        "phone": "555-0100",
        "specialty": "General Practice",
        "npi": npi
    }
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={
        'Content-Type': 'application/json',
        'User-Agent': 'TestScript'
    })
    
    print(f"\n--- Testing with: {name} ---")
    
    try:
        with urllib.request.urlopen(req) as response:
            for line in response:
                line = line.decode('utf-8').strip()
                if not line: continue
                if line.startswith('data: '):
                    data_str = line[6:]
                    if data_str == '[DONE]':
                        print("[DONE]")
                        break
                    try:
                        data = json.loads(data_str)
                        # print(f"Event: {data.get('type')} - {data.get('name')}")
                        if data.get('type') == 'on_chain_end':
                            if 'output' in data:
                                out = data['output']
                                if isinstance(out, dict):
                                    if 'google_result' in out:
                                        print(f"GOOGLE RESULT: {out['google_result'].get('google_address')}")
                                    if 'npi_result' in out:
                                        print(f"NPI RESULT: {out['npi_result'].get('npi_license')}")
                    except json.JSONDecodeError:
                        print(f"Failed to decode: {data_str}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_stream_input("Mayo Clinic", "Rochester, MN")
    test_stream_input("Pizza Hut", "New York, NY")
    
    print("\n--- Testing with NPI Input ---")
    # Test with a dummy NPI to see if it's passed through
    test_stream_input("Dr. Test Provider", "New York, NY", npi="1234567890")
