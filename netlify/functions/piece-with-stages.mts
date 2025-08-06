import type { Context, Config } from "@netlify/functions";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pieces, stageDetails } from "../../db/schema";
import { eq } from "drizzle-orm";
import type { StageDetails } from "../../src/types/Piece";

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
  const id = url.searchParams.get("id");

  if (method !== "GET") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!id) {
    return new Response(JSON.stringify({ error: "ID parameter required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Get the piece
    const piece = await db.select().from(pieces).where(eq(pieces.id, id));
    
    if (piece.length === 0) {
      return new Response(JSON.stringify({ error: "Piece not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get all stage details for this piece
    const stages = await db
      .select()
      .from(stageDetails)
      .where(eq(stageDetails.pieceId, id));

    // Assemble stageDetails object in the format expected by PotteryPiece interface
    const assembledStageDetails: StageDetails = {
      ideas: { notes: "", imageUrl: "" },
      throw: { notes: "", imageUrl: "", weight: null },
      trim: { notes: "", imageUrl: "" },
      bisque: { notes: "", imageUrl: "" },
      glaze: { notes: "", imageUrl: "", glazes: "" },
      finished: { notes: "", imageUrl: "" },
    };

    // Populate with actual data from database
    stages.forEach((stage) => {
      // Add stage-specific fields and assign properly
      if (stage.stage === "throw") {
        assembledStageDetails.throw = {
          notes: stage.notes || "",
          imageUrl: stage.imageUrl || "",
          weight: stage.weight,
        };
      } else if (stage.stage === "glaze") {
        assembledStageDetails.glaze = {
          notes: stage.notes || "",
          imageUrl: stage.imageUrl || "",
          glazes: stage.glazes || "",
        };
      } else if (stage.stage === "ideas") {
        assembledStageDetails.ideas = {
          notes: stage.notes || "",
          imageUrl: stage.imageUrl || "",
        };
      } else if (stage.stage === "trim") {
        assembledStageDetails.trim = {
          notes: stage.notes || "",
          imageUrl: stage.imageUrl || "",
        };
      } else if (stage.stage === "bisque") {
        assembledStageDetails.bisque = {
          notes: stage.notes || "",
          imageUrl: stage.imageUrl || "",
        };
      } else if (stage.stage === "finished") {
        assembledStageDetails.finished = {
          notes: stage.notes || "",
          imageUrl: stage.imageUrl || "",
        };
      }
    });

    // Combine piece with assembled stage details
    const pieceWithStages = {
      ...piece[0],
      stageDetails: assembledStageDetails,
    };

    return new Response(JSON.stringify(pieceWithStages), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/piece-with-stages",
};