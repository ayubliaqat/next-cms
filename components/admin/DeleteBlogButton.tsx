// components/admin/DeleteBlogButton.tsx
"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteBlogPost } from "@/app/actions/BlogActions";
import { toast } from "sonner";

export default function DeleteBlogButton({ id, title }: { id: string; title: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Standard browser confirmation
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setIsDeleting(true);
    try {
      const result = await deleteBlogPost(id);
      if (result.success) {
        toast.success("Post removed");
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error("Could not delete post");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
      title="Delete Post"
    >
      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
    </button>
  );
}