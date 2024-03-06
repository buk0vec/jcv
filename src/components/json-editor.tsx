"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { GlobeIcon, MailIcon, PhoneIcon, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { schema } from "@/lib/schema";
import { dateRange, formatLocation, getInitials, yyyy } from "@/lib/fmt";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";
import { XIcon } from "@/components/icons/XIcon";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { fromZodError } from "zod-validation-error";
import { useRouter } from "next/router";
import { useToast } from "./ui/use-toast";

type JSONEditorProps = {
  data: any;
  slug: string;
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

export default function JsonEditor({ data, slug }: JSONEditorProps) {
  const PARSED_DATA_2 = schema.parse(data);

  const { toast } = useToast();

  const [jsonInput, setJsonInput] = useState(JSON.stringify(data, null, "\t"));

  const [PARSED_DATA, setJson] = useState(PARSED_DATA_2);

  const [error, setError] = useState<string | null>(null);

  const [badLine, setBadLine] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [loading, setLoading] = useState(false);

  const attemptUpdate = (next: string) => {
    setBadLine(null);
    setJsonInput(next);
    try {
      const j = JSON.parse(next);
      try {
        setJson(schema.parse(j));
        setError(null);
      } catch (e: any) {
        const message = fromZodError(e).toString();
        setError(message);
      }
    } catch (e: any) {
      const message = (e.message ??
        "There was an error parsing the JSON") as string;
      setError(message);
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    fetch(`/api/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ resume: JSON.parse(jsonInput), name: slug }),
    })
      .then((res) => {
        if (res.ok) {
          toast({"title": "CV updated", "variant": "default"});
          window.location.href = `/${slug}`
        } else {
          toast({"title": "Error updating CV", "variant": "destructive"});
        }
      })
      .catch((e) => {
        toast({"title": "Error updating CV", "variant": "destructive"});
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <header className="flex items-center justify-between bg-slate-100 px-4 py-2">
        <p className="font-mono text-base italic">Currently editing: {slug}</p>
        <Button disabled={!!error || loading} onClick={() => handleSubmit()}>Save</Button>
      </header>
      <div className="flex h-[calc(100vh-1.5rem-1rem-1rem)] flex-row">
        <div className="relative mx-2 my-2 min-w-[40%]">
          <Textarea
            className="h-full resize-none border-r-0 font-mono"
            value={jsonInput}
            onChange={(e) => attemptUpdate(e.target.value)}
            ref={textareaRef}
            disabled={loading}
          />
        </div>
        <main className="container relative mx-auto max-h-[calc(100vh-1.5rem-1rem)]  overflow-scroll p-4 md:p-16 print:p-12">
          {error && (
            <div className="flex flex-row justify-center items-center h-full">
            <Card className="max-w-[350px]">
              <CardHeader>
                <CardTitle>Error</CardTitle>
                <CardDescription>
                  There was an error while parsing your JSON:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-red-500">{error}</p>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() =>
                    attemptUpdate(JSON.stringify(PARSED_DATA, null, "\t"))
                  }
                  className="my-2"
                >
                  Revert invalid changes
                </Button>
              </CardFooter>
            </Card>
            </div>
          )}
          {!error && (
            <section className="mx-auto w-full max-w-2xl space-y-8 bg-white print:space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-1.5">
                  <h1 className="text-2xl font-bold">
                    {PARSED_DATA.basics.name}
                  </h1>
                  {PARSED_DATA.basics.label && (
                    <p className="max-w-md text-pretty font-mono text-sm text-muted-foreground">
                      {PARSED_DATA.basics.label}
                    </p>
                  )}
                  {PARSED_DATA.basics.location && (
                    <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
                      {PARSED_DATA.basics.location.url ? (
                        <a
                          className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                          href={PARSED_DATA.basics.location.url}
                          target="_blank"
                        >
                          <GlobeIcon className="h-3 w-3" />
                          {formatLocation(PARSED_DATA.basics.location)}
                        </a>
                      ) : (
                        <span className="inline-flex gap-x-1.5 align-baseline leading-none">
                          <GlobeIcon className="h-3 w-3" />
                          {formatLocation(PARSED_DATA.basics.location)}
                        </span>
                      )}
                    </p>
                  )}
                  <div className="flex gap-x-1 pt-1 font-mono text-sm text-muted-foreground print:hidden">
                    {PARSED_DATA.basics.email ? (
                      <Button
                        className="h-8 w-8"
                        variant="outline"
                        size="icon"
                        asChild
                      >
                        <a
                          href={`mailto:${PARSED_DATA.basics.email}`}
                          aria-label={`Email ${PARSED_DATA.basics.email}`}
                        >
                          <MailIcon className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                    {PARSED_DATA.basics.phone ? (
                      <Button
                        className="h-8 w-8"
                        variant="outline"
                        size="icon"
                        asChild
                      >
                        <a
                          href={`tel:${PARSED_DATA.basics.phone}`}
                          aria-label={`Call ${PARSED_DATA.basics.phone}`}
                        >
                          <PhoneIcon className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : null}
                    {(PARSED_DATA.basics.profiles ?? []).map((social) => (
                      <Button
                        key={social.network}
                        className="h-8 w-8"
                        variant="outline"
                        size="icon"
                        asChild
                      >
                        <a
                          href={social.url}
                          aria-label={`Go to ${social.network} profile`}
                        >
                          {determineIcon(social.network)}
                        </a>
                      </Button>
                    ))}
                  </div>
                  <div className="hidden flex-col gap-x-1 font-mono text-sm text-muted-foreground print:flex">
                    {PARSED_DATA.basics.email ? (
                      <a href={`mailto:${PARSED_DATA.basics.email}`}>
                        <span className="underline">
                          {PARSED_DATA.basics.email}
                        </span>
                      </a>
                    ) : null}
                    {PARSED_DATA.basics.phone ? (
                      <a href={`tel:${PARSED_DATA.basics.phone}`}>
                        <span className="underline">
                          {PARSED_DATA.basics.phone}
                        </span>
                      </a>
                    ) : null}
                  </div>
                </div>

                <Avatar className="h-28 w-28">
                  <AvatarImage
                    alt={PARSED_DATA.basics.name}
                    src={PARSED_DATA.basics.image}
                  />
                  <AvatarFallback>
                    {PARSED_DATA.basics.initials ??
                      getInitials(PARSED_DATA.basics.name)}
                  </AvatarFallback>
                </Avatar>
              </div>
              {PARSED_DATA.basics.summary && (
                <Section>
                  <h2 className="text-xl font-bold">About</h2>
                  <p className="text-pretty font-mono text-sm text-muted-foreground">
                    {PARSED_DATA.basics.summary}
                  </p>
                </Section>
              )}
              <Section>
                <h2 className="text-xl font-bold">Work Experience</h2>
                {PARSED_DATA.work.map((work) => {
                  return (
                    <Card key={work.name}>
                      <CardHeader>
                        <div className="flex items-center justify-between gap-x-2 text-base">
                          <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                            <a className="hover:underline" href={work.url}>
                              {work.name}
                            </a>
                            <span className="inline-flex gap-x-1">
                              {work.badges?.map((badge) => (
                                <Badge
                                  variant="secondary"
                                  className="align-middle text-xs"
                                  key={badge}
                                >
                                  {badge}
                                </Badge>
                              ))}
                            </span>
                          </h3>
                          <div className="text-sm tabular-nums text-gray-500">
                            {dateRange(work.startDate, work.endDate)}
                          </div>
                        </div>

                        <h4 className="font-mono text-sm leading-none">
                          {work.position}
                        </h4>
                      </CardHeader>
                      <CardContent className="mt-2 text-xs">
                        {work.summary}
                        {work.highlights ? (
                          <ul className="mt-2 list-inside list-disc">
                            {work.highlights.map((highlight) => (
                              <li key={highlight}>{highlight}</li>
                            ))}
                          </ul>
                        ) : null}
                      </CardContent>
                    </Card>
                  );
                })}
              </Section>
              {PARSED_DATA.education && (
                <Section>
                  <h2 className="text-xl font-bold">Education</h2>
                  {PARSED_DATA.education.map((education) => {
                    return (
                      <Card key={education.institution}>
                        <CardHeader>
                          <div className="flex items-center justify-between gap-x-2 text-base">
                            <h3 className="font-semibold leading-none">
                              {education.institution}
                            </h3>
                            <div className="text-sm tabular-nums text-gray-500">
                              {dateRange(
                                education.startDate,
                                education.endDate,
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="mt-2">
                          <div>
                            {education.studyType}, {education.area}
                          </div>
                          {education.score ? (
                            <div className="mt-2 text-xs">
                              <span className="font-semibold">GPA:</span>{" "}
                              {education.score}
                            </div>
                          ) : null}
                          {education.courses ? (
                            <>
                              <div className="mt-2 text-xs font-semibold">
                                Coursework:
                              </div>
                              <ul className="mt-2 list-inside list-disc text-xs">
                                {education.courses.map((course) => (
                                  <li key={course}>{course}</li>
                                ))}
                              </ul>
                            </>
                          ) : null}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Section>
              )}
              {PARSED_DATA.skills && (
                <Section>
                  <h2 className="text-xl font-bold">Skills</h2>
                  <div className="flex flex-wrap gap-1">
                    {PARSED_DATA.skills.flatMap((skill) => {
                      return skill.keywords ? (
                        [
                          <Badge
                            key={skill.name}
                            className="align-middle text-xs"
                          >
                            {skill.name}
                          </Badge>,
                          ...skill.keywords.map((keyword) => (
                            <Badge
                              variant="secondary"
                              className="align-middle text-xs"
                              key={keyword}
                            >
                              {keyword}
                            </Badge>
                          )),
                        ]
                      ) : (
                        <Badge
                          className="align-middle text-xs"
                          key={skill.name}
                        >
                          {skill.name}
                        </Badge>
                      );
                    })}
                  </div>
                </Section>
              )}
              {PARSED_DATA.projects && (
                <Section className="print-force-new-page scroll-mb-16">
                  <h2 className="text-xl font-bold">Projects</h2>
                  <div className="-mx-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 print:grid-cols-3 print:gap-2">
                    {PARSED_DATA.projects.map((project) => {
                      return (
                        <ProjectCard
                          key={project.name}
                          name={project.name}
                          description={project.description}
                          tags={project.tags}
                          url={project.url}
                        />
                      );
                    })}
                  </div>
                </Section>
              )}

              {PARSED_DATA.volunteer && (
                <Section>
                  <h2 className="text-xl font-bold">Volunteering</h2>
                  {PARSED_DATA.volunteer.map((volunteer) => {
                    return (
                      <Card key={volunteer.organization}>
                        <CardHeader>
                          <div className="flex items-center justify-between gap-x-2 text-base">
                            <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                              <a
                                className="hover:underline"
                                href={volunteer.url}
                              >
                                {volunteer.organization}
                              </a>
                            </h3>
                            <div className="text-sm tabular-nums text-gray-500">
                              {dateRange(
                                volunteer.startDate,
                                volunteer.endDate,
                              )}
                            </div>
                          </div>

                          <h4 className="font-mono text-sm leading-none">
                            {volunteer.position}
                          </h4>
                        </CardHeader>
                        <CardContent className="mt-2 text-xs">
                          {volunteer.summary}
                          {volunteer.highlights ? (
                            <ul className="mt-2 list-inside list-disc">
                              {volunteer.highlights.map((highlight) => (
                                <li key={highlight}>{highlight}</li>
                              ))}
                            </ul>
                          ) : null}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Section>
              )}

              {PARSED_DATA.publications && (
                <Section>
                  <h2 className="text-xl font-bold">Publications</h2>
                  {PARSED_DATA.publications.map((publication) => {
                    return (
                      <Card key={publication.name}>
                        <CardHeader>
                          <div className="flex items-center justify-between gap-x-2 text-base">
                            <h3 className="font-semibold leading-none">
                              {publication.name}
                            </h3>
                            <div className="text-sm tabular-nums text-gray-500">
                              {yyyy(publication.releaseDate)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="mt-2 text-xs">
                          {publication.publisher}
                          {publication.summary
                            ? ` - ${publication.summary}`
                            : null}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Section>
              )}

              {PARSED_DATA.awards && (
                <Section>
                  <h2 className="text-xl font-bold">Awards</h2>
                  {PARSED_DATA.awards.map((award) => {
                    return (
                      <Card key={award.title}>
                        <CardHeader>
                          <div className="flex items-center justify-between gap-x-2 text-base">
                            <h3 className="font-semibold leading-none">
                              {award.title}
                            </h3>
                            {award.date && (
                              <div className="text-sm tabular-nums text-gray-500">
                                {yyyy(award.date)}
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="mt-2 text-xs">
                          {award.awarder}{" "}
                          {award.summary ? ` - ${award.summary}` : null}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Section>
              )}

              {PARSED_DATA.certificates && (
                <Section>
                  <h2 className="text-xl font-bold">Certificates</h2>
                  {PARSED_DATA.certificates.map((certificate) => {
                    return (
                      <Card key={certificate.name}>
                        <CardHeader>
                          <div className="flex items-center justify-between gap-x-2 text-base">
                            <h3 className="font-semibold leading-none">
                              {certificate.name}
                            </h3>
                            <div className="text-sm tabular-nums text-gray-500">
                              {yyyy(certificate.date)}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="mt-2 text-xs">
                          {certificate.issuer}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Section>
              )}

              {PARSED_DATA.languages && (
                <Section>
                  <h2 className="text-xl font-bold">Languages</h2>
                  <div className="flex flex-wrap gap-1">
                    {PARSED_DATA.languages.map((language) => {
                      return (
                        <Badge
                          className="align-middle text-xs"
                          key={language.language}
                        >
                          {language.language}
                          <span className="ml-2 text-muted">
                            ({language.fluency})
                          </span>
                        </Badge>
                      );
                    })}
                  </div>
                </Section>
              )}

              {PARSED_DATA.interests && (
                <Section>
                  <h2 className="text-xl font-bold">Interests</h2>
                  <div className="flex flex-wrap gap-1">
                    {PARSED_DATA.interests.map((interest) => {
                      return (
                        <Badge
                          className="align-middle text-xs"
                          key={interest.name}
                        >
                          {interest.name}
                        </Badge>
                      );
                    })}
                  </div>
                </Section>
              )}

              {PARSED_DATA.references && (
                <Section>
                  <h2 className="text-xl font-bold">References</h2>
                  {PARSED_DATA.references.map((reference) => {
                    return (
                      <Card key={reference.name}>
                        <CardHeader>
                          <h3 className="font-semibold leading-none">
                            {reference.name}
                          </h3>
                        </CardHeader>
                        <CardContent className="mt-2 text-xs">
                          {reference.reference}
                        </CardContent>
                      </Card>
                    );
                  })}
                </Section>
              )}
            </section>
          )}
        </main>
      </div>
    </>
  );
}
