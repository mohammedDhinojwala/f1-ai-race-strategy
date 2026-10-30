import pandas as pd
import numpy as np
import os
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.ensemble import RandomForestRegressor

# Figure out the correct path to your CSV (since it's in the notebooks folder)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
CSV_PATH = os.path.join(BASE_DIR, "notebooks", "DeepSeek_df_clean.csv")

print("Loading data and training model for API...")
DeepSeek_df = pd.read_csv(CSV_PATH)

FEATURES = [
    'TyreLife', 'TyreLifePercent', 'Avg_TrackTemp', 'Avg_AirTemp', 
    'TrackTemp_Delta', 'Peak_TyreEnergy', 'Energy_Std', 
    'PaceTrend', 'Quad_Term', 'DegAcceleration', 
    'Compound', 'CircuitArchetype', 'StintPhase'
]
train_df = DeepSeek_df.dropna(subset=['T2_Deg_Target'])
X = train_df[FEATURES]
y = train_df['T2_Deg_Target']

preprocessor = ColumnTransformer([
    ("cat", Pipeline([("imp", SimpleImputer(strategy="most_frequent")), ("oh", OneHotEncoder(handle_unknown="ignore"))]), ['Compound', 'CircuitArchetype', 'StintPhase']),
    ("num", Pipeline([("imp", SimpleImputer(strategy="median")), ("sc", StandardScaler())]), [c for c in FEATURES if c not in ['Compound', 'CircuitArchetype', 'StintPhase']])
])
model = Pipeline([("prep", preprocessor), ("rf", RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42))])
model.fit(X, y)
print("Model trained and ready for API requests!")

def run_simulation(race_name, driver, rival, my_pits, rival_pits):
    my_data = DeepSeek_df[(DeepSeek_df['EventName'] == race_name) & (DeepSeek_df['Driver'] == driver)].copy()
    rival_data = DeepSeek_df[(DeepSeek_df['EventName'] == race_name) & (DeepSeek_df['Driver'] == rival)].copy()
    
    if my_data.empty or rival_data.empty: 
        return {"error": f"Data not found for {race_name}."}
        
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
    
    if not isinstance(my_pits, list): my_pits = [my_pits]
    if not isinstance(rival_pits, list): rival_pits = [rival_pits]

    for lap in range(1, total_laps + 1):
        # My ML Prediction
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

        # Rival ML Prediction
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
        
        # Pits
        if lap in rival_pits:
            rival_lap_time += 22.0
            rival_tyre_age = 1
            rival_wear = 0.0
            rival_pits.remove(lap)
        else:
            rival_tyre_age += 1
            rival_wear += rival_wear_next

        if lap in my_pits:
            my_lap_time += 22.0
            my_tyre_age = 1
            my_wear = 0.0
            my_pits.remove(lap)
        else:
            my_tyre_age += 1
            my_wear += my_wear_next
            
        # Dirty Air
        if 0 < gap < 1.5:
            my_lap_time += 0.3
            
        my_time += my_lap_time
        rival_time += rival_lap_time
        gap = rival_time - my_time 

    return {
        "my_time": round(my_time, 2),
        "rival_time": round(rival_time, 2),
        "gap": round(gap, 2),
        "winner": driver if gap > 0 else rival
    }