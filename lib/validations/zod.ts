import { z } from "zod";

export const BLOG_CATEGORIES = [
  "Sustainability",
  "Organic Living",
  "Urban Leaf Tips",
  "Health Benefits",
  "Recipes",
  "Sourcing Stories",
  "Nutritional Science",
] as const;

export const BlogSchema = z.object({
  // --- CORE CONTENT ---
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  slug: z.string().min(1, "Slug is required"),
  category: z.enum(BLOG_CATEGORIES, {
    message: "Please select a valid category",
  }),
  author: z.string().default("NaturaPick Team"),

  // --- MEDIA & BODY ---
  coverImage: z.string().optional().default(""), 
  excerpt: z.string().max(200).optional().default(""),
  content: z.string().min(20, "Content body is too short"),

  // --- LIVE STATUS ---
  isPublished: z.boolean().default(false),

  // --- NESTED SEO ---
  seo: z.object({
    metaTitle: z.string().max(70).optional().default(""),
    metaDescription: z.string().max(160).optional().default(""),
    keywords: z.array(z.string()).default([]), 
    ogImage: z.string().optional().default(""),
    canonical: z.string().optional().default(""),
  }).default({
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    ogImage: "",
    canonical: ""
  }),

  // --- NESTED CONTROLS ---
  indexControl: z.object({
    isSearchable: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
  }).default({
    isSearchable: true,
    isFeatured: false
  }),

  publishedAt: z.union([z.date(), z.string()]).optional().default(() => new Date()),
});

export type BlogFormValues = z.infer<typeof BlogSchema>;