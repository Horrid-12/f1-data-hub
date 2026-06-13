import Image from "next/image";
import { Driver } from "@/types/f1";
import { DRIVER_IMAGES } from "@/lib/openf1";
import { useState } from "react";
import { isFavorite, addFavorite, removeFavorite } from "@/lib/favorites";

export default function DriverCard({ driver }: { driver: Driver }) {
  const [favorite, setFavorite] = useState(
    () => isFavorite("driver", String(driver.driver_number))
  );

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite("driver", String(driver.driver_number));
      setFavorite(false);
    } else {
      addFavorite({
        type: "driver",
        id: String(driver.driver_number),
        name: driver.full_name,
      });
      setFavorite(true);
    }
  };

  const teamColor = driver.team_colour ? `#${driver.team_colour}` : "#E8002D";

  return (
    <div className="relative bg-[#0d0d0d] border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 group cursor-pointer">

      {/* Favorite button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 z-10 w-7 h-7 rounded-lg bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors text-base"
        title={favorite ? "Remove from favorites" : "Add to favorites"}
      >
        {favorite ? "❤️" : "🤍"}
      </button>

      {/* Team color bar */}
      <div className="h-1 w-full" style={{ backgroundColor: teamColor }} />

      {/* Driver image area */}
      <div
        className="flex justify-center pt-6 pb-4 relative"
        style={{ background: `radial-gradient(ellipse at top, ${teamColor}15, transparent 70%)` }}
      >
        {driver.headshot_url ? (
          <Image
            src={DRIVER_IMAGES[driver.driver_number] ?? driver.headshot_url}
            alt={driver.full_name}
            width={80}
            height={80}
            className="object-contain relative z-10 w-auto h-auto"
            loading="eager"
            unoptimized
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-3xl">
            👤
          </div>
        )}
      </div>

      {/* Driver info */}
      <div className="px-4 pb-4 text-center">
        <p className="text-gray-600 font-mono text-xs mb-0.5">
          #{driver.driver_number}
        </p>
        <h3 className="text-white font-bold text-sm leading-snug group-hover:text-f1gold transition-colors">
          {driver.full_name}
        </h3>
        <p className="text-xs font-medium mt-1" style={{ color: teamColor }}>
          {driver.team_name}
        </p>
      </div>

    </div>
  );
}