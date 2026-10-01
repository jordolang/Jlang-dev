import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";

export async function POST(request: Request) {
  await clearSession();
  // 303 so the browser follows the form POST with a GET
  return NextResponse.redirect(new URL("/portal/login", request.url), 303);
}
