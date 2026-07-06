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

export function Settings() {
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex overflow-hidden bg-[#f8f9fb]">
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
          {activeSection === 'profile' && (
            <>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Profile</h2>
                <p className="text-sm text-gray-500 mt-0.5">Manage your personal information and preferences</p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
                {/* Avatar */}
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

                <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </>
          )}

          {activeSection === 'ai' && (
            <>
              <div>
                <h2 className="text-base font-semibold text-gray-900">AI Settings</h2>
                <p className="text-sm text-gray-500 mt-0.5">Configure AI assistant behavior and integrations</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                {[
                  { label: 'AI-powered experiment summaries', desc: 'Automatically generate summaries for new experiments', on: true },
                  { label: 'Reaction suggestions', desc: 'Suggest next steps based on current SAR data', on: true },
                  { label: 'Literature monitoring', desc: 'Alert when new papers match your research topics', on: false },
                  { label: 'Duplicate detection', desc: 'Warn when molecules are structurally similar to existing compounds', on: true },
                  { label: 'Patent writing assistance', desc: 'AI assistance for patent claims drafting', on: false },
                ].map(({ label, desc, on }) => (
                  <div key={label} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-800">{label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
                    </div>
                    <div
                      className={`w-10 h-5 rounded-full cursor-pointer transition-colors mt-0.5 shrink-0 relative ${on ? 'bg-blue-600' : 'bg-gray-200'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection !== 'profile' && activeSection !== 'ai' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-sm text-gray-400">{SECTIONS.find((s) => s.id === activeSection)?.label} settings</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
