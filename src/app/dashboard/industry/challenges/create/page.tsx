'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockDb, CellTheme, SEED_CELLS, User } from '@/lib/mockDb';
import { ArrowLeft, Check, Sparkles, Calendar, Plus, X, Lock, Eye, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function CreateChallenge() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Stepper
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<CellTheme | ''>('');
  const [problemStatement, setProblemStatement] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budgetRange, setBudgetRange] = useState('<50K');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCurrentUser(mockDb.getCurrentUser());
  }, []);

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagInput.trim()) return;
    const term = tagInput.trim();
    if (!tags.includes(term)) {
      setTags([...tags, term]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!title.trim() || title.length > 120) {
        setErrorMsg("Please enter a title (max 120 characters).");
        return;
      }
      if (!domain) {
        setErrorMsg("Please select an Excellence Cell Theme.");
        return;
      }
      if (!problemStatement.trim()) {
        setErrorMsg("Please provide a summary problem statement.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!deadline) {
        setErrorMsg("Please choose a submission deadline date.");
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setStep(prev => prev - 1);
  };

  const handlePublish = () => {
    if (!title || !domain || !problemStatement || !deadline) return;
    setIsSubmitting(true);

    const compName = currentUser?.industryProfile?.companyName || 'Netlink Business Solutions';

    // Call mockDb
    mockDb.addChallenge(
      title,
      problemStatement,
      description || `<p>${problemStatement}</p>`, // Fallback for detailed description
      domain as CellTheme,
      new Date(deadline).toISOString(),
      budgetRange,
      tags,
      compName
    );

    setTimeout(() => {
      setIsSubmitting(false);
      alert("Challenge published successfully and students have been notified!");
      router.push('/dashboard/industry/challenges');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Back link */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <Link 
          href="/dashboard/industry" 
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Industry Dashboard</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden">
        
        {/* Stepper Header */}
        <div className="bg-off-white px-8 py-6 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-md text-text-primary display-font">Post New Challenge</h2>
          
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step === s ? 'bg-primary text-white shadow-sm' :
                  step > s ? 'bg-success-soft text-success border border-success/30' :
                  'bg-white text-text-muted border border-border'
                }`}
              >
                {step > s ? <Check className="w-3.5 h-3.5" /> : s}
              </div>
            ))}
          </div>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-8 mt-6 p-4 bg-error-soft border border-error/25 rounded-xl text-error text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4.5 h-4.5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="p-8">
          
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div className="space-y-6">
              
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-2xs uppercase font-bold text-text-secondary tracking-wider">
                  <span>Challenge Title *</span>
                  <span className={title.length > 120 ? 'text-error' : 'text-text-muted'}>
                    {title.length} / 120 chars
                  </span>
                </div>
                <input 
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI-Powered Crop Disease Diagnosis"
                  className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-sm bg-off-white focus:bg-white transition-all font-semibold"
                />
              </div>

              {/* Cell Theme selection grid */}
              <div className="space-y-2">
                <label className="text-2xs font-bold text-text-secondary uppercase tracking-wider block">Excellence Cell Theme *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {Object.entries(SEED_CELLS).map(([key, cell]) => {
                    const active = domain === key;
                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setDomain(key as CellTheme)}
                        className={`p-3 rounded-xl border text-center transition-all text-xs font-bold flex flex-col justify-center items-center gap-1.5 h-20 ${
                          active 
                            ? 'border-primary bg-primary-soft/50 text-primary shadow-sm' 
                            : 'border-border bg-white text-text-secondary hover:bg-off-white'
                        }`}
                      >
                        <Sparkles className="w-4 h-4" style={{ color: cell.primaryColor }} />
                        <span className="leading-tight truncate w-full">{cell.name.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-2xs font-bold text-text-secondary uppercase tracking-wider">Problem Statement Summary *</label>
                <textarea 
                  rows={3}
                  required
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="Provide a plain-text summary describing the core blocker (e.g. Develop an offline-first mobile AI application to identify soybean crop leaf diseases)..."
                  className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-sm bg-off-white focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-2xs font-bold text-text-secondary uppercase tracking-wider">Detailed Scope & Requirements (HTML/Markdown)</label>
                <textarea 
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="<h3>Scope & Context</h3><p>Madhya Pradesh is losing crops...</p><h3>What we are looking for:</h3><ul><li>Offline framework...</li></ul>"
                  className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-xs bg-off-white focus:bg-white transition-all font-mono"
                />
              </div>

            </div>
          )}

          {/* STEP 2: TIMELINE & DETAILS */}
          {step === 2 && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Deadline */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-2xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    Submission Deadline *
                  </label>
                  <input 
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-sm bg-off-white focus:bg-white transition-all font-medium"
                  />
                </div>

                {/* Budget Range dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-2xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-cta" />
                    Budget Range
                  </label>
                  <select 
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-border focus:outline-none text-sm bg-off-white"
                  >
                    <option value="<₹50K">&lt; ₹50,000</option>
                    <option value="₹50K - ₹2L">₹50,000 - ₹2,00,000</option>
                    <option value="₹2L - ₹5L">₹2,00,000 - ₹5,00,000</option>
                    <option value="₹5L+">₹5,00,000+</option>
                  </select>
                  <p className="text-4xs text-cta font-bold mt-1 uppercase flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    This budget is strictly hidden from students
                  </p>
                </div>

              </div>

              {/* Tag inputs */}
              <div className="space-y-3">
                <label className="text-2xs font-bold text-text-secondary uppercase tracking-wider block">Skill Tags</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Add skill tag (e.g. AgriTech)..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="px-3.5 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-primary flex-grow bg-off-white"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddTag}
                    className="px-4 bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tags.map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-soft text-primary rounded-full text-4xs font-bold"
                    >
                      <span>#{tag}</span>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="w-3 h-3 rounded-full bg-primary/15 text-primary hover:bg-primary hover:text-white flex items-center justify-center text-5xs"
                      >
                        <X className="w-2 h-2" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: PREVIEW & PUBLISH */}
          {step === 3 && (
            <div className="space-y-6">
              
              <div className="bg-warning-soft border border-warning/15 p-4 rounded-xl text-xs text-text-secondary flex items-start gap-2.5">
                <Eye className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-text-primary display-font">Verify Student View Preview</h4>
                  <p className="text-4xs text-text-muted mt-0.5">This represents what is visible to active student candidates.</p>
                </div>
              </div>

              {/* Preview Container */}
              <div className="rounded-2xl border border-border overflow-hidden bg-off-white text-xs">
                
                {/* Simulated Header */}
                <div className="p-6 bg-text-primary text-white space-y-3">
                  <div className="flex gap-2">
                    <span className="text-5xs bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase">
                      {domain ? SEED_CELLS[domain as CellTheme].name.split(' ')[0] : 'Excellence'} Cell
                    </span>
                    <span className="text-5xs bg-success text-white px-2 py-0.5 rounded-full font-bold uppercase">OPEN</span>
                  </div>
                  <h3 className="text-md font-bold display-font">{title || "Untitled Challenge"}</h3>
                  <p className="text-5xs text-white/70">Posted by: {currentUser?.industryProfile?.companyName} · Closes: {deadline}</p>
                </div>

                {/* Simulated Body */}
                <div className="p-6 space-y-4 bg-white">
                  <div>
                    <span className="text-5xs text-text-muted uppercase font-bold tracking-wider block">Problem Statement</span>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">{problemStatement}</p>
                  </div>
                  
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag, idx) => (
                        <span key={idx} className="bg-primary-soft text-primary px-2 py-0.5 rounded-full text-5xs font-semibold">#{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Privacy row check */}
                  <div className="border-t border-border pt-4 flex justify-between items-center text-4xs text-cta font-bold">
                    <span>LOCK BUDGET check:</span>
                    <span className="flex items-center gap-1 font-bold">
                      <Lock className="w-3 h-3" />
                      Budget hidden from student views
                    </span>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between pt-8 border-t border-border mt-8">
            {step > 1 ? (
              <button 
                type="button"
                onClick={handlePrevStep}
                className="px-6 py-2 bg-white hover:bg-off-white text-text-secondary border border-border text-xs font-bold rounded-full transition-colors"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button 
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-full shadow-md transition-all card-bounce"
              >
                Continue
              </button>
            ) : (
              <button 
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-cta hover:bg-cta-dark disabled:bg-text-muted text-white text-xs font-bold rounded-full shadow-md shadow-cta/25 transition-all card-bounce flex items-center gap-1.5"
              >
                <CheckCircle className="w-4.5 h-4.5" />
                <span>{isSubmitting ? "Publishing..." : "Publish Challenge"}</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
