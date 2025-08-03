import type { Context, Config } from "@netlify/functions";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pieces } from "../../db/schema";
import { eq, and, count } from "drizzle-orm";

const databaseUrl = Netlify.env.DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(databaseUrl);
const db = drizzle(client);

interface UserStats {
  totalPieces: number;
  activePieces: number;
  completedPieces: number;
  starredPieces: number;
  archivedPieces: number;
  piecesByStage: {
    ideas: number;
    throw: number;
    trim: number;
    bisque: number;
    glaze: number;
    finished: number;
  };
  piecesByPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

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
    // Get total pieces count
    const totalPiecesResult = await db
      .select({ count: count() })
      .from(pieces)
      .where(eq(pieces.ownerId, userId));

    // Get active pieces (not finished and not archived) 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _activePiecesResult = await db
      .select({ count: count() })
      .from(pieces)
      .where(
        and(
          eq(pieces.ownerId, userId),
          eq(pieces.archived, false),
          // Not finished stage
          // Using SQL NOT operator since drizzle doesn't have a direct ne() for this case
        )
      );

    // Get completed pieces (finished stage)
    const completedPiecesResult = await db
      .select({ count: count() })
      .from(pieces)
      .where(
        and(
          eq(pieces.ownerId, userId),
          eq(pieces.stage, "finished")
        )
      );

    // Get starred pieces
    const starredPiecesResult = await db
      .select({ count: count() })
      .from(pieces)
      .where(
        and(
          eq(pieces.ownerId, userId),
          eq(pieces.starred, true)
        )
      );

    // Get archived pieces
    const archivedPiecesResult = await db
      .select({ count: count() })
      .from(pieces)
      .where(
        and(
          eq(pieces.ownerId, userId),
          eq(pieces.archived, true)
        )
      );

    // Get pieces by stage
    const stageStats = await Promise.all([
      db.select({ count: count() }).from(pieces).where(and(eq(pieces.ownerId, userId), eq(pieces.stage, "ideas"))),
      db.select({ count: count() }).from(pieces).where(and(eq(pieces.ownerId, userId), eq(pieces.stage, "throw"))),
      db.select({ count: count() }).from(pieces).where(and(eq(pieces.ownerId, userId), eq(pieces.stage, "trim"))),
      db.select({ count: count() }).from(pieces).where(and(eq(pieces.ownerId, userId), eq(pieces.stage, "bisque"))),
      db.select({ count: count() }).from(pieces).where(and(eq(pieces.ownerId, userId), eq(pieces.stage, "glaze"))),
      db.select({ count: count() }).from(pieces).where(and(eq(pieces.ownerId, userId), eq(pieces.stage, "finished"))),
    ]);

    // Get pieces by priority
    const priorityStats = await Promise.all([
      db.select({ count: count() }).from(pieces).where(and(eq(pieces.ownerId, userId), eq(pieces.priority, "high"))),
      db.select({ count: count() }).from(pieces).where(and(eq(pieces.ownerId, userId), eq(pieces.priority, "medium"))),
      db.select({ count: count() }).from(pieces).where(and(eq(pieces.ownerId, userId), eq(pieces.priority, "low"))),
    ]);

    // Calculate active pieces properly (total - archived)
    const totalCount = totalPiecesResult[0]?.count || 0;
    const archivedCount = archivedPiecesResult[0]?.count || 0;
    const completedCount = completedPiecesResult[0]?.count || 0;
    const actualActivePieces = totalCount - archivedCount - completedCount;

    const stats: UserStats = {
      totalPieces: totalCount,
      activePieces: Math.max(0, actualActivePieces), // Ensure non-negative
      completedPieces: completedCount,
      starredPieces: starredPiecesResult[0]?.count || 0,
      archivedPieces: archivedCount,
      piecesByStage: {
        ideas: stageStats[0][0]?.count || 0,
        throw: stageStats[1][0]?.count || 0,
        trim: stageStats[2][0]?.count || 0,
        bisque: stageStats[3][0]?.count || 0,
        glaze: stageStats[4][0]?.count || 0,
        finished: stageStats[5][0]?.count || 0,
      },
      piecesByPriority: {
        high: priorityStats[0][0]?.count || 0,
        medium: priorityStats[1][0]?.count || 0,
        low: priorityStats[2][0]?.count || 0,
      }
    };

    return new Response(JSON.stringify(stats), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch user statistics",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: "/api/user-stats"
};