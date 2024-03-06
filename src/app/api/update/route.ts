import { schema, usernameSchema } from "@/lib/schema";
import { Redis } from "@upstash/redis";
import { auth } from "@/../auth"
import { redirect } from "next/navigation";

const redis = Redis.fromEnv();

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {
  const session = await auth()

  const json = await request.json();
  const { name, resume } = json;
  if (!name || !resume) {
    return new Response(JSON.stringify({ message: "Missing name or JSON" }), {
      status: 400,
    });
  }

  if (!session || !session.user) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    })
  }

  const owner = await redis.get(`cv-owner:${name}`);
  if (owner && owner !== session.user.id) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    })
  }

  try {
    const n = usernameSchema.parse(name);
    const r = schema.parse(resume);

    const key = `cv:${n}`;

    await redis.set(key, resume);
    return new Response(JSON.stringify({ message: "CV updated", name: name }), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ message: "Error updating CV" }), {
      status: 400,
    });
  }
}
