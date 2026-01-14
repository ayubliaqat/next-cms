import Link from "next/link";
import { Plus, Edit, ExternalLink, Search } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import DeleteBlogButton from "@/components/admin/DeleteBlogButton";

async function getBlogs() {
  await connectDB();
  // Using .lean() for performance and converting to plain objects
  const data = await Blog.find().sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(data));
}

export default async function BlogDashboard() {
  const blogs = await getBlogs();

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Journal Manager
          </h1>
          <p className="text-slate-500 font-medium">
            Manage your UrbanLeaf stories and SEO
          </p>
        </div>
        <Link
          href="/admin/dashboard/blog/add"
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-green-100 active:scale-95"
        >
          <Plus size={18} /> New Entry
        </Link>
      </div>

      {/* COMPACT TABLE CONTAINER */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col">
        {/* FIXED THEAD */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest w-[40%]">
                Post Details
              </th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest w-[20%]">
                Category
              </th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest w-[15%] text-center">
                Status
              </th>
              <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest w-[25%] text-right">
                Actions
              </th>
            </tr>
          </thead>
        </table>

        {/* SCROLLABLE TBODY - Height limited to ~500px (approx 6-7 blogs visible) */}
        <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-slate-50">
              {blogs.map((post: any) => (
                <tr
                  key={post._id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="p-4 w-[40%]">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 flex-shrink-0">
                        <img
                          src={post.coverImage || "/placeholder-blog.png"}
                          alt=""
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-800 line-clamp-1 text-sm group-hover:text-green-600 transition-colors">
                          {post.title}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium truncate italic">
                          /{post.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 w-[20%]">
                    <span className="text-[10px] font-black px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg uppercase tracking-tight">
                      {post.category}
                    </span>
                  </td>
                  <td className="p-4 w-[15%]">
                    <div className="flex items-center justify-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          post.isPublished
                            ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                            : "bg-amber-400"
                        }`}
                      />
                      <span className="text-[11px] font-bold text-slate-600">
                        {post.isPublished ? "Live" : "Draft"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 w-[25%]">
                    <div className="flex justify-end items-center gap-1">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        title="View Live"
                      >
                        <ExternalLink size={16} />
                      </Link>
                      <Link
                        href={`/admin/dashboard/blog/edit/${post._id}`}
                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                        title="Edit Post"
                      >
                        <Edit size={16} />
                      </Link>

                      {/* DELETE COMPONENT */}
                      <DeleteBlogButton id={post._id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {blogs.length === 0 && (
          <div className="p-16 text-center space-y-3">
            <div className="bg-slate-50 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
              <Search size={24} />
            </div>
            <p className="text-slate-400 text-sm font-bold">No posts found.</p>
          </div>
        )}
      </div>

      {/* FOOTER STATS */}
      <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
        <span>Total: {blogs.length}</span>
        <span>•</span>
        <span>Live: {blogs.filter((b: any) => b.isPublished).length}</span>
      </div>
    </div>
  );
}
