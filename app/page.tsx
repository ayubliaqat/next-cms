export const dynamic = "force-dynamic";
import Link from "next/link";
import { MoveRight, ArrowUpRight, Leaf, Zap, Globe } from "lucide-react";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";

// This helps search engines understand what your page is about
export const metadata = {
  title: "NaturaPick | Urban Farming & Nutritional Science",
  description: "Transforming city spaces into sustainable ecosystems through vertical gardening and research.",
};

async function getLatestPosts() {
  await connectDB();
  const data = await Blog.find({ isPublished: true }).sort({ publishedAt: -1 }).limit(3).lean();
  return JSON.parse(JSON.stringify(data));
}

export default async function HomePage() {
  const latestPosts = await getLatestPosts();

  return (
    <div className="min-h-screen bg-white">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-28 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            
            {/* BOUNCING STATUS (Visible on all devices) */}
            <div className="flex items-center gap-2 mb-6 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <div className="h-2 w-2 bg-red-500 rounded-full animate-bounce" />
              <div className="h-2 w-2 bg-green-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="h-2 w-2 bg-yellow-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Live Updates</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-6 md:mb-8">
              Grow Urban <br /> 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent italic">Live Better.</span>
            </h1>
            
            <p className="max-w-xl text-slate-500 text-base md:text-lg font-medium leading-relaxed mb-8 md:mb-10 px-4">
              Next-generation city gardening. We combine traditional wisdom with nutritional science to build a greener future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-6 sm:px-0">
              <Link href="/blog" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-green-600 transition-all text-center shadow-xl shadow-slate-200">
                Read Journal
              </Link>
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-slate-50 transition-all text-center">
                Our Mission
              </button>
            </div>
          </div>
        </div>
        
        {/* Background Gradients (Optimized for performance) */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-100/40 rounded-full blur-[80px] md:blur-[120px] -z-10" />
      </section>

      {/* --- VALUE PROPS (Responsive Grid) --- */}
      <section className="py-16 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {[
            { icon: <Leaf />, title: "Sustainable", color: "text-green-600", desc: "Eco-friendly methods for city spaces." },
            { icon: <Zap />, title: "Scientific", color: "text-blue-600", desc: "Nutrient-dense crop research." },
            { icon: <Globe />, title: "Community", color: "text-purple-600", desc: "Global network of urban farmers." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center md:items-start md:text-left space-y-4">
              <div className={`w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center ${item.color} border border-slate-100`}>
                {item.icon}
              </div>
              <h3 className="font-black text-slate-900 uppercase text-sm tracking-wider">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- LATEST STORIES (Responsive Cards) --- */}
      <section className="py-20 md:py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
            <div>
              <span className="text-green-600 font-black uppercase text-[10px] tracking-[0.3em] block mb-2">Knowledge Base</span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Recent Journal Entries<span className="text-green-600">.</span></h2>
            </div>
            <Link href="/blog" className="flex items-center gap-2 font-black text-xs uppercase tracking-widest text-slate-900 hover:text-green-600 transition-colors">
              View All <MoveRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post: any) => (
              <Link key={post._id} href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-slate-100 mb-6 border border-slate-200/50 shadow-sm transition-all duration-500 group-hover:shadow-2xl">
                  <img src={post.coverImage} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={post.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                     <span className="text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">Read Entry <ArrowUpRight size={14}/></span>
                  </div>
                </div>
                <div className="px-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">{post.category}</span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">5 min read</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-green-600 transition-colors leading-tight mb-2">
                    {post.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOTER CTA (Mobile Responsive Gradient) --- */}
      <section className="px-4 md:px-6 mb-12">
        <div className="max-w-[1400px] mx-auto p-10 md:p-24 rounded-[30px] md:rounded-[40px] bg-gradient-to-br from-blue-600 to-purple-700 text-white relative overflow-hidden text-center">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-6xl font-black tracking-tighter mb-4 md:mb-6 leading-tight">Join the urban <br/>revolution.</h2>
              <p className="text-blue-100 max-w-sm mx-auto mb-8 md:mb-10 text-sm md:text-base font-medium">Weekly insights into the science of growing food in the city.</p>
              
              <form className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
                <input type="email" placeholder="Email address" className="bg-white/10 border border-white/20 px-6 py-4 rounded-2xl w-full text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm" />
                <button type="submit" className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-all w-full sm:w-auto">Subscribe</button>
              </form>
            </div>
            
            {/* Animated Dots Decoration */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10 flex gap-1">
              <div className="h-1.5 w-1.5 bg-white/30 rounded-full animate-bounce" />
              <div className="h-1.5 w-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:0.1s]" />
              <div className="h-1.5 w-1.5 bg-white/30 rounded-full animate-bounce [animation-delay:0.2s]" />
            </div>
        </div>
      </section>
    </div>
  );
}