import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { MoveLeft, Clock, User, Calendar } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  
  await connectDB();
  const post = await Blog.findOne({ slug, isPublished: true }).lean();

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white selection:bg-green-100">
      {/* MINIMAL NAV */}
      <nav className="border-b border-slate-50 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 flex justify-between items-center">
          <Link href="/blog" className="flex items-center gap-2 text-slate-400 hover:text-green-600 transition-colors text-[10px] font-bold uppercase tracking-widest">
            <MoveLeft size={14} /> Back to Journal
          </Link>
          <div className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">
            NaturaPick<span className="text-green-600">.</span>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        {/* HEADER SECTION */}
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6 tracking-tight">
            {post.title}
          </h1>

          {/* REFINED METADATA BAR - Now below the title */}
          <div className="flex flex-wrap items-center gap-y-4 gap-x-6 pt-6 border-t border-slate-100">
            {/* Author */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <User size={12} />
              </div>
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">
                {post.author}
              </span>
            </div>

            <span className="hidden md:block w-1 h-1 rounded-full bg-slate-200" />

            {/* Date */}
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-tight">
              <Calendar size={13} />
              {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>

            <span className="w-1 h-1 rounded-full bg-slate-200" />

            {/* Category */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black text-green-600 uppercase tracking-tight">
                {post.category}
              </span>
            </div>

            <span className="w-1 h-1 rounded-full bg-slate-200" />

            {/* Read Time */}
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-tight">
              <Clock size={13} />
              5 Min Read
            </div>
          </div>
        </header>

        {/* FEATURED IMAGE */}
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-12 shadow-sm border border-slate-100">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* EXCERPT / INTRO */}
        <div className="mb-10">
            <p className="text-xl text-slate-500 font-medium leading-relaxed italic border-l-2 border-green-500 pl-6">
                {post.excerpt}
            </p>
        </div>

        {/* MAIN CONTENT */}
        <div 
          className="prose prose-slate prose-lg max-w-none 
            prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
            prose-p:text-slate-600 prose-p:leading-relaxed
            prose-strong:text-slate-900
            prose-blockquote:border-none prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-2xl prose-blockquote:text-slate-700
            prose-img:rounded-2xl"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {/* ARTICLE FOOTER */}
        <footer className="mt-20 pt-10 border-t border-slate-100 flex flex-col items-center">
          <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-8">End of Journal</div>
          <Link 
            href="/blog" 
            className="group flex items-center gap-3 text-slate-900 font-black uppercase text-xs tracking-widest hover:text-green-600 transition-colors"
          >
            <MoveLeft size={16} className="transition-transform group-hover:-translate-x-1" /> View all stories
          </Link>
        </footer>
      </article>
    </div>
  );
}