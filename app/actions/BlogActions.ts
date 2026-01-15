"use server";

import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { BlogSchema } from "@/lib/validations/zod";
import { revalidatePath } from "next/cache";

export type ActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  error: string;
  data?: T;
};

// --- HELPER: DATA TRANSFORMATION ---
const transformFormData = (rawData: any) => {
  const processedKeywords =
    typeof rawData.keywords === "string" && rawData.keywords.trim() !== ""
      ? rawData.keywords
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean)
      : [];

  return {
    ...rawData,
    // HTML Checkboxes send "on" if checked, undefined if not
    isPublished: rawData.isPublished === "on" || rawData.isPublished === true,
    seo: {
      metaTitle: rawData.metaTitle || rawData.title,
      metaDescription: rawData.metaDescription || "",
      keywords: processedKeywords,
      ogImage: rawData.ogImage || rawData.coverImage || "",
      canonical: rawData.canonical || "",
    },
    indexControl: {
      // Logic: If searchable is "on", it's true.
      isSearchable:
        rawData.isSearchable === "on" || rawData.isSearchable === true,
      isFeatured: rawData.isFeatured === "on" || rawData.isFeatured === true,
    },
  };
};

// --- CREATE ---
export async function createBlogPost(
  rawData: any
): Promise<ActionResponse<string>> {
  try {
    await connectDB();
    const nestedData = transformFormData(rawData);
    const validatedData = BlogSchema.parse(nestedData);

    const result = await Blog.create(validatedData);

    revalidatePath("/admin/dashboard/blog");
    revalidatePath("/blog");

    return {
      success: true,
      message: "Journal entry published successfully!",
      error: "",
      data: result.slug,
    };
  } catch (e: any) {
    return handleActionError(e);
  }
}

// --- UPDATE ---
export async function updateBlogPost(
  id: string,
  rawData: any
): Promise<ActionResponse<string>> {
  try {
    await connectDB();
    const nestedData = transformFormData(rawData);
    const validatedData = BlogSchema.parse(nestedData);

    const result = await Blog.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!result)
      return { success: false, message: "", error: "Post not found" };

    revalidatePath("/admin/dashboard/blog");
    revalidatePath(`/blog/${validatedData.slug}`);

    return { success: true, message: "Updated successfully!", error: "" };
  } catch (e: any) {
    return handleActionError(e);
  }
}

// --- ERROR HANDLER ---
function handleActionError(e: any): ActionResponse<string> {
  console.error("Action Error:", e);

  if (e.name === "ZodError") {
    return {
      success: false,
      message: "",
      error: e.errors[0]?.message || "Validation failed",
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
    error: e.message || "An unexpected error occurred",
  };
}
// --- GET BY ID (With Flattening for the Form) ---
export async function getBlogPostById(id: string) {
  try {
    await connectDB();
    // 1. Fetch from DB
    const post = await Blog.findById(id).lean();
    if (!post) return null;

    // 2. Convert to plain object (removes Mongoose BSON types)
    const data = JSON.parse(JSON.stringify(post));

    // 3. FULL ALIGNMENT: Flatten nested objects into top-level form fields
    return {
      ...data,
      // Stringify the ID so the form can store it in a hidden input
      _id: data._id.toString(),

      // SEO Flattening
      metaTitle: data.seo?.metaTitle || "",
      metaDescription: data.seo?.metaDescription || "",
      keywords: Array.isArray(data.seo?.keywords)
        ? data.seo.keywords.join(", ")
        : "",
      ogImage: data.seo?.ogImage || "",
      canonical: data.seo?.canonical || "",

      // Control Flattening (Crucial for Checkboxes)
      isPublished: data.isPublished ?? false,
      isSearchable: data.indexControl?.isSearchable ?? true,
      isFeatured: data.indexControl?.isFeatured ?? false,
    };
  } catch (e) {
    console.error("Fetch Error:", e);
    return null;
  }
}

// ... rest of your actions (delete, getBlogPosts) remain the same
// --- DELETE ---
export async function deleteBlogPost(id: string) {
  try {
    await connectDB();

    // 1. Check if the post exists to get the slug for revalidation
    const post = await Blog.findById(id);
    if (!post) {
      return { success: false, message: "", error: "Post not found" };
    }

    // 2. Perform deletion
    await Blog.findByIdAndDelete(id);

    // 3. Clear the cache for the dashboard and the specific blog list/post
    revalidatePath("/admin/dashboard/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);

    // Match the return style of your other actions
    return { success: true, message: "Post deleted successfully", error: "" };
  } catch (e: any) {
    console.error("Delete Error:", e);
    return {
      success: false,
      message: "",
      error: e.message || "Failed to delete the post",
    };
  }
}
// --- GET BY SLUG (Public View) ---
export async function getBlogPostBySlug(slug: string) {
  try {
    await connectDB();

    // 1. Fetch the post
    const post = await Blog.findOne({ slug }).lean();

    if (!post) return null;

    // 2. Convert to plain object
    const data = JSON.parse(JSON.stringify(post));

    // 3. For public viewing, we return the nested structure as-is
    // because your frontend component will access it via:
    // <h1>{post.title}</h1>
    // <title>{post.seo.metaTitle}</title>
    return data;
  } catch (e) {
    console.error("Error fetching blog post for view:", e);
    return null;
  }
}
