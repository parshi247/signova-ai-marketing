import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Copy, CheckCircle2, Users, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ReferralPanelProps {
  userEmail?: string;
  userId?: number;
}

export default function ReferralPanel({ userEmail, userId }: ReferralPanelProps) {
  const [copied, setCopied] = useState(false);

  // Generate deterministic referral code from userId
  const referralCode = userId
    ? `SIG-${userId.toString(36).toUpperCase().padStart(6, "0")}`
    : "SIG-XXXXXX";

  const referralLink = `https://signova.ai/register?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleShare = (platform: "email" | "linkedin") => {
    const msg = encodeURIComponent(
      `I've been using Signova AI for document generation and e-signatures — it's significantly cheaper than DocuSign and has AI built in. Use my link for 1 month free: ${referralLink}`
    );
    if (platform === "email") {
      window.open(`mailto:?subject=Try Signova AI — 1 month free&body=${msg}`);
    } else {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`);
    }
  };

  return (
    <Card className="border border-slate-200 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
          <Gift className="w-5 h-5 text-emerald-600" />
          Refer & Earn — Give 1 Month Free, Get 1 Month Free
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* How it works */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Copy, step: "1", label: "Share your link", desc: "Send to a colleague or post online" },
            { icon: Users, step: "2", label: "They sign up & pay", desc: "Must convert to a paid plan" },
            { icon: Gift, step: "3", label: "Both get 1 month free", desc: "Applied to your next billing cycle" },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                {item.step}
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900">{item.label}</div>
                <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Referral link */}
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Your Referral Link</label>
          <div className="flex gap-2">
            <div className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 font-mono truncate">
              {referralLink}
            </div>
            <Button
              onClick={handleCopy}
              size="sm"
              className={`shrink-0 ${copied ? "bg-emerald-600 hover:bg-emerald-600" : "bg-slate-900 hover:bg-slate-800"} text-white`}
            >
              {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="ml-1.5">{copied ? "Copied!" : "Copy"}</span>
            </Button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => handleShare("email")}
            variant="outline"
            size="sm"
            className="flex-1 text-xs border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Share via Email
          </Button>
          <Button
            onClick={() => handleShare("linkedin")}
            variant="outline"
            size="sm"
            className="flex-1 text-xs border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Share on LinkedIn
          </Button>
        </div>

        {/* Terms */}
        <div className="flex gap-2 p-3 rounded-lg bg-amber-50 border border-amber-100">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Referral credit is applied after your referred contact converts to a paid plan and completes their first billing cycle. Maximum 12 months of free credit per account. Fraud detection is active — self-referrals and duplicate accounts are not eligible.
          </p>
        </div>

        {/* Stats placeholder */}
        <div className="grid grid-cols-3 gap-3 pt-1">
          {[
            { label: "Referrals Sent", value: "0" },
            { label: "Converted", value: "0" },
            { label: "Months Earned", value: "0" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
