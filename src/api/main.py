from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from simulator_service import run_simulation, DeepSeek_df
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="F1 Strategy API")

# Allow your future frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class SimulationRequest(BaseModel):
    race_name: str
    driver: str
    rival: str
    my_pits: List[int]
    rival_pits: List[int]

@app.post("/api/simulate")
def simulate_strategy(request: SimulationRequest):
    result = run_simulation(
        race_name=request.race_name,
        driver=request.driver,
        rival=request.rival,
        my_pits=request.my_pits,
        rival_pits=request.rival_pits
    )
    return result

@app.get("/")
def health_check():
    return {"status": "F1 Backend API is Live!"}


# ==========================================
# NEW ENDPOINTS FOR FRONTEND DATA
# ==========================================


@app.get("/api/races")
def get_races():
    """Returns a list of unique races from the dataset."""
    # Get unique races from the dataset
    unique_races = DeepSeek_df['EventName'].unique()
    
    # Format them nicely for the frontend
    races_list = []
    for i, race in enumerate(unique_races):
        races_list.append({
            "id": i,
            "code": race[:2].upper(), # e.g., "BA" for Bahrain
            "name": race,
            "date": "2025", # Placeholder date
            "round": f"R{i+1}"
        })
    
    # Sort alphabetically just to make it neat
    races_list = sorted(races_list, key=lambda x: x['name'])
    return {"races": races_list[:10]} # Return top 10 for now

@app.get("/api/drivers")
def get_drivers():
    """Returns a list of unique drivers and their teams."""
    # Get unique drivers and their teams
    unique_drivers = DeepSeek_df[['Driver', 'Team']].drop_duplicates()
    
    drivers_list = []
    for _, row in unique_drivers.iterrows():
        drivers_list.append({
            "code": row['Driver'],
            "name": row['Driver'], # We only have 3-letter codes in data
            "team": row['Team']
        })
        
    drivers_list = sorted(drivers_list, key=lambda x: x['code'])
    return {"drivers": drivers_list}

@app.get("/api/next-race")
def get_next_race():
    """Returns details for the upcoming race (Mocked for now)."""
    return {
        "name": "MX Mexico City",
        "circuit": "Autodromo Hermanos Rodriguez",
        "days": "02",
        "hours": "23",
        "minutes": "58",
        "seconds": "36"
    }