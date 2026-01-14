import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { MoveRight } from "lucide-react";

async function getPublishedBlogs() {
  await connectDB();
  const data = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 }).lean();
  return JSON.parse(JSON.stringify(data));
}

export default async function BlogListingPage() {
  const blogs = await getPublishedBlogs();

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-green-100">
      {/* COMPACT STACKED HEADER */}
      <header className="bg-white border-b border-slate-200/60 py-10">
        <div className="max-w-[1400px] mx-auto px-6 text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Journal<span className="text-green-600">.</span>
          </h1>
          <p className="text-slate-500 text-[13px] md:text-sm max-w-xl mt-2 leading-relaxed font-medium">
            Documenting our journey toward a greener, healthier urban lifestyle through research, recipes, and sustainable living.
          </p>
          <div className="flex gap-4 mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 justify-center md:justify-start">
            <span>{blogs.length} Stories</span>
            <span>•</span>
            <span>Est. 2026</span>
          </div>
        </div>
      </header>

      {/* COMPACT & RESPONSIVE GRID */}
      <main className="max-w-[1400px] mx-auto px-6 py-10">
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {blogs.map((post: any) => (
              <Link 
                key={post._id} 
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white rounded-xl p-2.5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300"
              >
                {/* Image: Narrower Cinematic Ratio for shorter height */}
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-slate-50 mb-3">
                  <img 
                    src={post.coverImage} 
                    alt="" 
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-2 left-2">
                     <span className="px-2 py-0.5 bg-white/90 backdrop-blur text-slate-900 text-[8px] font-black uppercase rounded tracking-tighter shadow-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Card Content: Tightened Spacing */}
                <div className="flex flex-col flex-grow px-1 pb-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="w-0.5 h-0.5 rounded-full bg-slate-200" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      5 min read
                    </span>
                  </div>
                  
                  <h2 className="text-[15px] font-bold text-slate-800 leading-tight group-hover:text-green-600 transition-colors line-clamp-2 mb-1.5">
                    {post.title}
                  </h2>
                  
                  <p className="text-slate-500 text-[12px] line-clamp-2 leading-snug mb-3">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-2.5">
                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">
                      View Story
                    </span>
                    <MoveRight size={12} className="text-green-600 transition-all group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No entries found.</p>
          </div>
        )}
      </main>
    </div>
  );
}