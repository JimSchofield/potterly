import type { Context, Config } from "@netlify/functions";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pieces } from "../../db/schema";
import { eq, desc, and } from "drizzle-orm";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(databaseUrl);
const db = drizzle(client);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async (req: Request, _context: Context) => {
  const { method } = req;
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "userId parameter is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    // Get the 6 most recently updated pieces for the user (excluding archived)
    const recentPieces = await db
      .select()
      .from(pieces)
      .where(
        and(
          eq(pieces.ownerId, userId),
          eq(pieces.archived, false)
        )
      )
      .orderBy(desc(pieces.lastUpdated))
      .limit(6);

    // Format dates for response
    const formattedPieces = recentPieces.map(piece => ({
      ...piece,
      createdAt: piece.createdAt.toISOString(),
      lastUpdated: piece.lastUpdated.toISOString(),
      dueDate: piece.dueDate?.toISOString(),
    }));

    return new Response(JSON.stringify(formattedPieces), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch recent pieces",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: "/api/user-recent-pieces"
};