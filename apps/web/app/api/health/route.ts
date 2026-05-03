import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/server/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const commit =
    process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ??
    process.env.GIT_COMMIT_SHA?.slice(0, 7) ??
    "local";
  const timestamp = new Date().toISOString();
  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ ok: true, db: "connected", commit, timestamp });
  } catch (error) {
    return NextResponse.json(
      { ok: false, db: "disconnected", error: (error as Error).message, commit, timestamp },
      { status: 503 },
    );
  }
}
