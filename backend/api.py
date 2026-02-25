from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from database import users_collection, trips_collection
from models import RegisterRequest, LoginRequest, TripRequest
from auth import create_access_token, get_current_user
from orchestrator import TripOrchestrator
from bson import ObjectId

app = FastAPI(title="AI Trip Planner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://mvsssruthi-2006-tripplanner.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"status": "API running 🚀"}


# ===============================
# REGISTER
# ===============================
@app.post("/api/register")
def register(data: RegisterRequest):
    existing_user = users_collection.find_one({"email": data.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    users_collection.insert_one({
        "full_name": data.full_name,
        "email": data.email,
        "password": data.password  # No bcrypt (as requested)
    })

    return {"message": "User registered successfully"}


# ===============================
# LOGIN
# ===============================
@app.post("/api/login")
def login(data: LoginRequest):
    user = users_collection.find_one({
        "email": data.email,
        "password": data.password
    })

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"email": user["email"]})

    return {
        "access_token": token,
        "user": {
            "full_name": user["full_name"],
            "email": user["email"]
        }
    }


# ===============================
# PLAN TRIP (AUTH REQUIRED)
# ===============================
@app.post("/api/plan-trip")
def plan_trip(data: TripRequest, current_user=Depends(get_current_user)):

    user_profile = data.dict()

    planner = TripOrchestrator(user_profile)
    result = planner.run()

    # Store trip with user reference
    trips_collection.insert_one({
        "user_email": current_user["email"],
        "trip_data": result
    })

    return result


# ===============================
# GET MY TRIPS
# ===============================
@app.get("/api/my-trips")
def get_my_trips(current_user=Depends(get_current_user)):

    trips = list(trips_collection.find({
        "user_email": current_user["email"]
    }))

    for trip in trips:
        trip["_id"] = str(trip["_id"])

    return trips