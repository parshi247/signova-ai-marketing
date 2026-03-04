import { useState } from "react";
import { trpc } from "../lib/trpc";
import { useLocation } from "wouter";

interface Question {
  id: string;
  question: string;
  type: "text" | "select" | "multiselect" | "radio";
  options?: string[];
  required: boolean;
}

// Document type definitions for the API
const documentTypeMap: Record<string, {
  id: string;
  name: string;
  category: string;
  complexity: "simple" | "moderate" | "complex";
  estimatedLength: string;
  jurisdictionRequired: boolean;
  commonUses: string[];
}> = {
  "Legal Agreement": {
    id: "legal-agreement",
    name: "Legal Agreement",
    category: "Legal",
    complexity: "moderate",
    estimatedLength: "2-5 pages",
    jurisdictionRequired: true,
    commonUses: ["NDAs", "Contracts", "Agreements"],
  },
  "Business Contract": {
    id: "business-contract",
    name: "Business Contract",
    category: "Business",
    complexity: "moderate",
    estimatedLength: "3-8 pages",
    jurisdictionRequired: true,
    commonUses: ["Service agreements", "Partnership agreements", "Vendor contracts"],
  },
  "Real Estate Document": {
    id: "real-estate",
    name: "Real Estate Document",
    category: "Real Estate",
    complexity: "complex",
    estimatedLength: "5-15 pages",
    jurisdictionRequired: true,
    commonUses: ["Lease agreements", "Purchase contracts", "Property disclosures"],
  },
  "Employment Document": {
    id: "employment",
    name: "Employment Document",
    category: "HR",
    complexity: "moderate",
    estimatedLength: "2-6 pages",
    jurisdictionRequired: true,
    commonUses: ["Offer letters", "Employment contracts", "Non-compete agreements"],
  },
  "Financial Document": {
    id: "financial",
    name: "Financial Document",
    category: "Finance",
    complexity: "complex",
    estimatedLength: "3-10 pages",
    jurisdictionRequired: true,
    commonUses: ["Loan agreements", "Investment documents", "Financial disclosures"],
  },
  "Personal Document": {
    id: "personal",
    name: "Personal Document",
    category: "Personal",
    complexity: "simple",
    estimatedLength: "1-3 pages",
    jurisdictionRequired: false,
    commonUses: ["Power of attorney", "Wills", "Personal agreements"],
  },
  "Other": {
    id: "other",
    name: "Other Document",
    category: "General",
    complexity: "moderate",
    estimatedLength: "2-5 pages",
    jurisdictionRequired: false,
    commonUses: ["Custom documents", "Miscellaneous"],
  },
};

export default function AIDocumentQuestionnaire() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateDocument = trpc.generate.generateDocument.useMutation();

  const questions: Question[] = [
    {
      id: "documentCategory",
      question: "What type of document do you need?",
      type: "select",
      options: [
        "Legal Agreement",
        "Business Contract",
        "Real Estate Document",
        "Employment Document",
        "Financial Document",
        "Personal Document",
        "Other",
      ],
      required: true,
    },
    {
      id: "specificType",
      question: "Can you be more specific?",
      type: "text",
      required: true,
    },
    {
      id: "jurisdiction",
      question: "Which jurisdiction or state does this apply to?",
      type: "select",
      options: [
        "California",
        "New York",
        "Texas",
        "Florida",
        "Illinois",
        "Pennsylvania",
        "Ohio",
        "Georgia",
        "Federal (USA)",
        "Other",
      ],
      required: true,
    },
    {
      id: "parties",
      question: "How many parties are involved?",
      type: "radio",
      options: ["1", "2", "3+"],
      required: true,
    },
    {
      id: "complexity",
      question: "What level of detail do you need?",
      type: "radio",
      options: ["Basic", "Standard", "Comprehensive"],
      required: true,
    },
    {
      id: "specificRequirements",
      question: "Any specific clauses or requirements? (Optional)",
      type: "text",
      required: false,
    },
  ];

  const currentQuestion = questions[step];

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      alert("This question is required");
      return;
    }
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      handleGenerate();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleGenerate = async () => {
    alert("handleGenerate called!");
    console.log("[DEBUG] answers:", JSON.stringify(answers));
    setIsGenerating(true);
    try {
      // Get the document type object from the map, or create a default one
      const selectedCategory = answers.documentCategory || "Other";
      const docType = documentTypeMap[selectedCategory] || {
        id: selectedCategory.toLowerCase().replace(/\s+/g, "-"),
        name: selectedCategory,
        category: "General",
        complexity: answers.complexity?.toLowerCase() === "comprehensive" ? "complex" as const : 
                    answers.complexity?.toLowerCase() === "basic" ? "simple" as const : "moderate" as const,
        estimatedLength: "2-5 pages",
        jurisdictionRequired: true,
        commonUses: [],
      };

      // Build userInputs record from all answers
      const userInputs: Record<string, any> = {
        documentCategory: answers.documentCategory || "",
        specificType: answers.specificType || "",
        jurisdiction: answers.jurisdiction || "",
        parties: answers.parties || "",
        complexity: answers.complexity || "",
        specificRequirements: answers.specificRequirements || "",
      };

      const result = await generateDocument.mutateAsync({
        documentType: docType,
        jurisdiction: answers.jurisdiction || "Federal (USA)",
        userInputs: userInputs,
        customInstructions: answers.specificRequirements || "",
      });

      // Redirect to document editor with generated content
      setLocation(`/document/${result.documentId}`);
    } catch (error: any) {
      console.error("Failed to generate document:", error);
      alert(error.message || "Failed to generate document. Please try again.");
      setIsGenerating(false);
    }
  };

  const progressPercentage = ((step + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Document Generator</h1>
          <p className="text-gray-600">Answer a few questions to generate your custom document</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Step {step + 1} of {questions.length}</span>
            <span>{Math.round(progressPercentage)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-700 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {currentQuestion.question}
          </h2>

          {/* Answer Input */}
          {currentQuestion.type === "text" && (
            <textarea
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              rows={4}
            />
          )}

          {currentQuestion.type === "select" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`p-4 border-2 rounded-lg text-left transition ${
                    answers[currentQuestion.id] === option
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        answers[currentQuestion.id] === option
                          ? "border-indigo-600 bg-indigo-700"
                          : "border-gray-300"
                      }`}
                    >
                      {answers[currentQuestion.id] === option && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    {option}
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === "radio" && (
            <div className="space-y-3">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition ${
                    answers[currentQuestion.id] === option
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        answers[currentQuestion.id] === option
                          ? "border-indigo-600 bg-indigo-700"
                          : "border-gray-300"
                      }`}
                    >
                      {answers[currentQuestion.id] === option && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>
                    {option}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={step === 0}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              step === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            ← Back
          </button>
          <button
            onClick={handleNext}
            disabled={isGenerating}
            className="px-6 py-3 bg-indigo-700 text-white rounded-lg font-medium hover:bg-indigo-800 transition disabled:opacity-50"
          >
            {isGenerating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : step === questions.length - 1 ? (
              "Generate Document →"
            ) : (
              "Next →"
            )}
          </button>
        </div>

        {/* Summary */}
        {step === questions.length - 1 && Object.keys(answers).length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📋</span> Summary
            </h3>
            <div className="space-y-3 text-sm">
              {questions.slice(0, -1).map((q) => (
                answers[q.id] && (
                  <div key={q.id}>
                    <span className="text-gray-500">{q.question}</span>
                    <p className="font-medium text-gray-900">{answers[q.id]}</p>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
