import { NextResponse } from "next/server";
import { fetchLighthouseScores } from "@/lib/performance";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jlang.dev";

export async function GET() {
  try {
    const metrics = await fetchLighthouseScores(SITE_URL);
    return NextResponse.json({ metrics });
  } catch {
    return NextResponse.json({ metrics: null });
  }
}
