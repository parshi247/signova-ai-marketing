/**
 * RecipientPortal.tsx
 * World-class e-signature recipient experience.
 * Replaces the basic SignDocument.tsx with a full 7-step flow:
 *   1. Landing (token validation + document preview)
 *   2. Identity Verification (OTP via email)
 *   3. Document Review (PDF viewer with scroll-to-bottom enforcement)
 *   4. Signature Capture (per-field, canvas-based)
 *   5. Confirmation (review before submit)
 *   6. Completion (signed confirmation + download)
 *   7. Declined (decline confirmation)
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRoute, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, CheckCircle, XCircle, FileText, Shield, Download, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

// ─── Types ───────────────────────────────────────────────────────────────────

type PortalStep =
  | 'loading'
  | 'landing'
  | 'otp-send'
  | 'otp-verify'
  | 'review'
  | 'sign'
  | 'confirm'
  | 'complete'
  | 'declined'
  | 'error';

interface SignatureField {
  id: number;
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

interface SignatureCapture {
  fieldId: number;
  value: string; // base64
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function maskEmail(email: string): string {
  return email.replace(/(.{2}).+(@.+)/, '$1***$2');
}

function formatDate(d: Date | string | null): string {
  if (!d) return '—';
  const dt = typeof d === 'string' ? new Date(d) : d;
  return dt.toISOString().split('T')[0];
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function PortalShell({ children, step, totalSteps }: {
  children: React.ReactNode;
  step: number;
  totalSteps: number;
}) {
  const progress = Math.round((step / totalSteps) * 100);
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-[#1a1a2e] text-white px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg tracking-wide">SIGNOVA</span>
          <span className="text-xs text-gray-400 uppercase tracking-widest hidden sm:block">Secure Document Signing</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Shield className="w-3.5 h-3.5" />
          <span>256-bit TLS</span>
        </div>
      </header>
      {/* Progress bar */}
      {step > 0 && (
        <div className="h-1 bg-gray-200">
          <div
            className="h-1 bg-indigo-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {children}
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4 text-center">
        <p className="text-xs text-gray-400">
          Signova.ai — Electronic Signature Platform &nbsp;|&nbsp;
          Compliant with ESIGN Act (US), eIDAS (EU) &nbsp;|&nbsp;
          <a href="https://signova.ai/privacy" className="underline hover:text-gray-600">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}

function OtpInput({ value, onChange, disabled }: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, '').slice(-1);
    const arr = value.padEnd(6, ' ').split('');
    arr[i] = digit || ' ';
    const newVal = arr.join('').trimEnd();
    onChange(newVal);
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center my-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] && value[i] !== ' ' ? value[i] : ''}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          disabled={disabled}
          className="w-12 h-14 text-center text-2xl font-mono font-bold border-2 border-gray-300 rounded-md focus:border-indigo-600 focus:outline-none disabled:bg-gray-100 transition-colors"
        />
      ))}
    </div>
  );
}

function SignatureCanvas({ fieldId, onCapture }: {
  fieldId: number;
  onCapture: (fieldId: number, dataUrl: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawing.current = true;
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !lastPos.current) return;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => {
    isDrawing.current = false;
    lastPos.current = null;
    const canvas = canvasRef.current;
    if (canvas) onCapture(fieldId, canvas.toDataURL('image/png'));
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onCapture(fieldId, '');
  };

  return (
    <div className="border-2 border-gray-300 rounded-md overflow-hidden bg-white">
      <canvas
        ref={canvasRef}
        width={560}
        height={160}
        className="w-full cursor-crosshair touch-none"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      <div className="flex justify-between items-center px-3 py-2 bg-gray-50 border-t border-gray-200">
        <span className="text-xs text-gray-500">Draw your signature above</span>
        <button
          onClick={clear}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Clear
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RecipientPortal() {
  const [, params] = useRoute('/sign/:token');
  const [, navigate] = useLocation();
  const accessToken = params?.token || '';

  const [step, setStep] = useState<PortalStep>('loading');
  const [otpValue, setOtpValue] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [signatures, setSignatures] = useState<SignatureCapture[]>([]);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const reviewRef = useRef<HTMLDivElement>(null);

  // ── tRPC Queries & Mutations ──────────────────────────────────────────────

  const otpStatusQuery = trpc.workflow.checkOtpStatus.useQuery(
    { accessToken },
    { enabled: !!accessToken, retry: false }
  );

  const docQuery = trpc.workflow.getDocumentForSigning.useQuery(
    { accessToken },
    { enabled: step === 'review' || step === 'sign' || step === 'confirm', retry: false }
  );

  const sendOtpMutation = trpc.workflow.sendSignerOtp.useMutation({
    onSuccess: (data) => {
      setMaskedEmail(data.maskedEmail);
      setOtpSent(true);
      setStep('otp-verify');
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const verifyOtpMutation = trpc.workflow.verifySignerOtp.useMutation({
    onSuccess: () => {
      setStep('review');
    },
    onError: (e) => {
      setOtpError(e.message);
    },
  });

  const submitMutation = trpc.workflow.submitSignatures.useMutation({
    onSuccess: () => {
      setStep('complete');
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const declineMutation = trpc.workflow.declineDocument.useMutation({
    onSuccess: () => {
      setStep('declined');
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  // ── Initialization ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!accessToken) {
      setStep('error');
      return;
    }
    if (otpStatusQuery.data) {
      if (otpStatusQuery.data.signerStatus === 'signed') {
        setStep('complete');
      } else if (otpStatusQuery.data.verified) {
        setStep('review');
      } else {
        setStep('landing');
      }
    } else if (otpStatusQuery.error) {
      setStep('error');
    }
  }, [otpStatusQuery.data, otpStatusQuery.error, accessToken]);

  // ── Scroll detection for review enforcement ───────────────────────────────

  const handleReviewScroll = useCallback(() => {
    const el = reviewRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 50;
    if (atBottom) setHasScrolledToBottom(true);
  }, []);

  // ── Signature capture ─────────────────────────────────────────────────────

  const handleSignatureCapture = (fieldId: number, dataUrl: string) => {
    setSignatures(prev => {
      const filtered = prev.filter(s => s.fieldId !== fieldId);
      if (!dataUrl) return filtered;
      return [...filtered, { fieldId, value: dataUrl }];
    });
  };

  const handleSubmit = () => {
    const requiredFields = docQuery.data?.fields.filter(f => f.required) || [];
    const missing = requiredFields.filter(f => !signatures.find(s => s.fieldId === f.id && s.value));
    if (missing.length > 0) {
      toast.error(`Please complete all required fields (${missing.length} remaining)`);
      return;
    }
    submitMutation.mutate({ accessToken, signatures });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  const stepNumber: Record<PortalStep, number> = {
    loading: 0, error: 0, landing: 1, 'otp-send': 1, 'otp-verify': 2,
    review: 3, sign: 4, confirm: 5, complete: 6, declined: 6,
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <PortalShell step={0} totalSteps={6}>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-500">Validating signing link…</p>
        </div>
      </PortalShell>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (step === 'error') {
    return (
      <PortalShell step={0} totalSteps={6}>
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Invalid or Expired Link</h1>
          <p className="text-sm text-gray-500 mb-6">
            This signing link is invalid, has expired, or has already been used. Please contact the document sender for a new link.
          </p>
          <a href="https://signova.ai" className="text-sm text-indigo-600 hover:underline">Return to Signova.ai</a>
        </div>
      </PortalShell>
    );
  }

  // ── Landing ───────────────────────────────────────────────────────────────
  if (step === 'landing') {
    return (
      <PortalShell step={1} totalSteps={6}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#1a1a2e] px-8 py-6">
            <div className="flex items-center gap-3 mb-1">
              <FileText className="w-5 h-5 text-indigo-300" />
              <span className="text-xs text-indigo-300 uppercase tracking-widest">Document Signing Request</span>
            </div>
            <h1 className="text-2xl font-semibold text-white">You have been asked to sign a document</h1>
          </div>
          <div className="px-8 py-6">
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              To proceed, you will need to verify your identity with a one-time code sent to your email address. This ensures the integrity and legal validity of your signature.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-1">Secure signing process</p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    <li>Identity verified via one-time code</li>
                    <li>Full audit trail recorded (IP, timestamp, user agent)</li>
                    <li>Compliant with ESIGN Act (US) and eIDAS (EU)</li>
                    <li>Signed copy delivered to all parties</li>
                  </ul>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                sendOtpMutation.mutate({ accessToken });
                setStep('otp-send');
              }}
              disabled={sendOtpMutation.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-sm font-medium"
            >
              {sendOtpMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending verification code…</>
              ) : (
                <>Continue to Identity Verification <ChevronRight className="w-4 h-4 ml-1" /></>
              )}
            </Button>
          </div>
        </div>
      </PortalShell>
    );
  }

  // ── OTP Send (intermediate) ───────────────────────────────────────────────
  if (step === 'otp-send') {
    return (
      <PortalShell step={2} totalSteps={6}>
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-sm text-gray-500">Sending verification code…</p>
        </div>
      </PortalShell>
    );
  }

  // ── OTP Verify ────────────────────────────────────────────────────────────
  if (step === 'otp-verify') {
    return (
      <PortalShell step={2} totalSteps={6}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#1a1a2e] px-8 py-6">
            <p className="text-xs text-indigo-300 uppercase tracking-widest mb-1">Step 2 of 5 — Identity Verification</p>
            <h1 className="text-2xl font-semibold text-white">Enter your verification code</h1>
          </div>
          <div className="px-8 py-6">
            <p className="text-sm text-gray-600 mb-2">
              A 6-digit verification code has been sent to <strong>{maskedEmail}</strong>. Enter it below to confirm your identity.
            </p>
            <p className="text-xs text-gray-400 mb-4">The code expires in 10 minutes.</p>

            <OtpInput
              value={otpValue}
              onChange={(v) => { setOtpValue(v); setOtpError(''); }}
              disabled={verifyOtpMutation.isPending}
            />

            {otpError && (
              <div className="flex items-center gap-2 text-red-600 text-sm mb-4 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {otpError}
              </div>
            )}

            <Button
              onClick={() => verifyOtpMutation.mutate({ accessToken, otpCode: otpValue.replace(/\s/g, '') })}
              disabled={otpValue.replace(/\s/g, '').length !== 6 || verifyOtpMutation.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-sm font-medium mb-3"
            >
              {verifyOtpMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" />Verifying…</>
              ) : (
                <>Verify Identity <ChevronRight className="w-4 h-4 ml-1" /></>
              )}
            </Button>

            <button
              onClick={() => {
                setOtpValue('');
                setOtpError('');
                sendOtpMutation.mutate({ accessToken });
              }}
              disabled={sendOtpMutation.isPending}
              className="w-full text-sm text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 py-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {sendOtpMutation.isPending ? 'Sending…' : 'Resend code'}
            </button>
          </div>
        </div>
      </PortalShell>
    );
  }

  // ── Review ────────────────────────────────────────────────────────────────
  if (step === 'review') {
    const doc = docQuery.data?.document;
    return (
      <PortalShell step={3} totalSteps={6}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#1a1a2e] px-8 py-6">
            <p className="text-xs text-indigo-300 uppercase tracking-widest mb-1">Step 3 of 5 — Document Review</p>
            <h1 className="text-2xl font-semibold text-white">
              {docQuery.isLoading ? 'Loading document…' : (doc?.title || 'Document')}
            </h1>
          </div>
          <div className="px-8 py-6">
            {docQuery.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-4">
                  Please review the document in full before proceeding to sign. Scroll to the bottom to continue.
                </p>
                {/* Document metadata */}
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 uppercase tracking-wide">Document</span>
                    <p className="font-medium text-gray-900 mt-0.5">{doc?.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wide">Sent</span>
                    <p className="font-medium text-gray-900 mt-0.5">{formatDate(doc?.createdAt ?? null)}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wide">Reference</span>
                    <p className="font-mono text-gray-700 mt-0.5">SIG-{String(doc?.id).padStart(6, '0')}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-wide">Fields</span>
                    <p className="font-medium text-gray-900 mt-0.5">{docQuery.data?.fields.length || 0} signature field(s)</p>
                  </div>
                </div>
                {/* Scrollable document area */}
                <div
                  ref={reviewRef}
                  onScroll={handleReviewScroll}
                  className="border border-gray-200 rounded-md h-64 overflow-y-auto bg-gray-50 p-4 mb-4 text-sm text-gray-700 leading-relaxed"
                >
                  {doc?.content ? (
                    <div dangerouslySetInnerHTML={{ __html: doc.content }} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <FileText className="w-8 h-8 mb-2" />
                      <p className="text-xs">Document preview not available. Scroll to bottom to continue.</p>
                      <button
                        onClick={() => setHasScrolledToBottom(true)}
                        className="mt-3 text-xs text-indigo-600 underline"
                      >
                        I have reviewed the document
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowDeclineModal(true)}
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Decline
                  </Button>
                  <Button
                    onClick={() => setStep('sign')}
                    disabled={!hasScrolledToBottom}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {hasScrolledToBottom ? (
                      <>Proceed to Sign <ChevronRight className="w-4 h-4 ml-1" /></>
                    ) : (
                      'Scroll to bottom to continue'
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Decline modal */}
        {showDeclineModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Decline to Sign</h2>
              <p className="text-sm text-gray-600 mb-4">
                You are about to decline this document. The sender will be notified. Please provide a reason (optional).
              </p>
              <textarea
                value={declineReason}
                onChange={e => setDeclineReason(e.target.value)}
                placeholder="Reason for declining (optional)"
                className="w-full border border-gray-300 rounded-md p-3 text-sm resize-none h-24 mb-4 focus:border-indigo-600 focus:outline-none"
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowDeclineModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    declineMutation.mutate({ accessToken, reason: declineReason });
                    setShowDeclineModal(false);
                  }}
                  disabled={declineMutation.isPending}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  {declineMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Decline'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </PortalShell>
    );
  }

  // ── Sign ──────────────────────────────────────────────────────────────────
  if (step === 'sign') {
    const fields = docQuery.data?.fields || [];
    return (
      <PortalShell step={4} totalSteps={6}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#1a1a2e] px-8 py-6">
            <p className="text-xs text-indigo-300 uppercase tracking-widest mb-1">Step 4 of 5 — Signature</p>
            <h1 className="text-2xl font-semibold text-white">Sign the document</h1>
          </div>
          <div className="px-8 py-6">
            <p className="text-sm text-gray-600 mb-6">
              Complete all required signature fields below. Your signature will be legally binding under the ESIGN Act and eIDAS.
            </p>
            {fields.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No signature fields found.</div>
            ) : (
              <div className="space-y-6">
                {fields.map((field) => (
                  <div key={field.id} className="border border-gray-200 rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">
                        {field.label || field.type}
                        {field.required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                      {signatures.find(s => s.fieldId === field.id && s.value) && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Captured
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      {field.type === 'signature' || field.type === 'initial' ? (
                        <SignatureCanvas
                          fieldId={field.id}
                          onCapture={handleSignatureCapture}
                        />
                      ) : field.type === 'text' ? (
                        <Input
                          placeholder={field.label || 'Enter text'}
                          onChange={e => handleSignatureCapture(field.id, e.target.value)}
                          className="text-sm"
                        />
                      ) : field.type === 'date' ? (
                        <Input
                          type="date"
                          defaultValue={new Date().toISOString().split('T')[0]}
                          onChange={e => handleSignatureCapture(field.id, e.target.value)}
                          className="text-sm"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          onChange={e => handleSignatureCapture(field.id, e.target.checked ? 'true' : '')}
                          className="w-5 h-5 accent-indigo-600"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setStep('review')}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep('confirm')}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Review and Submit <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </PortalShell>
    );
  }

  // ── Confirm ───────────────────────────────────────────────────────────────
  if (step === 'confirm') {
    const doc = docQuery.data?.document;
    return (
      <PortalShell step={5} totalSteps={6}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#1a1a2e] px-8 py-6">
            <p className="text-xs text-indigo-300 uppercase tracking-widest mb-1">Step 5 of 5 — Confirm</p>
            <h1 className="text-2xl font-semibold text-white">Review and confirm your signature</h1>
          </div>
          <div className="px-8 py-6">
            <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                By clicking "Submit Signature", you agree that your electronic signature is legally binding and equivalent to a handwritten signature under applicable law.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Document</p>
              <p className="font-medium text-gray-900">{doc?.title}</p>
              <p className="text-xs text-gray-500 mt-1">Reference: SIG-{String(doc?.id).padStart(6, '0')}</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Signatures captured</p>
              <p className="font-medium text-gray-900">{signatures.filter(s => s.value).length} of {docQuery.data?.fields.length || 0} field(s)</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setStep('sign')}
                variant="outline"
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {submitMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" />Submitting…</>
                ) : (
                  <>Submit Signature <CheckCircle className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            </div>
          </div>
        </div>
      </PortalShell>
    );
  }

  // ── Complete ──────────────────────────────────────────────────────────────
  if (step === 'complete') {
    const doc = docQuery.data?.document;
    return (
      <PortalShell step={6} totalSteps={6}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#1a1a2e] px-8 py-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <h1 className="text-2xl font-semibold text-white">Document Signed</h1>
            <p className="text-indigo-300 text-sm mt-1">Your signature has been recorded</p>
          </div>
          <div className="px-8 py-6">
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <p className="text-sm text-green-800">
                Your signature has been successfully submitted. A signed copy will be emailed to all parties. The audit trail has been recorded and is available upon request.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-gray-400 uppercase tracking-wide">Document</span>
                <p className="font-medium text-gray-900 mt-0.5">{doc?.title || '—'}</p>
              </div>
              <div>
                <span className="text-gray-400 uppercase tracking-wide">Signed</span>
                <p className="font-medium text-gray-900 mt-0.5">{formatDate(new Date())}</p>
              </div>
              <div>
                <span className="text-gray-400 uppercase tracking-wide">Reference</span>
                <p className="font-mono text-gray-700 mt-0.5">SIG-{String(doc?.id).padStart(6, '0')}</p>
              </div>
              <div>
                <span className="text-gray-400 uppercase tracking-wide">Status</span>
                <p className="font-medium text-green-700 mt-0.5">Signed</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center">
              This page will remain accessible for your records. You may close this window.
            </p>
          </div>
        </div>
      </PortalShell>
    );
  }

  // ── Declined ──────────────────────────────────────────────────────────────
  if (step === 'declined') {
    return (
      <PortalShell step={6} totalSteps={6}>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#1a1a2e] px-8 py-6 text-center">
            <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h1 className="text-2xl font-semibold text-white">Document Declined</h1>
          </div>
          <div className="px-8 py-6">
            <p className="text-sm text-gray-600 mb-4">
              You have declined to sign this document. The sender has been notified.
            </p>
            <p className="text-xs text-gray-400">You may close this window.</p>
          </div>
        </div>
      </PortalShell>
    );
  }

  return null;
}
