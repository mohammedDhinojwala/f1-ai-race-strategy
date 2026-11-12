
from pathlib import Path
from typing import List
from fastapi import Query
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from simulator_service import run_simulation


# ==========================================
# APP SETUP
# ==========================================

app = FastAPI(title="ARIS - F1 Strategy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Development only
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# CALENDAR DATA
# ==========================================

BASE_DIR = Path(__file__).resolve().parents[2]

CALENDAR_PATH = BASE_DIR / "notebooks" / "season_calendar.csv"

# Check if calendar file exists
if not CALENDAR_PATH.exists():
    raise FileNotFoundError(
        f"Calendar file not found: {CALENDAR_PATH}"
    )

# Load calendar
CALENDAR = pd.read_csv(CALENDAR_PATH)

# Validate required columns
required_columns = [
    "Year",
    "RoundNumber",
    "EventName",
    "Country",
    "Location",
    "Session",
    "SessionDateUTC",
]

missing_columns = [
    col for col in required_columns
    if col not in CALENDAR.columns
]

if missing_columns:
    raise ValueError(
        f"Missing calendar columns: {missing_columns}"
    )

# Convert session dates to UTC
CALENDAR["SessionDateUTC"] = pd.to_datetime(
    CALENDAR["SessionDateUTC"],
    utc=True,
    errors="coerce"
)

# Remove rows with invalid session dates
CALENDAR = CALENDAR.dropna(
    subset=["SessionDateUTC"]
).copy()

# Clean session names
CALENDAR["Session"] = (
    CALENDAR["Session"].astype(str).str.strip()
)

# Sort calendar chronologically
CALENDAR = CALENDAR.sort_values(
    "SessionDateUTC"
).reset_index(drop=True)

print("F1 Calendar loaded successfully!")
print("File:", CALENDAR_PATH)
print("Total sessions:", len(CALENDAR))
print("Seasons:", sorted(CALENDAR["Year"].unique()))


def country_code(country):
    codes = {
        "Brazil": "BR",
        "Mexico": "MX",
        "United States": "US",
        "USA": "US",
        "United Kingdom": "UK",
        "Italy": "IT",
        "Japan": "JP",
        "Australia": "AU",
        "China": "CN",
        "Bahrain": "BH",
        "Saudi Arabia": "SA",
        "Monaco": "MC",
        "Spain": "ES",
        "Canada": "CA",
        "Austria": "AT",
        "Hungary": "HU",
        "Belgium": "BE",
        "Netherlands": "NL",
        "Singapore": "SG",
        "Qatar": "QA",
        "Azerbaijan": "AZ",
        "United Arab Emirates": "AE",
    }

    return codes.get(str(country), str(country)[:2].upper())


def session_is(series, expected):
    return series.astype(str).str.strip().str.casefold().isin(
        [value.casefold() for value in expected]
    )


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/")
def health_check():
    return {
        "status": "ARIS Backend API is Live!",
        "calendar_rows": len(CALENDAR)
    }


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
    try:
        return run_simulation(
            race_name=request.race_name,
            driver=request.driver,
            rival=request.rival,
            my_pits=request.my_pits,
            rival_pits=request.rival_pits
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================
# CALENDAR ENDPOINT
# ==========================================

@app.get("/api/calendar")
def get_calendar():
    data = CALENDAR.copy()

    data["SessionDateUTC"] = (
        data["SessionDateUTC"].dt.strftime("%Y-%m-%dT%H:%M:%SZ")
    )

    data = data.astype(object).where(pd.notna(data), None)

    return {
        "calendar": data.to_dict(orient="records")
    }


# ==========================================
# NEXT RACE / NEXT FP1
# ==========================================

@app.get("/api/next-race")
def get_next_race():

    now = pd.Timestamp.now(tz="UTC")

    fp1_rows = CALENDAR[
        session_is(
            CALENDAR["Session"],
            ["Practice 1", "FP1"]
        )
        & (CALENDAR["SessionDateUTC"] > now)
    ].sort_values("SessionDateUTC")

    if fp1_rows.empty:
        return {
            "available": False,
            "message": "No upcoming FP1 session found."
        }

    race = fp1_rows.iloc[0]

    return {
        "available": True,
        "name": race["EventName"],
        "circuit": race["Location"],
        "country": race["Country"],
        "session": "FP1",
        "target_date": race["SessionDateUTC"].isoformat()
    }


# ==========================================
# LAST 3 COMPLETED RACES
# ==========================================

@app.get("/api/races")
def get_races():

    now = pd.Timestamp.now(tz="UTC")

    race_rows = CALENDAR[
        session_is(CALENDAR["Session"], ["Race"])
        & (CALENDAR["SessionDateUTC"] < now)
    ].copy()

    race_rows = race_rows.sort_values(
        "SessionDateUTC",
        ascending=False
    ).head(3)

    formatted_races = []

    for _, race in race_rows.iterrows():

        round_number = race.get("RoundNumber", None)

        formatted_races.append({
            "id": str(race["EventName"]),
            "code": country_code(race["Country"]),
            "name": race["EventName"],
            "date": race["SessionDateUTC"].strftime("%d %b"),
            "round": (
                f"R{int(round_number)}"
                if pd.notna(round_number)
                else ""
            ),
            "session": "RACE"
        })

    return {
        "races": formatted_races
    }


# ==========================================
# DRIVERS
# ==========================================

@app.get("/api/drivers")
def get_drivers():

    drivers = [
        {"code": "VER", "name": "Max Verstappen", "team": "Red Bull Racing"},
        {"code": "PER", "name": "Sergio Perez", "team": "Red Bull Racing"},
        {"code": "HAM", "name": "Lewis Hamilton", "team": "Ferrari"},
        {"code": "LEC", "name": "Charles Leclerc", "team": "Ferrari"},
        {"code": "NOR", "name": "Lando Norris", "team": "McLaren"},
        {"code": "PIA", "name": "Oscar Piastri", "team": "McLaren"},
        {"code": "RUS", "name": "George Russell", "team": "Mercedes"},
        {"code": "ANT", "name": "Andrea Kimi Antonelli", "team": "Mercedes"},
        {"code": "ALO", "name": "Fernando Alonso", "team": "Aston Martin"},
        {"code": "STR", "name": "Lance Stroll", "team": "Aston Martin"},
        {"code": "GAS", "name": "Pierre Gasly", "team": "Alpine"},
        {"code": "COL", "name": "Franco Colapinto", "team": "Alpine"},
        {"code": "ALB", "name": "Alex Albon", "team": "Williams"},
        {"code": "SAI", "name": "Carlos Sainz", "team": "Williams"},
        {"code": "HUL", "name": "Nico Hulkenberg", "team": "Kick Sauber"},
        {"code": "BOR", "name": "Gabriel Bortoleto", "team": "Kick Sauber"},
        {"code": "OCO", "name": "Esteban Ocon", "team": "Haas"},
        {"code": "BEA", "name": "Oliver Bearman", "team": "Haas"},
        {"code": "LAW", "name": "Liam Lawson", "team": "Racing Bulls"},
        {"code": "HAD", "name": "Isack Hadjar", "team": "Racing Bulls"},
    ]

    return {"drivers": drivers}


# ==========================================
# NEXT EVENT - LIVE PAGE
# ==========================================

@app.get("/api/live-event")
def get_live_event():

    now = pd.Timestamp.now(tz="UTC")

    # Find sessions that have not started yet
    upcoming = CALENDAR[
        CALENDAR["SessionDateUTC"] > now
    ].sort_values("SessionDateUTC")

    if upcoming.empty:
        return {
            "available": False,
            "message": "No upcoming event found."
        }

    # Identify the next event
    next_session = upcoming.iloc[0]

    event_rows = CALENDAR[
        (CALENDAR["Year"] == next_session["Year"]) &
        (CALENDAR["RoundNumber"] == next_session["RoundNumber"])
    ].sort_values("SessionDateUTC")

    sessions = []

    for _, row in event_rows.iterrows():

        session_name = str(row["Session"]).strip()

        labels = {
            "Practice 1": "FP1",
            "Practice 2": "FP2",
            "Practice 3": "FP3",
            "Qualifying": "Quali",
            "Race": "Race",
            "Sprint": "Sprint",
            "Sprint Qualifying": "Sprint Quali",
            "Sprint Shootout": "Sprint Shootout",
        }

        session_time = row["SessionDateUTC"]

        sessions.append({
            "name": labels.get(session_name, session_name),
            "session": session_name,
            "target_date": session_time.isoformat(),
            "status": (
                "completed" if session_time <= now else "upcoming"
            )
        })

    return {
        "available": True,
        "year": int(next_session["Year"]),
        "round": int(next_session["RoundNumber"]),
        "event": next_session["EventName"],
        "country": next_session["Country"],
        "circuit": next_session["Location"],
        "sessions": sessions
    }




# ==========================================
# REPLAY SEASONS
# ==========================================

def get_completed_races():

    now = pd.Timestamp.now(tz="UTC")

    races = CALENDAR[
        (CALENDAR["Session"].str.casefold() == "race") &
        (CALENDAR["SessionDateUTC"] < now)
    ].copy()

    return races.sort_values("SessionDateUTC")


def get_country_code(country):

    codes = {
        "Australia": "AU",
        "Japan": "JP",
        "China": "CN",
        "United States": "US",
        "United Kingdom": "GB",
        "Monaco": "MC",
        "Spain": "ES",
        "Canada": "CA",
        "Austria": "AT",
        "United Kingdom": "GB",
        "Belgium": "BE",
        "Hungary": "HU",
        "Netherlands": "NL",
        "Italy": "IT",
        "Singapore": "SG",
        "Azerbaijan": "AZ",
        "Mexico": "MX",
        "Brazil": "BR",
        "Qatar": "QA",
        "United Arab Emirates": "AE",
        "Bahrain": "BH",
        "Saudi Arabia": "SA",
    }

    return codes.get(str(country), str(country)[:2].upper())


@app.get("/api/replay-seasons")
def get_replay_seasons():

    races = get_completed_races()

    years = sorted(
        races["Year"].dropna().astype(int).unique().tolist()
    )

    return {"seasons": years}


# ==========================================
# REPLAY RACES BY SEASON
# ==========================================

@app.get("/api/replay-races")
def get_replay_races(year: int = Query(...)):

    races = get_completed_races()

    races = races[races["Year"] == year].copy()

    formatted_races = []

    for _, race in races.iterrows():

        round_number = int(race["RoundNumber"])

        formatted_races.append({
            "id": f"{year}-{round_number}",
            "year": year,
            "code": get_country_code(race["Country"]),
            "round": f"R{round_number}",
            "round_number": round_number,
            "name": race["EventName"],
            "circuit": race["Location"],
            "country": race["Country"],
            "date": race["SessionDateUTC"].strftime("%d %b"),
            "date_utc": race["SessionDateUTC"].isoformat()
        })

    return {
        "year": year,
        "total": len(formatted_races),
        "races": formatted_races
    }
