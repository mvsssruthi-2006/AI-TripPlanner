from pydantic import BaseModel
from typing import List, Optional


class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class TripRequest(BaseModel):
    origin: str
    destination: str
    days: int
    travelers: int
    budget: int
    purpose: str
    interests: List[str]
    pace: str
    climate: str
    hotel_category: str
    accommodation_type: str
    transport_mode: str
    food_preference: str
    must_visit: List[str]
    custom_prompt: Optional[str] = ""