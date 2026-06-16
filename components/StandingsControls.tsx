"use client";

import { useRouter } from "next/navigation";

interface StandingsControlsProps {
  selectedYear: number;
  activeTab: "drivers" | "constructors";
  years: number[];
}

export default function StandingsControls({
  selectedYear,
  activeTab,
  years,
}: StandingsControlsProps) {
  const router = useRouter();

  const handleYearChange = (year: number) => {
    router.push(`/standings?year=${year}&tab=${activeTab}`);
  };

  const handleTabChange = (tab: "drivers" | "constructors") => {
    router.push(`/standings?year=${selectedYear}&tab=${tab}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {/* Year selector */}
      <div>
        <label className="text-gray-600 text-xs uppercase tracking-widest mb-2 block">
          Season
        </label>
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className="bg-[#0d0d0d] border border-white/10 focus:border-white/30 text-white rounded-lg px-4 py-2.5 outline-none transition-colors text-sm cursor-pointer"
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
            onClick={() => handleTabChange("drivers")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "drivers"
                ? "bg-f1red text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Drivers
          </button>
          <button
            onClick={() => handleTabChange("constructors")}
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
  );
}
