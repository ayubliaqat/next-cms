// components/admin/EditFormWrapper.tsx
"use client";

import BlogForm from "./BlogForm";
import { updateBlogPost } from "@/app/actions/BlogActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function EditFormWrapper({ id, initialData }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await updateBlogPost(id, data);
      if (result.success) {
        toast.success("Post updated successfully!");
        router.push("/admin/dashboard/blog");
        router.refresh();
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BlogForm 
      initialData={initialData} 
      onSubmit={handleSubmit} 
      isSubmitting={isSubmitting} 
    />
  );
}