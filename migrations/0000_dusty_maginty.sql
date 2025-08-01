CREATE TABLE "pieces" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"details" text NOT NULL,
	"status" varchar(255),
	"priority" varchar(10) NOT NULL,
	"stage" varchar(20) NOT NULL,
	"archived" boolean DEFAULT false NOT NULL,
	"starred" boolean DEFAULT false NOT NULL,
	"ownerId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"lastUpdated" timestamp DEFAULT now() NOT NULL,
	"dueDate" timestamp
);
--> statement-breakpoint
CREATE TABLE "stage_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pieceId" uuid NOT NULL,
	"stage" varchar(20) NOT NULL,
	"notes" text,
	"imageUrl" varchar(500),
	"weight" integer,
	"glazes" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" varchar(100) NOT NULL,
	"lastName" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"bio" text NOT NULL,
	"website" varchar(500) NOT NULL,
	"socials" jsonb NOT NULL,
	"username" varchar(50) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "stage_details" ADD CONSTRAINT "stage_details_pieceId_pieces_id_fk" FOREIGN KEY ("pieceId") REFERENCES "public"."pieces"("id") ON DELETE cascade ON UPDATE no action;