import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Send, Save } from 'lucide-react';
import PDFViewer from '@/components/PDFViewer';
import { toast } from 'sonner';
import { getLoginUrl } from '@/const';

// Simple markdown to HTML renderer
const renderMarkdown = (text: string): string => {
  if (!text) return '';
  return text
    // Remove markdown code fences
    .replace(/^```[a-z]*\n?/gm, '')
    .replace(/^```\n?/gm, '')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Horizontal rules
    .replace(/^---+$/gm, '<hr class="my-4 border-gray-300" />')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul class="my-2 space-y-1">$&</ul>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p class="mb-3">')
    // Single newlines to <br>
    .replace(/\n/g, '<br />')
    // Wrap in paragraph
    .replace(/^(.+)/, '<p class="mb-3">$1')
    + '</p>';
};



interface SignatureField {
  id: string;
  type: 'signature' | 'initial' | 'text' | 'date' | 'checkbox';
  x: number;
  y: number;
  width: number;
  height: number;
  page: number;
  label?: string;
  required?: boolean;
  assignedTo?: string;
}

export default function DocumentEditor() {
  const [, params1] = useRoute('/document/:id');
  const [, params2] = useRoute('/documents/:id');
  const [, params3] = useRoute('/documents/:id/edit');
  const params = params1 || params2 || params3;
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const documentId = params?.id ? parseInt(params.id) : null;

  const [fields, setFields] = useState<SignatureField[]>([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  const { data: document, isLoading } = trpc.documents.getById.useQuery(
    { id: documentId! },
    { enabled: !!documentId }
  );

  // IMPORTANT: All hooks must be called before any early returns
  const sendDocumentMutation = trpc.workflow.sendDocument.useMutation({
    onSuccess: () => {
      toast.success('Document sent for signature!');
      navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(`Failed to send document: ${error.message}`);
    },
  });

  // Decode HTML content from data URL when document loads
  useEffect(() => {
    if (document?.fileUrl?.startsWith('data:text/html;base64,')) {
      try {
        const base64Content = document.fileUrl.split(',')[1];
        const decoded = atob(base64Content);
        setHtmlContent(decoded);
      } catch (e) {
        console.error('Failed to decode HTML content:', e);
        setHtmlContent(null);
      }
    }
  }, [document?.fileUrl]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = getLoginUrl();
    }
  }, [user, authLoading]);

  // Early returns AFTER all hooks
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
          <p className="text-gray-600 mb-4">The document you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const handleFieldsUpdate = (updatedFields: SignatureField[]) => {
    setFields(updatedFields);
  };

  const handleSaveDraft = () => {
    toast.success('Draft saved successfully');
  };

  const handleSendForSignature = async () => {
    if (!recipientEmail || !recipientName) {
      toast.error('Please enter recipient details');
      return;
    }

    if (fields.length === 0 && !document.fileUrl?.startsWith('data:text/html')) {
      toast.error('Please add at least one signature field');
      return;
    }

    if (!documentId) {
      toast.error('Invalid document ID');
      return;
    }

    await sendDocumentMutation.mutateAsync({
      documentId,
      signers: [{
        email: recipientEmail,
        name: recipientName,
        signingOrder: 0,
      }],
      message: `Please review and sign: ${document?.title}`,
      expiresInDays: 30,
    });
  };

  // Check if the document is HTML content (from AI generator)
  const isHtmlDocument = document.fileUrl?.startsWith('data:text/html');

  // Render HTML document using srcdoc for proper display
  const renderHtmlDocument = () => {
    if (!htmlContent) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-4 h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-lg p-4 h-full">
        <iframe
          srcDoc={htmlContent}
          className="w-full h-[800px] border rounded bg-white"
          title={document.title}
          sandbox="allow-same-origin"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold">{document.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            <Button 
              onClick={handleSendForSignature}
              disabled={sendDocumentMutation.isPending}
            >
              {sendDocumentMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send for Signature
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Recipient Details</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipientName">Name</Label>
                  <Input
                    id="recipientName"
                    placeholder="Enter recipient name"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="recipientEmail">Email</Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="Enter recipient email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            {!isHtmlDocument && (
              <Card className="p-4 mt-4">
                <h3 className="font-semibold mb-4">Signature Fields</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Click on the document to add signature fields where recipients should sign.
                </p>
                <div className="text-sm text-gray-500">
                  {fields.length === 0 ? (
                    <p>No fields added yet</p>
                  ) : (
                    <p>{fields.length} field(s) added</p>
                  )}
                </div>
              </Card>
            )}

            {isHtmlDocument && (
              <Card className="p-4 mt-4">
                <h3 className="font-semibold mb-4">AI Generated Document</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This document was generated by the AI Document Generator. 
                  Enter recipient details and click "Send for Signature" to send it for signing.
                </p>
              </Card>
            )}
          </div>

          {/* Document Viewer */}
          <div className="lg:col-span-3">
            {isHtmlDocument ? (
              renderHtmlDocument()
            ) : (
              <PDFViewer
                fileUrl={document.fileUrl}
                documentId={document.id}
                onFieldsUpdate={handleFieldsUpdate}
                editable={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
