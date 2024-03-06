import type { Metadata, ResolvingMetadata } from "next";
import { Redis } from "@upstash/redis";
import { notFound, redirect } from "next/navigation";
import JsonEditor from "@/components/json-editor";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "../../../../auth";

const redis = Redis.fromEnv();

interface PageProps {
  params: { slug: string };
}

/* TODO: Make sure to not include sections that don't have any data */

export default async function Page({ params }: PageProps) {
  const session = await auth();
    const owner = await redis.get("cv-owner:" + params.slug);
    if (!session || !session.user || (owner && owner !== session.user.id)) {
      redirect(`/${params.slug}`)
    }
    const data = await redis.get("cv:" + params.slug);
    if (!data) {
      notFound();
    }
    return (
      <>
        <JsonEditor data={data} slug={params.slug}/>
        <Toaster />
      </>
    );
  }

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const slug = params.slug;

  try {
    return {
      title: `Editing page ${slug} | jcv`,
      description: "JSON editor for your CV",
    };
  } catch (e) {
    return {
      title: "404",
      description: "404",
    };
  }
}
