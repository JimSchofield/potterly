import type { Context, Config } from "@netlify/functions";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { stageDetails } from "../../db/schema";
import { eq, and } from "drizzle-orm";

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
  const pieceId = url.searchParams.get("pieceId");
  const stage = url.searchParams.get("stage");

  try {
    switch (method) {
      case "GET":
        if (id) {
          // Get single stage detail by ID
          const stageDetail = await db.select().from(stageDetails).where(eq(stageDetails.id, id));
          if (stageDetail.length === 0) {
            return new Response(JSON.stringify({ error: "Stage detail not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" }
            });
          }
          return new Response(JSON.stringify(stageDetail[0]), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (pieceId && stage) {
          // Get stage detail by piece ID and stage
          const stageDetail = await db
            .select()
            .from(stageDetails)
            .where(and(eq(stageDetails.pieceId, pieceId), eq(stageDetails.stage, stage)));
          return new Response(JSON.stringify(stageDetail[0] || null), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (pieceId) {
          // Get all stage details for a piece
          const pieceStageDetails = await db
            .select()
            .from(stageDetails)
            .where(eq(stageDetails.pieceId, pieceId));
          return new Response(JSON.stringify(pieceStageDetails), {
            headers: { "Content-Type": "application/json" }
          });
        } else {
          // Get all stage details
          const allStageDetails = await db.select().from(stageDetails);
          return new Response(JSON.stringify(allStageDetails), {
            headers: { "Content-Type": "application/json" }
          });
        }

      case "POST": {
        const newStageDetail = await req.json();
        const insertedStageDetail = await db.insert(stageDetails).values(newStageDetail).returning();
        return new Response(JSON.stringify(insertedStageDetail[0]), {
          status: 201,
          headers: { "Content-Type": "application/json" }
        });
      }

      case "PUT": {
        if (!id) {
          return new Response(JSON.stringify({ error: "ID required for update" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        const updateData = await req.json();
        const updatedStageDetail = await db
          .update(stageDetails)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(stageDetails.id, id))
          .returning();
        
        if (updatedStageDetail.length === 0) {
          return new Response(JSON.stringify({ error: "Stage detail not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }
        return new Response(JSON.stringify(updatedStageDetail[0]), {
          headers: { "Content-Type": "application/json" }
        });
      }

      case "DELETE": {
        if (!id) {
          return new Response(JSON.stringify({ error: "ID required for delete" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        const deletedStageDetail = await db.delete(stageDetails).where(eq(stageDetails.id, id)).returning();
        if (deletedStageDetail.length === 0) {
          return new Response(JSON.stringify({ error: "Stage detail not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }
        return new Response(JSON.stringify({ message: "Stage detail deleted successfully" }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
          status: 405,
          headers: { "Content-Type": "application/json" }
        });
    }
  } catch (error) {
    console.error("Database error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const config: Config = {
  path: "/api/stage-details"
};