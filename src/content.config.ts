import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    role: z.string(),
    awardBadge: z.string().optional(),
    stack: z.array(z.string()),
    repoUrl: z.string().url(),
    commit: z.string().optional(),
    shot: z.string().optional(),
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

export const collections = { projects, awards, education };