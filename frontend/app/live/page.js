"use client";

export default function LivePage() {
  // Mock data for the session cards
  const sessions = [
    { name: "FP1", date: "Fri, Oct 30, 05:30 AM", countdown: "0d 4h 19m 10s", active: true },
    { name: "FP2", date: "Fri, Oct 30, 09:00 AM", countdown: "0d 7h 49m 10s", active: false },
    { name: "FP3", date: "Sat, Oct 31, 05:30 AM", countdown: "1d 4h 19m 10s", active: false },
    { name: "Quali", date: "Sat, Oct 31, 09:00 AM", countdown: "1d 7h 49m 10s", active: false },
    { name: "Race", date: "Sun, Nov 1, 02:00 PM", countdown: "2d 13h 49m 10s", active: false },
  ];

  return (
    <div className="min-h-screen flex flex-col relative pt-8">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="w-full max-w-6xl mx-auto px-6 z-10">
        
        {/* Breadcrumb / Top Info */}
        <div className="text-xs font-mono tracking-widest text-gray-500 mb-8 uppercase">
          <span className="text-gray-400">Live Setup</span><br/>
          2026 • MX Autodromo Hermanos Rodriguez • FP1 • Live timing
        </div>

        {/* ARIS Badge */}
        <div className="text-[#e10600] text-xs font-bold tracking-widest uppercase mb-2">
          Aris
        </div>

        {/* Main Title & Description */}
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          LIVE TIMING
        </h1>
        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed mb-8">
          Pick this weekend's session. Live sessions open the pit wall at the current lap. 
          Completed practice and qualifying are not replayable here. Race replays are on <span className="text-[#e10600] cursor-pointer">Replay</span>.
        </p>

        {/* Info Banner */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-5 max-w-2xl mb-12">
          <p className="text-gray-300 text-sm mb-1">
            <strong className="text-white font-semibold">ARIS live strategy coming soon.</strong>
          </p>
          <p className="text-gray-500 text-xs">
            Full pit-wall strategy available now in <span className="text-[#e10600] font-bold cursor-pointer hover:underline">Replay</span> mode.
          </p>
        </div>

        {/* This Weekend Section */}
        <div className="text-[#e10600] text-xs font-bold tracking-widest uppercase mb-2">
          This Weekend
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight mb-2">
          MX MEXICO CITY
        </h2>
        <p className="text-gray-500 text-sm mb-8">
          Autodromo Hermanos Rodriguez • Sunday, November 1
        </p>

        {/* Session Cards Row */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {sessions.map((session, idx) => (
            <div 
              key={idx} 
              className={`min-w-[200px] md:min-w-[220px] flex-shrink-0 bg-[#151515] rounded-lg p-5 flex flex-col transition-all cursor-pointer ${
                session.active 
                  ? "border border-[#e10600] shadow-[0_0_15px_rgba(225,6,0,0.15)]" 
                  : "border border-[#2a2a2a] hover:border-gray-500"
              }`}
            >
              <div className="text-white font-bold text-lg mb-4">{session.name}</div>
              <div className="text-gray-500 text-xs mb-2">{session.date}</div>
              <div className="text-[#e10600] font-mono text-sm font-bold tracking-widest mt-auto pt-4">
                {session.countdown}
              </div>
            </div>
          ))}
        </div>

        {/* Disabled Button */}
        <div className="mt-8">
          <button 
            disabled 
            className="border border-[#2a2a2a] text-gray-600 text-xs font-bold tracking-widest py-3 px-6 rounded cursor-not-allowed"
          >
            WAITING FOR LIVE FEED
          </button>
        </div>

      </div>
    </div>
  );
}