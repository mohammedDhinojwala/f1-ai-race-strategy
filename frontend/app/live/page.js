
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function formatCountdown(target, now) {
  const difference = new Date(target).getTime() - now;

  if (difference <= 0) return "SESSION STARTED";

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference % 86400000) / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function formatSessionDate(date) {
  return new Date(date).toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LivePage() {
  const [event, setEvent] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH NEXT EVENT
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchEvent() {
      try {
        const response = await fetch(
          `${API_URL}/api/live-event`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch event data.");
        }

        const data = await response.json();

        setEvent(data);

        if (data.available && data.sessions?.length) {
          const next = data.sessions.find(
            (session) => session.status === "upcoming"
          );

          setSelectedSession(next || data.sessions[0]);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Unable to load the event calendar.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchEvent();

    return () => controller.abort();
  }, []);

  // ==========================================
  // LIVE COUNTDOWN CLOCK
  // ==========================================

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ==========================================
  // LOADING / ERROR STATES
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-mono">
        LOADING F1 CALENDAR...
      </div>
    );
  }

  if (error || !event?.available) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-mono">
        {error || event?.message || "No upcoming event available."}
      </div>
    );
  }

  const nextSession = event.sessions.find(
    (session) => session.status === "upcoming"
  );

  return (
    <div className="min-h-screen flex flex-col relative pt-8">

      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto px-6 z-10">

        {/* LIVE SETUP */}
        <div className="text-xs font-mono tracking-widest text-gray-500 mb-8 uppercase">
          <span className="text-gray-400">Live Setup</span>
          <br />
          {event.year} • {event.event} • {selectedSession?.name || "Session"} • Live Timing
        </div>

        {/* HEADER */}
        <div className="text-[#e10600] text-xs font-bold tracking-widest uppercase mb-2">
          ARIS
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          LIVE TIMING
        </h1>

        <p className="text-gray-400 text-sm max-w-2xl leading-relaxed mb-8">
          Select a session from the upcoming Grand Prix weekend.
          Scheduled sessions and countdowns are powered by the ARIS
          race calendar. Race replays are on{" "}
          <Link
            href="/replay"
            className="text-[#e10600] hover:underline"
          >
            Replay
          </Link>.
        </p>

        {/* INFO BANNER */}
        <div className="bg-[#111] border border-[#2a2a2a] rounded-lg p-5 max-w-2xl mb-12">
          <p className="text-gray-300 text-sm mb-1">
            <strong className="text-white font-semibold">
              ARIS live strategy coming soon.
            </strong>
          </p>
          <p className="text-gray-500 text-xs">
            Full pit-wall strategy available now in{" "}
            <Link
              href="/replay"
              className="text-[#e10600] font-bold hover:underline"
            >
              Replay
            </Link>{" "}
            mode.
          </p>
        </div>

        {/* NEXT EVENT */}
        <div className="text-[#e10600] text-xs font-bold tracking-widest uppercase mb-2">
          Next Grand Prix
        </div>

        <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">
          {event.country} · {event.event}
        </h2>

        <p className="text-gray-500 text-sm mb-8">
          {event.circuit} · Round {event.round} · {event.year}
        </p>

        {/* SESSION CARDS */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">

          {event.sessions.map((session, idx) => {
            const isSelected =
              selectedSession?.session === session.session;

            const isNext =
              nextSession?.session === session.session;

            return (
              <button
                key={`${session.session}-${idx}`}
                onClick={() => setSelectedSession(session)}
                className={`text-left min-w-[200px] md:min-w-[220px] flex-shrink-0 bg-[#151515] rounded-lg p-5 flex flex-col transition-all ${
                  isSelected
                    ? "border border-[#e10600] shadow-[0_0_15px_rgba(225,6,0,0.15)]"
                    : "border border-[#2a2a2a] hover:border-gray-500"
                }`}
              >

                <div className="flex items-center justify-between mb-4">
                  <span className="text-white font-bold text-lg">
                    {session.name}
                  </span>

                  {isNext && (
                    <span className="text-[#e10600] text-[9px] font-bold">
                      NEXT
                    </span>
                  )}

                </div>

                <div className="text-gray-500 text-xs mb-2">
                  {formatSessionDate(session.target_date)}
                </div>

                <div className="text-[#e10600] font-mono text-xs font-bold tracking-wide mt-auto pt-4">
                  {session.status === "completed"
                    ? "COMPLETED"
                    : formatCountdown(session.target_date, now)}
                </div>

              </button>
            );
          })}

        </div>

        {/* SELECTED SESSION */}
        {selectedSession && (
          <div className="mt-4 bg-[#111] border border-[#2a2a2a] rounded-lg p-5 max-w-xl">

            <p className="text-[#e10600] text-xs font-bold tracking-widest mb-2">
              SELECTED SESSION
            </p>

            <h3 className="text-white text-xl font-bold">
              {selectedSession.name}
            </h3>

            <p className="text-gray-500 text-xs mt-2">
              {formatSessionDate(selectedSession.target_date)}
            </p>

            <p className="text-gray-400 text-xs mt-3">
              {selectedSession.status === "completed"
                ? "This session has already taken place."
                : `Starts in ${formatCountdown(
                    selectedSession.target_date,
                    now
                  )}`}
            </p>

          </div>
        )}

        {/* LIVE FEED STATUS */}
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
