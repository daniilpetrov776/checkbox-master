import { pgTable, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const checkboxStates = pgTable("checkbox_states", {
  id: integer("id").primaryKey(),
  checked: boolean("checked").notNull().default(false),
});

export const insertCheckboxStateSchema = createInsertSchema(checkboxStates).pick({
  id: true,
  checked: true,
});

export type InsertCheckboxState = z.infer<typeof insertCheckboxStateSchema>;
export type CheckboxState = typeof checkboxStates.$inferSelect;

export type CheckboxStates = { [key: number]: boolean };
