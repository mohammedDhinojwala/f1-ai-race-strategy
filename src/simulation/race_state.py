# src/simulation/race_state.py

class CarState:
    def __init__(self, driver_name, starting_lap, starting_tyre_age, compound, total_laps, starting_fuel_kg=110.0):
        # Static info
        self.driver_name = driver_name
        self.compound = compound
        self.total_laps = total_laps
        
        # State that changes every lap
        self.current_lap = starting_lap
        self.tyre_age = starting_tyre_age
        self.fuel_load = starting_fuel_kg
        self.total_race_time = 0.0  # Accumulated time in seconds
        
        # Track position
        self.current_position = 1
        self.gap_ahead = 0.0
        self.gap_behind = 0.0

    def complete_lap(self, lap_time, pit_loss=0.0):
        """Updates the car's state after completing one lap."""
        self.current_lap += 1
        self.total_race_time += lap_time
        self.tyre_age += 1
        
        # Burn roughly 1.5kg of fuel per lap (110kg / ~70 laps)
        self.fuel_load = max(0.0, self.fuel_load - 1.5) 
        
        # If the car pitted this lap, reset tyre age and add pit loss time
        if pit_loss > 0:
            self.total_race_time += pit_loss
            self.tyre_age = 1 # Fresh tyres

    def change_tyre(self, new_compound):
        """Called when a car pits and changes tyres."""
        self.compound = new_compound
        self.tyre_age = 1 # Resets to 1 lap old