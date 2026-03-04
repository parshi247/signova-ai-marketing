import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle, XCircle, FileText } from 'lucide-react';
import PDFViewer from '@/components/PDFViewer';
import SignatureModal from '@/components/SignatureModal';
import { toast } from 'sonner';

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
  value?: string;
}

export default function SignDocument() {
  const [, params] = useRoute('/sign/:token');
  const [, navigate] = useLocation();
  const accessToken = params?.token || '';

  const [fields, setFields] = useState<SignatureField[]>([]);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [currentFieldId, setCurrentFieldId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch document for signing
  const { data: documentData, isLoading, error } = trpc.workflow.getDocumentForSigning.useQuery(
    { accessToken },
    { enabled: !!accessToken }
  );

  // Submit signatures mutation
  const submitMutation = trpc.workflow.submitSignatures.useMutation({
    onSuccess: () => {
      toast.success('Document signed successfully!');
      setIsSubmitting(false);
    },
    onError: (error) => {
      toast.error(`Failed to submit signature: ${error.message}`);
      setIsSubmitting(false);
    },
  });

  // Decline document mutation
  const declineMutation = trpc.workflow.declineDocument.useMutation({
    onSuccess: () => {
      toast.success('Document declined');
      navigate('/');
    },
    onError: (error) => {
      toast.error(`Failed to decline: ${error.message}`);
    },
  });

  // Initialize fields from document data
  useEffect(() => {
    if (documentData?.signatureFields) {
      setFields(documentData.signatureFields.map((field: any) => ({
        id: field.id.toString(),
        type: field.type,
        x: field.x,
        y: field.y,
        width: field.width,
        height: field.height,
        page: field.page,
        label: field.label,
        required: field.required,
        value: '',
      })));
    }
  }, [documentData]);

  const handleFieldClick = (fieldId: string) => {
    const field = fields.find(f => f.id === fieldId);
    if (field?.type === 'signature' || field?.type === 'initial') {
      setCurrentFieldId(fieldId);
      setShowSignatureModal(true);
    }
  };

  const handleSignatureSave = (signatureDataUrl: string) => {
    if (currentFieldId) {
      setFields(prev => prev.map(field =>
        field.id === currentFieldId
          ? { ...field, value: signatureDataUrl }
          : field
      ));
      setShowSignatureModal(false);
      setCurrentFieldId(null);
    }
  };

  const handleFieldChange = (fieldId: string, value: string) => {
    setFields(prev => prev.map(field =>
      field.id === fieldId
        ? { ...field, value }
        : field
    ));
  };

  const handleSubmit = async () => {
    // Validate all required fields are filled
    const missingFields = fields.filter(f => f.required && !f.value);
    if (missingFields.length > 0) {
      toast.error('Please complete all required fields');
      return;
    }

    setIsSubmitting(true);

    await submitMutation.mutateAsync({
      accessToken,
      signatures: fields.map(field => ({
        fieldId: parseInt(field.id),
        value: field.value || '',
      })),
    });
  };

  const handleDecline = async () => {
    if (confirm('Are you sure you want to decline to sign this document?')) {
      await declineMutation.mutateAsync({ accessToken });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading document...</p>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !documentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Document Not Found</h2>
          <p className="text-gray-600 mb-4">
            This document may have expired, been completed, or the link is invalid.
          </p>
          <Button onClick={() => navigate('/')}>
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  // Already signed state
  if (documentData.signer?.status === 'signed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Already Signed</h2>
          <p className="text-gray-600 mb-4">
            You have already signed this document on{' '}
            {new Date(documentData.signer.signedAt).toLocaleDateString()}.
          </p>
          <Button onClick={() => navigate('/')}>
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  // Declined state
  if (documentData.signer?.status === 'declined') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center max-w-md">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Document Declined</h2>
          <p className="text-gray-600 mb-4">
            You declined to sign this document.
          </p>
          <Button onClick={() => navigate('/')}>
            Go to Homepage
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Signova AI</h1>
                <p className="text-sm text-gray-600">Secure Document Signing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Document Info */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{documentData.document.title}</h2>
                <p className="text-gray-600 mb-4">
                  From: <span className="font-medium">{documentData.senderName}</span>
                </p>
                {documentData.message && (
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
                    <p className="text-sm text-gray-700">{documentData.message}</p>
                  </div>
                )}
                <p className="text-sm text-gray-500">
                  Recipient: <span className="font-medium">{documentData.signer.name}</span> ({documentData.signer.email})
                </p>
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Pending Signature
                </div>
              </div>
            </div>
          </Card>

          {/* PDF Viewer with Signature Fields */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Review and Sign Document</h3>
            <div className="bg-gray-100 rounded-lg p-4 min-h-[600px]">
              <PDFViewer
                url={documentData.document.fileUrl}
                fields={fields}
                onFieldClick={handleFieldClick}
                onFieldChange={handleFieldChange}
                editable={true}
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                <p className="mb-1">
                  <span className="font-medium">{fields.filter(f => f.required).length}</span> required fields
                </p>
                <p>
                  <span className="font-medium">{fields.filter(f => f.value).length}</span> of{' '}
                  <span className="font-medium">{fields.length}</span> fields completed
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleDecline}
                  disabled={isSubmitting || declineMutation.isPending}
                >
                  Decline to Sign
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || fields.filter(f => f.required && !f.value).length > 0}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Sign Document
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Security Notice */}
          <div className="text-center text-sm text-gray-500">
            <p>
              🔒 This document is secured with 256-bit SSL encryption and SOC 2 certified infrastructure.
            </p>
            <p className="mt-1">
              Powered by <span className="font-semibold text-indigo-600">Signova AI</span>
            </p>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <SignatureModal
          isOpen={showSignatureModal}
          onClose={() => {
            setShowSignatureModal(false);
            setCurrentFieldId(null);
          }}
          onSave={handleSignatureSave}
          fieldType={fields.find(f => f.id === currentFieldId)?.type || 'signature'}
        />
      )}
    </div>
  );
}
