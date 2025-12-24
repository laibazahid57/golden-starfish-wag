import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_google_auth():
    url = f"{BASE_URL}/auth/google"
    print(f"Testing POST {url}...")
    
    # Payload with mock token
    payload = {"token": "mock-google-token-123"}
    
    try:
        response = requests.post(url, json=payload)
        
        # Check status code
        if response.status_code != 200:
            print(f"FAILED: Status code is {response.status_code}, expected 200")
            print(f"Response body: {response.text}")
            sys.exit(1)
            
        data = response.json()
        
        # Check access_token
        if "access_token" not in data:
            print("FAILED: 'access_token' not found in response")
            print(f"Response body: {data}")
            sys.exit(1)
            
        # Check user info
        if "user" not in data:
            print("FAILED: 'user' object not found in response")
            print(f"Response body: {data}")
            sys.exit(1)
            
        user = data["user"]
        
        # Check email (should be the mock email)
        if user.get("email") != "user@example.com":
            print(f"FAILED: user.email is {user.get('email')}, expected 'user@example.com'")
            print(f"User object: {user}")
            sys.exit(1)
            
        # Check is_guest flag (should be False)
        if user.get("is_guest") is not False:
            print(f"FAILED: user.is_guest is {user.get('is_guest')}, expected False")
            print(f"User object: {user}")
            sys.exit(1)
            
        print("SUCCESS: Google authentication endpoint verified!")
        print(f"Token: {data['access_token'][:20]}...")
        print(f"User: {user['display_name']} (ID: {user['user_id']})")
        
    except requests.exceptions.ConnectionError:
        print("FAILED: Could not connect to server. Is it running?")
        sys.exit(1)
    except Exception as e:
        print(f"FAILED: An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_google_auth()