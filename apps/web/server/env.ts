import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  APP_URL: z.string().url(),
  GIT_COMMIT_SHA: z.string().optional(),
  VERCEL_GIT_COMMIT_SHA: z.string().optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid env:", parsed.error.flatten().fieldErrors);
  throw new Error("Missing/invalid environment variables — see logs above");
}
export const env = parsed.data;
