import type { Context, Config } from "@netlify/functions";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pieces, stageDetails } from "../../db/schema";
import { eq, inArray } from "drizzle-orm";

const databaseUrl = Netlify.env.DATABASE_URL || process.env.DATABASE_URL;

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
    // Get all pieces for the user
    const userPieces = await db
      .select()
      .from(pieces)
      .where(eq(pieces.ownerId, userId));

    // Get stage details for all pieces
    const pieceIds = userPieces.map(p => p.id);
    const allStageDetails = pieceIds.length > 0 
      ? await db
          .select()
          .from(stageDetails)
          .where(inArray(stageDetails.pieceId, pieceIds))
      : [];

    // Assemble pieces with their stage details
    const piecesWithStages = userPieces.map(piece => {
      // Get stage details for this piece
      const pieceStageDetails = allStageDetails.filter(stage => stage.pieceId === piece.id);
      
      // Create stageDetails object with proper structure
      const stageDetailsObj = {
        ideas: { notes: "", imageUrl: "" },
        throw: { notes: "", imageUrl: "", weight: undefined },
        trim: { notes: "", imageUrl: "" },
        bisque: { notes: "", imageUrl: "" },
        glaze: { notes: "", imageUrl: "", glazes: "" },
        finished: { notes: "", imageUrl: "" }
      };

      // Populate with actual data from database
      pieceStageDetails.forEach(stageDetail => {
        const stageKey = stageDetail.stage as keyof typeof stageDetailsObj;
        if (stageKey in stageDetailsObj) {
          stageDetailsObj[stageKey] = {
            notes: stageDetail.notes || "",
            imageUrl: stageDetail.imageUrl || "",
            ...(stageKey === "throw" && { weight: stageDetail.weight }),
            ...(stageKey === "glaze" && { glazes: stageDetail.glazes || "" })
          };
        }
      });

      return {
        id: piece.id,
        title: piece.title,
        type: piece.type,
        details: piece.details,
        status: piece.status,
        priority: piece.priority,
        stage: piece.stage,
        archived: piece.archived,
        starred: piece.starred,
        ownerId: piece.ownerId,
        createdAt: piece.createdAt.toISOString(),
        lastUpdated: piece.lastUpdated.toISOString(),
        dueDate: piece.dueDate?.toISOString(),
        stageDetails: stageDetailsObj
      };
    });

    return new Response(JSON.stringify(piecesWithStages), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch user pieces",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: "/api/user-pieces"
};