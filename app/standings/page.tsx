    "use client";

import { useState, useEffect } from "react";
import { getDriverStandings, getConstructorStandings } from "@/lib/openf1";

type DriverStanding = {
  position: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
    permanentNumber?: string;
  };
  Constructors: { name: string; constructorId: string }[];
};

type ConstructorStanding = {
  position: string;
  points: string;
  wins: string;
  Constructor: {
    constructorId: string;
    name: string;
    nationality: string;
  };
};

const CURRENT_YEAR = 2026;
const MIN_YEAR = 1950;
const years = Array.from(
  { length: CURRENT_YEAR - MIN_YEAR + 1 },
  (_, i) => CURRENT_YEAR - i
);

// Nationality to flag emoji
const FLAGS: Record<string, string> = {
  British: "🇬🇧", Dutch: "🇳🇱", Monegasque: "🇲🇨", Spanish: "🇪🇸",
  German: "🇩🇪", French: "🇫🇷", Finnish: "🇫🇮", Australian: "🇦🇺",
  Canadian: "🇨🇦", Mexican: "🇲🇽", Japanese: "🇯🇵", Thai: "🇹🇭",
  Danish: "🇩🇰", Chinese: "🇨🇳", Italian: "🇮🇹", American: "🇺🇸",
  Brazilian: "🇧🇷", Argentine: "🇦🇷", Belgian: "🇧🇪", Polish: "🇵🇱",
  "New Zealander": "🇳🇿", Austrian: "🇦🇹", Portuguese: "🇵🇹",
  Swiss: "🇨🇭", Russian: "🇷🇺", Swedish: "🇸🇪", Hungarian: "🇭🇺",
  South: "🇿🇦",
};

export default function StandingsPage() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [activeTab, setActiveTab] = useState<"drivers" | "constructors">("drivers");
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setDriverStandings([]);
      setConstructorStandings([]);

      const [drivers, constructors] = await Promise.all([
        getDriverStandings(selectedYear),
        getConstructorStandings(selectedYear),
      ]);

      setDriverStandings(drivers);
      setConstructorStandings(constructors);
      setLoading(false);
    };
    load();
  }, [selectedYear]);

  const positionColor = (pos: string) => {
    if (pos === "1") return "#F59E0B";
    if (pos === "2") return "#9CA3AF";
    if (pos === "3") return "#C89B3C";
    return "#4B5563";
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">
          Championship{" "}
          <span style={{
            background: "linear-gradient(135deg, #E8002D, #C89B3C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Standings
          </span>
        </h1>
        <p className="text-gray-500">
          Driver and constructor standings from every F1 season since 1950.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-8">

        {/* Year selector */}
        <div>
          <label className="text-gray-600 text-xs uppercase tracking-widest mb-2 block">
            Season
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-[#0d0d0d] border border-white/10 focus:border-white/30 text-white rounded-lg px-4 py-2.5 outline-none transition-colors text-sm"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y} Season
              </option>
            ))}
          </select>
        </div>

        {/* Tab switcher */}
        <div className="flex items-end pb-0.5">
          <div className="flex bg-[#0d0d0d] border border-white/10 rounded-lg p-1 gap-1 mt-6">
            <button
              onClick={() => setActiveTab("drivers")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "drivers"
                  ? "bg-f1red text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Drivers
            </button>
            <button
              onClick={() => setActiveTab("constructors")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "constructors"
                  ? "bg-f1red text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Constructors
            </button>
          </div>
        </div>

      </div>

      {/* Table */}
      <div className="bg-[#0d0d0d] border border-white/5 rounded-2xl overflow-hidden">

        {/* Driver Standings */}
        {activeTab === "drivers" && (
          <>
            <div className="grid grid-cols-12 px-5 py-3 text-gray-600 text-xs uppercase tracking-wider border-b border-white/5">
              <span className="col-span-1">Pos</span>
              <span className="col-span-1">No.</span>
              <span className="col-span-4">Driver</span>
              <span className="col-span-3">Team</span>
              <span className="col-span-1 text-center">Wins</span>
              <span className="col-span-2 text-right">Points</span>
            </div>

            {loading ? (
              <div className="divide-y divide-white/5">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="grid grid-cols-12 px-5 py-4 animate-pulse gap-2">
                    <div className="col-span-1 h-4 bg-white/5 rounded" />
                    <div className="col-span-1 h-4 bg-white/5 rounded" />
                    <div className="col-span-4 h-4 bg-white/5 rounded" />
                    <div className="col-span-3 h-4 bg-white/5 rounded" />
                    <div className="col-span-1 h-4 bg-white/5 rounded" />
                    <div className="col-span-2 h-4 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            ) : driverStandings.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600">No standings available for {selectedYear}.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {driverStandings.map((standing, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-12 px-5 py-4 text-sm transition-colors hover:bg-white/2 items-center ${
                      standing.position === "1" ? "bg-yellow-500/3" : ""
                    }`}
                  >
                    {/* Position */}
                    <span
                      className="col-span-1 font-black text-base"
                      style={{ color: positionColor(standing.position) }}
                    >
                      {standing.position}
                    </span>

                    {/* Number */}
                    <span className="col-span-1 text-gray-600 font-mono text-xs">
                      {standing.Driver.permanentNumber ?? "—"}
                    </span>

                    {/* Driver */}
                    <span className="col-span-4 text-white font-semibold flex items-center gap-2">
                      <span className="text-base">
                        {FLAGS[standing.Driver.nationality] ?? "🏁"}
                      </span>
                      {standing.Driver.givenName[0]}. {standing.Driver.familyName}
                    </span>

                    {/* Team */}
                    <span className="col-span-3 text-gray-500 text-xs">
                      {standing.Constructors?.[0]?.name ?? "—"}
                    </span>

                    {/* Wins */}
                    <span className="col-span-1 text-center text-gray-400 font-medium">
                      {standing.wins}
                    </span>

                    {/* Points */}
                    <span className="col-span-2 text-right font-black"
                      style={{ color: standing.position === "1" ? "#F59E0B" : "white" }}
                    >
                      {standing.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Constructor Standings */}
        {activeTab === "constructors" && (
          <>
            <div className="grid grid-cols-12 px-5 py-3 text-gray-600 text-xs uppercase tracking-wider border-b border-white/5">
              <span className="col-span-1">Pos</span>
              <span className="col-span-5">Constructor</span>
              <span className="col-span-3">Nationality</span>
              <span className="col-span-1 text-center">Wins</span>
              <span className="col-span-2 text-right">Points</span>
            </div>

            {loading ? (
              <div className="divide-y divide-white/5">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="grid grid-cols-12 px-5 py-4 animate-pulse gap-2">
                    <div className="col-span-1 h-4 bg-white/5 rounded" />
                    <div className="col-span-5 h-4 bg-white/5 rounded" />
                    <div className="col-span-3 h-4 bg-white/5 rounded" />
                    <div className="col-span-1 h-4 bg-white/5 rounded" />
                    <div className="col-span-2 h-4 bg-white/5 rounded" />
                  </div>
                ))}
              </div>
            ) : constructorStandings.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600">
                  No constructor standings for {selectedYear}.
                  {selectedYear < 1958 && (
                    <span className="block text-xs mt-1 text-gray-700">
                      Constructor standings began in 1958.
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {constructorStandings.map((standing, index) => (
                  <div
                    key={index}
                    className={`grid grid-cols-12 px-5 py-4 text-sm transition-colors hover:bg-white/2 items-center ${
                      standing.position === "1" ? "bg-yellow-500/3" : ""
                    }`}
                  >
                    {/* Position */}
                    <span
                      className="col-span-1 font-black text-base"
                      style={{ color: positionColor(standing.position) }}
                    >
                      {standing.position}
                    </span>

                    {/* Constructor */}
                    <span className="col-span-5 text-white font-semibold flex items-center gap-2">
                      <span className="text-base">
                        {FLAGS[standing.Constructor.nationality] ?? "🏁"}
                      </span>
                      {standing.Constructor.name}
                    </span>

                    {/* Nationality */}
                    <span className="col-span-3 text-gray-500 text-xs">
                      {standing.Constructor.nationality}
                    </span>

                    {/* Wins */}
                    <span className="col-span-1 text-center text-gray-400 font-medium">
                      {standing.wins}
                    </span>

                    {/* Points */}
                    <span
                      className="col-span-2 text-right font-black"
                      style={{ color: standing.position === "1" ? "#F59E0B" : "white" }}
                    >
                      {standing.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>

      {/* Note about constructor standings */}
      {activeTab === "constructors" && selectedYear < 1958 && (
        <p className="text-gray-700 text-xs text-center mt-4">
          The Constructors Championship was introduced in 1958.
        </p>
      )}

    </main>
  );
}