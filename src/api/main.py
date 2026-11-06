from fastapi import FastAPI
from pydantic import BaseModel
import fastf1
import pandas as pd
from typing import List
from simulator_service import run_simulation, DeepSeek_df
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

app = FastAPI(title="F1 Strategy API")

# Allow your future frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# SIMULATION ENDPOINT
# ==========================================
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
# DATA ENDPOINTS (Powered by FastF1)
# ==========================================

@app.get("/api/races")
def get_races():
    """Fetches the 3 most recent races directly from the FastF1 official schedule."""
    try:
        # Enable cache for FastF1 to prevent downloading the schedule every time
        fastf1.Cache.enable_cache('../../notebooks/f1_cache') 
        
        # Get the real 2024 schedule
        schedule = fastf1.get_event_schedule(2024, include_testing=False)
        
        # For the demo, we just grab the last 3 races of the season
        recent_races = schedule.tail(3).iloc[::-1] 
        
        formatted_races = []
        for _, race in recent_races.iterrows():
            formatted_races.append({
                "id": int(race['RoundNumber']),
                "code": race['Country'][:2].upper(),
                "name": race['EventName'],
                "date": race['EventDate'].strftime('%d %b'),
                "round": f"R{int(race['RoundNumber'])}"
            })
            
        return {"races": formatted_races}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/next-race")
def get_next_race():
    """Finds the next upcoming race using FastF1's official schedule."""
    try:
        schedule = fastf1.get_event_schedule(2024, include_testing=False)
        now = pd.Timestamp.now()
        
        # Find races that are in the future
        future_races = schedule[schedule['EventDate'] > now]
        
        # If we are testing and all 2024 races are in the past, 
        # we mock a future date so the UI timer actually works.
        if future_races.empty:
            # Grab the last race of the season just for the name
            next_race = schedule.iloc[-1]
            # Create a guaranteed future date (2 days, 14 hours, 30 mins from NOW)
            future_date = datetime.now() + timedelta(days=2, hours=14, minutes=30)
            
            return {
                "name": next_race['EventName'],
                "circuit": next_race['Location'],
                "target_date": future_date.isoformat()
            }
            
        # If there is a real future race, use it
        next_race = future_races.iloc[0]
        return {
            "name": next_race['EventName'],
            "circuit": next_race['Location'],
            "target_date": next_race['EventDate'].isoformat()
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/drivers")
def get_drivers():
    """Returns the real 2024 F1 Driver Grid with full names and teams."""
    drivers = [
        {"code": "VER", "name": "Max Verstappen", "team": "Red Bull Racing"},
        {"code": "PER", "name": "Sergio Perez", "team": "Red Bull Racing"},
        {"code": "HAM", "name": "Lewis Hamilton", "team": "Mercedes"},
        {"code": "RUS", "name": "George Russell", "team": "Mercedes"},
        {"code": "LEC", "name": "Charles Leclerc", "team": "Ferrari"},
        {"code": "SAI", "name": "Carlos Sainz", "team": "Ferrari"},
        {"code": "NOR", "name": "Lando Norris", "team": "McLaren"},
        {"code": "PIA", "name": "Oscar Piastri", "team": "McLaren"},
        {"code": "ALO", "name": "Fernando Alonso", "team": "Aston Martin"},
        {"code": "STR", "name": "Lance Stroll", "team": "Aston Martin"},
        {"code": "GAS", "name": "Pierre Gasly", "team": "Alpine"},
        {"code": "OCO", "name": "Esteban Ocon", "team": "Alpine"},
        {"code": "ALB", "name": "Alex Albon", "team": "Williams"},
        {"code": "COL", "name": "Franco Colapinto", "team": "Williams"},
        {"code": "TSU", "name": "Yuki Tsunoda", "team": "RB"},
        {"code": "LAW", "name": "Liam Lawson", "team": "RB"},
        {"code": "BOT", "name": "Valtteri Bottas", "team": "Sauber"},
        {"code": "ZHO", "name": "Zhou Guanyu", "team": "Sauber"},
        {"code": "HUL", "name": "Nico Hulkenberg", "team": "Haas"},
        {"code": "MAG", "name": "Kevin Magnussen", "team": "Haas"}
    ]
    return {"drivers": drivers}