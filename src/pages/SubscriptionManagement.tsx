import { useState } from "react";
import { trpc } from "../lib/trpc";
import { useLocation } from "wouter";

export default function SubscriptionManagement() {
  const [, setLocation] = useLocation();
  const { data: user } = trpc.auth.me.useQuery();
  const { data: subscription } = trpc.subscription.getSubscription.useQuery();
  const createPortalSession = trpc.subscription.createPortalSession.useMutation();
  const cancelSubscription = trpc.subscription.cancelSubscription.useMutation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleManageBilling = async () => {
    try {
      const { url } = await createPortalSession.mutateAsync();
      window.location.href = url;
    } catch (error) {
      console.error("Failed to create portal session:", error);
      alert("Failed to open billing portal. Please try again.");
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription.mutateAsync();
      setShowCancelConfirm(false);
      alert("Your subscription has been cancelled. You'll retain access until the end of your billing period.");
      window.location.reload();
    } catch (error) {
      console.error("Failed to cancel subscription:", error);
      alert("Failed to cancel subscription. Please try again.");
    }
  };

  const tierInfo = {
    free: {
      name: "Free",
      price: "$0",
      features: ["5 documents/month", "Basic e-signature", "Email support"],
    },
    professional: {
      name: "Professional",
      price: "$49/month",
      features: ["100 documents/month", "AI-powered signature detection", "Advanced workflow automation", "Email support", "Custom branding"],
    },
    business: {
      name: "Business",
      price: "$149/month",
      features: ["Unlimited documents", "Team collaboration", "API access", "Priority support", "Advanced analytics", "Custom integrations"],
    },
    enterprise: {
      name: "Enterprise",
      price: "Custom",
      features: ["Everything in Business", "Dedicated account manager", "SLA guarantee", "Custom deployment", "Advanced security"],
    },
  };

  const currentTier = user?.subscriptionTier || "free";
  const currentTierInfo = tierInfo[currentTier as keyof typeof tierInfo];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>

      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-indigo-600">{currentTierInfo.name}</p>
            <p className="text-gray-600">{currentTierInfo.price}</p>
            <p className="text-sm text-gray-500 mt-2">
              Status: <span className={`font-semibold ${user?.subscriptionStatus === "active" ? "text-green-600" : "text-red-600"}`}>
                {user?.subscriptionStatus || "inactive"}
              </span>
            </p>
            {subscription?.nextBillingDate && (
              <p className="text-sm text-gray-500">
                Next billing date: {new Date(subscription.nextBillingDate).toLocaleDateString()}
              </p>
            )}
          </div>
          <div className="space-x-4">
            {currentTier !== "free" && (
              <>
                <button
                  onClick={handleManageBilling}
                  className="bg-indigo-700 text-white px-6 py-2 rounded-lg hover:bg-indigo-800"
                  disabled={createPortalSession.isLoading}
                >
                  {createPortalSession.isLoading ? "Loading..." : "Manage Billing"}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  Cancel Subscription
                </button>
              </>
            )}
          </div>
        </div>

        {/* Current Plan Features */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Your Plan Includes:</h3>
          <ul className="space-y-2">
            {currentTierInfo.features.map((feature, index) => (
              <li key={index} className="flex items-center text-gray-700">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Usage This Month</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <p className="text-gray-600 text-sm">Documents Sent</p>
            <p className="text-3xl font-bold text-indigo-600">{subscription?.documentsUsed || 0}</p>
            <p className="text-sm text-gray-500">
              of {subscription?.documentsLimit === -1 ? "unlimited" : subscription?.documentsLimit || 5}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-gray-600 text-sm">Storage Used</p>
            <p className="text-3xl font-bold text-indigo-600">{subscription?.storageUsed || 0} MB</p>
            <p className="text-sm text-gray-500">
              of {subscription?.storageLimit === -1 ? "unlimited" : `${subscription?.storageLimit || 100} MB`}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-gray-600 text-sm">Credits Remaining</p>
            <p className="text-3xl font-bold text-indigo-600">{user?.credits || 0}</p>
            <p className="text-sm text-gray-500">
              <a href="/credits" className="text-indigo-600 hover:underline">Purchase more</a>
            </p>
          </div>
        </div>
      </div>

      {/* Upgrade Options */}
      {currentTier !== "enterprise" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Upgrade Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(tierInfo).map(([tier, info]) => {
              if (tier === "free" || tier === currentTier) return null;
              return (
                <div key={tier} className="border rounded-lg p-6 hover:border-indigo-600 transition">
                  <h3 className="text-xl font-bold mb-2">{info.name}</h3>
                  <p className="text-2xl font-bold text-indigo-600 mb-4">{info.price}</p>
                  <ul className="space-y-2 mb-6">
                    {info.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setLocation(`/checkout?plan=${tier}`)}
                    className="w-full bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-800"
                  >
                    Upgrade to {info.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md">
            <h3 className="text-xl font-bold mb-4">Cancel Subscription?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? You'll retain access until the end of your current billing period.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                disabled={cancelSubscription.isLoading}
              >
                {cancelSubscription.isLoading ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
