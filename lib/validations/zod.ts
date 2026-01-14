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
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  slug: z.string().min(1, "Slug is required"),
  category: z.enum(BLOG_CATEGORIES, {
    message: "Please select a valid category",
  }),
  author: z.string().min(2, "Author name required").default("NaturaPick Team"),

  // NEW: Add this to track Live/Draft status
  isPublished: z.boolean().default(false), 

  coverImage: z.string().min(1, "Cover image is required"), 
  excerpt: z.string().min(10, "Excerpt is too short").max(200),
  content: z.string().min(20, "Content body is too short"),

  seo: z.object({
    metaTitle: z.string().max(70).optional().or(z.literal("")),
    metaDescription: z.string().max(160).optional().or(z.literal("")),
    keywords: z.array(z.string()).default([]), 
    ogImage: z.string().optional().or(z.literal("")),
    canonical: z.string().optional().or(z.literal("")),
  }),

  indexControl: z.object({
    isSearchable: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
  }),

  publishedAt: z.union([z.date(), z.string()]).optional().default(() => new Date()),
});