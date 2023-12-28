import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardHeader, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { CommandMenu } from "../components/command-menu";
import { Metadata } from "next";
import { Section } from "../components/ui/section";
import { GlobeIcon, MailIcon, PhoneIcon, Link } from "lucide-react";
import { Button } from "../components/ui/button";
import data from "../data/thomasdavis.json";
import { ProjectCard } from "../components/project-card";
import { schema } from "@/lib/schema";
import { formatLocation, getInitials, yyyy } from "@/lib/fmt";
import { GitHubIcon } from "../components/icons/GitHubIcon";
import { LinkedInIcon } from "../components/icons/LinkedInIcon";
import { XIcon } from "../components/icons/XIcon";
import { CreateForm } from "@/components/create-form";
import { Toaster } from "@/components/ui/toaster";

const PARSED_DATA = schema.parse(data);

export const metadata: Metadata = {
  title: `CV Generator`,
  description:
    "A JSONResume CV generator using Next.js, Tailwind CSS, shadcn/ui",
};

const determineIcon = (name: string) => {
  if (
    name.localeCompare("GitHub", undefined, { sensitivity: "accent" }) === 0
  ) {
    return <GitHubIcon className="h-4 w-4" />;
  }
  if (
    name.localeCompare("LinkedIn", undefined, { sensitivity: "accent" }) === 0
  ) {
    return <LinkedInIcon className="h-4 w-4" />;
  }
  if (
    name.localeCompare("X", undefined, { sensitivity: "accent" }) === 0 ||
    name.localeCompare("Twitter", undefined, { sensitivity: "accent" }) === 0
  ) {
    return <XIcon className="h-4 w-4" />;
  }
  return <Link className="h-4 w-4" />;
};

/* TODO: Make sure to not include sections that don't have any data */

export default function Page() {
  return (
    <>
    <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
      <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-6">
        <CreateForm />
      </section>
    </main>
    <Toaster />

    </>
  );
}
