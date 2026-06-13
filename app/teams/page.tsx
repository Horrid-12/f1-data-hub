"use client";

import { useState, useEffect } from "react";
import { TEAMS, TeamInfo } from "@/data/teams";
import { getDriversClient } from "@/lib/openf1";
import { Driver } from "@/types/f1";
import TeamCard from "@/components/TeamCard";
import TeamModal from "@/components/TeamModal";

export default function TeamsPage() {
  const [selected, setSelected] = useState<TeamInfo | null>(null);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "championships" | "founded">("name");

  useEffect(() => {
    getDriversClient(2026).then(setDrivers);
  }, []);

  const teams = Object.values(TEAMS);

  const filtered = teams.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.base.toLowerCase().includes(q) ||
      t.principal.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "championships") {
      return b.championships - a.championships;
    } else if (sortBy === "founded") {
      return a.firstEntry - b.firstEntry;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">
          2026{" "}
          <span style={{
            background: "linear-gradient(135deg, #E8002D, #C89B3C)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Teams
          </span>
        </h1>
        <p className="text-gray-500">
          All 11 constructors competing in the 2026 Formula 1 season. Click any team to see more.
        </p>
      </div>

      {/* Search & Sort */}
      <div className="mb-8 space-y-4">
        <input
          type="text"
          placeholder="Search by name, base, or principal..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-[#0d0d0d] border border-white/10 focus:border-white/30 text-white placeholder-gray-600 rounded-lg px-4 py-2.5 outline-none transition-colors text-sm"
        />
        {search && (
          <p className="text-gray-600 text-xs mt-2">
            {filtered.length} team{filtered.length !== 1 ? "s" : ""} found
          </p>
        )}
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "name" | "championships" | "founded")}
          className="bg-[#0d0d0d] border border-white/10 hover:border-white/20 text-white rounded-lg px-3 py-2 text-sm outline-none transition-colors cursor-pointer"
        >
          <option value="name">Sort by Name</option>
          <option value="championships">Sort by Championships</option>
          <option value="founded">Sort by Founded</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="text-gray-600 text-sm">
          No teams match your search
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sorted.map((team) => (
            <div key={team.name} onClick={() => setSelected(team)}>
              <TeamCard team={team} />
            </div>
          ))}
        </div>
      )}

      <TeamModal
        team={selected}
        drivers={drivers}
        onClose={() => setSelected(null)}
      />

    </main>
  );
}