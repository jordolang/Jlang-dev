import { NextResponse } from "next/server";
import { getApprovedTestimonials } from "@/lib/reviews";

export async function GET() {
  try {
    return NextResponse.json({ testimonials: await getApprovedTestimonials() });
  } catch {
    return NextResponse.json({ testimonials: [] });
  }
}
