import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { Redis } from "@upstash/redis";
import { Client } from "@planetscale/database";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
//@ts-expect-error 
const db = drizzle(sql);

const redis = Redis.fromEnv();

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
  ]
});
