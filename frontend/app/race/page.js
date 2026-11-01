"use client";
import Link from "next/link";

export default function RaceDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      
      {/* 1. TOP NAV BAR */}
      <div className="h-12 border-b border-[#2a2a2a] bg-[#111] flex items-center justify-between px-4 text-xs font-mono tracking-widest shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-gray-400 hover:text-white">←</Link>
          <span className="font-bold text-[#e10600]">ARIS</span>
          <span className="text-gray-500">Marina Bay Street Circuit • 2026</span>
          <span className="text-[#e10600] bg-[#1a1a1a] px-2 py-0.5 border border-[#e10600]/30 rounded-sm">ARIS FOR GAS</span>
          <span>Lap 8 / 62</span>
        </div>
        <div className="flex gap-2">
          <button className="bg-[#e10600] text-white px-3 py-1 rounded-sm">ARIS: ON</button>
          <button className="border border-[#2a2a2a] text-gray-400 px-3 py-1 rounded-sm hover:text-white">RESET VIEW</button>
        </div>
      </div>

      {/* 2. RACE CONTROL BANNER (VSC) */}
      <div className="bg-[#b38e00] text-black text-xs font-bold px-4 py-1 tracking-widest shrink-0">
        VIRTUAL SAFETY CAR. Pace delta limited. No overtaking.
      </div>

      {/* 3. MAIN GRID AREA */}
      <div className="flex-1 p-2 grid grid-cols-12 grid-rows-2 gap-2 overflow-hidden">
        
        {/* TOP ROW */}
        {/* Track Map */}
        <div className="col-span-6 bg-[#111] border border-[#2a2a2a] rounded flex flex-col">
          <div className="border-b border-[#2a2a2a] p-2 text-[10px] text-gray-500 tracking-widest uppercase font-bold bg-[#151515]">Track Map</div>
          <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">Track SVG goes here</div>
        </div>

        {/* Timing Tower */}
        <div className="col-span-3 bg-[#111] border border-[#2a2a2a] rounded flex flex-col">
          <div className="border-b border-[#2a2a2a] p-2 text-[10px] text-gray-500 tracking-widest uppercase font-bold bg-[#151515]">Timing Tower</div>
          <div className="flex-1 p-4 text-gray-600 text-sm">Table goes here</div>
        </div>

        {/* ARIS Comms */}
        <div className="col-span-3 bg-[#111] border border-[#2a2a2a] rounded flex flex-col">
          <div className="border-b border-[#2a2a2a] p-2 text-[10px] text-gray-500 tracking-widest uppercase font-bold bg-[#151515]">Aris Comms</div>
          <div className="flex-1 p-4 text-gray-600 text-sm">Chat logs go here</div>
        </div>

        {/* BOTTOM ROW */}
        {/* Undercut Window */}
        <div className="col-span-4 bg-[#111] border border-[#2a2a2a] rounded flex flex-col">
          <div className="border-b border-[#2a2a2a] p-2 text-[10px] text-gray-500 tracking-widest uppercase font-bold bg-[#151515]">Undercut Window</div>
          <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">Line Chart goes here</div>
        </div>

        {/* Tyre Degradation & Sector Times */}
        <div className="col-span-4 grid grid-rows-2 gap-2">
          <div className="bg-[#111] border border-[#2a2a2a] rounded flex flex-col">
            <div className="border-b border-[#2a2a2a] p-2 text-[10px] text-gray-500 tracking-widest uppercase font-bold bg-[#151515]">Tyre Degradation</div>
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">Scatter Chart goes here</div>
          </div>
          <div className="bg-[#111] border border-[#2a2a2a] rounded flex flex-col">
            <div className="border-b border-[#2a2a2a] p-2 text-[10px] text-gray-500 tracking-widest uppercase font-bold bg-[#151515]">Sector Times</div>
            <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">Bar Chart goes here</div>
          </div>
        </div>

        {/* Gap Chart */}
        <div className="col-span-4 bg-[#111] border border-[#2a2a2a] rounded flex flex-col">
          <div className="border-b border-[#2a2a2a] p-2 text-[10px] text-gray-500 tracking-widest uppercase font-bold bg-[#151515]">Gap Chart</div>
          <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">Line Chart goes here</div>
        </div>

      </div>
    </div>
  );
}