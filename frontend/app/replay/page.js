
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import DriverSelection from "../component/DriverSelection";
import StrategySelection from "../component/StrategySelection";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function ReplayPage() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [arisOn, setArisOn] = useState(true);

  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);

  const [races, setRaces] = useState([]);
  const [selectedRace, setSelectedRace] = useState(null);

  const [selectedDriver, setSelectedDriver] = useState(null);

  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [loadingRaces, setLoadingRaces] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH AVAILABLE SEASONS
  // ==========================================

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSeasons() {
      try {
        const response = await fetch(
          `${API_URL}/api/replay-seasons`,
          { signal: controller.signal, cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch seasons.");
        }

        const data = await response.json();
        const availableSeasons = data.seasons || [];

        setSeasons(availableSeasons);

        if (availableSeasons.length) {
          setSelectedSeason(
            availableSeasons.includes(2026)
              ? 2026
              : availableSeasons[availableSeasons.length - 1]
          );
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSeasons(false);
        }
      }
    }

    fetchSeasons();

    return () => controller.abort();
  }, []);

  // ==========================================
  // FETCH RACES WHEN SEASON CHANGES
  // ==========================================

  useEffect(() => {
    if (!selectedSeason) return;

    const controller = new AbortController();

    async function fetchRaces() {
      try {
        setLoadingRaces(true);
        setError("");
        setSelectedRace(null);
        setRaces([]);

        const response = await fetch(
          `${API_URL}/api/replay-races?year=${selectedSeason}`,
          { signal: controller.signal, cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Unable to fetch races.");
        }

        const data = await response.json();
        const seasonRaces = data.races || [];

        setRaces(seasonRaces);

        // Select the latest completed race by default
        if (seasonRaces.length) {
          setSelectedRace(
            seasonRaces[seasonRaces.length - 1]
          );
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingRaces(false);
        }
      }
    }

    fetchRaces();

    return () => controller.abort();
  }, [selectedSeason]);

  // ==========================================
  // STEP 1: SEASON AND RACE
  // ==========================================

  if (currentStep === 1) {
    return (
      <div className="min-h-screen flex flex-col relative pt-8 pb-16">

        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-6 z-10">

          {/* HEADER INFO */}
          <div className="mb-8">
            <div className="text-xs font-mono tracking-widest text-gray-500 mb-2 uppercase">
              Replay Setup
            </div>

            <div className="text-gray-300 text-sm font-mono">
              {selectedRace
                ? `${selectedRace.year} • ${selectedRace.code} ${selectedRace.name} • Race • ARIS`
                : "Select a season and race"}
            </div>
          </div>

          {/* STEPPER */}
          <div className="flex flex-wrap gap-2 text-[10px] md:text-xs font-mono tracking-widest uppercase mb-12">

            <span className="px-3 py-1.5 rounded-sm border bg-[#1a1a1a] text-[#e10600] border-[#e10600]/30">
              01 Year & Race
            </span>

            <span className="px-3 py-1.5 rounded-sm border border-transparent text-gray-600">
              02 Driver
            </span>

            <span className="px-3 py-1.5 rounded-sm border border-transparent text-gray-600">
              03 Strategies
            </span>

            <span className="text-gray-600 px-3 py-1.5 rounded-sm border border-transparent">
              04 Load
            </span>

          </div>

          {/* TITLE */}
          <div className="mb-10 max-w-3xl">

            <div className="text-[#e10600] text-xs font-bold tracking-widest uppercase mb-2">
              ARIS
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4 uppercase">
              Replay with ARIS
            </h1>

            <p className="text-gray-400 text-sm leading-relaxed">
              Toggle ARIS first, then pick a season and race.
              Cancelled, upcoming, and future-dated weekends are hidden.
            </p>

          </div>

          {/* ARIS TOGGLE */}
          <div className="flex bg-[#111] border border-[#2a2a2a] rounded-md p-1 w-max mb-16">

            <button
              onClick={() => setArisOn(false)}
              className={`px-6 py-2 text-xs font-bold tracking-widest transition-colors rounded-sm ${
                !arisOn
                  ? "bg-[#e10600] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              OFF
            </button>

            <button
              onClick={() => setArisOn(true)}
              className={`px-6 py-2 text-xs font-bold tracking-widest transition-colors rounded-sm ${
                arisOn
                  ? "bg-[#e10600] text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              ON
            </button>

          </div>

          {/* SEASON SELECTOR */}
          <div className="flex justify-between items-end mb-6">

            <h2 className="text-[#e10600] text-xs font-bold tracking-widest uppercase">
              Season & Race
            </h2>

            <div className="flex bg-[#111] border border-[#2a2a2a] rounded-md p-1">

              {loadingSeasons ? (
                <span className="px-4 py-2 text-xs text-gray-500">
                  Loading...
                </span>
              ) : (
                seasons.map((year) => (

                  <button
                    key={year}
                    onClick={() => setSelectedSeason(year)}
                    className={`px-4 py-1.5 text-xs font-mono tracking-wider transition-colors rounded-sm ${
                      selectedSeason === year
                        ? "bg-[#e10600] text-white"
                        : "text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    {year}
                  </button>

                ))
              )}

            </div>

          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-500 text-xs mb-5">
              {error}
            </p>
          )}

          {/* RACE CARDS */}
          {loadingRaces ? (

            <div className="text-gray-500 font-mono text-xs py-10">
              LOADING RACE CALENDAR...
            </div>

          ) : races.length > 0 ? (

            <div className="flex gap-4 overflow-x-auto pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

              {races.map((race) => (

                <div
                  key={race.id}
                  onClick={() => setSelectedRace(race)}
                  className={`min-w-[200px] md:min-w-[240px] flex-shrink-0 bg-[#151515] rounded-lg p-5 flex flex-col cursor-pointer transition-all ${
                    selectedRace?.id === race.id
                      ? "border border-[#e10600] shadow-[0_0_15px_rgba(225,6,0,0.15)]"
                      : "border border-[#2a2a2a] hover:border-gray-500"
                  }`}
                >

                  <div className="flex justify-between items-start mb-6">

                    <span className="text-2xl font-black text-gray-200">
                      {race.code}
                    </span>

                    <span className="text-[10px] text-gray-500 font-mono">
                      {race.round}
                    </span>

                  </div>

                  <div className="mb-4">

                    <div className="text-white font-bold text-sm truncate">
                      {race.name}
                    </div>

                    <div className="text-gray-500 text-xs mt-1">
                      {race.date}
                    </div>

                  </div>

                  <div className="mt-auto">

                    <span className="bg-[#0a0a0a] border border-[#2a2a2a] text-gray-400 text-[9px] font-bold px-2 py-1 rounded-sm tracking-widest">
                      RACE
                    </span>

                  </div>

                </div>

              ))}

            </div>

          ) : (

            <div className="text-gray-500 text-sm py-10">
              No completed races found for {selectedSeason || "this season"}.
            </div>

          )}

          {/* CONTINUE BUTTON */}
          <div className="mt-8 mb-16">

            <button
              disabled={!selectedRace || loadingRaces}
              onClick={() => setCurrentStep(2)}
              className="bg-transparent border border-[#e10600] text-[#e10600] hover:bg-[#e10600] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed text-xs font-bold tracking-widest py-4 px-8 rounded-md transition-colors flex items-center gap-2 uppercase"
            >
              Continue with {selectedRace?.name || "selected race"}
              <span>→</span>
            </button>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // STEP 2: DRIVER SELECTION
  // ==========================================

  if (currentStep === 2) {
    return (
      <DriverSelection
        onBack={() => setCurrentStep(1)}
        onNext={(driverCode) => {
          setSelectedDriver(driverCode);
          setCurrentStep(3);
        }}
      />
    );
  }

  // ==========================================
  // STEP 3: STRATEGY SELECTION
  // ==========================================

  if (currentStep === 3) {
    return (
      <StrategySelection
        driverName={selectedDriver}
        onBack={() => setCurrentStep(2)}
        onStart={(selectedStrategy) => {
          router.push(
            `/race?year=${selectedRace.year}&race=${encodeURIComponent(selectedRace.name)}&round=${selectedRace.round_number}&driver=${selectedDriver}&strategy=${encodeURIComponent(selectedStrategy)}&aris=${arisOn ? "on" : "off"}`
          );
        }}
      />
    );
  }

  return null;
}
