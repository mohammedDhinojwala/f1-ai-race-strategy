from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from simulator_service import run_simulation
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