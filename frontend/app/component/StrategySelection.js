"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Helper to draw the little tyre circles
const TyreIcon = ({ type }) => {
  const colors = { S: "#e10600", M: "#ffd700", H: "#ffffff", I: "#00c950", W: "#0055ff" };
  return (
    <div 
      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-black border-2 border-[#2a2a2a]"
      style={{ backgroundColor: colors[type] || "#888" }}
    >
      {type}
    </div>
  );
};

export default function StrategySelection({ onBack, onStart, driverName }) {
  const [selectedStrategy, setSelectedStrategy] = useState("B"); // Default to Recommended

  const strategies = [
    {
      id: "A",
      name: "ALTERNATIVE",
      title: "Strat A — One-stop early",
      risk: "LOW RISK",
      tyres: ["M", "H"],
      pitLaps: "18",
      description: "Box ~lap 18 (56-lap race) when deg is high from FP long runs 2018-present at this circuit: typical 1.5-stop, median first stop lap 22."
    },
    {
      id: "B",
      name: "RECOMMENDED",
      title: "Strat B — One-stop late",
      risk: "LOW RISK",
      tyres: ["M", "H"],
      pitLaps: "25",
      description: "Extend first stint to ~lap 25 when mediums hold from quali pace 2018-present at this circuit: typical 1.5-stop, median first stop lap 22."
    },
    {
      id: "C",
      name: "AGGRESSIVE",
      title: "Strat C — Two-stop aggressive",
      risk: "HIGHER RISK",
      tyres: ["M", "H", "M"],
      pitLaps: "16, 32",
      description: "Two-stop ~laps 16/32 when track temp is high and deg is steep 2018-present at this circuit: typical 1.5-stop, median first stop lap 22."
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto bg-[#111] border border-[#2a2a2a] rounded-xl p-6 md:p-10 shadow-2xl relative">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-8 right-8 text-xs font-mono tracking-widest text-gray-500 hover:text-white transition-colors flex items-center gap-1"
      >
        <span>←</span> BACK
      </button>

      <div className="mb-10">
        <div className="text-[#e10600] text-xs font-bold tracking-widest uppercase mb-1">Step 03</div>
        <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-2">PRE-RACE STRATEGY</h2>
        <p className="text-gray-400 text-sm">Plans for {driverName || "GAS"}. Select one before starting.</p>
      </div>

      {/* Strategy Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {strategies.map((strat) => (
          <div 
            key={strat.id}
            onClick={() => setSelectedStrategy(strat.id)}
            className={`relative bg-[#151515] rounded-xl p-6 cursor-pointer transition-all border ${
              selectedStrategy === strat.id 
                ? "border-[#e10600] bg-[#1a1111] shadow-[0_0_20px_rgba(225,6,0,0.15)]" 
                : "border-[#2a2a2a] hover:border-gray-500"
            }`}
          >
            {/* Card Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                {strat.name === "RECOMMENDED" && (
                  <span className="text-[#e10600] text-lg">★</span>
                )}
                <span className={`text-xs font-bold tracking-widest ${selectedStrategy === strat.id ? "text-[#e10600]" : "text-gray-400"}`}>
                  {strat.name}
                </span>
              </div>
              <span className="text-[9px] text-gray-500 font-bold tracking-widest">{strat.risk}</span>
            </div>

            {/* Card Title */}
            <h3 className="text-gray-200 text-sm font-bold mb-4">{strat.title}</h3>

            {/* Tyre Sequence */}
            <div className="flex items-center gap-2 mb-4">
              {strat.tyres.map((tyre, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <TyreIcon type={tyre} />
                  {idx < strat.tyres.length - 1 && <span className="text-gray-600 text-xs">→</span>}
                </div>
              ))}
            </div>

            {/* Pit Laps */}
            <div className="text-gray-400 text-[11px] font-mono mb-4">
              Start MEDIUM • pits L{strat.pitLaps}
            </div>

            {/* Description */}
            <p className="text-gray-500 text-xs leading-relaxed">
              {strat.description}
            </p>
          </div>
        ))}
      </div>

      {/* Action Button */}
     <div className="flex justify-end">
        <button 
          onClick={() => onStart(selectedStrategy)} // <-- Pass the strategy here
          className={`text-xs font-bold tracking-widest py-4 px-10 rounded-md transition-colors uppercase ${
            selectedStrategy 
              ? "bg-[#111] border border-gray-600 text-white hover:bg-gray-800 cursor-pointer" 
              : "bg-transparent text-gray-600 border-[#2a2a2a] cursor-not-allowed"
          }`}
        >
          START RACE
        </button>
      </div>

    </div>
  );
}