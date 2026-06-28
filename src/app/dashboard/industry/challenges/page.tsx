'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockDb, Challenge, User } from '@/lib/mockDb';
import { Briefcase, Calendar, Folder, Plus, Eye, CheckCircle, RefreshCw } from 'lucide-react';

export default function IndustryManageChallenges() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [proposalsMap, setProposalsMap] = useState<Record<string, number>>({});
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [filteredList, setFilteredList] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    setCurrentUser(user);

    const companyName = user.industryProfile?.companyName || 'Netlink Business Solutions';

    // Get challenges
    const allChals = mockDb.getChallenges();
    const companyChals = allChals.filter(c => c.industryProfileId === companyName);
    setChallenges(companyChals);
    setFilteredList(companyChals);

    // Map proposal counts
    const props = mockDb.getProposals();
    const counts: Record<string, number> = {};
    companyChals.forEach(c => {
      counts[c.id] = props.filter(p => p.challengeId === c.id).length;
    });
    setProposalsMap(counts);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    let result = challenges;
    if (selectedFilter === 'OPEN') {
      result = challenges.filter(c => c.status === 'OPEN');
    } else if (selectedFilter === 'CLOSED') {
      result = challenges.filter(c => c.status === 'CLOSED');
    }
    setFilteredList(result);
  }, [selectedFilter, challenges]);

  const handleCloseChallenge = (id: string) => {
    if (!confirm("Are you sure you want to close this challenge? No more student submissions will be allowed.")) return;
    
    const allChals = mockDb.getChallenges();
    const chalIndex = allChals.findIndex(c => c.id === id);
    if (chalIndex !== -1) {
      allChals[chalIndex].status = 'CLOSED';
      localStorage.setItem('ciisic_challenges', JSON.stringify(allChals));
      
      // Update local state
      setChallenges(allChals.filter(c => c.industryProfileId === (currentUser?.industryProfile?.companyName || 'Netlink Business Solutions')));
      alert("Challenge status updated to CLOSED.");
    }
  };

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
          <h1 className="text-3xl font-bold text-text-primary display-font">Manage Challenges</h1>
          <p className="text-sm text-text-secondary mt-1">Review active deadlines, close expired postings, or post a new problem statement.</p>
        </div>
        <Link 
          href="/dashboard/industry/challenges/create"
          className="px-5 py-2.5 bg-cta hover:bg-cta-dark text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1.5 transition-all card-bounce"
        >
          <Plus className="w-4 h-4" />
          <span>Post Challenge</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border pb-3 overflow-x-auto">
        {[
          { key: 'ALL', label: `All Postings (${challenges.length})` },
          { key: 'OPEN', label: `Open Challenges (${challenges.filter(c => c.status === 'OPEN').length})` },
          { key: 'CLOSED', label: `Closed (${challenges.filter(c => c.status === 'CLOSED').length})` }
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

      {/* Challenges List Grid */}
      {filteredList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-16 text-center space-y-4 shadow-xs">
          <Folder className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="font-bold text-lg text-text-primary">No Challenges Found</h3>
          <p className="text-xs text-text-secondary">Create a new problem statement for partnering student groups.</p>
          <Link 
            href="/dashboard/industry/challenges/create"
            className="px-5 py-2.5 bg-cta text-white text-xs font-bold rounded-full inline-block shadow-md"
          >
            Post Challenge
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredList.map((chal) => {
            const isClosed = chal.status === 'CLOSED';
            const count = proposalsMap[chal.id] || 0;
            
            return (
              <div 
                key={chal.id}
                className="bg-white rounded-xl border border-border p-6 shadow-xs hover:border-primary/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
              >
                
                {/* Info block */}
                <div className="space-y-2.5 flex-1">
                  
                  <div className="flex flex-wrap items-center gap-2 text-4xs">
                    <span className="font-bold uppercase tracking-wider text-primary">
                      {chal.domain.replace('_', ' ')}
                    </span>
                    <span className="text-text-muted font-bold">•</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full ${
                      isClosed ? 'bg-off-white text-text-muted border border-border' : 'bg-success-soft text-success'
                    }`}>
                      {chal.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors leading-snug line-clamp-1">
                    {chal.title}
                  </h3>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-5xs text-text-muted font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Deadline: {new Date(chal.deadline).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-cta" /> Budget Range: {chal.budgetRange}</span>
                    <span>•</span>
                    <span className="text-primary">Received: {count} Solutions</span>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <Link 
                    href={`/dashboard/industry/challenges/${chal.id}/proposals`}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Solutions ({count})</span>
                  </Link>

                  {!isClosed && (
                    <button
                      onClick={() => handleCloseChallenge(chal.id)}
                      className="px-4 py-2 bg-white hover:bg-error-soft text-text-secondary hover:text-error border border-border hover:border-error/20 text-xs font-bold rounded-lg transition-colors"
                    >
                      Close Deadlines
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
