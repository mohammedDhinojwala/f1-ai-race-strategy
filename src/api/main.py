from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from simulator_service import run_simulation, DeepSeek_df
from fastapi.middleware.cors import CORSMiddleware
import requests
from datetime import datetime

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
# REAL F1 DATA ENDPOINTS
# ==========================================

@app.get("/api/races")
def get_races():
    """Returns the actual last 3 completed races from the calendar."""
    # Hardcoded real schedule for late 2024 season
    recent_races = [
        {"id": 1, "code": "US", "name": "United States Grand Prix", "date": "20 Oct"},
        {"id": 2, "code": "MX", "name": "Mexico City Grand Prix", "date": "27 Oct"},
        {"id": 3, "code": "BR", "name": "São Paulo Grand Prix", "date": "03 Nov"}
    ]
    return {"races": recent_races}

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

@app.get("/api/next-race")
def get_next_race():
    """Returns the next race and the EXACT target date for the countdown."""
    return {
        "name": "Las Vegas Grand Prix",
        "circuit": "Las Vegas Strip Circuit",
        # We send a real timestamp to the frontend to calculate the exact time left
        "target_date": "2024-11-23T20:00:00" 
    }


# ==========================================
# LIVE API DATA ENDPOINTS
# ==========================================


@app.get("/api/races")
def get_races():
    """Returns the 3 most recently COMPLETED races from the 2024 season."""
    try:
        response = requests.get("https://api.jolpi.ca/ergast/f1/2024.json")
        data = response.json()
        all_races = data['MRData']['RaceTable']['Races']
        
        now = datetime.now()
        completed_races = []
        
        for race in all_races:
            # Combine date and time to compare with 'now'
            race_time_str = race.get('time', '00:00:00Z').replace('Z', '')
            race_datetime = datetime.strptime(f"{race['date']}T{race_time_str}", "%Y-%m-%dT%H:%M:%S")
            
            if race_datetime < now:
                completed_races.append(race)
        
        # Get the last 3 completed races
        recent_races = completed_races[-3:]
        
        formatted_races = []
        for race in recent_races:
            formatted_races.append({
                "id": race['round'],
                "code": race['Circuit']['circuitId'][:2].upper(),
                "name": race['raceName'],
                "date": datetime.strptime(race['date'], '%Y-%m-%d').strftime('%d %b'),
                "round": f"R{race['round']}"
            })
            
        # Reverse so the most recent is at the top
        formatted_races.reverse()
        return {"races": formatted_races}
    except Exception as e:
        return {"error": str(e)}


@app.get("/api/drivers")
def get_drivers():
    try:
        # Fetch standings to get team/constructor info
        response = requests.get("https://api.jolpi.ca/ergast/f1/2024/driverstandings.json")
        data = response.json()
        standings = data['MRData']['StandingsTable']['StandingsLists'][0]['DriverStandings']
        
        formatted_drivers = []
        for entry in standings:
            driver = entry['Driver']
            team = entry['Constructors'][0]['name'] if entry['Constructors'] else "Unknown"
            
            formatted_drivers.append({
                "code": driver['code'],
                "name": f"{driver['givenName']} {driver['familyName']}",
                "team": team
            })
            
        return {"drivers": formatted_drivers}
    except Exception as e:
        return {"error": str(e)}

@app.get("/api/next-race")
def get_next_race():
    """Returns the NEXT upcoming race from the 2024 season."""
    try:
        response = requests.get("https://api.jolpi.ca/ergast/f1/2024.json")
        data = response.json()
        all_races = data['MRData']['RaceTable']['Races']
        
        now = datetime.now()
        next_race = None
        
        for race in all_races:
            race_time_str = race.get('time', '00:00:00Z').replace('Z', '')
            race_datetime = datetime.strptime(f"{race['date']}T{race_time_str}", "%Y-%m-%dT%H:%M:%S")
            
            if race_datetime > now:
                next_race = race
                break # Stop at the first upcoming race
        
        if not next_race:
            return {"error": "Season finished"}
            
        # Format the target date correctly for the timer
        race_time = next_race.get('time', '00:00:00Z').replace('Z', '')
        target_datetime = f"{next_race['date']}T{race_time}"
        
        return {
            "name": next_race['raceName'],
            "circuit": next_race['Circuit']['circuitName'],
            "target_date": target_datetime
        }
    except Exception as e:
        return {"error": str(e)}