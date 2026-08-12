CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text[] DEFAULT '{}' NOT NULL,
	"category" text NOT NULL,
	"author_name" text NOT NULL,
	"author_role" text NOT NULL,
	"date" text NOT NULL,
	"read_time" text NOT NULL,
	"gradient_key" text DEFAULT 'violet-fuchsia-cyan' NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "consultation_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"company" text,
	"service" text NOT NULL,
	"preferred_date" text NOT NULL,
	"notes" text,
	"source_path" text,
	"ip_hash" text,
	"user_agent" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"email_sent" boolean DEFAULT false NOT NULL,
	"email_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_submissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"source_path" text,
	"ip_hash" text,
	"user_agent" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"email_sent" boolean DEFAULT false NOT NULL,
	"email_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" serial PRIMARY KEY NOT NULL,
	"group" text NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "footer_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"group" text NOT NULL,
	"label" text NOT NULL,
	"href" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "industries" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"icon_name" text NOT NULL,
	"tagline" text NOT NULL,
	"overview" text NOT NULL,
	"challenges" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"solutions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"services" text[] DEFAULT '{}' NOT NULL,
	"stats" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_slug" text NOT NULL,
	"job_title" text,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"linkedin" text,
	"cover_note" text NOT NULL,
	"resume_path" text,
	"resume_original_name" text,
	"resume_mime_type" text,
	"resume_size" integer,
	"source_path" text,
	"ip_hash" text,
	"user_agent" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"email_sent" boolean DEFAULT false NOT NULL,
	"email_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_openings" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"department" text NOT NULL,
	"location" text NOT NULL,
	"type" text NOT NULL,
	"description" text NOT NULL,
	"requirements" text[] DEFAULT '{}' NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nav_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"href" text NOT NULL,
	"mega_menu" text,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"unsubscribe_token" text NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"unsubscribed_at" timestamp with time zone,
	"source_path" text,
	"ip_hash" text,
	"user_agent" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"email_sent" boolean DEFAULT false NOT NULL,
	"email_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "portfolio_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"client" text NOT NULL,
	"industry" text NOT NULL,
	"services" text[] DEFAULT '{}' NOT NULL,
	"summary" text NOT NULL,
	"challenge" text NOT NULL,
	"solution" text NOT NULL,
	"outcomes" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"technologies" text[] DEFAULT '{}' NOT NULL,
	"year" text NOT NULL,
	"gradient_key" text DEFAULT 'violet-fuchsia-cyan' NOT NULL,
	"testimonial" jsonb,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"price" text NOT NULL,
	"period" text NOT NULL,
	"description" text NOT NULL,
	"features" text[] DEFAULT '{}' NOT NULL,
	"cta" text NOT NULL,
	"highlighted" boolean DEFAULT false NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "process_steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"step" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quote_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"project_type" text NOT NULL,
	"budget" text NOT NULL,
	"timeline" text NOT NULL,
	"description" text NOT NULL,
	"source_path" text,
	"ip_hash" text,
	"user_agent" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"email_sent" boolean DEFAULT false NOT NULL,
	"email_error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"id" serial PRIMARY KEY NOT NULL,
	"bucket" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"short_name" text NOT NULL,
	"icon_name" text NOT NULL,
	"tagline" text NOT NULL,
	"overview" text NOT NULL,
	"benefits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"features" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tech_stack" text[] DEFAULT '{}' NOT NULL,
	"process" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"faqs" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"related_industries" text[] DEFAULT '{}' NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"name" text NOT NULL,
	"legal_name" text NOT NULL,
	"tagline" text NOT NULL,
	"description" text NOT NULL,
	"url" text NOT NULL,
	"og_image" text NOT NULL,
	"email" text NOT NULL,
	"sales_email" text NOT NULL,
	"phone" text NOT NULL,
	"whatsapp" text NOT NULL,
	"founded" text NOT NULL,
	"address" jsonb NOT NULL,
	"social" jsonb NOT NULL,
	"stats" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" text NOT NULL,
	"bio" text NOT NULL,
	"initials" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "technologies" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"quote" text NOT NULL,
	"author" text NOT NULL,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"rating" integer DEFAULT 5 NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "why_choose_us" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"metric" text NOT NULL,
	"metric_label" text NOT NULL,
	"description" text NOT NULL,
	"is_published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_email_idx" ON "admin_users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_categories_name_idx" ON "blog_categories" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "blog_posts_date_idx" ON "blog_posts" USING btree ("date");--> statement-breakpoint
CREATE INDEX "consultation_requests_created_idx" ON "consultation_requests" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "contact_submissions_created_idx" ON "contact_submissions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "faqs_group_idx" ON "faqs" USING btree ("group");--> statement-breakpoint
CREATE INDEX "footer_links_group_idx" ON "footer_links" USING btree ("group");--> statement-breakpoint
CREATE UNIQUE INDEX "industries_slug_idx" ON "industries" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "job_applications_created_idx" ON "job_applications" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "job_openings_slug_idx" ON "job_openings" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_subscribers_email_idx" ON "newsletter_subscribers" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_subscribers_token_idx" ON "newsletter_subscribers" USING btree ("unsubscribe_token");--> statement-breakpoint
CREATE UNIQUE INDEX "portfolio_projects_slug_idx" ON "portfolio_projects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "quote_requests_created_idx" ON "quote_requests" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "rate_limits_bucket_idx" ON "rate_limits" USING btree ("bucket");--> statement-breakpoint
CREATE INDEX "rate_limits_expires_idx" ON "rate_limits" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");