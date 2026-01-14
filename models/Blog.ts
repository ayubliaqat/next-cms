import mongoose, { Schema, model, models } from "mongoose";
import { IBlogPost } from "@/types/blog";

/**
 * FINAL AUDIT:
 * 1. Core Content with 7-Category Enum
 * 2. Nested SEO Object (Array for Keywords)
 * 3. Index/Crawl Controls
 * 4. Development Cache Clearing (Fixes Enum Errors)
 */

const BlogSchema = new Schema<IBlogPost>(
  {
    // --- CORE CONTENT ---
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      // MUST MATCH YOUR FRONTEND DROPDOWN EXACTLY
      enum: [
        "Sustainability",
        "Organic Living",
        "Urban Leaf Tips",
        "Health Benefits",
        "Recipes",
        "Sourcing Stories",
        "Nutritional Science",
      ],
    },
    author: {
      type: String,
      default: "NaturaPick Team",
    },

    // --- MEDIA & BODY ---
    coverImage: {
      type: String,
      required: [true, "A cover image is required"],
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },

    // --- GROUPED SEO ---
    seo: {
      metaTitle: { type: String, trim: true },
      metaDescription: { type: String, maxlength: 160 },
      keywords: [{ type: String }], // Array of strings
      ogImage: { type: String },
      canonical: { type: String },
    },

    // --- GOOGLE CRAWL & FEATURED CONTROLS ---
    indexControl: {
      isSearchable: {
        type: Boolean,
        default: true,
      },
      isFeatured: {
        type: Boolean,
        default: false,
      },
    },

    // --- METADATA ---
    isPublished: {
      type: Boolean,
      default: false, // Default to Draft for safety
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// --- CACHE BUSTER FOR NEXT.JS DEVELOPMENT ---
// This prevents the "ValidatorError: ... is not a valid enum value"
// by clearing the model from Mongoose's internal memory.
if (process.env.NODE_ENV === "development") {
  delete mongoose.models.Blog;
}

const Blog = models.Blog || model<IBlogPost>("Blog", BlogSchema);
export default Blog;
