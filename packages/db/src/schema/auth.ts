// gerado por better-auth/cli em BOOT-03-T04
// placeholder — tabelas reais geradas pelo CLI Better Auth
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const organization = pgTable("organizations", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  logo: text("logo"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
