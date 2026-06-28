'use client';

import React from 'react';
import Link from 'next/link';
import { CloudDivider } from '@/components/ui/CloudDivider';
import { ShieldCheck, Award, Users, Lightbulb, Building, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-off-white min-h-screen">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-sky-mid via-sky-light to-off-white pt-20 pb-12">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-4 max-w-2xl">
          <span className="text-xs uppercase tracking-widest text-primary font-bold">About the Program</span>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight tracking-tight">
            Bridging Industry & Academia
          </h1>
          <p className="text-text-secondary leading-relaxed">
            The CII Industry Academia Excellence Cells (CIISIC) are a state-wide collaborative initiative launched to bring classrooms closer to corporate boardrooms.
          </p>
        </div>
      </section>

      {/* Cloud divider edge */}
      <CloudDivider />

      {/* Body Content */}
      <section className="py-16 container mx-auto px-4 md:px-6 space-y-16">
        
        {/* Mission / Vision split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
              <Lightbulb className="w-5.5 h-5.5" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary display-font">Our Mission</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              To activate and coordinate a secure web platform where MP industries post real-world blockers, enabling students from the 37+ partnering universities to submit technical approach documents. We promote verified problem solving as a gateway to student career advancements.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm space-y-4">
            <div className="w-10 h-10 rounded-xl bg-cta-soft text-cta flex items-center justify-center">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary display-font">Our Key Pillars</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              We enforce strict student PII shielding to provide a level playing field, where student solutions are evaluated purely on technical merit. Every action, proposal status change, and chat message is permanently logged in our auditable system database.
            </p>
          </div>

        </div>

        {/* State Structure Timeline / Core Details */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold text-text-primary display-font">How the Program Operates</h2>
            <p className="text-xs text-text-secondary">A unified framework driven by CII Madhya Pradesh Chapter state coordinators.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4">
            
            <div className="text-center space-y-3 p-4 bg-white rounded-xl border border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto text-lg font-bold">1</div>
              <h3 className="font-bold text-sm text-text-primary">Domain Hosting</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                7 Excellence Cells are hosted across designated host universities (JLU, LNCT, LNCTU, Oriental, RNTU, Scope Global).
              </p>
            </div>

            <div className="text-center space-y-3 p-4 bg-white rounded-xl border border-border">
              <div className="w-12 h-12 rounded-full bg-cta/10 text-cta flex items-center justify-center mx-auto text-lg font-bold">2</div>
              <h3 className="font-bold text-sm text-text-primary">Corporate Outreach</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                CII coordinators onboard MP business partners (like Netlink or Dilip Buildcon) to list their technical and operational challenges.
              </p>
            </div>

            <div className="text-center space-y-3 p-4 bg-white rounded-xl border border-border">
              <div className="w-12 h-12 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto text-lg font-bold">3</div>
              <h3 className="font-bold text-sm text-text-primary">Talent Placement</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                When a student solution is approved, it serves as checked portfolio verification, leading directly to corporate internships or job placements.
              </p>
            </div>

          </div>
        </div>

        {/* CTA Card */}
        <div className="p-8 rounded-3xl bg-text-primary text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/15 rounded-full blur-2xl" />
          <h2 className="text-3xl font-bold display-font">Join the Program</h2>
          <p className="text-xs text-white/70 max-w-md mx-auto leading-relaxed">
            Interested in adding your institution or partnering as an industry sponsor? Send our CII state administrative desk an inquiry today.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/contact" 
              className="px-6 py-2.5 bg-cta hover:bg-cta-dark text-white text-xs font-bold rounded-full transition-all card-bounce"
            >
              Inquire as Partner
            </Link>
            <Link 
              href="/challenges" 
              className="px-6 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-bold rounded-full transition-all card-bounce"
            >
              Browse Active Challenges
            </Link>
          </div>
        </div>

      </section>

    </div>
  );
}
