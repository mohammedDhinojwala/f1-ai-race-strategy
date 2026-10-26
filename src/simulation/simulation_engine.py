import pandas as pd
import numpy as np
import random
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestRegressor
import os

# Define the features globally so they are easy to access
FEATURES = [
    'TyreLife', 'TyreLifePercent', 'Avg_TrackTemp', 'Avg_AirTemp', 
    'TrackTemp_Delta', 'Peak_TyreEnergy', 'Energy_Std', 
    'PaceTrend', 'Quad_Term', 'DegAcceleration', 
    'Compound', 'CircuitArchetype', 'StintPhase'
]
TARGET = 'T2_Deg_Target'

def train_simulation_model(data_path="../../data/DeepSeek_df_clean.csv"):
    """Loads data and trains the ML model."""
    # Adjust path if necessary based on where you run it from
    if not os.path.exists(data_path):
        # Fallback if the file is directly in the notebooks folder
        data_path = "DeepSeek_df_clean.csv" 
        
    print(f"Loading data from {data_path}...")
    DeepSeek_df = pd.read_csv(data_path)
    
    train_df = DeepSeek_df.dropna(subset=[TARGET])
    X = train_df[FEATURES]
    y = train_df[TARGET]

    cat_features = ['Compound', 'CircuitArchetype', 'StintPhase']
    num_features = [c for c in FEATURES if c not in cat_features]

    preprocessor = ColumnTransformer([
        ("cat", Pipeline([("imp", SimpleImputer(strategy="most_frequent")), ("oh", OneHotEncoder(handle_unknown="ignore"))]), cat_features),
        ("num", Pipeline([("imp", SimpleImputer(strategy="median")), ("sc", StandardScaler())]), num_features)
    ])

    model = Pipeline([
        ("prep", preprocessor), 
        ("rf", RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42, n_jobs=-1))
    ])
    model.fit(X, y)
    return model, DeepSeek_df

def simulate_full_race(model, df, race_name, driver_code, rival_code, target_pit_lap, rival_pit_lap, pit_loss=22.0):
    """Simulates the race lap by lap."""
    my_data = df[(df['EventName'] == race_name) & (df['Driver'] == driver_code)].copy()
    rival_data = df[(df['EventName'] == race_name) & (df['Driver'] == rival_code)].copy()
    
    if my_data.empty or rival_data.empty: return None
    total_laps = int(max(my_data['LapNumber'].max(), rival_data['LapNumber'].max()))
    
    all_laps = pd.DataFrame({'LapNumber': range(1, total_laps + 1)})
    my_data = all_laps.merge(my_data, on='LapNumber', how='left').ffill()
    rival_data = all_laps.merge(rival_data, on='LapNumber', how='left').ffill()

    my_base_pace = my_data['LapTimeSeconds'].min()
    rival_base_pace = rival_data['LapTimeSeconds'].min()
    
    my_time, rival_time = 0.0, 0.0
    my_wear, rival_wear = 0.0, 0.0
    my_tyre_age, rival_tyre_age = 0, 0
    gap = 1.0 
    
    safety_car_lap = random.randint(10, total_laps) if random.random() < 0.20 else None
    
    for lap in range(1, total_laps + 1):
        my_row = my_data[my_data['LapNumber'] == lap].iloc[0]
        my_features = pd.DataFrame([{
            'TyreLife': my_tyre_age, 'TyreLifePercent': my_tyre_age / 25.0,
            'Avg_TrackTemp': my_row['Avg_TrackTemp'], 'Avg_AirTemp': my_row['Avg_AirTemp'],
            'TrackTemp_Delta': my_row['TrackTemp_Delta'], 'Peak_TyreEnergy': my_row['Peak_TyreEnergy'],
            'Energy_Std': my_row['Energy_Std'], 'PaceTrend': my_row['PaceTrend'],
            'Quad_Term': my_row['Quad_Term'], 'DegAcceleration': my_row['DegAcceleration'],
            'Compound': my_row['Compound'], 'CircuitArchetype': my_row['CircuitArchetype'],
            'StintPhase': 'Early' if my_tyre_age <= 5 else ('Mid' if my_tyre_age <= 15 else 'Late')
        }])
        my_wear_next = max(0, model.predict(my_features)[0])
        my_lap_time = my_base_pace + my_wear

        rival_row = rival_data[rival_data['LapNumber'] == lap].iloc[0]
        rival_features = pd.DataFrame([{
            'TyreLife': rival_tyre_age, 'TyreLifePercent': rival_tyre_age / 25.0,
            'Avg_TrackTemp': rival_row['Avg_TrackTemp'], 'Avg_AirTemp': rival_row['Avg_AirTemp'],
            'TrackTemp_Delta': rival_row['TrackTemp_Delta'], 'Peak_TyreEnergy': rival_row['Peak_TyreEnergy'],
            'Energy_Std': rival_row['Energy_Std'], 'PaceTrend': rival_row['PaceTrend'],
            'Quad_Term': rival_row['Quad_Term'], 'DegAcceleration': rival_row['DegAcceleration'],
            'Compound': rival_row['Compound'], 'CircuitArchetype': rival_row['CircuitArchetype'],
            'StintPhase': 'Early' if rival_tyre_age <= 5 else ('Mid' if rival_tyre_age <= 15 else 'Late')
        }])
        rival_wear_next = max(0, model.predict(rival_features)[0])
        rival_lap_time = rival_base_pace + rival_wear
        
        if lap == rival_pit_lap:
            rival_lap_time += pit_loss
            rival_tyre_age = 1
            rival_wear = 0.0
        else:
            rival_tyre_age += 1
            rival_wear += rival_wear_next

        actual_pit_loss = pit_loss
        if safety_car_lap and lap == safety_car_lap:
            actual_pit_loss = 10.0 
            
        if lap == target_pit_lap:
            my_lap_time += actual_pit_loss
            my_tyre_age = 1
            my_wear = 0.0
        else:
            my_tyre_age += 1
            my_wear += my_wear_next
            
        if 0 < (gap + (my_lap_time - rival_lap_time)) < 1.5:
            my_lap_time += 0.3 
            
        my_time += my_lap_time
        rival_time += rival_lap_time
        gap = rival_time - my_time 

    return my_time, rival_time, gap