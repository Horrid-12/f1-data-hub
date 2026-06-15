import { NextResponse } from "next/server";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const VALID_PATHS = new Set([
  "sessions",
  "drivers",
  "laps",
  "intervals",
  "location",
  "meetups",
  "pit",
  "position",
  "race_control",
  "team_radio",
  "weather",
  "car_data",
]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const path = searchParams.get("path");
  if (!path) {
    return NextResponse.json({ error: "No path provided" }, { status: 400 });
  }
  if (!VALID_PATHS.has(path)) {
    return NextResponse.json({ error: `Invalid path: ${path}` }, { status: 400 });
  }

  const params = new URLSearchParams(searchParams);
  params.delete("path");

  const url = `https://api.openf1.org/v1/${path}?${params.toString()}`;

  try {
    // First attempt
    let res = await fetch(url);

    // If rate limited, wait 4 seconds and retry up to 3 times
    let attempts = 0;
    while (res.status === 429 && attempts < 3) {
      console.log(`Rate limited on ${path} — retrying in 4s (attempt ${attempts + 1})`);
      await sleep(4000);
      res = await fetch(url);
      attempts++;
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: `OpenF1 returned ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}