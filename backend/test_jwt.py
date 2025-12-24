from auth import create_access_token
from main import settings
from jose import jwt, JWTError
from datetime import timedelta

# 1. Create a token for a dummy user
data = {"user_id": "test_user_123"}
access_token = create_access_token(data=data, expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
print(f"Generated Token: {access_token}")

# 2. Decode it immediately to verify the data matches
try:
    payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    user_id = payload.get("user_id")
    if user_id == "test_user_123":
        print("JWT Logic Verified")
    else:
        print(f"Verification Failed: Expected 'test_user_123', got '{user_id}'")
except JWTError as e:
    print(f"Verification Failed: JWT Error - {e}")
except Exception as e:
    print(f"Verification Failed: {e}")