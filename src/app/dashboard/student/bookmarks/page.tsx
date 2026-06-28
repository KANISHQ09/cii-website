'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockDb, Challenge, SEED_CELLS } from '@/lib/mockDb';
import { Bookmark, Calendar, Briefcase, ArrowRight, Inbox } from 'lucide-react';

export default function StudentBookmarks() {
  const [bookmarks, setBookmarks] = useState<Challenge[]>([]);

  useEffect(() => {
    // For mock demonstration, we load two challenges as bookmarked
    const allChals = mockDb.getChallenges();
    setBookmarks(allChals.slice(0, 2));
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-border pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary display-font">Saved Challenges</h1>
          <p className="text-sm text-text-secondary mt-1">Review excellence cell prompts you bookmarked for later submissions.</p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-16 text-center space-y-4 shadow-xs">
          <Inbox className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="font-bold text-lg text-text-primary">No Bookmarks Saved</h3>
          <p className="text-xs text-text-secondary">Save challenges by clicking the bookmark outline on detail views.</p>
          <Link 
            href="/challenges"
            className="px-5 py-2.5 bg-cta text-white text-xs font-bold rounded-full inline-block shadow-md"
          >
            Browse Challenges
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarks.map((chal) => {
            const cell = SEED_CELLS[chal.domain];
            return (
              <div 
                key={chal.id}
                className="bg-white rounded-2xl border border-border p-6 shadow-xs hover:border-primary/20 transition-all flex flex-col justify-between h-56 card-bounce"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-4xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white shadow-3xs"
                      style={{ backgroundColor: cell.primaryColor }}
                    >
                      {cell.name.split(' ')[0]} Cell
                    </span>
                    <span className="text-4xs text-text-muted uppercase">Open</span>
                  </div>

                  <Link href={`/challenges/${chal.id}`}>
                    <h3 className="font-bold text-sm text-text-primary hover:text-primary transition-colors leading-snug line-clamp-2">
                      {chal.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                    {chal.problemStatement}
                  </p>
                </div>

                <div className="border-t border-border pt-4 flex items-center justify-between mt-4">
                  <span className="text-5xs text-text-muted font-semibold uppercase flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-cta shrink-0" />
                    {chal.industryProfileId}
                  </span>
                  
                  <Link 
                    href={`/challenges/${chal.id}`}
                    className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 group"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
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
