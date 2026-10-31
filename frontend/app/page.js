"use client";
import { useState } from "react";

export default function Home() {
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          race_name: "Bahrain Grand Prix",
          driver: "PIA",
          rival: "VER",
          my_pits: [14, 32],
          rival_pits: [11, 26]
        })
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Failed to connect to backend. Is it running?");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-5xl font-bold mb-4 tracking-tighter text-red-500">
        AI RACE STRATEGIST
      </h1>
      <p className="text-gray-400 mb-12 max-w-xl text-center">
        Select a race, pick your driver, and let the ML engine simulate the optimal pit strategy.
      </p>

      <div className="bg-[#111] border border-gray-800 rounded-xl p-8 w-full max-w-2xl shadow-2xl">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Select Race</label>
            <select className="w-full bg-black border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500">
              <option>Bahrain Grand Prix</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Select Driver</label>
            <select className="w-full bg-black border border-gray-700 text-white p-3 rounded-lg outline-none focus:border-red-500">
              <option>PIA (McLaren)</option>
            </select>
          </div>
        </div>

        <button 
          onClick={runSimulation}
          disabled={isSimulating}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-4 rounded-lg transition-colors tracking-widest disabled:opacity-50"
        >
          {isSimulating ? "RUNNING AI SIMULATION..." : "RUN STRATEGY SIMULATION"}
        </button>

        {result && (
          <div className="mt-8 border-t border-gray-800 pt-8">
            <h3 className="text-green-500 text-sm font-bold mb-4 tracking-widest">SIMULATION COMPLETE</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black p-4 rounded border border-gray-800">
                <p className="text-gray-500 text-xs mb-1">WINNER</p>
                <p className="text-xl font-bold">{result.winner}</p>
              </div>
              <div className="bg-black p-4 rounded border border-gray-800">
                <p className="text-gray-500 text-xs mb-1">GAP</p>
                <p className="text-xl font-bold text-red-500">{result.gap}s</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}