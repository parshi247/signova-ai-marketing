import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "wouter";

// JSON data shape from /api/blog/posts
interface BlogPost {
  slug: string;
  id?: string;
  title: string;
  description?: string;   // used as excerpt
  excerpt?: string;
  content?: string;
  author?: string;
  date: string;
  readTime?: string;
  category?: string;
  industry?: string;      // fallback for category
  tags?: string[];
  image?: string;
}

// Normalize API response to a consistent shape
function normalizePost(p: BlogPost) {
  return {
    ...p,
    category: p.category || p.industry || "General",
    excerpt: p.excerpt || p.description || "",
    readTime: p.readTime || estimateReadTime(p.content || p.description || ""),
  };
}

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

export default function Blog() {
  const [posts, setPosts] = useState<ReturnType<typeof normalizePost>[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog/posts")
      .then((res) => {
        console.log("Blog API response:", res.status);
        return res.json();
      })
      .then((data) => {
        const raw: BlogPost[] = data.posts || [];
        setPosts(raw.map(normalizePost));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog posts:", error);
        setLoading(false);
      });
  }, []);

  const categories = ["all", ...Array.from(new Set(posts.map((p) => p.category)))];
  const filteredPosts =
    selectedCategory === "all"
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-6">
              ← Back to Home
            </Button>
          </Link>
          <h1 className="text-5xl font-bold mb-4">Signova AI Blog</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Insights on AI-powered document generation, e-signatures, legal tech, and digital transformation
          </p>
          <p className="text-sm opacity-60 mt-3">{posts.length} articles published</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="capitalize"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-500">Loading blog posts...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No blog posts found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card
                key={post.slug || post.id}
                className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Tag className="h-4 w-4" />
                    <span className="capitalize">{post.category}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button variant="ghost" className="w-full group">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg opacity-90 mb-8">
            Get the latest insights on AI, legal tech, and document automation delivered to your inbox
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <Button className="bg-white text-indigo-600 hover:bg-gray-100">Subscribe</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
