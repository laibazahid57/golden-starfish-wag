from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID

class User(BaseModel):
    user_id: str
    email: Optional[EmailStr] = None
    display_name: str
    is_guest: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserInDB(User):
    # This can be extended with DB specific fields if needed
    # For MongoDB, we might want to handle _id, but for now this is sufficient
    google_id: Optional[str] = None

class GoogleAuthRequest(BaseModel):
    token: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

class TokenData(BaseModel):
    user_id: Optional[str] = None