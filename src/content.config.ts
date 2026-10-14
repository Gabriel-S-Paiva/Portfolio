import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.string(),
    role: z.string(),
    awardBadge: z.string().optional(),
    stack: z.array(z.string()),
    repoUrl: z.url().optional(),
    commit: z.string(),
    shot: z.string().optional(),
    order: z.number().optional(),
    // Shown as a Work card on the landing page. Keep in sync with published case studies.
    featured: z.boolean().default(true),
  }),
});

const awards = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/awards' }),
  schema: z.object({
    title: z.string(),
    issuer: z.string(),
    date: z.string(),
    year: z.string(),
    order: z.number(),
    commit: z.string().optional(),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: '**/*.md', base: 'src/content/education' }),
  schema: z.object({
    degree: z.string(),
    school: z.string(),
    dates: z.string(),
    details: z.string(),
    order: z.number(),
    commit: z.string().optional(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/case-studies' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    // id of the matching entry in the `projects` collection (reuses role, stack, award, repo)
    project: z.string(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
  }),
});

const repos = defineCollection({
  loader: file('./src/content/repos.json'),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.url(),
    language: z.string(),
    kind: z.enum(['solo', 'team', 'hackathon', 'course']),
    year: z.string(),
    // id of a published case study, when one exists
    study: z.string().optional(),
    archived: z.boolean().default(false),
  }),
});

export const collections = { projects, awards, education, caseStudies, repos };