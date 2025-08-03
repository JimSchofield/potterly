import postgres from "postgres";

// Load environment variables
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is required");
}

const client = postgres(DATABASE_URL);

async function createTables() {
  try {
    console.log("Creating tables...");
    
    // Create users table
    await client`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        location VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        bio TEXT NOT NULL,
        website VARCHAR(500) NOT NULL,
        socials JSONB NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    // Create pieces table
    await client`
      CREATE TABLE IF NOT EXISTS pieces (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        details TEXT NOT NULL,
        status VARCHAR(255),
        priority VARCHAR(10) NOT NULL,
        stage VARCHAR(20) NOT NULL,
        archived BOOLEAN NOT NULL DEFAULT false,
        starred BOOLEAN NOT NULL DEFAULT false,
        owner_id UUID NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        last_updated TIMESTAMP NOT NULL DEFAULT NOW(),
        due_date TIMESTAMP
      )
    `;

    // Create stage_details table
    await client`
      CREATE TABLE IF NOT EXISTS stage_details (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        piece_id UUID NOT NULL REFERENCES pieces(id) ON DELETE CASCADE,
        stage VARCHAR(20) NOT NULL,
        notes TEXT,
        image_url VARCHAR(500),
        weight INTEGER,
        glazes TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    console.log("Tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  } finally {
    await client.end();
  }
}

createTables();
