import type { Context, Config } from "@netlify/functions";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { users } from "../../db/schema";
import { eq } from "drizzle-orm";

const databaseUrl = Netlify.env.DATABASE_URL || process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const client = postgres(databaseUrl);
const db = drizzle(client);

export default async (req: Request, context: Context) => {
  const { method } = req;
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const googleId = url.searchParams.get("googleId");

  try {
    switch (method) {
      case "GET":
        if (googleId) {
          // Get user by Google ID
          const user = await db.select().from(users).where(eq(users.googleId, googleId));
          if (user.length === 0) {
            return new Response(JSON.stringify({ error: "User not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" }
            });
          }
          return new Response(JSON.stringify(user[0]), {
            headers: { "Content-Type": "application/json" }
          });
        } else if (id) {
          // Get single user by UUID
          const user = await db.select().from(users).where(eq(users.id, id));
          if (user.length === 0) {
            return new Response(JSON.stringify({ error: "User not found" }), {
              status: 404,
              headers: { "Content-Type": "application/json" }
            });
          }
          return new Response(JSON.stringify(user[0]), {
            headers: { "Content-Type": "application/json" }
          });
        } else {
          // Get all users
          const allUsers = await db.select().from(users);
          return new Response(JSON.stringify(allUsers), {
            headers: { "Content-Type": "application/json" }
          });
        }

      case "POST":
        const newUser = await req.json();
        const insertedUser = await db.insert(users).values(newUser).returning();
        return new Response(JSON.stringify(insertedUser[0]), {
          status: 201,
          headers: { "Content-Type": "application/json" }
        });

      case "PUT":
        if (!id) {
          return new Response(JSON.stringify({ error: "ID required for update" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        const updateData = await req.json();
        const updatedUser = await db
          .update(users)
          .set({ ...updateData, updatedAt: new Date() })
          .where(eq(users.id, id))
          .returning();
        
        if (updatedUser.length === 0) {
          return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }
        return new Response(JSON.stringify(updatedUser[0]), {
          headers: { "Content-Type": "application/json" }
        });

      case "DELETE":
        if (!id) {
          return new Response(JSON.stringify({ error: "ID required for delete" }), {
            status: 400,
            headers: { "Content-Type": "application/json" }
          });
        }
        const deletedUser = await db.delete(users).where(eq(users.id, id)).returning();
        if (deletedUser.length === 0) {
          return new Response(JSON.stringify({ error: "User not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
          });
        }
        return new Response(JSON.stringify({ message: "User deleted successfully" }), {
          headers: { "Content-Type": "application/json" }
        });

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
  path: "/api/users"
};