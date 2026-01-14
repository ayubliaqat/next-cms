import Link from "next/link";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { 
  FileText, 
  Eye, 
  CheckCircle, 
  Clock, 
  Plus, 
  ArrowUpRight,
  LayoutDashboard,
  Settings
} from "lucide-react";

async function getStats() {
  await connectDB();
  const total = await Blog.countDocuments();
  const live = await Blog.countDocuments({ isPublished: true });
  const drafts = total - live;
  const latest = await Blog.find().sort({ createdAt: -1 }).limit(5).lean();
  
  return {
    total,
    live,
    drafts,
    latest: JSON.parse(JSON.stringify(latest))
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Overview</h1>
          <p className="text-slate-500 text-sm font-medium">Welcome back, Admin.</p>
        </div>
        <Link 
          href="/admin/dashboard/blog/add" 
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-green-100"
        >
          <Plus size={18} /> Create New
        </Link>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Stories" value={stats.total} icon={<FileText className="text-blue-600" />} />
        <StatCard title="Live Posts" value={stats.live} icon={<CheckCircle className="text-green-600" />} />
        <StatCard title="Drafts" value={stats.drafts} icon={<Clock className="text-amber-500" />} />
        <StatCard title="Total Views" value="1.2k" icon={<Eye className="text-purple-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* RECENT ACTIVITY TABLE */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Recent Content</h2>
            <Link href="/admin/dashboard/blog" className="text-xs font-bold text-green-600 uppercase tracking-widest hover:underline">
              View All
            </Link>
          </div>
          
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Post</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Status</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.latest.map((post: any) => (
                  <tr key={post._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-sm line-clamp-1">{post.title}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{post.category}</div>
                    </td>
                    <td className="p-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${post.isPublished ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                        {post.isPublished ? 'Live' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link href={`/admin/dashboard/blog/edit/${post._id}`} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowUpRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SIDEBAR TOOLS */}
        <div className="space-y-6">
          <h2 className="text-xl font-black text-slate-900">Quick Tools</h2>
          <div className="grid grid-cols-1 gap-4">
            <ToolButton icon={<LayoutDashboard size={18} />} label="Site Analytics" />
            <ToolButton icon={<Settings size={18} />} label="SEO Settings" />
            {/* BOUNCING ANIMATION INTEGRATED HERE */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-700 text-white relative overflow-hidden">
                <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">System Status</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-bounce" />
                    <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span className="font-bold text-sm text-green-100">Database Connected</span>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// HELPER COMPONENTS
function StatCard({ title, value, icon }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <p className="text-2xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

function ToolButton({ icon, label }: any) {
  return (
    <button className="flex items-center gap-4 w-full p-4 bg-white border border-slate-100 rounded-2xl hover:border-green-500 hover:shadow-lg hover:shadow-green-50 transition-all text-slate-600 hover:text-green-600 font-bold text-sm">
      {icon} {label}
    </button>
  );
}