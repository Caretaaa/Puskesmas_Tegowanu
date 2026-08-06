import { defineCollection, z } from 'astro:content';

const berita = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: z.string(),
    excerpt: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { berita };