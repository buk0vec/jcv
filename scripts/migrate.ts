import { migrate } from "drizzle-orm/neon-http/migrator";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
//@ts-expect-error 
const db = drizzle(sql);

await migrate(db, { migrationsFolder: "drizzle" });