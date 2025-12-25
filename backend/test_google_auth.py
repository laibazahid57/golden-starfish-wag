import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_google_auth_rejection():
    url = f"{BASE_URL}/auth/google"
    print(f"Testing POST {url} with INVALID token...")
    
    # Payload with mock token (which should now be rejected)
    payload = {"token": "mock-google-token-123"}
    
    try:
        response = requests.post(url, json=payload)
        
        # Check status code - Expecting 400 Bad Request for invalid token
        if response.status_code == 400:
            print("SUCCESS: Server correctly rejected invalid/mock token.")
            print(f"Response: {response.json()}")
        else:
            print(f"FAILED: Expected 400 Bad Request, but got {response.status_code}")
            print(f"Response body: {response.text}")
            sys.exit(1)
        
    except requests.exceptions.ConnectionError:
        print("FAILED: Could not connect to server. Is it running?")
        sys.exit(1)
    except Exception as e:
        print(f"FAILED: An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_google_auth_rejection()