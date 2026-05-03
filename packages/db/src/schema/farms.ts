import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { organizations } from "./auth";

export const farms = pgTable("farms", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  deletedAt: timestamp("deleted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
