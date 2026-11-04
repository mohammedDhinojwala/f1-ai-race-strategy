"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [arisMode, setArisMode] = useState("ON");
  
  // New State variables to hold data from the Backend
  const [nextRace, setNextRace] = useState(null);
  const [races, setRaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // This runs once when the page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Next Race
        const nextRaceRes = await fetch("http://127.0.0.1:8000/api/next-race");
        const nextRaceData = await nextRaceRes.json();
        setNextRace(nextRaceData);

        // Fetch Races
        const racesRes = await fetch("http://127.0.0.1:8000/api/races");
        const racesData = await racesRes.json();
        setRaces(racesData.races);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to connect to backend:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 relative">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Main ARIS Logo */}
      <div className="text-center mb-16 z-10">
        <h1 className="text-7xl md:text-9xl font-black text-[#e10600] tracking-tighter" style={{ textShadow: "0 0 40px rgba(225,6,0,0.3)" }}>
          ARIS
        </h1>
        <div className="inline-block bg-[#e10600] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm mb-4">
          BETA
        </div>
        <p className="text-gray-400 text-xs tracking-[0.2em] font-mono uppercase">
          Always On Race Intelligence System
        </p>
      </div>

      {isLoading ? (
        <div className="text-white font-mono animate-pulse">LOADING DATA FROM BACKEND...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10 px-4">
          
          {/* LEFT BOX: Replay a Race */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 shadow-2xl flex flex-col">
            <h2 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-4">Replay a Race</h2>
            
            <div className="flex bg-[#0a0a0a] rounded-md p-1 w-max mb-4 border border-[#2a2a2a]">
              <button onClick={() => setArisMode("OFF")} className={`px-3 py-1 text-xs font-bold rounded-sm transition-colors ${arisMode === "OFF" ? "bg-[#2a2a2a] text-white" : "text-gray-500"}`}>ARIS OFF</button>
              <button onClick={() => setArisMode("ON")} className={`px-3 py-1 text-xs font-bold rounded-sm transition-colors ${arisMode === "ON" ? "bg-[#e10600] text-white" : "text-gray-500"}`}>ARIS ON</button>
            </div>

            <div className="mb-4">
              <label className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1 block">Driver</label>
              <select className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-gray-200 rounded p-2 outline-none focus:border-[#e10600]">
                <option>NOR - LANDO NORRIS</option>
                <option>VER - MAX VERSTAPPEN</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              {/* Dynamic Mapping of Backend Races */}
              {races.slice(0, 3).map((race, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#0f0f0f] border border-[#2a2a2a] p-3 rounded hover:border-gray-600 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="bg-white text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded">{race.code}</span>
                    <span className="text-gray-300 text-xs font-mono truncate w-40">{race.name}</span>
                  </div>
                  <span className="bg-[#e10600] text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider">RACE</span>
                </div>
              ))}
            </div>
            <button className="text-xs text-gray-400 hover:text-white font-bold tracking-widest mt-auto text-left flex items-center gap-2">
              SEE ALL RACES <span>→</span>
            </button>
          </div>

          {/* RIGHT BOX: Next Race */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 shadow-2xl flex flex-col">
            <h2 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-4">Next • FP1</h2>
            
            {/* Dynamic Next Race Data */}
            <h3 className="text-2xl font-black text-white mb-1">{nextRace?.name || "Loading..."}</h3>
            <p className="text-gray-500 text-xs mb-5">{nextRace?.circuit}</p>

            <div className="bg-[#0a0a0a] border border-[#2a2a2a] p-3 rounded mb-6">
              <p className="text-gray-400 text-[11px] leading-relaxed">
                <strong className="text-gray-200">ARIS live strategy coming soon.</strong><br/>
                Full pit-wall strategy available now in <span className="text-[#e10600] font-bold cursor-pointer">Replay</span> mode.
              </p>
            </div>

            {/* Dynamic Countdown Blocks */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {[
                { value: nextRace?.days || "00", label: "D" },
                { value: nextRace?.hours || "00", label: "H" },
                { value: nextRace?.minutes || "00", label: "M" },
                { value: nextRace?.seconds || "00", label: "S" },
              ].map((time, idx) => (
                <div key={idx} className="bg-[#0a0a0a] border border-[#2a2a2a] rounded flex flex-col items-center justify-center py-3">
                  <span className="text-xl font-mono text-gray-200">{time.value}</span>
                  <span className="text-[9px] text-gray-600 font-bold mt-1">{time.label}</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-[#0f0f0f] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-bold tracking-widest py-3 rounded transition-colors mt-auto">
              LIVE HUB →
            </button>
          </div>

        </div>
      )}

      <div className="mt-8 text-gray-600 text-xs font-mono z-10">
        v0.3 • T4-final • 0.345 match-rate (30/87 dry)
      </div>

    </div>
  );
}