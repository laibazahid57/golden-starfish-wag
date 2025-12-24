import requests
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_guest_auth():
    url = f"{BASE_URL}/auth/guest"
    print(f"Testing POST {url}...")
    
    try:
        response = requests.post(url)
        
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
        
        # Check is_guest flag
        if not user.get("is_guest"):
            print("FAILED: user.is_guest is not True")
            print(f"User object: {user}")
            sys.exit(1)
            
        print("SUCCESS: Guest authentication endpoint verified!")
        print(f"Token: {data['access_token'][:20]}...")
        print(f"User: {user['display_name']} (ID: {user['user_id']})")
        
    except requests.exceptions.ConnectionError:
        print("FAILED: Could not connect to server. Is it running?")
        sys.exit(1)
    except Exception as e:
        print(f"FAILED: An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    test_guest_auth()