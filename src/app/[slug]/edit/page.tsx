import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CommandMenu } from "@/components/command-menu";
import type { Metadata, ResolvingMetadata } from "next";
import { Section } from "@/components/ui/section";
import { GlobeIcon, MailIcon, PhoneIcon, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { schema } from "@/lib/schema";
import { dateRange, formatLocation, getInitials, yyyy } from "@/lib/fmt";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";
import { XIcon } from "@/components/icons/XIcon";
import { Redis } from "@upstash/redis";
import { notFound, redirect } from "next/navigation";
import { getCommandBarProps } from "@/components/auth-components";
import { Textarea } from "@/components/ui/textarea";
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
    const data = await redis.get("cv:" + slug);
    const PARSED_DATA = schema.parse(data);
    return {
      title: `${PARSED_DATA.basics.name} | ${PARSED_DATA.basics.label}`,
      description: PARSED_DATA.basics.summary,
    };
  } catch (e) {
    return {
      title: "404",
      description: "404",
    };
  }
}
