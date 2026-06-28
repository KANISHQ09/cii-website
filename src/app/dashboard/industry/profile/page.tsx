'use client';

import React, { useEffect, useState } from 'react';
import { mockDb, User } from '@/lib/mockDb';
import { Building2, Globe, ShieldCheck, Check } from 'lucide-react';

export default function IndustryProfilePage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setCurrentUser(mockDb.getCurrentUser());
  }, []);

  if (!currentUser) return null;

  const profile = currentUser.industryProfile;
  const companyName = profile?.companyName || 'Netlink Business Solutions';
  const sector = profile?.industry || 'Information Technology';

  return (
    <div className="space-y-6 max-w-2xl">
      
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-text-primary display-font flex items-center gap-2">
          <Building2 className="w-7 h-7 text-primary" />
          <span>Company Profile</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">Manage corporate details, sectors, and verify your CII partnership credentials.</p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl border border-border shadow-sm p-8 space-y-6">
        
        <div className="flex gap-4 items-center">
          <div className="w-16 h-16 bg-primary-soft text-primary rounded-2xl flex items-center justify-center font-bold text-xl">
            {companyName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary display-font">{companyName}</h2>
            <p className="text-xs text-text-secondary">{sector}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/50 text-xs">
          
          <div className="space-y-1">
            <span className="text-text-secondary font-medium uppercase tracking-wider block text-3xs">Website Address</span>
            <span className="font-semibold text-text-primary flex items-center gap-1">
              <Globe className="w-4 h-4 text-primary" />
              {profile?.websiteUrl || 'https://netlink.com'}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-text-secondary font-medium uppercase tracking-wider block text-3xs">CII Membership Standing</span>
            {profile?.isCIIMember ? (
              <span className="font-bold text-success flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-success" />
                VERIFIED CII CORPORATE MEMBER
              </span>
            ) : (
              <span className="font-semibold text-text-muted">Standard Corporate Account</span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
