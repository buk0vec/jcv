import { z } from "zod";

/*
    Extension of the JSONResume format
    https://jsonresume.org/schema/
    Changes:
    - Updated a bunch of stuff that isn't necessary to be optional.
    - Added optional location url.
    - Added optional initials for photo fallback.

    Todo:
    - Try to only make the real required things required and everything else optional.
    - Add proper validation for start dates and optional end dates 
      (ex. current position, projects with only one month, projects w/ only end dates).
    - More flexible date parsing.
*/

const reservedPaths = ["api"];

export const usernameSchema = z
  .string()
  .min(3)
  .regex(
    /^[a-z0-9\-\_]+$/i,
    "Username can only contain letters, numbers, dashes, and underscores.",
  )
  .refine((data) => !reservedPaths.includes(data), "Bad username");

export const schema = z.object({
  meta: z
    .object({
      canonical: z.string().optional(),
      version: z.string().optional(),
      lastModified: z.string().optional(),
      theme: z.string().optional(),
    })
    .optional(),
  $schema: z.string().optional(),
  basics: z.object({
    name: z.string(),
    label: z.string(),
    image: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    url: z.string().optional(),
    initials: z.string().optional(),
    summary: z.string().optional(),
    location: z
      .object({
        address: z.string().optional(),
        postalCode: z.string().optional(),
        city: z.string().optional(),
        countryCode: z.string().optional(),
        region: z.string().optional(),
        url: z.string().url().optional(),
      })
      .optional(),
    profiles: z
      .array(
        z.object({
          network: z.string(),
          username: z.string().optional(),
          url: z.string(),
        }),
      )
      .optional(),
  }),
  work: z.array(
    z.object({
      name: z.string(),
      position: z.string(),
      url: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      summary: z.string(),
      highlights: z.array(z.string()).optional(),
      badges: z.array(z.string()).optional(),
    }),
  ),
  volunteer: z
    .array(
      z.object({
        organization: z.string(),
        position: z.string(),
        url: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        summary: z.string(),
        highlights: z.array(z.string()),
      }),
    )
    .optional(),
  education: z
    .array(
      z.object({
        institution: z.string(),
        url: z.string().optional(),
        area: z.string(),
        studyType: z.string(),
        startDate: z.string(),
        endDate: z.string(),
        score: z.string().optional(),
        courses: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  awards: z
    .array(
      z.object({
        title: z.string(),
        date: z.string().optional(),
        awarder: z.string(),
        summary: z.string().optional(),
      }),
    )
    .optional(),
  certificates: z
    .array(
      z.object({
        name: z.string(),
        date: z.string(),
        issuer: z.string(),
        url: z.string(),
      }),
    )
    .optional(),
  publications: z
    .array(
      z.object({
        name: z.string(),
        publisher: z.string(),
        releaseDate: z.string(),
        url: z.string(),
        summary: z.string(),
      }),
    )
    .optional(),
  skills: z
    .array(
      z.object({
        name: z.string(),
        level: z.string().optional(),
        keywords: z.array(z.string()).optional(),
      }),
    )
    .optional(),
  languages: z
    .array(z.object({ language: z.string(), fluency: z.string().optional() }))
    .optional(),
  interests: z
    .array(
      z.object({ name: z.string(), keywords: z.array(z.string()).optional() }),
    )
    .optional(),
  references: z
    .array(z.object({ name: z.string(), reference: z.string() }))
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        description: z.string(),
        highlights: z.array(z.string()).optional(),
        url: z.string().optional(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .optional(),
});

export type Resume = z.infer<typeof schema>;
