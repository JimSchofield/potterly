import {
  pgTable,
  varchar,
  text,
  boolean,
  timestamp,
  uuid,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";

export const pieces = pgTable("pieces", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  type: varchar({ length: 50 }).notNull(),
  details: text().notNull(),
  status: varchar({ length: 255 }),
  priority: varchar({ length: 10 }).notNull(),
  stage: varchar({ length: 20 }).notNull(),
  archived: boolean().notNull().default(false),
  starred: boolean().notNull().default(false),
  ownerId: uuid("owner_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
});

export const stageDetails = pgTable("stage_details", {
  id: uuid().primaryKey().defaultRandom(),
  pieceId: uuid("piece_id")
    .notNull()
    .references(() => pieces.id, { onDelete: "cascade" }),
  stage: varchar({ length: 20 }).notNull(), // ideas, throw, trim, bisque, glaze, finished
  notes: text(),
  imageUrl: varchar("image_url", { length: 500 }),
  weight: integer(), // Weight in grams (for throw stage)
  glazes: text(), // Glaze descriptions (for glaze stage)
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  googleId: varchar("google_id", { length: 255 }).unique(), // Google OAuth ID
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  location: varchar({ length: 255 }).notNull(),
  title: varchar({ length: 255 }).notNull(),
  bio: text().notNull(),
  website: varchar({ length: 500 }).notNull(),
  socials: jsonb().notNull(), // UserSocials object
  username: varchar({ length: 50 }).notNull().unique(),
  profilePicture: varchar("profile_picture", { length: 500 }), // Profile picture URL from Google OAuth
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

