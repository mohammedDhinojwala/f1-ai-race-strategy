"use client";
import { useState } from "react";

export default function Home() {
  // We will connect this to the backend later. For now, it's mocked UI data.
  const [arisMode, setArisMode] = useState("ON");
  const [selectedDriver, setSelectedDriver] = useState("NOR");

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 relative">
      
      {/* Background Grid Pattern (Subtle) */}
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
        <p className="text-gray-600 text-[11px] mt-2 max-w-md mx-auto">
          Classical decision support, not a black box. ARIS shows its evidence and races a ghost driver against the field.
        </p>
      </div>

      {/* The Two Main Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10 px-4">
        
        {/* LEFT BOX: Replay a Race */}
        <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 shadow-2xl flex flex-col">
          <h2 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-4">Replay a Race</h2>
          
          {/* Toggle */}
          <div className="flex bg-[#0a0a0a] rounded-md p-1 w-max mb-4 border border-[#2a2a2a]">
            <button 
              onClick={() => setArisMode("OFF")}
              className={`px-3 py-1 text-xs font-bold rounded-sm transition-colors ${arisMode === "OFF" ? "bg-[#2a2a2a] text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              ARIS OFF
            </button>
            <button 
              onClick={() => setArisMode("ON")}
              className={`px-3 py-1 text-xs font-bold rounded-sm transition-colors ${arisMode === "ON" ? "bg-[#e10600] text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              ARIS ON
            </button>
          </div>

          {/* Driver Select */}
          <div className="mb-4">
            <label className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1 block">Driver</label>
            <select className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-gray-200 rounded p-2 outline-none focus:border-[#e10600]">
              <option value="NOR">NOR - LANDO NORRIS</option>
              <option value="PIA">PIA - OSCAR PIASTRI</option>
              <option value="VER">VER - MAX VERSTAPPEN</option>
            </select>
          </div>

          {/* Race List */}
          <div className="flex flex-col gap-2 mb-6">
            {[
              { id: "us", year: "2026", name: "Circuit of the Americas" },
              { id: "sg", year: "2026", name: "Marina Bay Street Circuit" },
              { id: "my", year: "2026", name: "Sepang International Circuit" }
            ].map((race, idx) => (
              <div key={idx} className="flex items-center justify-between bg-[#0f0f0f] border border-[#2a2a2a] p-3 rounded hover:border-gray-600 cursor-pointer transition-colors group">
                <div className="flex items-center gap-3">
                  <span className="bg-white text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded">{race.id}</span>
                  <span className="text-gray-300 text-xs font-mono">{race.year} • {race.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#e10600] text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider">RACE</span>
                  <span className="text-gray-500 group-hover:text-white transition-colors">🏁</span>
                </div>
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
          
          <h3 className="text-2xl font-black text-white mb-1">MX Mexico City</h3>
          <p className="text-gray-500 text-xs mb-5">Autodromo Hermanos Rodriguez</p>

          {/* Coming Soon Box */}
          <div className="bg-[#0a0a0a] border border-[#2a2a2a] p-3 rounded mb-6">
            <p className="text-gray-400 text-[11px] leading-relaxed">
              <strong className="text-gray-200">ARIS live strategy coming soon.</strong><br/>
              Full pit-wall strategy available now in <span className="text-[#e10600] font-bold cursor-pointer">Replay</span> mode.
            </p>
          </div>

          {/* Countdown Blocks */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[
              { value: "00", label: "D" },
              { value: "04", label: "H" },
              { value: "19", label: "M" },
              { value: "46", label: "S" },
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

      {/* Footer Text Below Boxes */}
      <div className="mt-8 text-gray-600 text-xs font-mono z-10">
        v0.3 • T4-final • 0.345 match-rate (30/87 dry)
      </div>

    </div>
  );
}