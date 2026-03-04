import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star, Clock, Zap, ArrowRight, Coins } from "lucide-react";
import { ALL_INDUSTRIES, ALL_DOCUMENTS, getPopularDocuments, searchDocuments, type DocumentType } from "@shared/documentCatalog";
import { Link } from "wouter";
import { APP_LOGO, APP_TITLE } from "@/const";

export default function TemplateLibrary() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"popular" | "all" | "industry">("popular");

  // Filter documents based on search and filters
  const filteredDocuments = useMemo(() => {
    let docs = ALL_DOCUMENTS;

    // Search filter
    if (searchQuery) {
      docs = searchDocuments(searchQuery);
    }

    // Industry filter
    if (selectedIndustry !== "all") {
      docs = docs.filter(doc => doc.industry === selectedIndustry);
    }

    // Category filter
    if (selectedCategory !== "all") {
      docs = docs.filter(doc => doc.category === selectedCategory);
    }

    // View mode filter
    if (viewMode === "popular") {
      docs = docs.filter(doc => doc.popular);
    }

    return docs;
  }, [searchQuery, selectedIndustry, selectedCategory, viewMode]);

  const userCredits = user?.credits || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard">
              <a className="flex items-center gap-2">
                {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-8" />}
                <span className="text-xl font-bold text-indigo-700">
                  {APP_TITLE}
                </span>
              </a>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full">
                <Coins className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-amber-900">{userCredits} Credits</span>
              </div>
              <Link href="/credits">
                <Button variant="outline" size="sm">
                  Buy Credits
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-700">
            Professional Document Library
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate legally compliant documents in minutes with AI. Choose from 5,000+ document types across all industries.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search documents... (e.g., 'custody agreement', 'lease', 'NDA')"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-lg"
              />
            </div>

            {/* Industry Filter */}
            <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
              <SelectTrigger className="w-full md:w-[200px] h-12">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {ALL_INDUSTRIES.map(industry => (
                  <SelectItem key={industry.id} value={industry.name}>
                    {industry.icon} {industry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "popular" ? "default" : "outline"}
              onClick={() => setViewMode("popular")}
              className="gap-2"
            >
              <Star className="w-4 h-4" />
              Popular
            </Button>
            <Button
              variant={viewMode === "all" ? "default" : "outline"}
              onClick={() => setViewMode("all")}
            >
              All Documents
            </Button>
            <Button
              variant={viewMode === "industry" ? "default" : "outline"}
              onClick={() => setViewMode("industry")}
            >
              By Industry
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-indigo-600">{filteredDocuments.length}</span> documents
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Document Grid */}
        {viewMode === "industry" ? (
          // Industry-grouped view
          <div className="space-y-12">
            {ALL_INDUSTRIES.map(industry => {
              const industryDocs = filteredDocuments.filter(doc => doc.industry === industry.name);
              if (industryDocs.length === 0) return null;

              return (
                <div key={industry.id}>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
                      <span className="text-3xl">{industry.icon}</span>
                      {industry.name}
                    </h2>
                    <p className="text-gray-600">{industry.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {industryDocs.map(doc => (
                      <DocumentCard key={doc.id} document={doc} userCredits={userCredits} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Grid view
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(doc => (
              <DocumentCard key={doc.id} document={doc} userCredits={userCredits} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-semibold mb-2">No documents found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters
            </p>
            <Button onClick={() => { setSearchQuery(""); setSelectedIndustry("all"); setViewMode("popular"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// Document Card Component
function DocumentCard({ document, userCredits }: { document: DocumentType; userCredits: number }) {
  const canAfford = userCredits >= document.creditCost;
  const complexityColors = {
    simple: "bg-green-100 text-green-800",
    moderate: "bg-blue-100 text-blue-800",
    complex: "bg-indigo-100 text-slate-800",
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg">{document.name}</CardTitle>
          {document.popular && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Popular
            </Badge>
          )}
        </div>
        <CardDescription className="text-sm">{document.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metadata */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {document.industry}
          </Badge>
          <Badge variant="outline" className={`text-xs ${complexityColors[document.complexity]}`}>
            {document.complexity}
          </Badge>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{document.estimatedTime}s</span>
          </div>
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-amber-600" />
            <span className="font-semibold">{document.creditCost} credits</span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/generate/${document.id}`}>
          <Button
            className="w-full gap-2"
            disabled={!canAfford}
            variant={canAfford ? "default" : "outline"}
          >
            {canAfford ? (
              <>
                <Zap className="w-4 h-4" />
                Generate Now
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <Coins className="w-4 h-4" />
                Need {document.creditCost - userCredits} more credits
              </>
            )}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
