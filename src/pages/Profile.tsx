import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Building2, 
  CreditCard, 
  Users, 
  Bell, 
  Shield, 
  Key,
  Trash2,
  LogOut,
  Crown,
  AlertCircle
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Profile() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("account");

  const handleUpgrade = () => {
    navigate('/credits');
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Please log in to view your profile.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-1">Manage your profile and preferences</p>
          </div>
          <Button
            variant="outline"
            onClick={() => logout()}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Subscription Badge */}
        <Card className="p-6 bg-gradient-to-r from-slate-50 to-indigo-50 border-indigo-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="h-8 w-8 text-indigo-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.subscriptionTier?.charAt(0).toUpperCase() + user.subscriptionTier?.slice(1)} Plan
                </h3>
                <p className="text-sm text-gray-600">
                  Status: <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                    {user.subscriptionStatus}
                  </Badge>
                </p>
              </div>
            </div>
            <Button variant="default" className="bg-indigo-700 hover:bg-indigo-800" onClick={handleUpgrade}>
              Upgrade Plan
            </Button>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="account" className="gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="company" className="gap-2">
              <Building2 className="h-4 w-4" />
              Company
            </TabsTrigger>
            <TabsTrigger value="subscription" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="team" className="gap-2">
              <Users className="h-4 w-4" />
              Team
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences" className="gap-2">
              <Bell className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account">
            <AccountSettings user={user} />
          </TabsContent>

          {/* Company Tab */}
          <TabsContent value="company">
            <CompanySettings user={user} />
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <SubscriptionSettings user={user} />
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <TeamSettings user={user} />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <SecuritySettings user={user} />
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <PreferencesSettings user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

// Account Settings Component
function AccountSettings({ user }: { user: any }) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");

  const updateProfile = trpc.profile.updateAccount.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSave = () => {
    updateProfile.mutate({ name, email, phone });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Smith"
          />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@company.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        <Button onClick={handleSave} disabled={updateProfile.isPending}>
          {updateProfile.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  );
}

// Company Settings Component
function CompanySettings({ user }: { user: any }) {
  const [company, setCompany] = useState(user.company || "");
  const [industry, setIndustry] = useState(user.industry || "");
  const [jurisdiction, setJurisdiction] = useState(user.jurisdiction || "");

  const updateCompany = trpc.profile.updateCompany.useMutation({
    onSuccess: () => {
      toast.success("Company information updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSave = () => {
    updateCompany.mutate({ company, industry, jurisdiction });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Company Information</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="company">Company Name</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Corporation"
          />
        </div>
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Input
            id="industry"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Legal, Real Estate, Healthcare, etc."
          />
        </div>
        <div>
          <Label htmlFor="jurisdiction">Primary Jurisdiction</Label>
          <Input
            id="jurisdiction"
            value={jurisdiction}
            onChange={(e) => setJurisdiction(e.target.value)}
            placeholder="California, USA"
          />
        </div>
        <Button onClick={handleSave} disabled={updateCompany.isPending}>
          {updateCompany.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  );
}

// Subscription Settings Component
function SubscriptionSettings({ user }: { user: any }) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const cancelSubscription = trpc.subscription.cancel.useMutation({
    onSuccess: () => {
      toast.success("Subscription cancelled. You'll have access until the end of your billing period.");
      setShowCancelDialog(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCancel = () => {
    cancelSubscription.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Current Plan</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Plan</p>
              <p className="text-sm text-gray-600">
                {user.subscriptionTier?.charAt(0).toUpperCase() + user.subscriptionTier?.slice(1)}
              </p>
            </div>
            <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
              {user.subscriptionStatus}
            </Badge>
          </div>
          {user.subscriptionStartDate && (
            <div>
              <p className="font-medium">Billing Cycle</p>
              <p className="text-sm text-gray-600">
                Started: {new Date(user.subscriptionStartDate).toLocaleDateString()}
              </p>
            </div>
          )}
          {user.trialEndsAt && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">
                Trial ends: {new Date(user.trialEndsAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Payment Method */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <CreditCard className="h-8 w-8 text-gray-400" />
            <div>
              <p className="font-medium">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-600">Expires 12/2025</p>
            </div>
          </div>
          <Button variant="outline">Update Payment Method</Button>
        </div>
      </Card>

      {/* Billing History */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Billing History</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-3 border-b">
            <div>
              <p className="font-medium">Professional Plan</p>
              <p className="text-sm text-gray-600">Dec 1, 2024</p>
            </div>
            <div className="text-right">
              <p className="font-medium">$15.00</p>
              <Button variant="link" className="h-auto p-0 text-sm">Download</Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Cancel Subscription */}
      {user.subscriptionTier !== 'free' && (
        <Card className="p-6 border-red-200">
          <h2 className="text-xl font-semibold mb-4 text-red-900">Danger Zone</h2>
          <p className="text-sm text-gray-600 mb-4">
            Cancel your subscription. You'll continue to have access until the end of your billing period.
          </p>
          <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                Cancel Subscription
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will cancel your subscription at the end of the current billing period. 
                  You'll lose access to premium features after {user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString() : 'your billing period ends'}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancel}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {cancelSubscription.isPending ? "Cancelling..." : "Yes, Cancel"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      )}
    </div>
  );
}

// Team Settings Component
function TeamSettings({ user }: { user: any }) {
  const isBusinessOrEnterprise = ['business', 'enterprise'].includes(user.subscriptionTier || '');

  if (!isBusinessOrEnterprise) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Team Features Available on Business & Enterprise Plans</h3>
          <p className="text-gray-600 mb-6">
            Upgrade to collaborate with your team and manage multiple users.
          </p>
          <Button className="bg-indigo-700 hover:bg-indigo-800" onClick={handleUpgrade}>
            Upgrade to Business
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Team Members</h2>
        <Button>
          <Users className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          <Badge>Owner</Badge>
        </div>
      </div>
    </Card>
  );
}

// Security Settings Component
function SecuritySettings({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div>
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
          <Button>Update Password</Button>
        </div>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Two-Factor Authentication</h2>
        <div className="flex items-start gap-4">
          <Shield className="h-6 w-6 text-green-600 mt-1" />
          <div className="flex-1">
            <p className="font-medium mb-2">Enhance your account security</p>
            <p className="text-sm text-gray-600 mb-4">
              Add an extra layer of security to your account by enabling two-factor authentication.
            </p>
            <Button variant="outline">Enable 2FA</Button>
          </div>
        </div>
      </Card>

      {/* API Keys */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">API Keys</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Key className="h-6 w-6 text-gray-400" />
            <div className="flex-1">
              <p className="font-medium">No API keys created</p>
              <p className="text-sm text-gray-600">Create an API key to integrate Signova with your applications</p>
            </div>
          </div>
          <Button variant="outline">Generate API Key</Button>
        </div>
      </Card>

      {/* Delete Account */}
      <Card className="p-6 border-red-200">
        <h2 className="text-xl font-semibold mb-4 text-red-900">Delete Account</h2>
        <div className="flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-red-600 mt-1" />
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    Yes, Delete My Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Preferences Settings Component
function PreferencesSettings({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      {/* Email Notifications */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Email Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Document Activity</p>
              <p className="text-sm text-gray-600">Receive emails when documents are signed or viewed</p>
            </div>
            <input type="checkbox" className="h-5 w-5" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Marketing Emails</p>
              <p className="text-sm text-gray-600">Receive product updates and promotional content</p>
            </div>
            <input type="checkbox" className="h-5 w-5" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Billing Notifications</p>
              <p className="text-sm text-gray-600">Receive emails about invoices and payment issues</p>
            </div>
            <input type="checkbox" className="h-5 w-5" defaultChecked />
          </div>
        </div>
      </Card>

      {/* Language & Region */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Language & Region</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <select id="language" className="w-full border rounded-md p-2">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <select id="timezone" className="w-full border rounded-md p-2">
              <option>Pacific Time (PT)</option>
              <option>Mountain Time (MT)</option>
              <option>Central Time (CT)</option>
              <option>Eastern Time (ET)</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  );
}
