import type { Config } from "drizzle-kit";
export default {
  schema: "./src/lib/db.ts",
  out: "./drizzle",
} satisfies Config;