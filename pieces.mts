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

  try {
    switch (method) {
      case "GET":
        if (id) {
          // Get single piece
          const piece = await db.select().from(pieces).where(eq(pieces.id, id));
          if (piece.length === 0) {
            return new Response(JSON.stringify({ error: "Piece not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" },
            });
          }
          return new Response(JSON.stringify(piece[0]), {
            headers: { "Content-Type": "application/json" },
          });
        } else {
          // Get all pieces
          const allPieces = await db.select().from(pieces);
          return new Response(JSON.stringify(allPieces), {
            headers: { "Content-Type": "application/json" },
          });
        }

      case "POST": {
        const newPiece = await req.json();
        
        // Convert date strings to Date objects for database insertion
        const pieceData = {
          ...newPiece,
          createdAt: newPiece.createdAt ? new Date(newPiece.createdAt) : new Date(),
          lastUpdated: newPiece.lastUpdated ? new Date(newPiece.lastUpdated) : new Date(),
          dueDate: newPiece.dueDate ? new Date(newPiece.dueDate) : undefined,
        };
        
        const insertedPiece = await db
          .insert(pieces)
          .values(pieceData)
          .returning();

        // Create default stage details for all stages
        const stages = [
          "ideas",
          "throw",
          "trim",
          "bisque",
          "glaze",
          "finished",
        ];
        const stageDetailsData = stages.map((stage) => ({
          pieceId: insertedPiece[0].id,
          stage,
          notes: "",
          imageUrl: "",
          ...(stage === "throw" && { weight: null }),
          ...(stage === "glaze" && { glazes: "" }),
        }));

        const insertedStageDetails = await db.insert(stageDetails).values(stageDetailsData).returning();

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
        insertedStageDetails.forEach(stageDetail => {
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

        // Return piece with stage details
        const pieceWithStages = {
          ...insertedPiece[0],
          createdAt: insertedPiece[0].createdAt.toISOString(),
          lastUpdated: insertedPiece[0].lastUpdated.toISOString(),
          dueDate: insertedPiece[0].dueDate?.toISOString(),
          stageDetails: stageDetailsObj
        };

        return new Response(JSON.stringify(pieceWithStages), {
          status: 201,
          headers: { "Content-Type": "application/json" },
        });
      }

      case "PUT": {
        if (!id) {
          return new Response(
            JSON.stringify({ error: "ID required for update" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
        const updateData = await req.json();
        
        // Filter out fields that don't exist in the pieces table
        const validPieceFields = {
          title: updateData.title,
          type: updateData.type,
          details: updateData.details,
          status: updateData.status,
          priority: updateData.priority,
          stage: updateData.stage,
          archived: updateData.archived,
          starred: updateData.starred,
          ownerId: updateData.ownerId,
          dueDate: updateData.dueDate ? new Date(updateData.dueDate) : undefined,
          lastUpdated: new Date()
        };
        
        // Remove undefined values
        const cleanedData = Object.fromEntries(
          Object.entries(validPieceFields).filter(([, value]) => value !== undefined)
        );
        
        const updatedPiece = await db
          .update(pieces)
          .set(cleanedData)
          .where(eq(pieces.id, id))
          .returning();

        if (updatedPiece.length === 0) {
          return new Response(JSON.stringify({ error: "Piece not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        // Format dates for response
        const formattedPiece = {
          ...updatedPiece[0],
          createdAt: updatedPiece[0].createdAt.toISOString(),
          lastUpdated: updatedPiece[0].lastUpdated.toISOString(),
          dueDate: updatedPiece[0].dueDate?.toISOString(),
        };
        
        return new Response(JSON.stringify(formattedPiece), {
          headers: { "Content-Type": "application/json" },
        });
      }

      case "DELETE": {
        if (!id) {
          return new Response(
            JSON.stringify({ error: "ID required for delete" }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
        const deletedPiece = await db
          .delete(pieces)
          .where(eq(pieces.id, id))
          .returning();
        if (deletedPiece.length === 0) {
          return new Response(JSON.stringify({ error: "Piece not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(
          JSON.stringify({ message: "Piece deleted successfully" }),
          {
            headers: { "Content-Type": "application/json" },
          },
        );
      }

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const config: Config = {
  path: "/api/pieces",
};
