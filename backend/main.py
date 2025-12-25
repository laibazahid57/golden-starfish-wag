import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Response, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings
from uuid import uuid4
from datetime import datetime, timezone
from models import User, Token, UserInDB, GoogleAuthRequest
from auth import create_access_token
from config import settings

# Database setup
class Database:
    client: AsyncIOMotorClient = None

db = Database()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        db.client = AsyncIOMotorClient(settings.MONGODB_URI)
        # Verify connection
        await db.client.admin.command('ping')
        print("Connected to MongoDB")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        # We might want to raise an error here or let the app start but fail health checks
        # For now, we'll let it start, but db.client might be usable or not depending on the error
        pass
        
    yield
    # Shutdown
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB")

app = FastAPI(lifespan=lifespan)

# CORS configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5137",
    "http://127.0.0.1:5137",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/healthz")
async def health_check():
    if not db.client:
        return Response(content='{"status": "error", "db": "disconnected"}', media_type="application/json", status_code=status.HTTP_503_SERVICE_UNAVAILABLE)
    
    try:
        # Check if we can ping the database
        await db.client.admin.command('ping')
        return {"status": "ok", "db": "connected"}
    except Exception as e:
        return Response(content=f'{{"status": "error", "db": "error", "details": "{str(e)}"}}', media_type="application/json", status_code=status.HTTP_503_SERVICE_UNAVAILABLE)

@app.get("/")
async def root():
    return {"message": "Welcome to CalorieQuest API"}

@app.post("/auth/guest", response_model=Token)
async def guest_auth():
    user_id = str(uuid4())
    current_time = datetime.now(timezone.utc)
    
    user_in_db = UserInDB(
        user_id=user_id,
        email=None,
        display_name="Guest User",
        is_guest=True,
        created_at=current_time
    )
    
    # Insert user into database
    if not db.client:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database not connected")
        
    await db.client[settings.DB_NAME]["users"].insert_one(user_in_db.model_dump())
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id, "is_guest": True})
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_in_db
    )

@app.get("/restaurants/search")
async def search_restaurants(lat: float, lng: float, mileage: int = 5, max_calories: int = None):
    if not db.client:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database not connected")
    
    # Convert mileage to meters (1 mile ≈ 1609.34 meters)
    radius_in_meters = mileage * 1609.34
    
    try:
        # Use $near operator for geospatial query
        cursor = db.client[settings.DB_NAME]["restaurants"].find({
            "location": {
                "$near": {
                    "$geometry": {
                        "type": "Point",
                        "coordinates": [lng, lat]
                    },
                    "$maxDistance": radius_in_meters
                }
            }
        })
        
        restaurants = []
        async for doc in cursor:
            # Handle _id: convert to string
            doc["_id"] = str(doc["_id"])
            
            # Calorie Filtering Logic
            if max_calories is not None:
                original_items = doc.get("menu_items", [])
                filtered_items = [
                    item for item in original_items
                    if item.get("calories") is not None and item["calories"] <= max_calories
                ]
                
                # If restaurant has matching items, keep it with filtered menu
                if filtered_items:
                    doc["menu_items"] = filtered_items
                    restaurants.append(doc)
            else:
                # No filtering, include restaurant as is
                restaurants.append(doc)
            
        return restaurants
    except Exception as e:
        print(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/google", response_model=Token)
async def google_auth(request: GoogleAuthRequest):
    if not db.client:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database not connected")

    # Real Google Verification Logic
    token = request.token
    
    try:
        import requests
        
        # Verify the access token by calling Google's userinfo endpoint
        response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if response.status_code != 200:
            raise ValueError("Invalid access token")
            
        user_info = response.json()
        
        # Verify that the token was issued to our client (optional but recommended if using id_token,
        # but for access token, if we can get user info, it's valid for that user.
        # Stricter checks might involve tokeninfo endpoint)
        
        google_id = user_info.get('sub')
        email = user_info.get('email')
        display_name = user_info.get('name', 'Google User')
        
    except ValueError as e:
        # Invalid token
        raise HTTPException(status_code=400, detail=f"Invalid Google token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Google authentication failed: {str(e)}")

    # Check if user exists
    user = await db.client[settings.DB_NAME]["users"].find_one({"google_id": google_id})

    if user:
        user_in_db = UserInDB(**user)
    else:
        # Create new user
        current_time = datetime.now(timezone.utc)
        user_id = str(uuid4())
        
        user_in_db = UserInDB(
            user_id=user_id,
            email=email,
            display_name=display_name,
            is_guest=False,
            created_at=current_time,
            google_id=google_id
        )
        await db.client[settings.DB_NAME]["users"].insert_one(user_in_db.model_dump())

    # Create access token
    access_token = create_access_token(data={"sub": user_in_db.user_id, "is_guest": False})

    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_in_db
    )