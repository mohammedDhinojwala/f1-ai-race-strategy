
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const EMPTY_TIME = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00",
};

export default function Home() {
  const [arisMode, setArisMode] = useState("ON");
  const [nextRace, setNextRace] = useState(null);
  const [races, setRaces] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("NOR");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(EMPTY_TIME);

  // ==========================================
  // FETCH HOMEPAGE DATA
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        setIsLoading(true);
        setError("");

        const [nextRaceRes, racesRes, driversRes] =
          await Promise.all([
            fetch(`${API_URL}/api/next-race`, {
              signal: controller.signal,
              cache: "no-store",
            }),
            fetch(`${API_URL}/api/races`, {
              signal: controller.signal,
              cache: "no-store",
            }),
            fetch(`${API_URL}/api/drivers`, {
              signal: controller.signal,
              cache: "no-store",
            }),
          ]);

        if (!nextRaceRes.ok || !racesRes.ok || !driversRes.ok) {
          throw new Error("Backend returned an error.");
        }

        const [nextRaceData, racesData, driversData] =
          await Promise.all([
            nextRaceRes.json(),
            racesRes.json(),
            driversRes.json(),
          ]);

        setNextRace(nextRaceData);
        setRaces(racesData.races || []);
        setDrivers(driversData.drivers || []);

        if (driversData.drivers?.length) {
          const hasDefaultDriver = driversData.drivers.some(
            (driver) => driver.code === "NOR"
          );

          setSelectedDriver(
            hasDefaultDriver
              ? "NOR"
              : driversData.drivers[0].code
          );
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Homepage data error:", err);
          setError("Unable to connect to the ARIS backend.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => controller.abort();
  }, []);

  // ==========================================
  // COUNTDOWN TIMER
  // ==========================================

  useEffect(() => {
    if (!nextRace?.available || !nextRace?.target_date) {
      setTimeLeft(EMPTY_TIME);
      return;
    }

    const target = new Date(nextRace.target_date).getTime();

    if (Number.isNaN(target)) {
      setTimeLeft(EMPTY_TIME);
      return;
    }

    function updateCountdown() {
      const difference = target - Date.now();

      if (difference <= 0) {
        setTimeLeft(EMPTY_TIME);
        return;
      }

      const pad = (value) =>
        String(value).padStart(2, "0");

      const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
      );

      const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
      );

      const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
      );

      const seconds = Math.floor(
        (difference / 1000) % 60
      );

      setTimeLeft({
        days: pad(days),
        hours: pad(hours),
        minutes: pad(minutes),
        seconds: pad(seconds),
      });
    }

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, [nextRace]);

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formattedDate = nextRace?.target_date
    ? new Date(nextRace.target_date).toLocaleString(
        "en-US",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        }
      )
    : "";

  // ==========================================
  // HOMEPAGE
  // ==========================================

  return (
    <div className="min-h-screen flex flex-col items-center pt-16 relative">

      {/* BACKGROUND GRID */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* HEADER */}
      <div className="text-center mb-16 z-10">

        <h1
          className="text-7xl md:text-9xl font-black text-[#e10600] tracking-tighter"
          style={{
            textShadow: "0 0 40px rgba(225,6,0,0.3)",
          }}
        >
          ARIS
        </h1>

        <div className="inline-block bg-[#e10600] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm mb-4">
          BETA
        </div>

        <p className="text-gray-400 text-xs tracking-[0.2em] font-mono uppercase">
          Always On Race Intelligence System
        </p>

        <p className="text-gray-600 text-xs max-w-md mx-auto mt-4 leading-relaxed">
          Classical decision support, not a black box.
          ARIS shows its evidence and races a ghost driver
          against the field.
        </p>
      </div>

      {/* LOADING */}
      {isLoading ? (
        <div className="text-white font-mono animate-pulse z-10">
          LOADING DATA FROM ARIS...
        </div>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10 px-4">

          {/* ================================== */}
          {/* LEFT PANEL: REPLAY A RACE */}
          {/* ================================== */}

          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 shadow-2xl flex flex-col">

            <h2 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-4">
              Replay a Race
            </h2>

            {/* ARIS MODE */}
            <div className="flex bg-[#0a0a0a] rounded-md p-1 w-max mb-4 border border-[#2a2a2a]">

              <button
                onClick={() => setArisMode("OFF")}
                className={`px-3 py-1 text-xs font-bold rounded-sm transition-colors ${
                  arisMode === "OFF"
                    ? "bg-[#2a2a2a] text-white"
                    : "text-gray-500"
                }`}
              >
                ARIS OFF
              </button>

              <button
                onClick={() => setArisMode("ON")}
                className={`px-3 py-1 text-xs font-bold rounded-sm transition-colors ${
                  arisMode === "ON"
                    ? "bg-[#e10600] text-white"
                    : "text-gray-500"
                }`}
              >
                ARIS ON
              </button>

            </div>

            {/* DRIVER DROPDOWN */}
            <div className="mb-4">

              <label className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1 block">
                Driver
              </label>

              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[#2a2a2a] text-sm text-gray-200 rounded p-2 outline-none focus:border-[#e10600]"
              >
                {drivers.map((driver) => (
                  <option
                    key={driver.code}
                    value={driver.code}
                  >
                    {driver.code} - {driver.name}
                  </option>
                ))}
              </select>

            </div>

            {/* LAST 3 COMPLETED RACES */}
            <div className="flex flex-col gap-2 mb-6">

              {races.length > 0 ? (
                races.map((race) => (

                  <div
                    key={race.id}
                    className="flex items-center justify-between bg-[#0f0f0f] border border-[#2a2a2a] p-3 rounded hover:border-gray-600 cursor-pointer transition-colors group"
                  >

                    <div className="flex items-center gap-3 min-w-0">

                      <span className="bg-white text-black text-[9px] font-black uppercase px-1.5 py-0.5 rounded">
                        {race.code}
                      </span>

                      <div className="min-w-0">

                        <p className="text-gray-300 text-xs font-mono truncate">
                          {race.round} · {race.name}
                        </p>

                        <p className="text-gray-600 text-[10px] mt-1">
                          {race.date}
                        </p>

                      </div>

                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="bg-[#e10600] text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider">
                        RACE
                      </span>
                      <span>🏆</span>
                    </div>

                  </div>

                ))
              ) : (
                <p className="text-gray-500 text-xs">
                  No completed races available.
                </p>
              )}

            </div>

            <Link
              href="/replay"
              className="text-xs text-gray-400 hover:text-white font-bold tracking-widest mt-auto text-left flex items-center gap-2"
            >
              SEE ALL RACES <span>→</span>
            </Link>

          </div>


          {/* ================================== */}
          {/* RIGHT PANEL: NEXT FP1 */}
          {/* ================================== */}

          <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 shadow-2xl flex flex-col">

            <h2 className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-4">
              NEXT · {nextRace?.session || "FP1"}
            </h2>

            {nextRace?.available ? (
              <>

                <h3 className="text-2xl font-black text-white mb-1">
                  {nextRace.name}
                </h3>

                <p className="text-gray-500 text-xs mb-2">
                  {nextRace.circuit}
                </p>

                <p className="text-gray-600 text-[10px] mb-5">
                  {nextRace.country} · {formattedDate} IST
                </p>

                <div className="bg-[#0a0a0a] border border-[#2a2a2a] p-3 rounded mb-6">

                  <p className="text-gray-400 text-[11px] leading-relaxed">
                    <strong className="text-gray-200">
                      ARIS live strategy coming soon.
                    </strong>
                    <br />
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

                {/* COUNTDOWN */}
                <div className="grid grid-cols-4 gap-2 mb-6">

                  {[
                    ["D", timeLeft.days],
                    ["H", timeLeft.hours],
                    ["M", timeLeft.minutes],
                    ["S", timeLeft.seconds],
                  ].map(([label, value]) => (

                    <div
                      key={label}
                      className="bg-[#0a0a0a] border border-[#2a2a2a] rounded flex flex-col items-center justify-center py-3"
                    >
                      <span className="text-xl font-mono text-gray-200">
                        {value}
                      </span>

                      <span className="text-[9px] text-gray-600 font-bold mt-1">
                        {label}
                      </span>

                    </div>

                  ))}

                </div>

              </>
            ) : (
              <div className="bg-[#0a0a0a] border border-[#2a2a2a] p-4 rounded mb-6">
                <p className="text-gray-400 text-xs">
                  {nextRace?.message || "No upcoming FP1 session found."}
                </p>
              </div>
            )}

            <Link
              href="/live"
              className="w-full bg-[#0f0f0f] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-bold tracking-widest py-3 rounded transition-colors mt-auto text-center block"
            >
              LIVE HUB →
            </Link>

          </div>

        </div>
      )}

      {/* BACKEND ERROR */}
      {error && (
        <p className="text-red-500 text-xs font-mono mt-5 z-10">
          {error}
        </p>
      )}

      {/* FOOTER */}
      <div className="mt-8 mb-8 text-gray-600 text-xs font-mono z-10">
        v0.3 • T4-final • 0.345 match-rate (30/87 dry)
      </div>

    </div>
  );
}
