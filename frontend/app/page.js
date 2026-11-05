"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [arisMode, setArisMode] = useState("ON");
  const [nextRace, setNextRace] = useState(null);
  const [races, setRaces] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for the live countdown timer
  const [timeLeft, setTimeLeft] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  // 1. Fetch all data from FastAPI Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const nextRaceRes = await fetch("http://127.0.0.1:8000/api/next-race");
        const nextRaceData = await nextRaceRes.json();
        setNextRace(nextRaceData);

        const racesRes = await fetch("http://127.0.0.1:8000/api/races");
        const racesData = await racesRes.json();
        setRaces(racesData.races);

        const driversRes = await fetch("http://127.0.0.1:8000/api/drivers");
        const driversData = await driversRes.json();
        setDrivers(driversData.drivers);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to connect to backend:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

   // 2. Live Countdown Timer Logic
  useEffect(() => {
    if (!nextRace || !nextRace.target_date) return;

    // Parse the target date from the backend (e.g., "2024-11-03T17:00:00")
    const target = new Date(nextRace.target_date).getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      // Calculate Days, Hours, Minutes, Seconds
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      // Format to always show 2 digits
      const pad = (num) => String(num).padStart(2, "0");

      setTimeLeft({
        days: pad(d),
        hours: pad(h),
        minutes: pad(m),
        seconds: pad(s)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [nextRace]);
  return (
    <div className="min-h-screen flex flex-col items-center pt-16 relative">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Header */}
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
        <div className="text-white font-mono animate-pulse z-10">LOADING DATA FROM BACKEND...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10 px-4">
          
          {/* LEFT BOX: Replay a Race */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 shadow-2xl flex flex-col">
            <h2 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-4">Replay a Race</h2>
            
            {/* ARIS Toggle */}
            <div className="flex bg-[#0a0a0a] rounded-md p-1 w-max mb-4 border border-[#2a2a2a]">
              <button onClick={() => setArisMode("OFF")} className={`px-3 py-1 text-xs font-bold rounded-sm transition-colors ${arisMode === "OFF" ? "bg-[#2a2a2a] text-white" : "text-gray-500"}`}>ARIS OFF</button>
              <button onClick={() => setArisMode("ON")} className={`px-3 py-1 text-xs font-bold rounded-sm transition-colors ${arisMode === "ON" ? "bg-[#e10600] text-white" : "text-gray-500"}`}>ARIS ON</button>
            </div>

            {/* Driver Dropdown */}
            <div className="mb-4">
              <label className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1 block">Driver</label>
              <select className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-gray-200 rounded p-2 outline-none focus:border-[#e10600]">
                {drivers.map((driver, idx) => (
                  <option key={idx} value={driver.code}>
                    {driver.code} - {driver.name} ({driver.team})
                  </option>
                ))}
              </select>
            </div>

            {/* Last 3 Races */}
            <div className="flex flex-col gap-2 mb-6">
              {races.map((race, idx) => (
                <div key={idx} className="flex items-center justify-between bg-[#0f0f0f] border border-[#2a2a2a] p-3 rounded hover:border-gray-600 cursor-pointer transition-colors group">
                  <div className="flex items-center gap-3">
                    <span className="bg-white text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded">{race.code}</span>
                    <span className="text-gray-300 text-xs font-mono truncate w-40">{race.name}</span>
                  </div>
                  <span className="bg-[#e10600] text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider">RACE</span>
                </div>
              ))}
            </div>

            {/* Link to Replay Page */}
            <Link href="/replay" className="text-xs text-gray-400 hover:text-white font-bold tracking-widest mt-auto text-left flex items-center gap-2">
              SEE ALL RACES <span>→</span>
            </Link>
          </div>

          {/* RIGHT BOX: Next Race */}
          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 shadow-2xl flex flex-col">
            <h2 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-4">Next • FP1</h2>
            
            <h3 className="text-2xl font-black text-white mb-1">{nextRace?.name || "Loading..."}</h3>
            <p className="text-gray-500 text-xs mb-5">{nextRace?.circuit}</p>

            <div className="bg-[#0a0a0a] border border-[#2a2a2a] p-3 rounded mb-6">
              <p className="text-gray-400 text-[11px] leading-relaxed">
                <strong className="text-gray-200">ARIS live strategy coming soon.</strong><br/>
                Full pit-wall strategy available now in <Link href="/replay" className="text-[#e10600] font-bold cursor-pointer hover:underline">Replay</Link> mode.
              </p>
            </div>

            {/* Live Ticking Countdown */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded flex flex-col items-center justify-center py-3">
                <span className="text-xl font-mono text-gray-200">{timeLeft.days}</span>
                <span className="text-[9px] text-gray-600 font-bold mt-1">D</span>
              </div>
              <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded flex flex-col items-center justify-center py-3">
                <span className="text-xl font-mono text-gray-200">{timeLeft.hours}</span>
                <span className="text-[9px] text-gray-600 font-bold mt-1">H</span>
              </div>
              <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded flex flex-col items-center justify-center py-3">
                <span className="text-xl font-mono text-gray-200">{timeLeft.minutes}</span>
                <span className="text-[9px] text-gray-600 font-bold mt-1">M</span>
              </div>
              <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded flex flex-col items-center justify-center py-3">
                <span className="text-xl font-mono text-gray-200">{timeLeft.seconds}</span>
                <span className="text-[9px] text-gray-600 font-bold mt-1">S</span>
              </div>
            </div>

            <Link href="/live" className="w-full bg-[#0f0f0f] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-bold tracking-widest py-3 rounded transition-colors mt-auto text-center block">
              LIVE HUB →
            </Link>
          </div>

        </div>
      )}

      <div className="mt-8 text-gray-600 text-xs font-mono z-10">
        v0.3 • T4-final • 0.345 match-rate (30/87 dry)
      </div>

    </div>
  );
}