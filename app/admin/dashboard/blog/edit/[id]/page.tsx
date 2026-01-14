import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import EditFormWrapper from "@/components/admin/EditFormWrapper"; // Adjust path

interface EditPageProps {
  params: Promise<{ id: string }>; // Change: define as a Promise
}

export default async function EditBlogPostPage({ params }: EditPageProps) {
  // FIX: Unwrapping the params before using them
  const { id } = await params; 

  await connectDB();
  
  // Now you use the unwrapped 'id'
  const post = await Blog.findById(id).lean();

  if (!post) {
    notFound();
  }

  // Transform database data back for the form
  const initialData = {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category,
    author: post.author,
    coverImage: post.coverImage,
    metaTitle: post.seo?.metaTitle || "",
    metaDescription: post.seo?.metaDescription || "",
    keywords: post.seo?.keywords?.join(", ") || "", 
    ogImage: post.seo?.ogImage || "",
    canonical: post.seo?.canonical || "",
    noIndex: !post.indexControl?.isSearchable,
    isPublished: post.isPublished || false,
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6">
      <EditFormWrapper id={id} initialData={initialData} />
    </div>
  );
}