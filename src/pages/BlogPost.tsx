import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";

// Inline markdown-to-HTML converter (no dependencies)
function markdownToHtml(md: string): string {
  if (!md) return "";
  let html = md
    // Escape HTML entities first
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    // Headings
    .replace(/^#{6}\s+(.+)$/gm, "<h6>$1</h6>")
    .replace(/^#{5}\s+(.+)$/gm, "<h5>$1</h5>")
    .replace(/^#{4}\s+(.+)$/gm, "<h4>$1</h4>")
    .replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>")
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    // Inline code
    .replace(/`(.+?)`/g, "<code>$1</code>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Horizontal rule
    .replace(/^---+$/gm, "<hr/>")
    // Unordered lists
    .replace(/^[\*\-]\s+(.+)$/gm, "<li>$1</li>")
    // Ordered lists
    .replace(/^\d+\.\s+(.+)$/gm, "<li>$1</li>")
    // Blockquotes
    .replace(/^&gt;\s+(.+)$/gm, "<blockquote>$1</blockquote>")
    // Paragraphs (double newline = paragraph break)
    .replace(/\n\n+/g, "</p><p>")
    // Single newlines within paragraphs
    .replace(/\n/g, "<br/>");

  // Wrap in paragraph tags
  html = "<p>" + html + "</p>";

  // Fix: wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*?<\/li>)(\s*<li>)/g, "$1$2");
  html = html.replace(/(<li>)/g, (_, p1, offset, str) => {
    const before = str.substring(Math.max(0, offset - 5), offset);
    return before.includes("<ul>") ? p1 : "<ul>" + p1;
  });
  html = html.replace(/(<\/li>)(?!\s*<li>)/g, "$1</ul>");

  // Clean up empty paragraphs and nested p tags
  html = html
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<p>(<h[1-6]>)/g, "$1")
    .replace(/(<\/h[1-6]>)<\/p>/g, "$1")
    .replace(/<p>(<ul>)/g, "$1")
    .replace(/(<\/ul>)<\/p>/g, "$1")
    .replace(/<p>(<hr\/>)<\/p>/g, "$1")
    .replace(/<p>(<blockquote>)/g, "$1")
    .replace(/(<\/blockquote>)<\/p>/g, "$1");

  return html;
}

interface BlogPostData {
  slug: string;
  id?: string;
  title: string;
  excerpt?: string;
  description?: string;
  content?: string;
  author?: string;
  date: string;
  readTime?: string;
  category?: string;
  industry?: string;
  tags?: string[];
  image?: string;
}

function estimateReadTime(text: string): string {
  const words = (text || "").split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min`;
}

export default function BlogPost() {
  const params = useParams();
  const postSlug = params.slug;
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postSlug) return;
    fetch(`/api/blog/posts/${postSlug}`)
      .then((res) => res.json())
      .then((data) => {
        setPost(data.post || null);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blog post:", error);
        setLoading(false);
      });
  }, [postSlug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog">
            <Button>← Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const category = post.category || post.industry || "General";
  const readTime = post.readTime || estimateReadTime(post.content || "");
  const contentHtml = markdownToHtml(post.content || post.description || "");

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header bar */}
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/blog">
            <Button variant="ghost" className="text-white hover:bg-white/20 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Article */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          {/* Category */}
          <div className="flex items-center gap-2 text-sm text-indigo-600 mb-4">
            <span className="capitalize font-semibold">{category}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">{post.title}</h1>

          {/* Meta */}
          <div className="flex items-center gap-6 text-gray-500 mb-8 pb-8 border-b flex-wrap">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(post.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{readTime} read</span>
            </div>
            <button
              className="ml-auto flex items-center gap-1 text-sm hover:text-indigo-600 transition-colors"
              onClick={() => navigator.clipboard?.writeText(window.location.href)}
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          {/* Hero image */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-full rounded-lg mb-8 object-cover max-h-96"
            />
          )}

          {/* Content — rendered markdown */}
          <div
            className="prose prose-lg max-w-none text-gray-800 leading-relaxed
              [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4 [&_h1]:text-gray-900
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-gray-900
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-gray-900
              [&_p]:mb-4 [&_p]:leading-7
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
              [&_li]:mb-1
              [&_strong]:font-semibold [&_strong]:text-gray-900
              [&_a]:text-indigo-600 [&_a]:underline [&_a]:hover:text-indigo-800
              [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
              [&_blockquote]:border-l-4 [&_blockquote]:border-indigo-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_blockquote]:my-4
              [&_hr]:my-8 [&_hr]:border-gray-200"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h3 className="font-semibold mb-3 text-gray-700">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-slate-800 text-white rounded-xl p-8 text-center border border-slate-700">
          <h2 className="text-2xl font-bold mb-3">Ready to Transform Your Document Workflow?</h2>
          <p className="text-lg opacity-80 mb-6">
            Try Signova AI — World's First AI Document Generator + E-Signature Platform
          </p>
          <Link href="/checkout?plan=professional">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold">
              Start Free — No Credit Card
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
