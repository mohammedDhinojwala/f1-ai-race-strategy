// "use client";
// import { useState } from "react";
// import { Responsive, WidthProvider } from "react-grid-layout/legacy";
// import { Play, Pause, SkipBack, SkipForward, Plus, RotateCcw, ChevronDown, Maximize2, X } from "lucide-react";
// import Link from "next/link";

// import "react-grid-layout/css/styles.css";
// import "react-resizable/css/styles.css";

// const ResponsiveGridLayout = WidthProvider(Responsive);

// export default function RaceDashboard() {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentLap, setCurrentLap] = useState(32);
//   const [showAddMenu, setShowAddMenu] = useState(false);

//   // EXACT layout matching your left screenshot
//   const defaultLayout = {
//     lg: [
//       // TOP ROW (Height 6)
//       { i: "track", x: 0, y: 0, w: 6, h: 6, minW: 4, minH: 4 }, 
//       { i: "timing", x: 6, y: 0, w: 3, h: 6, minW: 2, minH: 4 }, 
//       { i: "comms", x: 9, y: 0, w: 3, h: 6, minW: 2, minH: 4 }, 
//       // BOTTOM ROW (Height 4)
//       { i: "undercut", x: 0, y: 6, w: 3, h: 4, minW: 2, minH: 3 }, 
//       { i: "tyre", x: 3, y: 6, w: 3, h: 4, minW: 2, minH: 3 }, 
//       { i: "sector", x: 6, y: 6, w: 3, h: 4, minW: 2, minH: 3 }, 
//       { i: "gap", x: 9, y: 6, w: 3, h: 4, minW: 2, minH: 3 }, 
//     ],
//   };

//   return (
//     <div className="h-screen w-full flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      
//       {/* TOP NAV BAR */}
//       <div className="h-12 border-b border-[#2a2a2a] bg-[#111] flex items-center justify-between px-4 text-xs font-mono tracking-widest shrink-0 z-50 relative">
//         <div className="flex items-center gap-4">
//           <Link href="/" className="text-gray-400 hover:text-white">←</Link>
//           <span className="font-bold text-[#e10600]">ARIS</span>
//           <span className="text-gray-500">Yas Island • 2025</span>
//           <span className="text-[#e10600] bg-[#1a1a1a] px-2 py-0.5 border border-[#e10600]/30 rounded-sm">ARIS FOR PIA</span>
//           <span>Lap {currentLap} / 58</span>
//         </div>
//         <div className="flex gap-2 items-center relative">
//           <button className="bg-[#e10600] text-white px-3 py-1 rounded-sm flex items-center gap-2">
//             <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div> ARIS: ON
//           </button>
//           <button className="border border-[#2a2a2a] text-gray-400 px-3 py-1 rounded-sm hover:text-white flex items-center gap-2">
//             <RotateCcw size={12} /> RESET VIEW
//           </button>
//           <button 
//             onClick={() => setShowAddMenu(!showAddMenu)}
//             className="border border-[#2a2a2a] text-gray-400 px-3 py-1 rounded-sm hover:text-white flex items-center gap-2 bg-[#0a0a0a]"
//           >
//             <Plus size={12} /> ADD <ChevronDown size={12} />
//           </button>
//         </div>
//       </div>

//       {/* RACE CONTROL BANNER */}
//       <div className="bg-[#b38e00] text-black text-xs font-bold px-4 py-1 tracking-widest shrink-0">
//         VIRTUAL SAFETY CAR. Pace delta limited. No overtaking.
//       </div>

//       {/* FULL SCREEN GRID AREA */}
//       <div className="flex-1 w-full relative bg-[#0a0a0a] p-1">
//         <ResponsiveGridLayout
//           className="layout"
//           layouts={defaultLayout}
//           breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
//           cols={{ lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 }}
//           rowHeight={60} // Adjusted to fit screen height
//           margin={[4, 4]} // Tighter margins like the screenshot
//           draggableHandle=".drag-handle"
//           compactType="vertical" // Locks boxes to the top
//           isBounded={true} // Prevents dragging outside the screen
//         >
          
//           {/* TRACK MAP */}
//           <div key="track" className="bg-[#111] border border-[#2a2a2a] rounded flex flex-col overflow-hidden">
//             <div className="drag-handle border-b border-[#2a2a2a] p-1.5 bg-[#151515] flex justify-between items-center cursor-move">
//               <span className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">Track Map</span>
//               <div className="flex gap-2 text-gray-500"><Maximize2 size={12} /><X size={12} /></div>
//             </div>
//             <div className="flex-1 relative flex items-center justify-center bg-[#0a0a0a]">
//               <span className="text-gray-600 font-mono text-sm">Track SVG goes here</span>
//               {/* Playback Controls */}
//               <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between bg-[#111]/90 p-1.5 rounded border border-[#2a2a2a]">
//                 <div className="flex items-center gap-3">
//                   <SkipBack size={14} className="text-gray-400 cursor-pointer" />
//                   <div onClick={() => setIsPlaying(!isPlaying)} className="cursor-pointer">
//                     {isPlaying ? <Pause size={14} className="text-[#e10600]" /> : <Play size={14} className="text-[#e10600]" />}
//                   </div>
//                   <SkipForward size={14} className="text-gray-400 cursor-pointer" />
//                 </div>
//                 <div className="flex gap-2 text-[10px] text-gray-400 font-mono">
//                   <span>1x</span><span>2x</span><span>4x</span>
//                   <span className="text-[#e10600] bg-[#1a1a1a] px-1 rounded">16x</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* TIMING TOWER */}
//           <div key="timing" className="bg-[#111] border border-[#2a2a2a] rounded flex flex-col overflow-hidden">
//             <div className="drag-handle border-b border-[#2a2a2a] p-1.5 bg-[#151515] flex justify-between items-center cursor-move">
//               <span className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">Timing Tower</span>
//               <div className="flex gap-2 text-gray-500"><Maximize2 size={12} /><X size={12} /></div>
//             </div>
//             <div className="flex-1 overflow-y-auto">
//               <table className="w-full text-left text-[10px] font-mono">
//                 <thead className="text-[9px] text-gray-500 border-b border-[#2a2a2a] sticky top-0 bg-[#111]">
//                   <tr>
//                     <th className="p-1.5 font-normal">P</th>
//                     <th className="p-1.5 font-normal">DRV</th>
//                     <th className="p-1.5 font-normal">GAP</th>
//                     <th className="p-1.5 font-normal">LAST</th>
//                     <th className="p-1.5 font-normal">BEST</th>
//                     <th className="p-1.5 font-normal">TY</th>
//                   </tr>
//                 </thead>
//                 <tbody className="text-gray-300">
//                   {[
//                     { pos: 1, code: "VER", gap: "LEADER", last: "1:28.473", best: "1:27.123", tyre: "H" },
//                     { pos: 2, code: "PIA", gap: "+12.6s", last: "1:28.974", best: "1:27.456", tyre: "M" },
//                     { pos: 3, code: "NOR", gap: "+16.6s", last: "1:28.987", best: "1:27.890", tyre: "H" },
//                     { pos: 4, code: "LEC", gap: "+23.3s", last: "1:28.273", best: "1:27.654", tyre: "H" },
//                     { pos: 5, code: "RUS", gap: "+28.8s", last: "1:29.166", best: "1:28.111", tyre: "H" },
//                     { pos: 6, code: "HAM", gap: "+32.1s", last: "1:29.012", best: "1:28.321", tyre: "M" },
//                   ].map((d, i) => (
//                     <tr key={i} className="border-b border-[#2a2a2a]/50 hover:bg-[#1a1a1a]">
//                       <td className="p-1.5 text-gray-500">{d.pos}</td>
//                       <td className="p-1.5 font-bold text-white">{d.code}</td>
//                       <td className="p-1.5 text-gray-400">{d.gap}</td>
//                       <td className="p-1.5">{d.last}</td>
//                       <td className="p-1.5 text-gray-500">{d.best}</td>
//                       <td className="p-1.5">
//                         <span className={`px-1 rounded text-[9px] font-black text-black ${d.tyre === 'H' ? 'bg-white' : d.tyre === 'M' ? 'bg-yellow-400' : 'bg-red-500'}`}>
//                           {d.tyre}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* ARIS COMMS */}
//           <div key="comms" className="bg-[#111] border border-[#2a2a2a] rounded flex flex-col overflow-hidden">
//             <div className="drag-handle border-b border-[#2a2a2a] p-1.5 bg-[#151515] flex justify-between items-center cursor-move">
//               <span className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">Aris Comms</span>
//               <div className="flex gap-2 text-gray-500"><Maximize2 size={12} /><X size={12} /></div>
//             </div>
//             <div className="flex-1 flex flex-col p-2 text-[10px] font-mono text-gray-300 overflow-y-auto">
//               <div className="mb-2">
//                 <span className="text-[#e10600] text-[9px] font-bold block mb-0.5">ARIS // L43</span>
//                 <p className="leading-tight">Lost 0.2s in S1 vs VER. Consider pushing in S2.</p>
//               </div>
//               <div className="mb-2">
//                 <span className="text-[#e10600] text-[9px] font-bold block mb-0.5">ARIS // L45</span>
//                 <p className="leading-tight">Gap to leader +4.1s. Ahead VER +4.1s. Behind NOR.</p>
//               </div>
//             </div>
//             <div className="p-1.5 border-t border-[#2a2a2a]">
//               <button className="w-full bg-[#e10600] text-white text-[10px] font-bold tracking-widest py-1.5 rounded">ANALYSING...</button>
//             </div>
//           </div>

//           {/* UNDERCUT WINDOW */}
//           <div key="undercut" className="bg-[#111] border border-[#2a2a2a] rounded flex flex-col overflow-hidden">
//             <div className="drag-handle border-b border-[#2a2a2a] p-1.5 bg-[#151515] flex justify-between items-center cursor-move">
//               <span className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">Undercut Window</span>
//               <div className="flex gap-2 text-gray-500"><Maximize2 size={12} /><X size={12} /></div>
//             </div>
//             <div className="flex-1 p-2 flex items-center justify-center text-gray-600 text-xs font-mono">Line Chart</div>
//           </div>

//           {/* TYRE DEGRADATION */}
//           <div key="tyre" className="bg-[#111] border border-[#2a2a2a] rounded flex flex-col overflow-hidden">
//             <div className="drag-handle border-b border-[#2a2a2a] p-1.5 bg-[#151515] flex justify-between items-center cursor-move">
//               <span className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">Tyre Deg</span>
//               <div className="flex gap-2 text-gray-500"><Maximize2 size={12} /><X size={12} /></div>
//             </div>
//             <div className="flex-1 p-2 flex items-center justify-center text-gray-600 text-xs font-mono">Scatter Plot</div>
//           </div>

//           {/* SECTOR TIMES */}
//           <div key="sector" className="bg-[#111] border border-[#2a2a2a] rounded flex flex-col overflow-hidden">
//             <div className="drag-handle border-b border-[#2a2a2a] p-1.5 bg-[#151515] flex justify-between items-center cursor-move">
//               <span className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">Sector Times</span>
//               <div className="flex gap-2 text-gray-500"><Maximize2 size={12} /><X size={12} /></div>
//             </div>
//             <div className="flex-1 p-2 flex items-center justify-center text-gray-600 text-xs font-mono">Bar Chart</div>
//           </div>

//           {/* GAP CHART */}
//           <div key="gap" className="bg-[#111] border border-[#2a2a2a] rounded flex flex-col overflow-hidden">
//             <div className="drag-handle border-b border-[#2a2a2a] p-1.5 bg-[#151515] flex justify-between items-center cursor-move">
//               <span className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">Gap Chart</span>
//               <div className="flex gap-2 text-gray-500"><Maximize2 size={12} /><X size={12} /></div>
//             </div>
//             <div className="flex-1 p-2 flex items-center justify-center text-gray-600 text-xs font-mono">Line Chart</div>
//           </div>

//         </ResponsiveGridLayout>
//       </div>
//     </div>
//   );
// }


// import DashboardGrid from "./components/DashboardGrid";

import DashboardGrid from "./dashboard_grid";

export default function RacePage() {
  return <DashboardGrid />;
}