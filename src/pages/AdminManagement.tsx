import { useLocation } from 'wouter';
import { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, CheckCircle, XCircle } from 'lucide-react';

export default function AdminManagement() {
  // Admin auth guard - check if user is admin
  const [, navigate] = useLocation();
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  const adminEmails = ['peter.arshi@gmail.com', 'admin@signova.ai'];
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userEmail = payload.email || '';
      const isAdmin = adminEmails.includes(userEmail) || payload.role === 'admin';
      if (!isAdmin) {
        navigate('/dashboard');
      }
    } catch {
      navigate('/login');
    }
  }, [token]);

  const [activeSection, setActiveSection] = useState('users');
  const [complimentaryGrants, setComplimentaryGrants] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [message, setMessage] = useState({ type: '', text: '' });

  // User Management Form State
  const [newUser, setNewUser] = useState({
    email: '',
    tier: 'professional',
    isComplimentary: false,
    durationType: 'months',
    duration: '3',
    expiryDate: '',
    reason: ''
  });

  // Team Member Form State
  const [newTeamMember, setNewTeamMember] = useState({
    email: '',
    role: 'monitor'
  });

  useEffect(() => {
    if (activeSection === 'users') {
      fetchComplimentaryGrants();
    } else if (activeSection === 'team') {
      fetchTeamMembers();
    }
  }, [activeSection]);

  const fetchComplimentaryGrants = async () => {
    try {
      const response = await fetch('/api/admin/users/complimentary');
      const data = await response.json();
      setComplimentaryGrants(data.grants || []);
    } catch (error) {
      console.error('Error fetching grants:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/admin/team/members');
      const data = await response.json();
      setTeamMembers(data.members || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'User added successfully!' });
        setNewUser({ email: '', tier: 'professional', isComplimentary: false, durationType: 'months', duration: '3', expiryDate: '', reason: '' });
        fetchComplimentaryGrants();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add user' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding user' });
    }
  };

  const handleGrantAccess = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users/grant-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: newUser.email,
          tier: newUser.tier,
          duration: newUser.duration,
          durationType: newUser.durationType,
          reason: newUser.reason
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Complimentary access granted!' });
        setNewUser({ email: '', tier: 'professional', isComplimentary: false, durationType: 'months', duration: '3', expiryDate: '', reason: '' });
        fetchComplimentaryGrants();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to grant access' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error granting access' });
    }
  };

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/team/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTeamMember)
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Team member added successfully!' });
        setNewTeamMember({ email: '', role: 'monitor' });
        fetchTeamMembers();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to add team member' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding team member' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Admin Management</h1>
          <p className="text-slate-400 mt-2">Manage users, complimentary access, and team members</p>
        </div>

        {/* Message Banner */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setActiveSection('users')}
            className={`px-6 py-3 rounded-lg font-semibold ${activeSection === 'users' ? 'bg-indigo-700 text-white' : 'bg-white text-slate-300'}`}
          >
            <Users className="inline w-5 h-5 mr-2" />
            User Management
          </button>
          <button
            onClick={() => setActiveSection('team')}
            className={`px-6 py-3 rounded-lg font-semibold ${activeSection === 'team' ? 'bg-indigo-700 text-white' : 'bg-white text-slate-300'}`}
          >
            <Shield className="inline w-5 h-5 mr-2" />
            Team Access
          </button>
        </div>

        {/* User Management Section */}
        {activeSection === 'users' && (
          <div className="space-y-6">
            {/* Add User / Grant Access Form */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Add User or Grant Complimentary Access</h2>
              <form onSubmit={newUser.isComplimentary ? handleGrantAccess : handleAddUser} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Subscription Tier</label>
                    <select
                      value={newUser.tier}
                      onChange={(e) => setNewUser({...newUser, tier: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="starter">Starter</option>
                      <option value="professional">Professional</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={newUser.isComplimentary}
                      onChange={(e) => setNewUser({...newUser, isComplimentary: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-slate-300">Grant Complimentary Access (Free)</span>
                  </label>
                </div>
                {newUser.isComplimentary && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Duration Type</label>
                        <select
                          value={newUser.durationType}
                          onChange={(e) => setNewUser({...newUser, durationType: e.target.value})}
                          className="w-full px-4 py-2 border rounded-lg"
                        >
                          <option value="days">Days</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                          <option value="lifetime">Lifetime (No Expiry)</option>
                        </select>
                      </div>
                      {newUser.durationType !== 'lifetime' && (
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Duration</label>
                          <input
                            type="number"
                            min="1"
                            value={newUser.duration}
                            onChange={(e) => setNewUser({...newUser, duration: e.target.value})}
                            className="w-full px-4 py-2 border rounded-lg"
                            placeholder="e.g., 3"
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Reason for Complimentary Access</label>
                      <textarea
                        value={newUser.reason}
                        onChange={(e) => setNewUser({...newUser, reason: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg"
                        rows={2}
                        placeholder="e.g., Product Hunt launch special, partnership, beta tester"
                      />
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="w-full bg-indigo-700 text-white py-3 rounded-lg hover:bg-indigo-800 font-semibold"
                >
                  <UserPlus className="inline w-5 h-5 mr-2" />
                  {newUser.isComplimentary ? 'Grant Complimentary Access' : 'Add New User'}
                </button>
              </form>
            </div>

            {/* Complimentary Grants List */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Complimentary Access Grants</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Tier</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Granted</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Expires</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Days Left</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-slate-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {complimentaryGrants.length > 0 ? (
                      complimentaryGrants.map((grant, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-sm">{grant.email}</td>
                          <td className="px-4 py-3 text-sm">{grant.tier}</td>
                          <td className="px-4 py-3 text-sm">{new Date(grant.grantedAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3 text-sm">{grant.expiresAt ? new Date(grant.expiresAt).toLocaleDateString() : 'Never'}</td>
                          <td className="px-4 py-3 text-sm">{grant.daysRemaining || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs ${grant.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-800 text-slate-200'}`}>
                              {grant.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                          No complimentary access granted yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Team Access Section */}
        {activeSection === 'team' && (
          <div className="space-y-6">
            {/* Add Team Member Form */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Add Team Member</h2>
              <form onSubmit={handleAddTeamMember} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={newTeamMember.email}
                      onChange={(e) => setNewTeamMember({...newTeamMember, email: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                    <select
                      value={newTeamMember.role}
                      onChange={(e) => setNewTeamMember({...newTeamMember, role: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="admin">Admin (Full Access)</option>
                      <option value="monitor">Monitor (Read Only)</option>
                      <option value="support">Support (Customer Access)</option>
                      <option value="marketing">Marketing (Campaign Access)</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                >
                  <Shield className="inline w-5 h-5 mr-2" />
                  Add Team Member
                </button>
              </form>
            </div>

            {/* Role Permissions Info */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Role Permissions</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-indigo-600">Admin</div>
                  <ul className="list-disc list-inside text-slate-300 mt-1 space-y-1">
                    <li>Full dashboard access</li>
                    <li>User management</li>
                    <li>Campaign approval</li>
                    <li>Team management</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-blue-600">Monitor</div>
                  <ul className="list-disc list-inside text-slate-300 mt-1 space-y-1">
                    <li>View all metrics</li>
                    <li>Export reports</li>
                    <li>No editing permissions</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-green-600">Support</div>
                  <ul className="list-disc list-inside text-slate-300 mt-1 space-y-1">
                    <li>View customer data</li>
                    <li>Grant complimentary access</li>
                    <li>Manage user issues</li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-orange-600">Marketing</div>
                  <ul className="list-disc list-inside text-slate-300 mt-1 space-y-1">
                    <li>View marketing metrics</li>
                    <li>Approve campaigns</li>
                    <li>Manage content</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Team Members List */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Current Team Members</h2>
              <div className="space-y-3">
                {/* Owner */}
                <div className="flex items-center justify-between p-4 border rounded-lg bg-indigo-50">
                  <div>
                    <div className="font-semibold">admin@signova.ai</div>
                    <div className="text-sm text-slate-400">Admin • Full Access</div>
                  </div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                    Owner
                  </span>
                </div>

                {/* Team Members */}
                {teamMembers.length > 0 ? (
                  teamMembers.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-semibold">{member.email}</div>
                        <div className="text-sm text-slate-400">{member.role} • Added {new Date(member.addedAt).toLocaleDateString()}</div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        Active
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400 border-2 border-dashed rounded-lg">
                    No additional team members yet
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
