import requests
import json
import sseclient

def test_stream_input(name, address):
    url = "http://localhost:8000/api/run-stream"
    payload = {
        "name": name,
        "address": address,
        "phone": "555-0100",
        "specialty": "General Practice"
    }
    print(f"\n--- Testing with: {name} ---")
    
    try:
        response = requests.post(url, json=payload, stream=True)
        client = sseclient.SSEClient(response)
        
        for event in client.events():
            if event.data == '[DONE]':
                break
            
            data = json.loads(event.data)
            if data['type'] == 'on_chain_end' and 'output' in data:
                output = data['output']
                if 'validated_data' in output and 'google_result' in output['validated_data']:
                     google = output['validated_data']['google_result']
                     print(f"Google Found: {google.get('google_address')}")
                     print(f"Confidence: {google.get('source_reliability')}")
                     
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    # Test 1: Known Entity
    test_stream_input("Mayo Clinic", "Rochester, MN")
    
    # Test 2: Fictional/Different Entity
    test_stream_input("Pizza Hut", "New York, NY")
