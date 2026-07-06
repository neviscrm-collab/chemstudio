import { motion } from 'framer-motion';
import { User, Bell, Lock, Palette, Buildings, Users, Robot, Database } from '@phosphor-icons/react';
import { CURRENT_USER } from '../../data/mockData';
import { Avatar } from '../ui/Avatar';
import { useState } from 'react';

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'organization', label: 'Organization', icon: Buildings },
  { id: 'team', label: 'Team & Access', icon: Users },
  { id: 'ai', label: 'AI Settings', icon: Robot },
  { id: 'data', label: 'Data & Export', icon: Database },
];

function Toggle({ on }: { on: boolean }) {
  const [active, setActive] = useState(on);
  return (
    <div
      onClick={() => setActive(!active)}
      className={`w-10 h-5 rounded-full cursor-pointer transition-colors mt-0.5 shrink-0 relative ${active ? 'bg-blue-600' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${active ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </div>
  );
}

const TEAM_MEMBERS = [
  { name: 'Dr. Sarah Chen', email: 'sarah.chen@pharma.com', role: 'Principal Investigator', access: 'Admin', avatar: 'SC' },
  { name: 'Marcus Rodriguez', email: 'marcus.r@pharma.com', role: 'Medicinal Chemist', access: 'Editor', avatar: 'MR' },
  { name: 'Dr. Yuki Tanaka', email: 'yuki.t@pharma.com', role: 'Computational Chemist', access: 'Editor', avatar: 'YT' },
  { name: 'Alex Kim', email: 'alex.k@pharma.com', role: 'Research Associate', access: 'Viewer', avatar: 'AK' },
];

const ACCESS_COLORS: Record<string, string> = {
  Admin: 'text-purple-700 bg-purple-50',
  Editor: 'text-blue-700 bg-blue-50',
  Viewer: 'text-gray-600 bg-gray-100',
};

export function Settings() {
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.2 } }} className="flex-1 flex overflow-hidden" style={{ background: '#f7f8fc' }}>
      {/* Sidebar */}
      <div className="w-52 bg-white border-r border-gray-100 flex flex-col p-3 gap-0.5">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 py-2 mb-1">Settings</div>
        {SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors text-left ${
                activeSection === s.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              <Icon size={14} weight={activeSection === s.id ? 'fill' : 'regular'} />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[640px] space-y-6">

          {/* ── PROFILE ── */}
          {activeSection === 'profile' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Profile</h2>
                <p className="text-sm text-gray-400 mt-0.5">Manage your personal information and preferences</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar user={CURRENT_USER} size="lg" />
                  <div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">Change photo</button>
                    <p className="text-xs text-gray-400 mt-0.5">JPG, PNG up to 2MB</p>
                  </div>
                </div>

                {[
                  { label: 'Full Name', value: CURRENT_USER.name, type: 'text' },
                  { label: 'Email', value: CURRENT_USER.email, type: 'email' },
                  { label: 'Title', value: CURRENT_USER.title, type: 'text' },
                  { label: 'Department', value: CURRENT_USER.department, type: 'text' },
                ].map(({ label, value, type }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
                    <input
                      type={type}
                      defaultValue={value}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                ))}

                <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200">
                  Save Changes
                </button>
              </div>
            </>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeSection === 'notifications' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-400 mt-0.5">Choose what alerts you want to receive</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-1">
                {[
                  { label: 'Experiment completed', desc: 'Notify when a running experiment finishes', on: true },
                  { label: 'New publication added', desc: 'Alert when a teammate adds a publication', on: true },
                  { label: 'Patent status change', desc: 'Notify when a patent moves to a new status', on: true },
                  { label: 'Milestone reached', desc: 'Celebrate project milestone completions', on: false },
                  { label: 'Weekly digest', desc: 'Summary of activity across all projects every Monday', on: true },
                  { label: 'Mention & comments', desc: 'Get notified when someone mentions you', on: false },
                ].map(({ label, desc, on }) => (
                  <div key={label} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                    </div>
                    <Toggle on={on} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── SECURITY ── */}
          {activeSection === 'security' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Security</h2>
                <p className="text-sm text-gray-400 mt-0.5">Protect your account with strong security settings</p>
              </div>

              {/* Password */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="text-sm font-semibold text-gray-800">Change Password</div>
                {[
                  { label: 'Current Password', placeholder: '••••••••' },
                  { label: 'New Password', placeholder: 'At least 8 characters' },
                  { label: 'Confirm New Password', placeholder: 'Repeat new password' },
                ].map(({ label, placeholder }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
                    <input
                      type="password"
                      placeholder={placeholder}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                ))}
                <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200">
                  Update Password
                </button>
              </div>

              {/* 2FA */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Two-Factor Authentication</div>
                    <div className="text-xs text-gray-400 mt-0.5">Add an extra layer of security via authenticator app</div>
                  </div>
                  <Toggle on={false} />
                </div>
              </div>

              {/* Sessions */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
                <div className="text-sm font-semibold text-gray-800">Active Sessions</div>
                {[
                  { device: 'MacBook Pro — Chrome', location: 'San Francisco, CA', time: 'Active now', current: true },
                  { device: 'iPhone 15 — Safari', location: 'San Francisco, CA', time: '2 hours ago', current: false },
                  { device: 'Windows PC — Firefox', location: 'New York, NY', time: '3 days ago', current: false },
                ].map(({ device, location, time, current }) => (
                  <div key={device} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <div className="text-sm text-gray-800 font-medium flex items-center gap-2">
                        {device}
                        {current && <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold">Current</span>}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">{location} · {time}</div>
                    </div>
                    {!current && (
                      <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── APPEARANCE ── */}
          {activeSection === 'appearance' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
                <p className="text-sm text-gray-400 mt-0.5">Customize how ChemStudio looks for you</p>
              </div>

              {/* Theme */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="text-sm font-semibold text-gray-800">Theme</div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'light', label: 'Light', bg: '#ffffff', border: '#e5e7eb' },
                    { id: 'dark', label: 'Dark', bg: '#1e1e2e', border: '#333' },
                    { id: 'system', label: 'System', bg: 'linear-gradient(135deg,#fff 50%,#1e1e2e 50%)', border: '#e5e7eb' },
                  ].map(({ id, label, bg, border }) => (
                    <button
                      key={id}
                      className={`rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all ${id === 'light' ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="w-full h-10 rounded-lg" style={{ background: bg, border: `1px solid ${border}` }} />
                      <span className="text-xs font-medium text-gray-700">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Density */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="text-sm font-semibold text-gray-800">Density</div>
                <div className="grid grid-cols-3 gap-3">
                  {['Compact', 'Default', 'Comfortable'].map((density) => (
                    <button
                      key={density}
                      className={`rounded-xl border-2 px-3 py-2.5 text-xs font-medium transition-all ${density === 'Default' ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent color */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="text-sm font-semibold text-gray-800">Accent Color</div>
                <div className="flex items-center gap-3">
                  {[
                    { color: '#2563eb', label: 'Blue' },
                    { color: '#7c3aed', label: 'Purple' },
                    { color: '#059669', label: 'Green' },
                    { color: '#dc2626', label: 'Red' },
                    { color: '#d97706', label: 'Amber' },
                    { color: '#0891b2', label: 'Cyan' },
                  ].map(({ color, label }) => (
                    <button
                      key={color}
                      title={label}
                      className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${color === '#2563eb' ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                      style={{ background: color }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── ORGANIZATION ── */}
          {activeSection === 'organization' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Organization</h2>
                <p className="text-sm text-gray-400 mt-0.5">Manage your organization's details</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
                {[
                  { label: 'Organization Name', value: 'NovaPharma Research Institute', type: 'text' },
                  { label: 'Address', value: '123 Discovery Blvd, San Francisco, CA 94107', type: 'text' },
                  { label: 'Website', value: 'https://novapharma.research', type: 'url' },
                  { label: 'Industry', value: 'Pharmaceutical & Biotech', type: 'text' },
                ].map(({ label, value, type }) => (
                  <div key={label}>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">{label}</label>
                    <input
                      type={type}
                      defaultValue={value}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Timezone</label>
                  <select className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white">
                    <option>America/Los_Angeles (UTC−8)</option>
                    <option>America/New_York (UTC−5)</option>
                    <option>Europe/London (UTC+0)</option>
                    <option>Europe/Berlin (UTC+1)</option>
                    <option>Asia/Tokyo (UTC+9)</option>
                  </select>
                </div>

                <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200">
                  Save Changes
                </button>
              </div>
            </>
          )}

          {/* ── TEAM ── */}
          {activeSection === 'team' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Team & Access</h2>
                <p className="text-sm text-gray-400 mt-0.5">Manage team members and their permissions</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                  <span className="text-sm font-semibold text-gray-800">Members ({TEAM_MEMBERS.length})</span>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200">
                    + Invite Member
                  </button>
                </div>

                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left text-xs font-semibold text-gray-400 px-5 py-2.5">Name</th>
                      <th className="text-left text-xs font-semibold text-gray-400 px-3 py-2.5">Role</th>
                      <th className="text-left text-xs font-semibold text-gray-400 px-3 py-2.5">Access</th>
                      <th className="px-3 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {TEAM_MEMBERS.map((member) => (
                      <tr key={member.email} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">
                              {member.avatar}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">{member.name}</div>
                              <div className="text-xs text-gray-400">{member.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-gray-500">{member.role}</td>
                        <td className="px-3 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ACCESS_COLORS[member.access]}`}>
                            {member.access}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-right">
                          <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 text-xs hover:bg-gray-50">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* ── AI SETTINGS ── */}
          {activeSection === 'ai' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900">AI Settings</h2>
                <p className="text-sm text-gray-400 mt-0.5">Configure AI assistant behavior and integrations</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-1">
                {[
                  { label: 'AI-powered experiment summaries', desc: 'Automatically generate summaries for new experiments', on: true },
                  { label: 'Reaction suggestions', desc: 'Suggest next steps based on current SAR data', on: true },
                  { label: 'Literature monitoring', desc: 'Alert when new papers match your research topics', on: false },
                  { label: 'Duplicate detection', desc: 'Warn when molecules are structurally similar to existing compounds', on: true },
                  { label: 'Patent writing assistance', desc: 'AI assistance for patent claims drafting', on: false },
                ].map(({ label, desc, on }) => (
                  <div key={label} className="flex items-start justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                    </div>
                    <Toggle on={on} />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── DATA & EXPORT ── */}
          {activeSection === 'data' && (
            <>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Data & Export</h2>
                <p className="text-sm text-gray-400 mt-0.5">Export your research data in various formats</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="text-sm font-semibold text-gray-800">Export Options</div>
                <div className="space-y-3">
                  {[
                    { format: 'CSV', desc: 'Spreadsheet-compatible data for experiments, molecules, and projects', icon: '📊' },
                    { format: 'JSON', desc: 'Full structured data export including all metadata and relationships', icon: '{ }' },
                    { format: 'SDF', desc: 'Structure Data File — molecule structures with properties (ChemDraw compatible)', icon: '⚗️' },
                  ].map(({ format, desc, icon }) => (
                    <div key={format} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-base font-mono font-bold text-gray-500">
                          {icon}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">{format}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200">
                        Export
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
                <div className="text-sm font-semibold text-gray-800">Data Retention</div>
                <div className="flex items-start justify-between py-2 border-b border-gray-100">
                  <div>
                    <div className="text-sm font-medium text-gray-800">Auto-archive completed projects</div>
                    <div className="text-xs text-gray-400 mt-0.5">Archive projects 6 months after completion</div>
                  </div>
                  <Toggle on={true} />
                </div>
                <div className="flex items-start justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-gray-800">Backup experiment data daily</div>
                    <div className="text-xs text-gray-400 mt-0.5">Automatic daily snapshots stored for 90 days</div>
                  </div>
                  <Toggle on={true} />
                </div>
              </div>

              <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
                <div className="text-sm font-semibold text-red-800 mb-1">Danger Zone</div>
                <p className="text-xs text-red-600 mb-3">These actions are permanent and cannot be undone.</p>
                <button className="px-3 py-1.5 rounded-lg border border-red-300 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors">
                  Delete All Data
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </motion.div>
  );
}
