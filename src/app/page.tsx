'use client';

import React from 'react';
import Link from 'next/link';
import { CloudDivider } from '@/components/ui/CloudDivider';
import { SEED_CELLS, mockDb } from '@/lib/mockDb';
import {
  ArrowRight, CheckCircle2, ShieldCheck, Users, Briefcase, Award,
  MessageSquare, Sparkles, Building2, BrainCircuit, Play
} from 'lucide-react';

export default function Home() {
  const cells = Object.values(SEED_CELLS);

  // Alternative names for marquee
  const partnerInstitutes = [
    "LNCT Group", "Jagran Lakecity University", "RNTU Bhopal", "Oriental Group",
    "Scope Global University", "IIT Indore", "IIM Indore", "IIFM Bhopal",
    "CRISP Bhopal", "GSITS Indore", "Prestige Institute", "BSSS IAS"
  ];

  return (
    <div className="w-full">

      {/* ─── SECTION 1: HERO ────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-16 bg-gradient-to-b from-sky-mid via-sky-light to-white overflow-hidden">

        {/* Floating background decorative shapes */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-bounce" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-cta/10 rounded-full blur-2xl animate-pulse" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Content */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-primary/15 shadow-sm">
                <div className="flex -space-x-2">
                  <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-3xs font-bold ring-2 ring-white">JLU</span>
                  <span className="w-6 h-6 rounded-full bg-cta/20 flex items-center justify-center text-3xs font-bold ring-2 ring-white">LNCT</span>
                  <span className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center text-3xs font-bold ring-2 ring-white">RNTU</span>
                </div>
                <span className="text-xs font-semibold text-text-secondary">
                  Connecting <span className="text-primary">37+ Institutions</span> with MP Industries
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-6xl font-bold text-text-primary leading-tight tracking-tight">
                Solve Real Challenges.<br />
                <span className="text-primary">Build Real Careers.</span>
              </h1>

              {/* Sub-copy */}
              <p className="text-lg text-text-secondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
                An state collaboration portal powered by the CII Industry Academia Excellence Cells. Solve real-world corporate challenges, get industry validation, and unlock career opportunities.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/challenges"
                  className="w-full sm:w-auto text-center px-8 py-4 bg-cta hover:bg-cta-dark text-white font-bold rounded-full shadow-lg shadow-cta/30 hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  Browse Challenges →
                </Link>
                <Link
                  href="/about"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-sky-light text-text-secondary font-bold rounded-full border border-border transition-colors hover:text-primary"
                >
                  <Play className="w-4 h-4 fill-current text-primary" />
                  <span>How It Works</span>
                </Link>
              </div>

              {/* Quick stats */}
              <div className="pt-6 border-t border-border flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs text-text-muted">
                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-primary" /> <strong>40+</strong> Active Challenges</span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5 text-cta" /> <strong>150+</strong> Registered Businesses</span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-success" /> <strong>37</strong> Partner Colleges</span>
              </div>

            </div>

            {/* Right Graphic Panel */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-3xl bg-gradient-to-br from-primary to-sky-deep p-6 shadow-2xl flex flex-col justify-between overflow-hidden animate-float">
                {/* Overlay patterns */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />

                {/* Dashboard Card Preview Mock */}
                <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-white space-y-2 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-2xs font-semibold bg-white/20 px-2 py-0.5 rounded-full">EXCELLENCE CELL</span>
                    <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                  </div>
                  <h3 className="font-bold text-sm leading-snug">AI Crop Leaf Disease Classification Engine</h3>
                  <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-cta rounded-full" />
                  </div>
                  <div className="flex justify-between text-3xs text-white/80">
                    <span>14 Solutions Submitted</span>
                    <span>Deadline: 2 days left</span>
                  </div>
                </div>

                {/* Main Illustration Label */}
                <div className="text-white space-y-2 self-start z-10">
                  <p className="text-3xs font-semibold uppercase tracking-widest text-sky-light">CII MP CHAPTER Initiative</p>
                  <p className="text-xl font-bold display-font">Bridging Classrooms with Corporate Boardrooms</p>
                </div>

                {/* Absolute Floating UI badge */}
                <div className="absolute bottom-6 right-6 bg-white text-text-primary py-2.5 px-4 rounded-2xl shadow-xl border border-border flex items-center gap-2 animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-cta/15 flex items-center justify-center text-cta">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-3xs font-bold text-text-primary leading-tight">Student PII Protected</span>
                    <span className="text-4xs text-text-muted">Merit-first evaluations</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </section>

      {/* ─── SECTION 2: PARTNERS MARQUEE ────────────────────────────────────── */}
      <section className="bg-white py-8 overflow-hidden border-b border-border">
        <div className="container mx-auto px-4 mb-3">
          <p className="text-2xs uppercase tracking-widest text-center text-text-muted font-bold">
            Empowering Collaboration Across Madhya Pradesh Institutions
          </p>
        </div>
        <div className="relative flex overflow-x-hidden">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-sm text-text-secondary font-semibold">
            {partnerInstitutes.map((inst, index) => (
              <span key={`marquee-1-${index}`} className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-primary" />
                <span>{inst}</span>
              </span>
            ))}
          </div>
          {/* Double list for smooth infinite scroll */}
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 text-sm text-text-secondary font-semibold" aria-hidden="true">
            {partnerInstitutes.map((inst, index) => (
              <span key={`marquee-2-${index}`} className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-primary" />
                <span>{inst}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: PLATFORM EXPLAINER ──────────────────────────────────── */}
      <section className="py-20 bg-off-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Block */}
            <div className="space-y-6 text-center lg:text-left">
              <span className="text-xs uppercase tracking-widest text-primary font-bold">Platform Overview</span>
              <h2 className="text-4xl font-bold text-text-primary leading-snug">
                A secure portal connecting curious student minds with actual corporate problems.
              </h2>
              <p className="text-text-secondary leading-relaxed">
                CIISIC replaces abstract classroom theories with actionable corporate challenges. Industries post critical blockers, while students submit their strategic approach documents. Our unique matching framework fosters genuine innovation while safeguarding student privacy.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
                <div className="bg-white p-4 rounded-xl border border-border flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-text-primary">Anonymized Submission</h4>
                    <p className="text-xs text-text-secondary mt-1">Student identities remain shielded during industry reviews.</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-border flex gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-text-primary">Auditable Environment</h4>
                    <p className="text-xs text-text-secondary mt-1">All threads and files are permanently logged and immutably secured.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Stats Block */}
            <div className="grid grid-cols-2 gap-6">

              <div className="bg-white p-8 rounded-2xl border border-border shadow-card flex flex-col justify-between hover:shadow-lg transition-all">
                <span className="text-5xl font-bold text-primary display-font leading-none">37+</span>
                <div className="mt-4">
                  <h3 className="font-bold text-md text-text-primary">Institutions Active</h3>
                  <p className="text-xs text-text-muted mt-1">Colleges connected to coordinate student solutions.</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-border shadow-card flex flex-col justify-between hover:shadow-lg transition-all">
                <span className="text-5xl font-bold text-cta display-font leading-none">340+</span>
                <div className="mt-4">
                  <h3 className="font-bold text-md text-text-primary">Challenges Handled</h3>
                  <p className="text-xs text-text-muted mt-1">Industrial and research blockers posted for resolution.</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-border shadow-card flex flex-col justify-between hover:shadow-lg transition-all">
                <span className="text-5xl font-bold text-success display-font leading-none">7</span>
                <div className="mt-4">
                  <h3 className="font-bold text-md text-text-primary">Excellence Cells</h3>
                  <p className="text-xs text-text-muted mt-1">Dedicated domains hosting distinct state cell cells.</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-border shadow-card flex flex-col justify-between hover:shadow-lg transition-all">
                <span className="text-5xl font-bold text-text-primary display-font leading-none">₹0</span>
                <div className="mt-4">
                  <h3 className="font-bold text-md text-text-primary">Egress Fees</h3>
                  <p className="text-xs text-text-muted mt-1">Zero costs to students or institutions for file downloads.</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 4: HOW IT WORKS ───────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-sky-light to-sky-mid/40 relative">
        <CloudDivider />
        <div className="container mx-auto px-4 md:px-6">

          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-cta font-bold">Workflow Lifecycle</span>
            <h2 className="text-4xl font-bold text-text-primary display-font">From Problem to Impact</h2>
            <p className="text-text-secondary">A highly structured, four-step process driving state-wide academic innovation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white p-6 rounded-2xl border border-border shadow-card card-bounce flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center font-bold text-lg mb-4">1</div>
                <h3 className="font-bold text-md text-text-primary">Industry Posts Problem</h3>
                <p className="text-xs text-text-secondary mt-2">Companies submit rich problem statements with timelines and hidden budget details.</p>
              </div>
              <span className="text-4xs text-text-muted uppercase tracking-wider mt-4">Step 01</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-card card-bounce flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cta-soft text-cta flex items-center justify-center font-bold text-lg mb-4">2</div>
                <h3 className="font-bold text-md text-text-primary">Students Submit Solutions</h3>
                <p className="text-xs text-text-secondary mt-2">Students upload detailed technical approach documents and summary pitches.</p>
              </div>
              <span className="text-4xs text-text-muted uppercase tracking-wider mt-4">Step 02</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-card card-bounce flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-success/15 text-success flex items-center justify-center font-bold text-lg mb-4">3</div>
                <h3 className="font-bold text-md text-text-primary">Review & Secure Chat</h3>
                <p className="text-xs text-text-secondary mt-2">Industries review proposals anonymously, request revisions, and chat on query threads.</p>
              </div>
              <span className="text-4xs text-text-muted uppercase tracking-wider mt-4">Step 03</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-border shadow-card card-bounce flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-warning/15 text-warning flex items-center justify-center font-bold text-lg mb-4">4</div>
                <h3 className="font-bold text-md text-text-primary">Impact & Recognition</h3>
                <p className="text-xs text-text-secondary mt-2">Approved approach documents trigger notifications, certificates, and portfolio points.</p>
              </div>
              <span className="text-4xs text-text-muted uppercase tracking-wider mt-4">Step 04</span>
            </div>

          </div>

        </div>
        <div className="absolute bottom-0 left-0 w-full rotate-180">
          <CloudDivider />
        </div>
      </section>

      {/* ─── SECTION 5: CELLS SHOWCASE ──────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-primary font-bold">CII EXCELLENCE CELLS</span>
              <h2 className="text-4xl font-bold text-text-primary display-font">7 Cells. 7 Themes. One Platform.</h2>
              <p className="text-text-secondary max-w-xl">Each excellence cell coordinates research, skills, and industry challenges for specific domains.</p>
            </div>
            <Link
              href="/cells"
              className="inline-flex items-center gap-1.5 text-primary hover:text-primary-dark font-bold text-sm group shrink-0"
            >
              <span>View All Cells Directory</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cells.slice(0, 6).map((cell) => (
              <div
                key={cell.theme}
                className="group relative rounded-2xl border border-border bg-white shadow-card card-bounce overflow-hidden flex flex-col justify-between h-[360px]"
              >
                {/* Header background representation */}
                <div
                  className="h-36 w-full relative overflow-hidden flex items-center justify-center text-white"
                  style={{ background: `linear-gradient(135deg, ${cell.primaryColor}, ${cell.primaryColor}dd)` }}
                >
                  {/* Web image or falling icon */}
                  <img
                    src={cell.imagePath}
                    alt={cell.name}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="relative z-10 text-center px-4">
                    <span className="text-2xs font-semibold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                      {cell.colorName} CELL
                    </span>
                    <h3 className="font-bold text-lg leading-snug">{cell.name}</h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-text-muted font-medium">Hosted by {cell.hostName}</p>
                    <p className="text-sm font-medium italic text-text-secondary leading-snug">
                      &ldquo;{cell.tagline}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
                    <span className="text-3xs text-text-muted font-semibold uppercase tracking-wider">CII CELL CELL</span>
                    <Link
                      href={`/cells/${cell.theme.toLowerCase()}`}
                      className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 group-hover:underline"
                    >
                      <span>Explore Cell →</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── SECTION 6: TESTIMONIALS ────────────────────────────────────────── */}
      <section className="py-20 bg-off-white overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-6">

          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="text-xs uppercase tracking-widest text-primary font-bold">User Testimonials</span>
            <h2 className="text-4xl font-bold text-text-primary display-font">Studify-Inspired Testimonials</h2>
            <p className="text-text-secondary">What students and industry leaders in MP are saying about the platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">

            {/* Tilted Left Card */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-md transform md:-rotate-2 hover:rotate-0 transition-transform duration-300 flex flex-col justify-between h-64">
              <div className="space-y-4">
                <div className="flex text-amber-400">★ ★ ★ ★ ★</div>
                <p className="text-sm text-text-secondary leading-relaxed font-medium">
                  &ldquo;CIISIC helped me submit an alternative scoring framework for small stores. The Industry SPOC was highly responsive.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-border pt-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-xs text-primary">AP</div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Anjali Pathak</h4>
                  <p className="text-4xs text-text-muted uppercase">Student · LNCT</p>
                </div>
              </div>
            </div>

            {/* Straight Center Card */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-lg z-10 flex flex-col justify-between h-64 border-primary/20">
              <div className="space-y-4">
                <div className="flex text-amber-400">★ ★ ★ ★ ★</div>
                <p className="text-sm text-text-primary leading-relaxed font-semibold">
                  &ldquo;By shielding student PII, we evaluated proposals purely on merit. We selected two solutions that solved our core agricultural datasets blocker.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-border pt-4">
                <div className="w-8 h-8 rounded-full bg-cta/20 flex items-center justify-center font-bold text-xs text-cta">RK</div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Rajesh Kulkarni</h4>
                  <p className="text-4xs text-text-muted uppercase">Industry SPOC · Netlink</p>
                </div>
              </div>
            </div>

            {/* Tilted Right Card */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-md transform md:rotate-2 hover:rotate-0 transition-transform duration-300 flex flex-col justify-between h-64">
              <div className="space-y-4">
                <div className="flex text-amber-400">★ ★ ★ ★ ★</div>
                <p className="text-sm text-text-secondary leading-relaxed font-medium">
                  &ldquo;Having an immutable log of all communications keeps our collaboration transparent and secure. Super easy to oversee our students.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 border-t border-border pt-4">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center font-bold text-xs text-success">AB</div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">Dr. Amit Bansal</h4>
                  <p className="text-4xs text-text-muted uppercase">SPOC · LNCT Group</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 7: FEATURE SPLIT ───────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-sky-mid/20 to-sky-light/10 relative">
        <CloudDivider />
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-16">

            {/* Split A */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 relative flex justify-center order-last lg:order-first">
                <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-2xl bg-white border border-border shadow-xl p-6 flex flex-col justify-between card-bounce">
                  <div className="w-12 h-12 rounded-xl bg-cta-soft text-cta flex items-center justify-center"><Users className="w-6 h-6" /></div>
                  <div className="space-y-2">
                    <span className="text-4xs font-bold text-cta uppercase">Anonymized UI</span>
                    <h3 className="font-bold text-md text-text-primary">Shielded Identity View</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Industry reviewers see Proposal ID #PROP-392 and the approach documentation, but student personal details remain locked.
                    </p>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs uppercase tracking-widest text-cta font-bold">Privacy First</span>
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary display-font">Privacy by Design</h2>
                <p className="text-text-secondary leading-relaxed">
                  Student personal data is completely shielded from industries. Conversely, industry budgets and contact details are hidden from student-facing endpoints. Direct links, contact exchanges, and email addresses are automatically redacted to enforce portal-only communication.
                </p>
              </div>
            </div>

            {/* Split B */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="text-xs uppercase tracking-widest text-primary font-bold">Real Opportunities</span>
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary display-font">Real World Focused</h2>
                <p className="text-text-secondary leading-relaxed">
                  Solve actual corporate blockers instead of generic academic examples. When your approach document is approved, you gain direct visibility with corporate decision-makers, validating your technical skills and creating paths to placements.
                </p>
              </div>
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="w-72 h-72 sm:w-80 sm:h-80 rounded-2xl bg-white border border-border shadow-xl p-6 flex flex-col justify-between card-bounce">
                  <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center"><Award className="w-6 h-6" /></div>
                  <div className="space-y-2">
                    <span className="text-4xs font-bold text-primary uppercase">Direct Validation</span>
                    <h3 className="font-bold text-md text-text-primary">Portfolio Verification</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Approved solutions trigger verified accomplishments, which can be linked in student profiles and resumes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 8: CTA BANNER ─────────────────────────────────────────── */}
      <section className="py-24 bg-text-primary text-white text-center relative overflow-hidden">

        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-2xl space-y-6">
          <span className="text-xs uppercase tracking-widest text-cta font-bold">More Than A Platform</span>
          <h2 className="text-4xl md:text-5xl font-bold display-font">Ready to Collaborate?</h2>
          <p className="text-sm text-white/60 leading-relaxed max-w-md mx-auto">
            Join the CII-powered network today. Post a challenge as an industry sponsor, or submit solutions as an active student researcher.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/register/student"
              className="w-full sm:w-auto px-8 py-3.5 bg-cta hover:bg-cta-dark text-white font-bold rounded-full transition-all card-bounce"
            >
              Join as Student
            </Link>
            <Link
              href="/auth/register/industry"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold rounded-full transition-all card-bounce"
            >
              Partner as Industry
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
