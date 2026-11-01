"use client";
import { useState } from "react";

export default function DriverSelection({ onBack, onNext }) {
  const [arisControl, setArisControl] = useState("AUTO");
  const [selectedDriver, setSelectedDriver] = useState(null);

  // Dynamic Driver Data (Ready for your backend later)
  const drivers = [
    { code: "NOR", number: "1", initials: "LN", color: "#ff8700" }, // McLaren
    { code: "VER", number: "3", initials: "MV", color: "#3671c6" }, // Red Bull
    { code: "BOR", number: "5", initials: "GB", color: "#e10600" }, // Sauber (Red)
    { code: "HAD", number: "6", initials: "IH", color: "#3671c6" }, // Red Bull
    { code: "GAS", number: "10", initials: "PG", color: "#0093cc" }, // Alpine
    { code: "PER", number: "11", initials: "SP", color: "#6cd3bf" }, // Aston Martin
    { code: "ANT", number: "12", initials: "KA", color: "#27f4d2" }, // Mercedes
    { code: "ALO", number: "14", initials: "FA", color: "#229971" }, // Aston Martin
    { code: "LEC", number: "16", initials: "CL", color: "#e10600" }, // Ferrari
    { code: "STR", number: "18", initials: "LS", color: "#229971" }, // Aston Martin
    { code: "ALB", number: "23", initials: "AA", color: "#64c4ff" }, // Williams
    { code: "HUL", number: "27", initials: "NH", color: "#ffffff" }, // Haas
    { code: "LAW", number: "30", initials: "LL", color: "#3671c6" }, // Red Bull
    { code: "OCO", number: "31", initials: "EO", color: "#ffffff" }, // Haas
    { code: "LIN", number: "41", initials: "AL", color: "#0093cc" }, // Alpine
    { code: "COL", number: "43", initials: "FC", color: "#0093cc" }, // Alpine
    { code: "HAM", number: "44", initials: "LH", color: "#e10600" }, // Ferrari
    { code: "SAI", number: "55", initials: "CS", color: "#64c4ff" }, // Williams
    { code: "RUS", number: "63", initials: "GR", color: "#27f4d2" }, // Mercedes
    { code: "BOT", number: "77", initials: "VB", color: "#e10600" }, // Sauber
    { code: "PIA", number: "81", initials: "OP", color: "#ff8700" }, // McLaren
    { code: "BEA", number: "87", initials: "OB", color: "#ffffff" }, // Haas
  ];

  return (
    <div className="w-full max-w-6xl mx-auto bg-[#111] border border-[#2a2a2a] rounded-xl p-6 md:p-10 shadow-2xl relative">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-8 right-8 text-xs font-mono tracking-widest text-gray-500 hover:text-white transition-colors flex items-center gap-1"
      >
        <span>←</span> BACK
      </button>

      <div className="mb-8">
        <div className="text-[#e10600] text-xs font-bold tracking-widest uppercase mb-1">Step 02</div>
        <h2 className="text-3xl font-black text-white tracking-tight uppercase mb-2">Select Driver</h2>
        <p className="text-gray-400 text-sm">Choose who ARIS runs for, then fetch strategies.</p>
      </div>

      {/* ARIS Control Toggle */}
      <div className="mb-8">
        <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-3">Aris Control</div>
        <div className="flex bg-[#0a0a0a] border border-[#2a2a2a] rounded-md p-1 w-max">
          <button 
            onClick={() => setArisControl("AUTO")}
            className={`px-6 py-1.5 text-xs font-bold tracking-widest rounded-sm transition-colors ${
              arisControl === "AUTO" ? "bg-[#e10600] text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            AUTO
          </button>
          <button 
            onClick={() => setArisControl("ASSISTED")}
            className={`px-6 py-1.5 text-xs font-bold tracking-widest rounded-sm transition-colors ${
              arisControl === "ASSISTED" ? "bg-[#e10600] text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            ASSISTED
          </button>
        </div>
      </div>

      {/* Driver Grid */}
      <div className="mb-10">
        <div className="text-gray-500 text-[10px] font-bold tracking-widest uppercase mb-4">Driver Grid</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {drivers.map((driver) => (
            <div 
              key={driver.code}
              onClick={() => setSelectedDriver(driver.code)}
              className={`bg-[#151515] rounded flex flex-col items-center justify-center py-4 cursor-pointer transition-all border ${
                selectedDriver === driver.code 
                  ? "border-[#e10600] bg-[#1a1111]" 
                  : "border-[#2a2a2a] hover:border-gray-500"
              }`}
              style={{ borderTop: `3px solid ${driver.color}` }} // Team color top border
            >
              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-gray-300 font-bold text-sm mb-3">
                {driver.initials}
              </div>
              <div className="text-white font-mono text-xs font-bold">
                <span className="text-gray-500">#{driver.number}</span> {driver.code}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      <button 
         onClick={() => onNext(selectedDriver)} 
        disabled={!selectedDriver}
        className={`w-max text-xs font-bold tracking-widest py-4 px-8 rounded-md transition-colors uppercase border ${
          selectedDriver 
            ? "bg-[#e10600] text-white border-[#e10600] hover:bg-[#b30500] cursor-pointer" 
            : "bg-transparent text-gray-600 border-[#2a2a2a] cursor-not-allowed"
        }`}
      >
        Get Strategies
      </button>
    </div>
  );
}