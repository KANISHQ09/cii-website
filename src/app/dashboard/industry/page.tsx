'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockDb, User, Challenge, Proposal } from '@/lib/mockDb';
import { 
  Building2, Briefcase, FileText, CheckCircle, Clock, 
  PlusCircle, AlertCircle, ArrowRight, ShieldCheck 
} from 'lucide-react';

export default function IndustryDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [unreviewedProps, setUnreviewedProps] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    setCurrentUser(user);

    const companyName = user.industryProfile?.companyName || 'Netlink Business Solutions';

    // Get challenges posted by this company
    const allChals = mockDb.getChallenges();
    const companyChals = allChals.filter(c => c.industryProfileId === companyName);
    setChallenges(companyChals);

    // Get proposals received for those challenges
    const companyChalIds = companyChals.map(c => c.id);
    const allProps = mockDb.getProposals();
    const companyProps = allProps.filter(p => companyChalIds.includes(p.challengeId));
    setProposals(companyProps);

    // Filter unreviewed/submitted proposals
    const pending = companyProps.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW');
    setUnreviewedProps(pending);

    setIsLoading(false);
  }, []);

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const companyName = currentUser.industryProfile?.companyName || 'Netlink Business Solutions';
  const approvedCount = proposals.filter(p => p.status === 'APPROVED').length;

  return (
    <div className="space-y-8">
      
      {/* Greeting Header */}
      <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-text-primary display-font flex items-center gap-2">
            Welcome back, {currentUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-xs text-text-secondary flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-primary" />
            <strong>{companyName}</strong> (CII Corporate Partner)
          </p>
        </div>
        <Link 
          href="/dashboard/industry/challenges/create"
          className="px-5 py-2.5 bg-cta hover:bg-cta-dark text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1.5 transition-all card-bounce"
        >
          <PlusCircle className="w-4.5 h-4.5" />
          <span>Post New Challenge</span>
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{challenges.length}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Active Challenges</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cta-soft text-cta flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{proposals.length}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Proposals Received</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-warning-soft text-warning flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{unreviewedProps.length}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Awaiting Review</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success-soft text-success flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{approvedCount}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Approved Solutions</h4>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Challenges needing attention */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-md text-text-primary display-font">Challenges Needing Attention</h3>
            <Link href="/dashboard/industry/challenges" className="text-xs text-primary hover:underline font-bold">
              Manage Challenges
            </Link>
          </div>

          {challenges.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-border text-center space-y-4 shadow-sm">
              <AlertCircle className="w-10 h-10 text-text-muted mx-auto" />
              <div>
                <h4 className="font-bold text-sm text-text-primary">No challenges posted yet</h4>
                <p className="text-xs text-text-secondary mt-1">Post a problem statement to start receiving student approaches.</p>
              </div>
              <Link 
                href="/dashboard/industry/challenges/create" 
                className="inline-block px-5 py-2.5 bg-cta text-white text-xs font-bold rounded-full shadow-md"
              >
                Post First Challenge
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {challenges.map((chal) => {
                const chalProps = proposals.filter(p => p.challengeId === chal.id);
                const unreviewed = chalProps.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW');
                
                return (
                  <div key={chal.id} className="bg-white p-5 rounded-xl border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-primary/20 transition-all group">
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs text-text-primary group-hover:text-primary transition-colors line-clamp-1">{chal.title}</h4>
                      <p className="text-4xs text-text-muted">
                        Cell theme: <strong className="text-text-primary">{chal.domain.replace('_', ' ')}</strong> · Closes: {new Date(chal.deadline).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-semibold text-text-secondary">
                        {chalProps.length} proposals ({unreviewed.length} new)
                      </span>
                      <Link 
                        href={`/dashboard/industry/challenges/${chal.id}/proposals`}
                        className="px-4 py-2 bg-off-white hover:bg-primary hover:text-white border border-border hover:border-primary text-4xs font-bold rounded-lg transition-colors"
                      >
                        View Solutions →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Column: Anonymized Solutions feed */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="border-b border-border pb-3 flex items-center gap-1.5 text-text-primary">
            <ShieldCheck className="w-5 h-5 text-success" />
            <h3 className="font-bold text-md display-font">Anonymized Inbox</h3>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <h4 className="text-2xs font-bold text-text-primary uppercase tracking-wide">Recent Proposal Summaries</h4>
            
            {unreviewedProps.length === 0 ? (
              <p className="text-xs text-text-secondary leading-relaxed">All submitted approaches have been reviewed. Good job!</p>
            ) : (
              <div className="space-y-3.5 divide-y divide-border pt-1">
                {unreviewedProps.slice(0, 3).map((prop, idx) => (
                  <div key={prop.id} className={`space-y-1.5 ${idx > 0 ? 'pt-3.5' : ''}`}>
                    <div className="flex justify-between items-center text-5xs">
                      <span className="font-bold text-primary">PROP #{prop.id.slice(-5).toUpperCase()}</span>
                      <span className="bg-cta-soft text-cta px-1.5 py-0.5 rounded-full font-bold uppercase">NEW</span>
                    </div>
                    <p className="text-4xs text-text-secondary leading-relaxed italic line-clamp-2">
                      &ldquo;{prop.summary}&rdquo;
                    </p>
                    <Link 
                      href={`/dashboard/industry/challenges/${prop.challengeId}/proposals/${prop.id}`}
                      className="text-5xs font-bold text-primary hover:underline block"
                    >
                      Review approach & chat →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
