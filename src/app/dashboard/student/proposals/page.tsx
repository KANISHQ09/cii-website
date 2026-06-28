'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockDb, User, Proposal, SEED_CELLS } from '@/lib/mockDb';
import { FileText, Calendar, Briefcase, Award, ArrowUpRight, Inbox } from 'lucide-react';

export default function StudentProposals() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredList, setFilteredList] = useState<Proposal[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    setCurrentUser(user);

    // Get student's proposals
    const allProps = mockDb.getProposals();
    const studentProps = allProps.filter(p => p.studentProfileId === user.id);
    setProposals(studentProps);
    setFilteredList(studentProps);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let result = proposals;
    if (selectedFilter === 'ACTIVE') {
      result = proposals.filter(p => p.status !== 'APPROVED' && p.status !== 'REJECTED');
    } else if (selectedFilter === 'APPROVED') {
      result = proposals.filter(p => p.status === 'APPROVED');
    } else if (selectedFilter === 'CLOSED') {
      result = proposals.filter(p => p.status === 'REJECTED');
    }
    setFilteredList(result);
  }, [selectedFilter, proposals]);

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary display-font">My Submitted Solutions</h1>
          <p className="text-sm text-text-secondary mt-1">Review review updates and open chat threads for your proposals.</p>
        </div>
        <Link 
          href="/challenges"
          className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-full shadow-md text-center transition-all card-bounce"
        >
          Browse Challenges
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border pb-3 overflow-x-auto">
        {[
          { key: 'ALL', label: `All Submissions (${proposals.length})` },
          { key: 'ACTIVE', label: `In Review (${proposals.filter(p => p.status !== 'APPROVED' && p.status !== 'REJECTED').length})` },
          { key: 'APPROVED', label: `Approved Solutions (${proposals.filter(p => p.status === 'APPROVED').length})` },
          { key: 'CLOSED', label: `Rejected (${proposals.filter(p => p.status === 'REJECTED').length})` }
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

      {/* List Container */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-16 text-center space-y-4 shadow-xs">
          <Inbox className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="font-bold text-lg text-text-primary">No Submissions Found</h3>
          <p className="text-xs text-text-secondary">Try switching filter tabs or apply to new challenges.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredList.map((prop) => {
            const challenge = mockDb.getChallengeById(prop.challengeId);
            const cell = challenge ? SEED_CELLS[challenge.domain] : null;
            const isApproved = prop.status === 'APPROVED';
            
            return (
              <div 
                key={prop.id}
                className="bg-white rounded-xl border border-border p-6 shadow-xs hover:border-primary/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
              >
                
                {/* Info block */}
                <div className="space-y-3 flex-1">
                  
                  <div className="flex flex-wrap items-center gap-2 text-4xs">
                    {cell && (
                      <span className="font-bold uppercase tracking-wider text-primary">
                        {cell.name.split(' ')[0]} Cell
                      </span>
                    )}
                    <span className="text-text-muted font-bold">•</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full ${
                      isApproved ? 'bg-success-soft text-success' :
                      prop.status === 'REVISION_REQUESTED' ? 'bg-warning-soft text-warning border border-warning/20' :
                      prop.status === 'REJECTED' ? 'bg-error-soft text-error' :
                      'bg-primary-soft text-primary'
                    }`}>
                      {prop.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors leading-snug line-clamp-1">
                    {challenge ? challenge.title : 'Solution Document'}
                  </h3>

                  <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
                    Summary Abstract: {prop.summary}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-5xs text-text-muted font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> File: {prop.approachDoc}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Submitted: {new Date(prop.submittedAt).toLocaleDateString()}</span>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <Link 
                    href={`/dashboard/student/proposals/${prop.id}`}
                    className="px-5 py-2.5 bg-off-white hover:bg-primary hover:text-white border border-border hover:border-primary text-xs font-bold rounded-lg transition-colors flex items-center gap-1 group-hover:shadow-sm"
                  >
                    <span>Solution Details & Chat</span>
                    <ArrowUpRight className="w-4 h-4" />
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
