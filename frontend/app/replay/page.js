"use client";
import { useState } from "react";
import DriverSelection from "../component/DriverSelection";
import StrategySelection from "../component/StrategySelection";

export default function ReplayPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [arisOn, setArisOn] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(2026);
  const [selectedRace, setSelectedRace] = useState("US");
  const [selectedDriver, setSelectedDriver] = useState(null);

  const races = [
    { code: "AU", round: "R1", name: "Albert Park", date: "8 Mar" },
    { code: "JP", round: "R4", name: "Suzuka", date: "29 Mar" },
    { code: "CN", round: "R5", name: "Shanghai Internatio...", date: "15 Mar" },
    { code: "US", round: "R6", name: "Miami Internationa...", date: "3 May" },
    { code: "MC", round: "R8", name: "Circuit de Monaco", date: "7 Jun" },
    { code: "ES", round: "R9", name: "Circuit de Barcelon...", date: "14 Jun" },
    { code: "CA", round: "R10", name: "Circuit Gilles Vill...", date: "24 May" },
    { code: "GB", round: "R12", name: "Silverstone", date: "5 Jul" },
    { code: "IT", round: "R15", name: "Monza", date: "6 Sep" },
    { code: "SG", round: "R18", name: "Marina Bay", date: "20 Sep" },
  ];

  return (
    <div className="min-h-screen flex flex-col relative pt-8 pb-16">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="w-full max-w-7xl mx-auto px-6 z-10">
        
        {/* Header Info */}
        <div className="mb-8">
          <div className="text-xs font-mono tracking-widest text-gray-500 mb-2 uppercase">Replay Setup</div>
          <div className="text-gray-300 text-sm font-mono">2026 • US Circuit of the Americas • Race • ARIS</div>
        </div>

        {/* Stepper */}
        <div className="flex flex-wrap gap-2 text-[10px] md:text-xs font-mono tracking-widest uppercase mb-12">
          <span className={`px-3 py-1.5 rounded-sm border ${currentStep === 1 ? "bg-[#1a1a1a] text-[#e10600] border-[#e10600]/30" : "text-gray-600 border-transparent"}`}>01 Year & Race</span>
          <span className={`px-3 py-1.5 rounded-sm border ${currentStep === 2 ? "bg-[#1a1a1a] text-[#e10600] border-[#e10600]/30" : "text-gray-600 border-transparent"}`}>02 Driver</span>
          <span className={`px-3 py-1.5 rounded-sm border ${currentStep === 3 ? "bg-[#1a1a1a] text-[#e10600] border-[#e10600]/30" : "text-gray-600 border-transparent"}`}>03 Strategies</span>
          <span className="text-gray-600 px-3 py-1.5 rounded-sm border border-transparent">04 Load</span>
        </div>

        {/* --- STEP 1: RACE SELECTION --- */}
        {currentStep === 1 && (
          <>
            <div className="mb-10 max-w-3xl">
              <div className="text-[#e10600] text-xs font-bold tracking-widest uppercase mb-2">Aris</div>
              <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">Replay with ARIS</h1>
              <p className="text-gray-400 text-sm leading-relaxed">Toggle ARIS first, then pick a season and race. Cancelled, upcoming, and future-dated weekends are hidden.</p>
            </div>

            <div className="flex bg-[#111] border border-[#2a2a2a] rounded-md p-1 w-max mb-16">
              <button onClick={() => setArisOn(false)} className={`px-6 py-2 text-xs font-bold tracking-widest transition-colors rounded-sm ${!arisOn ? "bg-[#e10600] text-white" : "text-gray-500 hover:text-gray-300"}`}>OFF</button>
              <button onClick={() => setArisOn(true)} className={`px-6 py-2 text-xs font-bold tracking-widest transition-colors rounded-sm ${arisOn ? "bg-[#e10600] text-white" : "text-gray-500 hover:text-gray-300"}`}>ON</button>
            </div>

            <div className="flex justify-between items-end mb-6">
              <h2 className="text-[#e10600] text-xs font-bold tracking-widest uppercase">Season & Race</h2>
              <div className="flex bg-[#111] border border-[#2a2a2a] rounded-md p-1">
                {[2024, 2025, 2026].map((year) => (
                  <button key={year} onClick={() => setSelectedSeason(year)} className={`px-4 py-1.5 text-xs font-mono tracking-wider transition-colors rounded-sm ${selectedSeason === year ? "bg-[#e10600] text-white" : "text-gray-500 hover:text-gray-300"}`}>{year}</button>
                ))}
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {races.map((race, idx) => (
                <div key={idx} onClick={() => setSelectedRace(race.code)} className={`min-w-[200px] md:min-w-[240px] flex-shrink-0 bg-[#151515] rounded-lg p-5 flex flex-col cursor-pointer transition-all ${selectedRace === race.code ? "border border-[#e10600] shadow-[0_0_15px_rgba(225,6,0,0.15)]" : "border border-[#2a2a2a] hover:border-gray-500"}`}>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-2xl font-black text-gray-200">{race.code}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{race.round}</span>
                  </div>
                  <div className="mb-4">
                    <div className="text-white font-bold text-sm truncate">{race.name}</div>
                    <div className="text-gray-500 text-xs mt-1">{race.date}</div>
                  </div>
                  <div className="mt-auto">
                    <span className="bg-[#0a0a0a] border border-[#2a2a2a] text-gray-400 text-[9px] font-bold px-2 py-1 rounded-sm tracking-widest">RACE</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 mb-16">
              <button onClick={() => setCurrentStep(2)} className="bg-transparent border border-[#e10600] text-[#e10600] hover:bg-[#e10600] hover:text-white text-xs font-bold tracking-widest py-4 px-8 rounded-md transition-colors flex items-center gap-2 uppercase">
                Continue with Circuit of the Americas <span>→</span>
              </button>
            </div>
          </>
        )}

        {/* --- STEP 2: DRIVER SELECTION --- */}
        {currentStep === 2 && (
          <DriverSelection 
            onBack={() => setCurrentStep(1)} 
            onNext={(driverCode) => {
              setSelectedDriver(driverCode);
              setCurrentStep(3);
            }} 
          />
        )}

        {/* --- STEP 3: STRATEGY SELECTION --- */}
        {currentStep === 3 && (
          <StrategySelection 
            driverName={selectedDriver}
            onBack={() => setCurrentStep(2)} 
            onStart={() => {
              // This will eventually route to the dashboard
              alert(`Starting Race for ${selectedDriver}!`);
            }} 
          />
        )}

      </div>
    </div>
  );
}