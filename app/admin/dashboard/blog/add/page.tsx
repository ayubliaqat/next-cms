"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm"; // Adjust path
import { createBlogPost } from '@/app/actions/BlogActions'; // Adjust path
import { toast } from "sonner"; // Or your preferred toast library

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePublish = async (formData: any) => {
    setLoading(true);
    
    const result = await createBlogPost(formData);

    if (result.success) {
      toast.success("Story published successfully!");
      router.push("/admin/dashboard/blog");
      router.refresh();
    } else {
      toast.error("Error: " + result.error);
    }
    
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto py-12">
        <BlogForm 
          onSubmit={handlePublish} 
          isSubmitting={loading} 
        />
      </div>
    </main>
  );
}