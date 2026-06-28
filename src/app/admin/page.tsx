'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockDb, User, Challenge, Proposal, AuditLog } from '@/lib/mockDb';
import { 
  Shield, Users, FileText, Folder, Building2, 
  History, ArrowRight, ShieldCheck, Activity 
} from 'lucide-react';

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [institutionsCount, setInstitutionsCount] = useState(0);
  const [challengesCount, setChallengesCount] = useState(0);
  const [proposalsCount, setProposalsCount] = useState(0);
  const [recentLogs, setRecentLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load counts from mockDb
    setUsersCount(mockDb.getUsers().length);
    setInstitutionsCount(mockDb.getInstitutions().length);
    setChallengesCount(mockDb.getChallenges().length);
    setProposalsCount(mockDb.getProposals().length);

    // Get recent audit logs
    const logs = mockDb.getAuditLogs();
    setRecentLogs(logs.slice(0, 5));

    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-border pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary display-font flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            <span>Super Admin Dashboard</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">Platform administration panel. Monitor system metrics, user rosters, and auditable events.</p>
        </div>
        
        <div className="bg-primary-soft text-primary border border-primary/20 px-4 py-2.5 rounded-xl text-3xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>System Audits: Secure</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <Link href="/admin/users" className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 hover:border-primary/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{usersCount}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Registered Users</h4>
          </div>
        </Link>

        <Link href="/admin/institutions" className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 hover:border-primary/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-cta-soft text-cta flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{institutionsCount}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Institutions Directory</h4>
          </div>
        </Link>

        <Link href="/admin/challenges" className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 hover:border-primary/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-warning-soft text-warning flex items-center justify-center shrink-0">
            <Folder className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{challengesCount}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Total Challenges</h4>
          </div>
        </Link>

        <Link href="/admin/proposals" className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4 hover:border-primary/30 transition-all">
          <div className="w-12 h-12 rounded-xl bg-success-soft text-success flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{proposalsCount}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Proposals Filed</h4>
          </div>
        </Link>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recent Audit activity */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-md text-text-primary display-font flex items-center gap-1.5">
              <History className="w-5 h-5 text-primary" />
              Recent Audit Log Logs
            </h3>
            <Link href="/admin/audit" className="text-xs text-primary hover:underline font-bold">
              View Complete Audit Log
            </Link>
          </div>

          {recentLogs.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-border text-center text-text-secondary">
              No auditable events logged in this session yet.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-xs divide-y divide-border">
              {recentLogs.map((log) => (
                <div key={log.id} className="p-4.5 flex justify-between items-start text-xs hover:bg-off-white transition-colors">
                  <div className="space-y-1">
                    <p className="font-semibold text-text-primary">
                      {log.action}
                    </p>
                    <p className="text-5xs text-text-muted uppercase">
                      User: <strong>{log.userName}</strong> ({log.userRole.replace('_', ' ')}) · Entity: {log.entityType} ({log.entityId.slice(-6)})
                    </p>
                  </div>
                  <span className="text-5xs text-text-muted font-medium shrink-0">
                    {new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Platform Configuration summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="font-bold text-md text-text-primary display-font">System Configuration</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4 text-xs">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary font-medium">Server Location</span>
              <strong className="text-text-primary">Vercel (bom1 Mumbai)</strong>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary font-medium">Storage Engine</span>
              <strong className="text-text-primary">Cloudflare R2</strong>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary font-medium">Database Layer</span>
              <strong className="text-text-primary">PostgreSQL 16</strong>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-text-secondary font-medium">Audit Rule Constraint</span>
              <span className="text-success font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                APPEND-ONLY
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
