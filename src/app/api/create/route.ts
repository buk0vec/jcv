import { schema, usernameSchema } from "@/lib/schema";
import { Redis } from "@upstash/redis";
import { auth } from "@/../auth"

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
  try {
    const n = usernameSchema.parse(name);
    const r = schema.parse(resume);

    const key = `cv:${n}`;
    const exists = await redis.exists(key);
    if (exists != 0) {
      return new Response(JSON.stringify({ message: "Username taken" }), {
        status: 400,
      });
    }
    await redis.set(`cv-owner:${n}`, session?.user?.id ?? "anonymous")
    await redis.set(key, resume);
    return new Response(JSON.stringify({ message: "CV created", name: name }), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ message: "Error creating CV" }), {
      status: 400,
    });
  }
}
