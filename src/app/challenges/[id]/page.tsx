'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockDb, Challenge, CellDetails, SEED_CELLS, User } from '@/lib/mockDb';
import { CloudDivider } from '@/components/ui/CloudDivider';
import { 
  ArrowLeft, Calendar, Building2, Briefcase, FileText, 
  Download, Sparkles, Lock, Bookmark, BookOpen, Clock
} from 'lucide-react';

export default function ChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [cell, setCell] = useState<CellDetails | null>(null);
  const [proposalsCount, setProposalsCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const id = params?.id as string;

  useEffect(() => {
    setCurrentUser(mockDb.getCurrentUser());

    if (!id) return;

    // Load challenge
    const chal = mockDb.getChallengeById(id);
    if (!chal) {
      router.push('/challenges');
      return;
    }

    // Increment view count
    mockDb.incrementViewCount(id);
    setChallenge(chal);
    setCell(SEED_CELLS[chal.domain]);

    // Proposals count for this challenge
    const props = mockDb.getProposals().filter(p => p.challengeId === id);
    setProposalsCount(props.length);

    setIsLoading(false);
  }, [id, router]);

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (isLoading || !challenge || !cell) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const isStudent = currentUser?.role === 'STUDENT';
  const isClosed = challenge.status === 'CLOSED';

  // Calculate days remaining
  const daysLeft = Math.ceil((new Date(challenge.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-off-white min-h-screen">
      
      {/* ─── HERO HEADER ────────────────────────────────────────────────────── */}
      <section 
        className="relative pt-24 pb-20 text-white overflow-hidden transition-colors"
        style={{ backgroundColor: cell.primaryColor }}
      >
        <div className="absolute inset-0 bg-black/25 z-0" />
        <img 
          src={cell.imagePath} 
          alt={cell.name}
          className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay z-0"
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10 space-y-6">
          <Link 
            href="/challenges" 
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white font-medium text-xs bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Challenges</span>
          </Link>

          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-3xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-text-primary" style={{ backgroundColor: cell.accentColor }}>
                {cell.name.split(' ')[0]} Cell
              </span>
              <span className={`inline-flex items-center gap-1 text-3xs font-bold px-2 py-0.5 rounded-full ${
                isClosed ? 'bg-white/10 border border-white/20 text-white' : 'bg-success text-white'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {challenge.status}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight display-font text-white">
              {challenge.title}
            </h1>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs text-white/80">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-white" />
                Posted by: <strong>{challenge.industryProfileId}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-white" />
                Deadline: <strong>{new Date(challenge.deadline).toLocaleDateString()}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-white" />
                {daysLeft > 0 ? `${daysLeft} days remaining` : 'Deadline expired'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud divider from Cell primary color to off-white */}
      <div 
        className="w-full h-20 relative overflow-hidden" 
        style={{ backgroundColor: cell.primaryColor }}
      >
        <div className="absolute bottom-0 left-0 w-full">
          <CloudDivider offwhite />
        </div>
      </div>

      {/* ─── CONTENT BODY ───────────────────────────────────────────────────── */}
      <section className="py-12 container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Problem description */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Plain text summary */}
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm space-y-4">
              <span className="text-3xs font-bold text-primary uppercase tracking-widest block">Executive Summary</span>
              <p className="text-sm text-text-secondary leading-relaxed font-semibold">
                {challenge.problemStatement}
              </p>
            </div>

            {/* Rich text details */}
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm space-y-6">
              <h2 className="text-xl font-bold text-text-primary display-font border-b border-border pb-3">Detailed Challenge Scope</h2>
              <div 
                className="text-xs text-text-secondary leading-relaxed space-y-4 prose"
                dangerouslySetInnerHTML={{ __html: challenge.description }}
              />
            </div>

            {/* Attachments */}
            {challenge.attachmentUrls.length > 0 && (
              <div className="bg-white p-8 rounded-2xl border border-border shadow-sm space-y-4">
                <h2 className="text-xl font-bold text-text-primary display-font border-b border-border pb-3">Supporting Documentation</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {challenge.attachmentUrls.map((file, idx) => (
                    <div key={idx} className="p-4 bg-off-white rounded-xl border border-border flex items-center justify-between group hover:border-primary/20 hover:bg-white transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="text-xs font-bold text-text-primary truncate">{file}</h4>
                          <p className="text-4xs text-text-muted">PDF Document · 4.2 MB</p>
                        </div>
                      </div>
                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); alert("File download started (mock)."); }}
                        className="w-8 h-8 rounded-full border border-border bg-white text-text-secondary hover:text-primary hover:bg-primary-soft flex items-center justify-center transition-colors shrink-0"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills required tags */}
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-text-primary display-font">Required Skillsets</h2>
              <div className="flex flex-wrap gap-2">
                {challenge.tags.map((tag, idx) => (
                  <span key={idx} className="bg-primary-soft border border-primary/10 text-primary px-3.5 py-1.5 rounded-full text-xs font-semibold">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Sidebar info */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Overview Widget */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
              <h3 className="font-bold text-md text-text-primary border-b border-border pb-3 display-font">Overview Matrix</h3>
              
              <div className="space-y-4 text-xs">
                
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Host Cell</span>
                  <span className="font-bold text-text-primary text-right">{cell.name.split(' ')[0]} Cell</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Sponsor</span>
                  <span className="font-bold text-text-primary text-right">{challenge.industryProfileId}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">Submissions</span>
                  <span className="font-bold text-text-primary text-right">{proposalsCount} Solutions</span>
                </div>

                {/* Privacy Rule: Hide Budget from Students */}
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <span className="text-text-secondary">Budget Allocation</span>
                  {isStudent ? (
                    <span className="font-semibold text-text-muted flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-cta shrink-0" />
                      Shielded for privacy
                    </span>
                  ) : (
                    <span className="font-bold text-success text-right">{challenge.budgetRange || "₹2L - ₹5L"}</span>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-border">
                {isClosed ? (
                  <button 
                    disabled 
                    className="w-full py-3 bg-off-white border border-border text-text-muted font-bold text-sm rounded-full text-center"
                  >
                    Submissions Closed
                  </button>
                ) : (
                  <Link 
                    href={`/challenges/${challenge.id}/apply`}
                    className="w-full py-3 bg-cta hover:bg-cta-dark text-white font-bold text-sm rounded-full text-center shadow-md shadow-cta/25 hover:shadow-lg transition-all card-bounce"
                  >
                    Apply to This Challenge
                  </Link>
                )}

                <button 
                  onClick={handleBookmarkToggle}
                  className={`w-full py-3 border border-border hover:bg-off-white text-text-secondary font-bold text-sm rounded-full flex items-center justify-center gap-2 transition-all ${
                    isBookmarked ? 'bg-primary-soft text-primary border-primary/20 hover:bg-primary-soft' : ''
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  <span>{isBookmarked ? 'Challenge Bookmarked' : 'Save for Later'}</span>
                </button>
              </div>

            </div>

            {/* Host info card */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-text-primary display-font">Host Institution</h3>
              <div className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-text-primary truncate">{cell.hostName.split(',')[0]}</h4>
                  <p className="text-4xs text-text-muted uppercase">MP Chapter Member</p>
                </div>
              </div>
              <Link 
                href={`/cells/${cell.theme.toLowerCase()}`}
                className="w-full py-2 bg-off-white hover:bg-primary-soft hover:text-primary text-text-secondary transition-colors text-xs font-bold rounded-lg block text-center"
              >
                View Cell Details
              </Link>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
