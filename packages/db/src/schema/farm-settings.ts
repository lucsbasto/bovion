import { integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { farms } from "./farms";

export const farmSettings = pgTable("farm_settings", {
  farmId: uuid("farm_id")
    .primaryKey()
    .references(() => farms.id, { onDelete: "cascade" }),
  kgPerArroba: integer("kg_per_arroba").notNull().default(30),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
