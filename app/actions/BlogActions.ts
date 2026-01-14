"use server";

import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { BlogSchema } from "@/lib/validations/zod"; // Import your Zod schema
import { revalidatePath } from "next/cache";

export type ActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  error: string;
  data?: T;
};

// --- CREATE ---
export async function createBlogPost(
  rawData: any
): Promise<ActionResponse<string>> {
  try {
    await connectDB();

    // 1. DATA TRANSFORMATION
    const processedKeywords =
      typeof rawData.keywords === "string"
        ? rawData.keywords
            .split(",")
            .map((k: string) => k.trim())
            .filter((k: string) => k !== "")
        : [];

    const nestedData = {
      ...rawData,
      // FIX: Ensure isPublished is captured as a Boolean
      isPublished: !!rawData.isPublished,
      seo: {
        metaTitle: rawData.metaTitle || rawData.title,
        metaDescription: rawData.metaDescription || "",
        keywords: processedKeywords,
        ogImage: rawData.ogImage || rawData.coverImage || "",
        canonical: rawData.canonical || "",
      },
      indexControl: {
        isSearchable: rawData.noIndex === undefined ? true : !rawData.noIndex,
        isFeatured: !!rawData.isFeatured,
      },
    };

    // 2. ZOD VALIDATION
    const validatedData = BlogSchema.parse(nestedData);

    // 3. DATABASE PERSISTENCE
    const result = await Blog.create(validatedData);

    // 4. CACHE REVALIDATION
    revalidatePath("/admin/dashboard/blog");
    revalidatePath("/blog");

    return {
      success: true,
      message: "Journal entry published successfully!",
      error: "",
      data: result.slug,
    };
  } catch (e: any) {
    return handleActionError(e); // Using a helper for cleaner code
  }
}

// --- UPDATE ---
export async function updateBlogPost(id: string, rawData: any) {
  try {
    await connectDB();

    // 1. DATA TRANSFORMATION
    const processedKeywords =
      typeof rawData.keywords === "string"
        ? rawData.keywords
            .split(",")
            .map((k: string) => k.trim())
            .filter(Boolean)
        : [];

    const nestedData = {
      ...rawData,
      // FIX: Ensure isPublished is captured as a Boolean
      isPublished: !!rawData.isPublished,
      seo: {
        metaTitle: rawData.metaTitle || rawData.title,
        metaDescription: rawData.metaDescription || "",
        keywords: processedKeywords,
        ogImage: rawData.ogImage || rawData.coverImage || "",
        canonical: rawData.canonical || "",
      },
      indexControl: {
        isSearchable: rawData.noIndex === undefined ? true : !rawData.noIndex,
        isFeatured: !!rawData.isFeatured,
      },
    };

    // 2. Validate
    const validatedData = BlogSchema.parse(nestedData);

    // 3. Update
    await Blog.findByIdAndUpdate(id, validatedData, { new: true });

    revalidatePath("/admin/dashboard/blog");
    revalidatePath(`/blog/${validatedData.slug}`);

    return { success: true, message: "Updated successfully!" };
  } catch (e: any) {
    return handleActionError(e);
  }
}

// --- ERROR HANDLING HELPER ---
function handleActionError(e: any) {
  console.error("Action Error:", e);

  if (e.name === "ZodError") {
    return {
      success: false,
      message: "",
      error: e.errors[0]?.message || "Validation failed",
    };
  }

  if (e.name === "ValidationError") {
    const firstError = Object.values(e.errors)[0] as any;
    return {
      success: false,
      message: "",
      error: firstError?.message || "Database validation failed",
    };
  }

  if (e.code === 11000) {
    return {
      success: false,
      message: "",
      error: "A post with this title or slug already exists.",
    };
  }

  return {
    success: false,
    message: "",
    error: e.message || "An unexpected server error occurred",
  };
}
// --- GET BY ID (With Flattening for the Form) ---
export async function getBlogPostById(id: string) {
  try {
    await connectDB();
    const post = await Blog.findById(id).lean();
    if (!post) return null;

    const data = JSON.parse(JSON.stringify(post));

    // IMPORTANT: Flatten the nested SEO/Control objects so the Form can read them
    return {
      ...data,
      metaTitle: data.seo?.metaTitle || "",
      metaDescription: data.seo?.metaDescription || "",
      keywords: data.seo?.keywords?.join(", ") || "",
      ogImage: data.seo?.ogImage || "",
      canonical: data.seo?.canonical || "",
      noIndex: !data.indexControl?.isSearchable,
    };
  } catch (e) {
    return null;
  }
}

// ... rest of your actions (delete, getBlogPosts) remain the same
// --- DELETE ---
export async function deleteBlogPost(id: string) {
  try {
    await connectDB();

    // 1. Check if the post exists
    const post = await Blog.findById(id);
    if (!post) {
      return { success: false, error: "Post not found" };
    }

    // 2. Perform deletion
    await Blog.findByIdAndDelete(id);

    // 3. Clear the cache for the dashboard and the specific blog post URL
    revalidatePath("/admin/dashboard/blog");
    revalidatePath(`/blog/${post.slug}`);

    return { success: true, message: "Post deleted successfully" };
  } catch (e: any) {
    console.error("Delete Error:", e);
    return { success: false, error: "Failed to delete the post" };
  }
}
// --- GET BY SLUG (Public View) ---
export async function getBlogPostBySlug(slug: string) {
  try {
    await connectDB();
    const post = await Blog.findOne({ slug }).lean();
    return post ? JSON.parse(JSON.stringify(post)) : null;
  } catch (e) {
    return null;
  }
}
