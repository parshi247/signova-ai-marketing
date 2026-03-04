/**
 * AI Document Generator Component
 * Conversational interface for generating documents with AI
 */

import React, { useState } from 'react';
import { Sparkles, FileText, Send, Check, AlertCircle } from 'lucide-react';
// Navigation will use window.location for compatibility

interface Question {
  question_id: string;
  question_text: string;
  question_type: 'text' | 'select' | 'multiselect' | 'number' | 'date';
  options?: string[];
  placeholder?: string;
  help_text?: string;
  required?: boolean;
}

interface DocumentInfo {
  document_type: string;
  confidence: number;
  category: string;
  requires_jurisdiction: boolean;
  estimated_questions: number;
}

interface GeneratedDocument {
  document_id: string;
  title: string;
  content: string;
  requires_signature: boolean;
  signature_parties: Array<{
    role: string;
    name: string;
    email: string;
  }>;
  metadata: {
    document_type: string;
    jurisdiction: string;
    category: string;
  };
}

// Helper function to get auth headers (cookie-based auth)
const getAuthHeaders = (): HeadersInit => {
  return { 'Content-Type': 'application/json' };
};

export default function AIDocumentGenerator() {
  // Using window.location for navigation
  
  // State
  const [step, setStep] = useState<'input' | 'questions' | 'generating' | 'complete'>('input');
  const [query, setQuery] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [progress, setProgress] = useState(0);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    question: string;
    answer: string;
  }>>([]);
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Start document generation
  const handleStartGeneration = async () => {
    if (!query.trim()) return;
    
    setError(null);
    setStep('questions');
    
    try {
      const response = await fetch('/api/generate/start', {
        credentials: 'include',
        method: 'POST',
        headers: getAuthHeaders(),
                body: JSON.stringify({ query: query.trim() }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to start document generation');
      }
      
      const data = await response.json();
      setSessionId(data.session_id);
      setDocumentInfo(data.document_info);
      setCurrentQuestion({
        question_id: data.first_question.question_id,
        question_text: data.first_question.question_text,
        question_type: 'text',
        required: true,
      });
      setProgress(data.progress);
    } catch (err: any) {
      setError(err.message || 'Failed to start generation');
      setStep('input');
    }
  };

  // Submit answer and get next question
  const handleSubmitAnswer = async () => {
    if (!answer.trim() || !sessionId || !currentQuestion) return;
    
    setError(null);
    
    // Add to conversation history
    setConversationHistory(prev => [...prev, {
      question: currentQuestion.question_text,
      answer: answer.trim(),
    }]);
    
    try {
      const response = await fetch('/api/generate/answer', {
        credentials: 'include',
        method: 'POST',
        headers: getAuthHeaders(),
                body: JSON.stringify({
          session_id: sessionId,
          question_id: currentQuestion.question_id,
          question_text: currentQuestion.question_text,
          answer: answer.trim(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }
      
      const data = await response.json();
      setProgress(data.progress);
      setAnswer('');
      
      if (data.complete) {
        // All questions answered, generate document
        await handleGenerateDocument();
      } else if (data.next_question) {
        setCurrentQuestion({
          question_id: data.next_question.question_id,
          question_text: data.next_question.question_text,
          question_type: 'text',
          required: true,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit answer');
    }
  };

  // Generate final document
  const handleGenerateDocument = async () => {
    setStep('generating');
    setError(null);
    
    try {
      const response = await fetch('/api/generate/finalize', {
        credentials: 'include',
        method: 'POST',
        headers: getAuthHeaders(),
                body: JSON.stringify({ session_id: sessionId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate document');
      }
      
      const data = await response.json();
      setGeneratedDocument(data);
      setStep('complete');
    } catch (err: any) {
      setError(err.message || 'Failed to generate document');
      setStep('questions');
    }
  };

  // Handle sending document for signature
  const handleSendForSignature = async () => {
    if (!generatedDocument) return;
    
    setIsSaving(true);
    setError(null);
    
    try {
      // Save the document to the database
      const response = await fetch('/api/generate/save', {
        credentials: 'include',
        method: 'POST',
        headers: getAuthHeaders(),
                body: JSON.stringify({
          title: generatedDocument.title,
          content: generatedDocument.content,
          document_type: generatedDocument.metadata.document_type,
          requires_signature: generatedDocument.requires_signature,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save document');
      }
      
      const data = await response.json();
      
      // Navigate to the document editor with the new document ID
      window.location.href = `/document/${data.document_id}`;
    } catch (err: any) {
      setError(err.message || 'Failed to save document');
      setIsSaving(false);
    }
  };

  // Handle downloading document
  const handleDownload = () => {
    if (!generatedDocument) return;
    
    const blob = new Blob([generatedDocument.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedDocument.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Reset to start over
  const handleStartOver = () => {
    setStep('input');
    setQuery('');
    setSessionId(null);
    setDocumentInfo(null);
    setCurrentQuestion(null);
    setAnswer('');
    setProgress(0);
    setConversationHistory([]);
    setGeneratedDocument(null);
    setError(null);
    setIsSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold">AI Document Generator</h1>
        </div>
        <p className="text-gray-600">
          Create any document in minutes. Just tell us what you need.
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Initial Input */}
      {step === 'input' && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What document do you need?
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='e.g., "freelance contract" or "rental lease agreement"'
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleStartGeneration()}
            />
          </div>
          <button
            onClick={handleStartGeneration}
            disabled={!query.trim()}
            className="w-full py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Start Creating
          </button>
          
          {/* Quick suggestions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-3">Popular document types:</p>
            <div className="flex flex-wrap gap-2">
              {['Freelance contract', 'Rental lease agreement', 'NDA', 'Employment contract', 'Invoice template', 'Service agreement'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Questions */}
      {step === 'questions' && currentQuestion && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-700 transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>

          {/* Conversation history */}
          {conversationHistory.length > 0 && (
            <div className="mb-6 space-y-4">
              {conversationHistory.map((item, index) => (
                <div key={index} className="text-sm">
                  <div className="text-gray-600 mb-1">{item.question}</div>
                  <div className="text-gray-900 font-medium bg-gray-50 p-2 rounded">
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Current question */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-gray-900 mb-3">
              {currentQuestion.question_text}
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              autoFocus
            />
          </div>

          <button
            onClick={handleSubmitAnswer}
            disabled={!answer.trim()}
            className="w-full py-3 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            Continue
          </button>
        </div>
      )}

      {/* Step 3: Generating */}
      {step === 'generating' && (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Generating Your Document</h2>
          <p className="text-gray-600">
            Our AI is creating your document with jurisdiction-specific legal language...
          </p>
        </div>
      )}

      {/* Step 4: Complete */}
      {step === 'complete' && generatedDocument && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Success message */}
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
            <Check className="w-5 h-5" />
            <span>Your <strong>{generatedDocument.title}</strong> has been generated successfully.</span>
          </div>

          {/* Document preview */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-600" />
                <h2 className="text-2xl font-bold">{generatedDocument.title}</h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Download
                </button>
                {generatedDocument.requires_signature && (
                  <button
                    onClick={handleSendForSignature}
                    disabled={isSaving}
                    className="px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Send for Signature'}
                  </button>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Category:</span>
                <span className="ml-2 font-medium">{generatedDocument.metadata.category}</span>
              </div>
              <div>
                <span className="text-gray-600">Jurisdiction:</span>
                <span className="ml-2 font-medium">{generatedDocument.metadata.jurisdiction}</span>
              </div>
              <div>
                <span className="text-gray-600">Requires Signature:</span>
                <span className="ml-2 font-medium">{generatedDocument.requires_signature ? 'Yes' : 'No'}</span>
              </div>
              <div>
                <span className="text-gray-600">Document Type:</span>
                <span className="ml-2 font-medium">{generatedDocument.metadata.document_type.replace(/_/g, ' ')}</span>
              </div>
            </div>

            {/* Document Content Preview */}
            <div className="prose max-w-none">
              <div className="p-6 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {generatedDocument.content.substring(0, 1000)}...
                </pre>
              </div>
            </div>
          </div>

          {/* Start over button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleStartOver}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Create Another Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
