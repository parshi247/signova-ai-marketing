import React from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "../lib/trpc";

export default function DocumentView() {
  const [match, params] = useRoute("/document/:id");
  const id = params?.id;
  const [, setLocation] = useLocation();

  const { data: document, isLoading } = trpc.documents.getById.useQuery({
    id: parseInt(id || "0"),
  });

  const deleteMutation = trpc.documents.delete.useMutation({
    onSuccess: () => {
      setLocation("/documents");
    },
  });

  const handleDownload = () => {
    if (document?.fileUrl) {
      window.open(document.fileUrl, "_blank");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      await deleteMutation.mutateAsync({ id: parseInt(id || "0") });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-gray-600">Loading document...</div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-gray-600 mb-4">Document not found</div>
          <button
            onClick={() => setLocation("/documents")}
            className="px-6 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800"
          >
            Back to Documents
          </button>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      declined: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || colors.draft;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => setLocation("/documents")}
            className="text-indigo-600 hover:text-indigo-700 mb-2 text-sm"
          >
            ← Back to Documents
          </button>
          <h1 className="text-3xl font-bold">{document.title}</h1>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadge(
            document.status
          )}`}
        >
          {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
        </span>
      </div>

      {/* Document Info */}
      <div className="document-paper-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-sm text-gray-500 mb-1">Document Type</div>
            <div className="font-medium text-gray-900">
              {document.documentType || "General Document"}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Created</div>
            <div className="font-medium text-gray-900">
              {new Date(document.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Status</div>
            <div className="font-medium text-gray-900">
              {document.status.charAt(0).toUpperCase() +
                document.status.slice(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="document-paper-md p-6 mb-6">
        <h2 className="text-lg font-bold mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center px-6 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800"
          >
            <span className="mr-2">⬇️</span>
            Download PDF
          </button>

          {document.status === "draft" && (
            <button
              onClick={() => setLocation(`/documents/${id}/edit`)}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <span className="mr-2">✏️</span>
              Edit Document
            </button>
          )}

          {document.status === "pending" && (
            <button className="flex items-center px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
              <span className="mr-2">📧</span>
              Send Reminder
            </button>
          )}

          <button className="flex items-center px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
            <span className="mr-2">🔗</span>
            Copy Link
          </button>

          <button
            onClick={handleDelete}
            disabled={deleteMutation.isLoading}
            className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <span className="mr-2">🗑️</span>
            {deleteMutation.isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* PDF Preview */}
      <div className="document-paper-md p-6">
        <h2 className="text-lg font-bold mb-4">Document Preview</h2>
        {document.fileUrl ? (
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <iframe
              src={`${document.fileUrl}#toolbar=0`}
              className="w-full h-[800px]"
              title="Document Preview"
            />
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">📄</div>
            <div className="text-gray-600">No preview available</div>
          </div>
        )}
      </div>

      {/* Signature Audit Trail (if completed) */}
      {document.status === "completed" && (
        <div className="document-paper-md p-6 mt-6">
          <h2 className="text-lg font-bold mb-4">Signature Audit Trail</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">✅</div>
                <div>
                  <div className="font-medium text-gray-900">
                    Document Signed
                  </div>
                  <div className="text-sm text-gray-500">
                    All parties have signed the document
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(document.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
