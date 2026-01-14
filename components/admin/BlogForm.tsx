"use client";

import React, { useState, useRef, useEffect } from "react";
import TiptapEditor from "./TiptapEditor";
import {
  Save,
  ArrowLeft,
  Globe,
  Loader2,
  RefreshCcw,
  Settings,
  Image as ImageIcon,
  FileText,
  User,
  Upload,
  ShieldCheck,
  EyeOff,
  Link2,
  Clock,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

// 1. DATA STRUCTURE DEFINITION
export interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  coverImage: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonical: string;
  isPublished: boolean;
  noIndex: boolean;
}

interface BlogFormProps {
  initialData?: BlogFormData;
  onSubmit: (data: BlogFormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function BlogForm({
  initialData,
  onSubmit,
  isSubmitting,
}: BlogFormProps) {
  // 2. STATE INITIALIZATION
  const [formData, setFormData] = useState<BlogFormData>(
    initialData || {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "Sustainability",
      author: "Admin",
      coverImage: "",
      metaTitle: "",
      metaDescription: "",
      keywords: "",
      ogImage: "",
      canonical: "",
      isPublished: false,
      noIndex: false,
    }
  );

  const [isSlugCustomized, setIsSlugCustomized] = useState(!!initialData);
  const [isAuthorAdmin, setIsAuthorAdmin] = useState(
    initialData?.author === "Admin" || !initialData
  );

  const coverInputRef = useRef<HTMLInputElement>(null);
  const ogInputRef = useRef<HTMLInputElement>(null);

  // 3. LOGIC HELPERS
  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const noHtmlText = text.replace(/<[^>]*>?/gm, "");
    const words = noHtmlText.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev: BlogFormData) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "title" && !isSlugCustomized) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof BlogFormData
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: BlogFormData) => ({
          ...prev,
          [field]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
      className="max-w-7xl mx-auto pb-24 space-y-8 text-slate-900 px-4"
    >
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center py-6 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/dashboard/blog"
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-bold leading-tight">
              {initialData ? "Update Post" : "Create Post"}
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Post Management
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-blue-500 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-green-100 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {initialData ? "Update Blog" : "Publish Blog"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* --- LEFT: EDITOR AREA --- */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4 bg-white p-2 rounded-xl">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Main Catchy Title..."
              className="w-full text-5xl font-black focus:outline-none placeholder:text-slate-200 bg-transparent tracking-tight"
              required
            />
            <div className="flex items-center gap-2 text-sm text-slate-400 border-b border-slate-100 pb-4">
              <Globe size={14} />{" "}
              <span className="opacity-50">naturapick.com/blog/</span>
              <input
                name="slug"
                value={formData.slug}
                onChange={(e) => {
                  setIsSlugCustomized(true);
                  handleChange(e);
                }}
                className="focus:outline-none font-bold text-green-600 flex-1 bg-transparent"
              />
              {isSlugCustomized && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSlugCustomized(false);
                    setFormData((p) => ({ ...p, slug: generateSlug(p.title) }));
                  }}
                >
                  <RefreshCcw
                    size={14}
                    className="hover:rotate-180 transition-all duration-500"
                  />
                </button>
              )}
            </div>
          </div>

          <div className="rounded-3xl shadow-sm overflow-hidden border border-slate-200 bg-white">
            <TiptapEditor
              content={formData.content}
              onChange={(val: string) =>
                setFormData((prev: BlogFormData) => ({ ...prev, content: val }))
              }
            />
            <div className="flex items-center gap-6 px-8 py-4 bg-slate-50 border-t border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <BarChart3 size={14} />{" "}
                {formData.content.replace(/<[^>]*>?/gm, "").length} Chars
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} /> {getReadingTime(formData.content)} Min Read
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: SIDEBAR --- */}
        <div className="lg:col-span-4 space-y-6 sticky top-28">
          {/* PUBLISHING */}
          <div className="p-6 border border-slate-200 rounded-3xl bg-white space-y-5 shadow-sm">
            <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
              Visibility
            </h3>
            <label className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100">
              <span className="text-sm font-bold">Publicly Live</span>
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="w-10 h-5 accent-green-600"
              />
            </label>
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  Author: {isAuthorAdmin ? "Admin" : "Custom"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsAuthorAdmin(!isAuthorAdmin);
                    setFormData((p: any) => ({
                      ...p,
                      author: !isAuthorAdmin ? "Admin" : "",
                    }));
                  }}
                  className={`w-8 h-4 rounded-full relative transition-colors ${
                    isAuthorAdmin ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                      isAuthorAdmin ? "left-4.5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              {!isAuthorAdmin && (
                <input
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Name"
                  className="w-full border border-slate-200 p-3 rounded-xl text-sm"
                />
              )}
            </div>
          </div>

          {/* MEDIA ASSETS */}
          <div className="p-6 border border-slate-200 rounded-3xl bg-white space-y-6 shadow-sm">
            <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
              Images
            </h3>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                <span>Cover Image</span>{" "}
                <span className="text-blue-500">PC or URL</span>
              </label>
              <div className="group relative aspect-video bg-slate-100 rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center">
                {formData.coverImage ? (
                  <img
                    src={formData.coverImage}
                    className="w-full h-full object-cover"
                    alt="Cover"
                  />
                ) : (
                  <ImageIcon className="text-slate-300" />
                )}
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-2"
                >
                  <Upload size={14} /> Upload
                </button>
                <input
                  type="file"
                  ref={coverInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "coverImage")}
                />
              </div>
              <input
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="Image URL..."
                className="w-full border border-slate-100 p-2.5 rounded-xl text-[10px] bg-slate-50 shadow-inner"
              />
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 mt-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex justify-between">
                <span>Social Share (OG)</span>{" "}
                <span className="text-blue-500">PC or URL</span>
              </label>
              <div className="group relative h-20 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
                {formData.ogImage ? (
                  <img
                    src={formData.ogImage}
                    className="w-full h-full object-cover"
                    alt="OG"
                  />
                ) : (
                  <span className="text-[10px] font-bold text-slate-300">
                    OG
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => ogInputRef.current?.click()}
                  className="absolute inset-0 bg-blue-600/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold gap-2"
                >
                  <Upload size={14} /> Upload
                </button>
                <input
                  type="file"
                  ref={ogInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "ogImage")}
                />
              </div>
              <input
                name="ogImage"
                value={formData.ogImage}
                onChange={handleChange}
                placeholder="OG URL..."
                className="w-full border border-slate-100 p-2.5 rounded-xl text-[10px] bg-slate-50 shadow-inner"
              />
            </div>
          </div>

          {/* SEO ENGINE */}
          <div className="p-6 border border-slate-200 rounded-3xl bg-white space-y-5 shadow-sm">
            <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
              <Settings size={14} /> SEO Engine
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <label className="text-slate-500 uppercase">Meta Title</label>
                  <span
                    className={
                      formData.metaTitle.length > 60
                        ? "text-red-500"
                        : "text-green-600"
                    }
                  >
                    {formData.metaTitle.length}/60
                  </span>
                </div>
                <input
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className="w-full border border-slate-200 p-3 rounded-xl text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <label className="text-slate-500 uppercase">
                    Meta Description
                  </label>
                  <span
                    className={
                      formData.metaDescription.length > 160
                        ? "text-red-500"
                        : "text-green-600"
                    }
                  >
                    {formData.metaDescription.length}/160
                  </span>
                </div>
                <textarea
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-slate-200 p-3 rounded-xl text-xs outline-none resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                  <Link2 size={10} /> Canonical URL
                </label>
                <input
                  name="canonical"
                  value={formData.canonical}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-slate-200 p-3 rounded-xl text-xs outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Keywords
                </label>
                <input
                  name="keywords"
                  value={formData.keywords}
                  onChange={handleChange}
                  placeholder="key, words, separated..."
                  className="w-full border border-slate-200 p-3 rounded-xl text-xs outline-none"
                />
              </div>
              <label className="flex items-center gap-3 p-3 bg-red-50 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  name="noIndex"
                  checked={formData.noIndex}
                  onChange={handleChange}
                  className="w-4 h-4 accent-red-600"
                />
                <span className="text-[11px] font-bold text-red-700 flex items-center gap-1">
                  <EyeOff size={12} /> Disable Search Indexing
                </span>
              </label>
            </div>
          </div>

          {/* LISTING DETAILS */}
          <div className="p-6 border border-slate-200 rounded-3xl bg-white space-y-4 shadow-sm">
            <h3 className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
              Listing Details
            </h3>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-slate-200 p-3 rounded-xl text-sm outline-none bg-white focus:border-green-500 transition-all cursor-pointer"
              >
                <option value="Sustainability">Sustainability</option>
                <option value="Organic Living">Organic Living</option>
                <option value="Urban Leaf Tips">Urban Leaf Tips</option>
                <option value="Health Benefits">Health Benefits</option>
                <option value="Recipes">Recipes</option>
                <option value="Sourcing Stories">Sourcing Stories</option>
                <option value="Nutritional Science">Nutritional Science</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">
                  Excerpt
                </label>
                <span
                  className={`text-[9px] font-bold uppercase tracking-tighter ${
                    formData.excerpt.length > 200
                      ? "text-red-500"
                      : "text-slate-400"
                  }`}
                >
                  {formData.excerpt.length}/200 chars
                </span>
              </div>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                rows={4}
                placeholder="Brief summary..."
                className="w-full border border-slate-200 p-4 rounded-2xl text-xs outline-none resize-none bg-slate-50 focus:bg-white transition-all shadow-inner"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
