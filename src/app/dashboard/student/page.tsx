'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockDb, User, Challenge, Proposal } from '@/lib/mockDb';
import { Sparkles, FileText, Bookmark, Award, AlertCircle, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function StudentDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [recommended, setRecommended] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    setCurrentUser(user);

    // Get student's proposals
    const allProps = mockDb.getProposals();
    const studentProps = allProps.filter(p => p.studentProfileId === user.id);
    setProposals(studentProps);

    // Get recommended challenges (same domain/cell theme as student interests, or general)
    const allChals = mockDb.getChallenges();
    const cellId = user.studentProfile?.institutionId;
    const inst = mockDb.getInstitutions().find(i => i.id === cellId);
    
    // Find challenges matching the student's skills or cell theme
    const recChals = allChals.filter(c => 
      c.status === 'OPEN' && 
      (inst?.cellTheme ? c.domain === inst.cellTheme : true)
    );
    setRecommended(recChals.slice(0, 3));

    setIsLoading(false);
  }, []);

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const approvedCount = proposals.filter(p => p.status === 'APPROVED').length;
  const activeCount = proposals.filter(p => p.status !== 'APPROVED' && p.status !== 'REJECTED').length;

  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary display-font flex items-center gap-2">
            Good morning, {currentUser.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Track your submissions, read messaging queries, or apply to active excellence cell prompts.
          </p>
        </div>
        <Link 
          href="/challenges"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-cta hover:bg-cta-dark text-white text-xs font-bold rounded-full shadow-md transition-all card-bounce"
        >
          <span>Find New Challenges</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{proposals.length}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Total Submissions</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-warning-soft text-warning flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{activeCount}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Active Reviews</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success-soft text-success flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{approvedCount}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Approved Solutions</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <span className="text-xs font-bold text-text-primary truncate block uppercase tracking-wide">
              {currentUser.studentProfile?.department.split(' ')[0]}
            </span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">My Department</h4>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Active Proposals list */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-md text-text-primary display-font">Proposals in Progress</h3>
            <Link href="/dashboard/student/proposals" className="text-xs text-primary hover:underline font-bold">
              View All Submissions
            </Link>
          </div>

          {proposals.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-border text-center space-y-4 shadow-sm">
              <AlertCircle className="w-10 h-10 text-text-muted mx-auto" />
              <div>
                <h4 className="font-bold text-sm text-text-primary">No submissions made yet</h4>
                <p className="text-xs text-text-secondary mt-1">Start by browsing challenges from partnering companies.</p>
              </div>
              <Link 
                href="/challenges" 
                className="inline-block px-5 py-2 bg-cta hover:bg-cta-dark text-white text-xs font-bold rounded-full shadow-md"
              >
                Find Challenges
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.slice(0, 3).map((prop) => {
                const isApproved = prop.status === 'APPROVED';
                const isRevision = prop.status === 'REVISION_REQUESTED';
                
                return (
                  <div key={prop.id} className="bg-white p-5 rounded-xl border border-border shadow-xs hover:border-primary/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-4xs font-bold px-2 py-0.5 rounded-full ${
                          isApproved ? 'bg-success-soft text-success' :
                          isRevision ? 'bg-warning-soft text-warning border border-warning/20' :
                          'bg-primary-soft text-primary'
                        }`}>
                          {prop.status.replace('_', ' ')}
                        </span>
                        <span className="text-4xs text-text-muted">Submitted {new Date(prop.submittedAt).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-xs text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                        {prop.approachDoc}
                      </h4>
                      <p className="text-4xs text-text-muted line-clamp-1">
                        Summary: {prop.summary}
                      </p>
                    </div>

                    <Link 
                      href={`/dashboard/student/proposals/${prop.id}`}
                      className="px-4 py-2 bg-off-white hover:bg-primary hover:text-white border border-border hover:border-primary text-4xs font-bold rounded-lg transition-colors shrink-0"
                    >
                      Open Solutions Thread →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Recommended Challenges */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="font-bold text-md text-text-primary display-font">Recommended for You</h3>
          </div>

          {recommended.length === 0 ? (
            <p className="text-xs text-text-secondary">No recommended open challenges at the moment.</p>
          ) : (
            <div className="space-y-4">
              {recommended.map((chal) => (
                <div key={chal.id} className="bg-white p-5 rounded-2xl border border-border shadow-xs hover:shadow-sm transition-all space-y-3">
                  <span className="text-4xs font-bold px-2.5 py-0.5 rounded-full bg-primary-soft text-primary uppercase tracking-wider">
                    {chal.domain.replace('_', ' ')}
                  </span>
                  <h4 className="font-bold text-xs text-text-primary line-clamp-1 leading-snug">{chal.title}</h4>
                  <p className="text-4xs text-text-secondary line-clamp-2 leading-relaxed">
                    {chal.problemStatement}
                  </p>
                  
                  <div className="border-t border-border pt-3 mt-3 flex items-center justify-between">
                    <span className="text-5xs text-text-muted uppercase">Deadline: {new Date(chal.deadline).toLocaleDateString()}</span>
                    <Link 
                      href={`/challenges/${chal.id}`} 
                      className="text-4xs font-bold text-primary hover:underline"
                    >
                      Apply Solution →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
