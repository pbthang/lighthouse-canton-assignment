CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "margin" (
	"client_id" uuid PRIMARY KEY NOT NULL,
	"loanBalance" numeric DEFAULT '0' NOT NULL,
	"marginRequirement" numeric DEFAULT '0' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "market_data" (
	"symbol" varchar(255),
	"price" numeric DEFAULT '0' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "market_data_symbol_pk" PRIMARY KEY("symbol")
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"symbol" varchar(255),
	"quantity" integer DEFAULT 0 NOT NULL,
	"costBasis" numeric DEFAULT '0' NOT NULL,
	"client_id" uuid,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "positions_symbol_client_id_pk" PRIMARY KEY("symbol","client_id")
);
--> statement-breakpoint
ALTER TABLE "margin" ADD CONSTRAINT "margin_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;