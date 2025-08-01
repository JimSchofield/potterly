import type { Context, Config } from "@netlify/functions";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { pieces, stageDetails } from "../../db/schema";
import { eq } from "drizzle-orm";

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
    const assembledStageDetails = {
      ideas: { notes: "", imageUrl: "" },
      throw: { notes: "", imageUrl: "", weight: null },
      trim: { notes: "", imageUrl: "" },
      bisque: { notes: "", imageUrl: "" },
      glaze: { notes: "", imageUrl: "", glazes: "" },
      finished: { notes: "", imageUrl: "" },
    };

    // Populate with actual data from database
    stages.forEach((stage) => {
      const stageData: any = {
        notes: stage.notes || "",
        imageUrl: stage.imageUrl || "",
      };

      // Add stage-specific fields
      if (stage.stage === "throw") {
        stageData.weight = stage.weight;
      } else if (stage.stage === "glaze") {
        stageData.glazes = stage.glazes || "";
      }

      assembledStageDetails[stage.stage as keyof typeof assembledStageDetails] = stageData;
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