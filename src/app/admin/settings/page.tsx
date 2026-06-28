'use client';

import React, { useState } from 'react';
import { Settings, Save, Lock, Mail, ShieldAlert } from 'lucide-react';

export default function AdminSettings() {
  const [email, setEmail] = useState('admin@ciisic.in');
  const [isRegOpen, setIsRegOpen] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-text-primary display-font flex items-center gap-2">
          <Settings className="w-7 h-7 text-primary" />
          <span>Platform Settings</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">Configure global parameters, registration gates, and audit email targets.</p>
      </div>

      {isSaved && (
        <div className="p-4 bg-success-soft border border-success/20 rounded-xl text-success text-xs">
          Global platform settings updated successfully!
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-text-primary uppercase flex items-center gap-1">
            <Mail className="w-4 h-4 text-primary" />
            Platform Alert Email Target
          </label>
          <input 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-primary bg-off-white"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-off-white rounded-xl border border-border">
          <div className="space-y-0.5">
            <h4 className="font-bold text-xs text-text-primary">Open Student Registration Gate</h4>
            <p className="text-4xs text-text-secondary">If toggled off, registration redirects to inquiry forms.</p>
          </div>
          <input 
            type="checkbox"
            checked={isRegOpen}
            onChange={() => setIsRegOpen(!isRegOpen)}
            className="rounded text-primary focus:ring-primary h-4.5 w-4.5 cursor-pointer"
          />
        </div>

        <div className="p-4 bg-warning-soft/30 border border-warning/15 rounded-xl text-4xs text-text-secondary leading-relaxed flex gap-2">
          <ShieldAlert className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <p>
            <strong>Administrative Notice:</strong> Modifying platform settings triggers an entry in the immutable audit log including IP details.
          </p>
        </div>

        <button 
          type="submit"
          className="w-full py-2.5 bg-cta hover:bg-cta-dark text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all card-bounce"
        >
          <Save className="w-4 h-4" />
          <span>Save Global Configurations</span>
        </button>

      </form>

    </div>
  );
}
