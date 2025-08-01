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
          weight: stage === "throw" ? null : undefined,
          glazes: stage === "glaze" ? "" : undefined,
        }));

        await db.insert(stageDetails).values(stageDetailsData);

        return new Response(JSON.stringify(insertedPiece[0]), {
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
        const updatedPiece = await db
          .update(pieces)
          .set({ ...updateData, lastUpdated: new Date() })
          .where(eq(pieces.id, id))
          .returning();

        if (updatedPiece.length === 0) {
          return new Response(JSON.stringify({ error: "Piece not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(updatedPiece[0]), {
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
