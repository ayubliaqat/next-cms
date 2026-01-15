import { notFound } from "next/navigation";
import { getBlogPostById } from "@/app/actions/BlogActions";
import EditFormWrapper from "@/components/admin/EditFormWrapper";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: EditPageProps) {
  // 1. Unwrap the params to get the ID
  const { id } = await params;

  // 2. Fetch the post using our perfected Action
  // This automatically flattens seo.metaTitle -> metaTitle
  // and converts indexControl.isSearchable -> isSearchable
  const post = await getBlogPostById(id);

  // 3. Handle 404 if the post doesn't exist
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto py-12 px-6">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Edit Story
          </h1>
          <p className="text-slate-500 font-medium">
            Refining: <span className="text-blue-600">{post.title}</span>
          </p>
        </div>

        {/* 4. Pass the already-flattened post data to the Wrapper */}
        <EditFormWrapper id={id} initialData={post} />
      </div>
    </main>
  );
}