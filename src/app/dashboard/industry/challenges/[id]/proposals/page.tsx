'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockDb, Challenge, Proposal, SEED_CELLS } from '@/lib/mockDb';
import { ArrowLeft, Inbox, ShieldCheck, FileText, ChevronRight, Check } from 'lucide-react';

export default function IndustryChallengeProposals() {
  const params = useParams();
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredList, setFilteredList] = useState<Proposal[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  const id = params?.id as string;

  useEffect(() => {
    if (!id) return;

    // Load challenge
    const chal = mockDb.getChallengeById(id);
    if (!chal) {
      router.push('/dashboard/industry/challenges');
      return;
    }
    setChallenge(chal);

    // Get proposals received for this challenge
    const allProps = mockDb.getProposals();
    const chalProps = allProps.filter(p => p.challengeId === id);
    setProposals(chalProps);
    setFilteredList(chalProps);

    setIsLoading(false);
  }, [id, router]);

  useEffect(() => {
    let result = proposals;
    if (selectedFilter === 'PENDING') {
      result = proposals.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW');
    } else if (selectedFilter === 'APPROVED') {
      result = proposals.filter(p => p.status === 'APPROVED');
    } else if (selectedFilter === 'REVISION') {
      result = proposals.filter(p => p.status === 'REVISION_REQUESTED');
    }
    setFilteredList(result);
  }, [selectedFilter, proposals]);

  if (isLoading || !challenge) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const cell = SEED_CELLS[challenge.domain];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-border pb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Link 
            href="/dashboard/industry/challenges" 
            className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary font-bold text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Challenges</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-text-primary display-font">
            Proposals Received ({proposals.length})
          </h1>
          <p className="text-xs text-text-secondary line-clamp-1">
            Challenge: <strong className="text-text-primary">{challenge.title}</strong>
          </p>
        </div>

        {/* Secure Mask Banner */}
        <div className="bg-success-soft border border-success/20 px-4 py-2.5 rounded-xl text-success text-3xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm shrink-0">
          <ShieldCheck className="w-4 h-4" />
          <span>Student PII Masked</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border pb-3 overflow-x-auto">
        {[
          { key: 'ALL', label: `All Proposals (${proposals.length})` },
          { key: 'PENDING', label: `Awaiting Review (${proposals.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').length})` },
          { key: 'REVISION', label: `Revision Requested (${proposals.filter(p => p.status === 'REVISION_REQUESTED').length})` },
          { key: 'APPROVED', label: `Approved (${proposals.filter(p => p.status === 'APPROVED').length})` }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedFilter(tab.key)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 ${
              selectedFilter === tab.key 
                ? 'bg-primary-soft text-primary font-bold' 
                : 'text-text-secondary hover:bg-off-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid of Anonymized proposals */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-16 text-center space-y-4 shadow-xs">
          <Inbox className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="font-bold text-lg text-text-primary">No Proposals Found</h3>
          <p className="text-xs text-text-secondary">Submissions will appear here when students upload their approach documents.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredList.map((prop) => {
            const isApproved = prop.status === 'APPROVED';
            
            return (
              <div 
                key={prop.id}
                className="bg-white rounded-2xl border border-border p-6 shadow-xs hover:border-primary/20 transition-all flex flex-col justify-between h-64 card-bounce"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary">PROPOSAL #{prop.id.slice(-6).toUpperCase()}</span>
                    <span className={`text-4xs font-bold px-2 py-0.5 rounded-full ${
                      isApproved ? 'bg-success-soft text-success' :
                      prop.status === 'REVISION_REQUESTED' ? 'bg-warning-soft text-warning border border-warning/20' :
                      prop.status === 'REJECTED' ? 'bg-error-soft text-error' :
                      'bg-primary-soft text-primary'
                    }`}>
                      {prop.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed italic line-clamp-3">
                    &ldquo;{prop.summary}&rdquo;
                  </p>
                </div>

                <div className="border-t border-border pt-4 flex flex-col gap-3 mt-4">
                  <div className="flex items-center justify-between text-5xs text-text-muted font-bold uppercase tracking-wider">
                    <span>Institution: {prop.studentInstitution}</span>
                    <span className="text-cta">PII Masked</span>
                  </div>

                  <Link 
                    href={`/dashboard/industry/challenges/${challenge.id}/proposals/${prop.id}`}
                    className="w-full py-2 bg-off-white hover:bg-primary hover:text-white border border-border hover:border-primary text-xs font-bold rounded-lg transition-colors text-center flex items-center justify-center gap-1"
                  >
                    <span>Review Solution & Chat</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
