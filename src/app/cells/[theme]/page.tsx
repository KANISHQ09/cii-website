'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { SEED_CELLS, mockDb, Challenge, CellTheme, CellDetails } from '@/lib/mockDb';
import { CloudDivider } from '@/components/ui/CloudDivider';
import { 
  Building2, Calendar, ShieldAlert, Award, ArrowLeft, 
  MapPin, CheckCircle, HelpCircle, Briefcase 
} from 'lucide-react';

export default function CellPage() {
  const params = useParams();
  const router = useRouter();
  const [cell, setCell] = useState<CellDetails | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const themeStr = params?.theme as string;

  useEffect(() => {
    if (!themeStr) return;

    // Normalize parameter (e.g. startup -> STARTUP, ai_in_business -> AI_IN_BUSINESS)
    const normalizedKey = themeStr.toUpperCase().replace(/-/g, '_') as CellTheme;
    const cellData = SEED_CELLS[normalizedKey];

    if (!cellData) {
      // Cell not found, redirect to cells directory
      router.push('/cells');
      return;
    }

    setCell(cellData);

    // Get challenges specific to this cell
    const allChallenges = mockDb.getChallenges();
    const cellChallenges = allChallenges.filter(c => c.domain === normalizedKey && c.status === 'OPEN');
    setChallenges(cellChallenges);
    
    setIsLoading(false);
  }, [themeStr, router]);

  if (isLoading || !cell) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // Get cell pillars based on domain
  const getPillars = (theme: CellTheme) => {
    switch(theme) {
      case 'STARTUP':
        return [
          { title: "Ideation & Incubation", desc: "Coaching early ideas into concrete business plans." },
          { title: "Mentor Network", desc: "Connecting builders with experienced CII executives." },
          { title: "Investor Demo Days", desc: "Pitches to local and national angel funds." },
          { title: "Scale Support", desc: "Assistance with business filings and scaling." }
        ];
      case 'AI_IN_BUSINESS':
        return [
          { title: "Machine Learning Implementations", desc: "Automating workflows with predictive model engines." },
          { title: "Computer Vision Systems", desc: "Visual data quality controls and inspections." },
          { title: "Alternative Scoring Engine", desc: "Parsing alternative datasets for creditscoring." },
          { title: "NLP Automation", desc: "Translating dialects and text queries locally." }
        ];
      case 'AGRITECH':
        return [
          { title: "Crop Disease Diagnosis", desc: "Machine Learning models for leaf disease detection." },
          { title: "IoT Field Sensors", desc: "Measuring soil chemical content and moisture levels." },
          { title: "Drip Automation", desc: "Conserving water using automated micro-irrigation." },
          { title: "Remedial Suggestion", desc: "Organic remediation recipes written in Hindi." }
        ];
      default:
        return [
          { title: "Industrial Collaborations", desc: "Tackling actual blockers faced by state businesses." },
          { title: "Student Internships", desc: "Gaining corporate exposure through approved solutions." },
          { title: "IP Development", desc: "Filing and co-owning innovative patents." },
          { title: "Skills Validation", desc: "Earning verified portfolio checkpoints." }
        ];
    }
  };

  const pillars = getPillars(cell.theme);

  return (
    <div className="bg-off-white min-h-screen">
      
      {/* ─── HERO SECTION ────────────────────────────────────────────────────── */}
      <section 
        className="relative pt-24 pb-20 text-white overflow-hidden transition-colors"
        style={{ backgroundColor: cell.primaryColor }}
      >
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-black/25 z-0" />
        <img 
          src={cell.imagePath} 
          alt={cell.name}
          className="absolute inset-0 w-full h-full object-cover opacity-15 mix-blend-overlay z-0"
        />

        <div className="container mx-auto px-4 md:px-6 relative z-10 space-y-6">
          <Link 
            href="/cells" 
            className="inline-flex items-center gap-1.5 text-white/80 hover:text-white font-medium text-xs bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-full transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Cells</span>
          </Link>

          <div className="max-w-3xl space-y-4">
            <span 
              className="text-2xs font-bold px-3 py-1 rounded-full uppercase tracking-wider inline-block text-text-primary"
              style={{ backgroundColor: cell.accentColor }}
            >
              {cell.colorName} Cell
            </span>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight display-font text-white">
              {cell.name}
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 font-medium italic">
              &ldquo;{cell.tagline}&rdquo;
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs text-white/80">
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-white" />
                Host: <strong>{cell.hostName}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-white" />
                Bhopal State Office
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud divider from dark theme to off-white */}
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Pillars & Host */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Host Institution Block */}
            <div className="bg-white p-8 rounded-2xl border border-border shadow-sm space-y-4">
              <h2 className="text-2xl font-bold text-text-primary display-font">About the Host Institution</h2>
              <p className="text-sm text-text-secondary leading-relaxed">
                The cell is hosted at <strong className="text-text-primary">{cell.hostName}</strong>. As an Excellence Cell host, they allocate laboratories, technical advisors, and administrative coordinators to support students working on these strategic problem statements.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-off-white rounded-xl border border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">Resource Facility</h4>
                    <p className="text-4xs text-text-muted uppercase">Lab access provided</p>
                  </div>
                </div>
                <div className="p-4 bg-off-white rounded-xl border border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cta-soft text-cta flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-text-primary">CII Endorsed Advisor</h4>
                    <p className="text-4xs text-text-muted uppercase">Mentorship verified</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Core Pillars */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-text-primary display-font">Cell Focus Areas & Pillars</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {pillars.map((p, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl border border-border shadow-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <h4 className="font-bold text-sm text-text-primary">{p.title}</h4>
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed pl-6">{p.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Challenges List */}
          <div className="space-y-8">
            
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
              <div className="border-b border-border pb-4 flex justify-between items-center">
                <h3 className="font-bold text-md text-text-primary display-font">Active Challenges</h3>
                <span className="bg-primary/10 text-primary text-3xs font-bold px-2 py-0.5 rounded-full">
                  {challenges.length} OPEN
                </span>
              </div>

              {challenges.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-off-white flex items-center justify-center mx-auto text-text-muted text-lg font-bold">!</div>
                  <h4 className="text-sm font-semibold text-text-primary">No Active Challenges</h4>
                  <p className="text-xs text-text-secondary">Check back soon for new corporate prompts in this domain.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {challenges.map((c) => (
                    <div key={c.id} className="p-4 rounded-xl border border-border bg-off-white hover:bg-white hover:border-primary/20 hover:shadow-md transition-all group">
                      <h4 className="font-bold text-xs text-text-primary group-hover:text-primary transition-colors line-clamp-1">{c.title}</h4>
                      <p className="text-4xs text-text-muted mt-1 leading-snug line-clamp-2">{c.problemStatement}</p>
                      
                      <div className="flex items-center justify-between mt-3 text-4xs text-text-muted">
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-cta" /> {c.industryProfileId}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(c.deadline).toLocaleDateString()}</span>
                      </div>
                      
                      <Link 
                        href={`/challenges/${c.id}`} 
                        className="mt-3 w-full py-1.5 text-center bg-white hover:bg-primary hover:text-white border border-border hover:border-primary text-4xs font-bold rounded-lg transition-colors block"
                      >
                        Review Challenge Details →
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Action Banner */}
            <div className="p-6 rounded-2xl bg-text-primary text-white space-y-4 shadow-lg text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-lg" />
              <h3 className="font-bold text-sm display-font">Submit Innovative Approach</h3>
              <p className="text-4xs text-white/70 leading-relaxed">
                Registered students can immediately download datasets and submit solutions. Safeguard details through our portal interface.
              </p>
              <Link 
                href="/challenges" 
                className="w-full py-2 bg-cta hover:bg-cta-dark text-white text-xs font-bold rounded-xl transition-colors block"
              >
                Browse All Cell Challenges
              </Link>
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
