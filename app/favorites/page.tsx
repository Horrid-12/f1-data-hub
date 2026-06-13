"use client";

import { useState, useEffect } from "react";
import { getFavorites, removeFavorite, type Favorite } from "@/lib/favorites";
import Link from "next/link";
import Image from "next/image";
import { Driver } from "@/types/f1";
import { TeamInfo, TEAMS } from "@/data/teams";
import { getDriversClient } from "@/lib/openf1";
import DriverCard from "@/components/DriverCard";
import TeamCard from "@/components/TeamCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const faves = getFavorites();
      setFavorites(faves);

      const allDrivers = await getDriversClient(2026);
      setDrivers(allDrivers);
      setLoading(false);
    };
    load();
  }, []);

  const favoriteDrivers = drivers.filter((d) =>
    favorites.some(
      (f) => f.type === "driver" && f.id === String(d.driver_number)
    )
  );

  const favoriteTeams = Object.values(TEAMS).filter((t) =>
    favorites.some((f) => f.type === "team" && f.id === t.name)
  );

  const handleRemove = (type: "driver" | "team", id: string) => {
    removeFavorite(type, id);
    setFavorites(getFavorites());
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white mb-3">
          2026{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #E8002D, #C89B3C)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Favorites
          </span>
        </h1>
        <p className="text-gray-500">
          Your bookmarked drivers and teams. Click the heart icon to remove from
          favorites.
        </p>
      </div>

      {loading ? (
        <div className="space-y-8">
          <div className="h-80 bg-[#0d0d0d] rounded-2xl animate-pulse" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-lg p-12 text-center">
          <p className="text-gray-400 text-lg mb-6">
            No favorites yet. Browse drivers and teams to add them to your
            favorites.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/drivers"
              className="px-6 py-2.5 bg-f1red hover:bg-[#C20028] text-white rounded-lg font-semibold transition-colors"
            >
              Browse Drivers
            </Link>
            <Link
              href="/teams"
              className="px-6 py-2.5 bg-f1gold hover:bg-[#B88A2C] text-white rounded-lg font-semibold transition-colors"
            >
              Browse Teams
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Favorite Drivers */}
          {favoriteDrivers.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white mb-1">
                  Favorite Drivers
                </h2>
                <p className="text-gray-500 text-sm">
                  {favoriteDrivers.length} driver
                  {favoriteDrivers.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {favoriteDrivers.map((driver) => (
                  <div key={driver.driver_number}>
                    <DriverCard driver={driver} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Teams */}
          {favoriteTeams.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white mb-1">
                  Favorite Teams
                </h2>
                <p className="text-gray-500 text-sm">
                  {favoriteTeams.length} team{favoriteTeams.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {favoriteTeams.map((team) => (
                  <div key={team.name}>
                    <TeamCard team={team} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
