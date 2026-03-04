import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, X } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function UploadDocument() {
  const [, setLocation] = useLocation();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const uploadMutation = trpc.documents.upload.useMutation({
    onSuccess: (data: { id: number; url: string }) => {
      toast.success("Document uploaded successfully!");
      setLocation(`/documents/${data.id}`);
    },
    onError: (error) => {
      toast.error(`Upload failed: ${error.message}`);
      setUploading(false);
    },
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(f => f.type === "application/pdf");
    
    if (pdfFile) {
      setFile(pdfFile);
      if (!title) {
        setTitle(pdfFile.name.replace(".pdf", ""));
      }
    } else {
      toast.error("Please upload a PDF file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      if (files[0].type === "application/pdf") {
        setFile(files[0]);
        if (!title) {
          setTitle(files[0].name.replace(".pdf", ""));
        }
      } else {
        toast.error("Please upload a PDF file");
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      toast.error("Please select a file and enter a title");
      return;
    }

    setUploading(true);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      await uploadMutation.mutateAsync({
        title,
        fileData: base64,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Upload Document</h1>
          <p className="text-muted-foreground mt-1">
            Upload a PDF document to send for signature
          </p>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            {/* File Upload Area */}
            <div>
              <Label>Document File</Label>
              <div
                className={`mt-2 border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragging
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-400"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-4">
                    <FileText className="h-12 w-12 text-indigo-600" />
                    <div className="text-left">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">
                      Drag and drop your PDF here
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse
                    </p>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                    >
                      Select PDF File
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Document Title */}
            <div>
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Sales Agreement Q4 2025"
                className="mt-2"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleUpload}
                disabled={!file || !title || uploading}
                className="flex-1 bg-indigo-700 hover:bg-indigo-800"
              >
                {uploading ? "Uploading..." : "Upload & Continue"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setLocation("/dashboard")}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
