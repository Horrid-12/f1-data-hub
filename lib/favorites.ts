// Manage favorites in localStorage
const FAVORITES_KEY = "f1-favorites";

export interface Favorite {
  type: "driver" | "team";
  id: string;
  name: string;
  timestamp: number;
}

export function getFavorites(): Favorite[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addFavorite(favorite: Omit<Favorite, "timestamp">): void {
  if (typeof window === "undefined") return;
  try {
    const favorites = getFavorites();
    // Avoid duplicates
    if (!favorites.find((f) => f.type === favorite.type && f.id === favorite.id)) {
      favorites.push({ ...favorite, timestamp: Date.now() });
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (err) {
    console.error("Failed to add favorite:", err);
  }
}

export function removeFavorite(type: "driver" | "team", id: string): void {
  if (typeof window === "undefined") return;
  try {
    const favorites = getFavorites().filter(
      (f) => !(f.type === type && f.id === id)
    );
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error("Failed to remove favorite:", err);
  }
}

export function isFavorite(type: "driver" | "team", id: string): boolean {
  return getFavorites().some((f) => f.type === type && f.id === id);
}
