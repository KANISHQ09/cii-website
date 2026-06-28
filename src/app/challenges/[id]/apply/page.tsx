'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockDb, Challenge, CellDetails, SEED_CELLS, User, SEED_USERS } from '@/lib/mockDb';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, Check, Award } from 'lucide-react';

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [cell, setCell] = useState<CellDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Stepper
  const [step, setStep] = useState(1);

  // Form State
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [summary, setSummary] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const id = params?.id as string;

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    setCurrentUser(user);

    // Only students can apply
    if (user.role !== 'STUDENT') {
      alert("Only registered students can apply to challenges. Switched to default student Priya Sharma for testing.");
      const studentUser = mockDb.getUsers().find(u => u.role === 'STUDENT') || SEED_USERS[1];
      mockDb.setCurrentUser(studentUser);
      setCurrentUser(studentUser);
    }

    if (!id) return;

    const chal = mockDb.getChallengeById(id);
    if (!chal) {
      router.push('/challenges');
      return;
    }

    setChallenge(chal);
    setCell(SEED_CELLS[chal.domain]);
    setIsLoading(false);
  }, [id, router]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMsg('');
    const ext = file.name.split('.').pop()?.toLowerCase();
    
    // Check extension
    if (ext !== 'pdf' && ext !== 'docx') {
      setErrorMsg("Invalid file type. Only PDF and DOCX documents are accepted.");
      return;
    }

    // Check size (10MB)
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 10) {
      setErrorMsg("File exceeds the 10MB limit. Please compress your document.");
      return;
    }

    setFileName(file.name);
    setFileSize(parseFloat(sizeInMB.toFixed(2)));
  };

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!fileName) {
        setErrorMsg("Please upload your approach document to proceed.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (summary.trim().length < 50) {
        setErrorMsg("Your summary is too short. Please provide at least 50 characters detailing your core solution idea.");
        return;
      }
      if (summary.trim().length > 500) {
        setErrorMsg("Summary exceeds the 500 character limit.");
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challenge || !fileName || !summary) return;

    // Submit via mockDb
    mockDb.submitProposal(challenge.id, summary, fileName);
    setIsSuccess(true);
  };

  if (isLoading || !challenge || !cell) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-off-white">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-off-white min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        
        {/* Back Link */}
        <Link 
          href={`/challenges/${challenge.id}`} 
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary font-bold text-xs mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Challenge Details</span>
        </Link>

        {isSuccess ? (
          /* SUCCESS STATE */
          <div className="bg-white rounded-3xl border border-border p-10 text-center space-y-6 shadow-xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Confetti simulation elements */}
            <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-cta animate-ping" />
            <div className="absolute top-20 right-10 w-3 h-3 rounded-full bg-primary animate-ping" />
            
            <div className="w-20 h-20 rounded-full bg-success-soft text-success flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-text-primary display-font">Proposal Submitted! 🎉</h1>
              <p className="text-sm text-text-secondary leading-relaxed max-w-sm mx-auto">
                Your technical approach document has been successfully logged. The industry partner has been notified.
              </p>
            </div>

            <div className="p-4 bg-off-white rounded-xl border border-border text-left text-xs space-y-1.5 max-w-md mx-auto">
              <p><strong>Challenge:</strong> {challenge.title}</p>
              <p><strong>Document:</strong> {fileName} ({fileSize} MB)</p>
              <p><strong>Status:</strong> <span className="text-success font-semibold">SUBMITTED (Pending review)</span></p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link 
                href="/dashboard/student/proposals" 
                className="w-full sm:w-auto px-6 py-2.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-full text-center transition-all card-bounce"
              >
                View My Proposals
              </Link>
              <Link 
                href="/challenges" 
                className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-off-white text-text-secondary border border-border text-xs font-bold rounded-full text-center transition-colors"
              >
                Browse Challenges
              </Link>
            </div>
          </div>
        ) : (
          /* WORKFLOW FORM */
          <div className="bg-white rounded-3xl border border-border shadow-md overflow-hidden">
            
            {/* Stepper Header */}
            <div className="bg-off-white px-8 py-6 border-b border-border flex items-center justify-between">
              <h2 className="font-bold text-md text-text-primary display-font">Apply to Challenge</h2>
              
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

            {/* Error Message */}
            {errorMsg && (
              <div className="mx-8 mt-6 p-4 bg-error-soft border border-error/25 rounded-xl text-error text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Steps Container */}
            <div className="p-8">
              
              {/* STEP 1: UPLOAD APPROACH DOCUMENT */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-bold text-md text-text-primary">Upload Technical Solution</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Upload your detailed approach blueprint describing your software architecture, database design, or engineering models.
                    </p>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-border hover:border-primary/50 bg-off-white hover:bg-primary-soft/10 rounded-2xl p-10 text-center transition-all cursor-pointer relative"
                  >
                    <input 
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.docx"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-3">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-xs border border-border flex items-center justify-center mx-auto text-text-secondary group-hover:text-primary">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-text-primary">
                          {fileName ? fileName : "Drag and drop your file here or click to browse"}
                        </p>
                        <p className="text-4xs text-text-muted mt-1 uppercase tracking-wider">
                          PDF or DOCX documents · Max 10MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* File Selected Card */}
                  {fileName && (
                    <div className="p-4 bg-primary-soft/30 rounded-xl border border-primary/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg border border-border flex items-center justify-center text-primary">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-text-primary truncate max-w-xs">{fileName}</h4>
                          <p className="text-4xs text-text-muted">{fileSize} MB</p>
                        </div>
                      </div>
                      <span className="text-4xs bg-success-soft text-success px-2 py-0.5 border border-success/20 rounded-full font-bold">READY</span>
                    </div>
                  )}

                  {/* Tips Card */}
                  <div className="p-4 rounded-2xl bg-off-white border border-border space-y-2">
                    <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-cta" />
                      Submission Best Practices
                    </h4>
                    <ul className="text-4xs text-text-secondary space-y-1 pl-5 list-disc leading-relaxed">
                      <li><strong>Anonymize content:</strong> Do not include your name, enrollment number, or phone details inside the document body.</li>
                      <li><strong>Structure clearly:</strong> Include sections for Abstract, Proposed Architecture, System requirements, and Milestones.</li>
                      <li><strong>Validation:</strong> Ensure schemas, algorithms, or visual flow charts are legible.</li>
                    </ul>
                  </div>

                </div>
              )}

              {/* STEP 2: WRITE SUMMARY */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-bold text-md text-text-primary">Write Executive Summary</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Summarize your approach in 1-3 sentences (between 50 and 500 characters). Industry sponsors see this summary first in their proposal queues.
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-2xs uppercase tracking-wider text-text-secondary font-bold">
                      <span>Approach Abstract Summary</span>
                      <span className={summary.length > 500 ? 'text-error' : 'text-text-muted'}>
                        {summary.length} / 500 chars
                      </span>
                    </div>
                    <textarea 
                      rows={6}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Our technical solution leverages an offline-first machine learning framework built on MobileNetV3. By compressing the model parameters..."
                      className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none text-sm bg-off-white focus:bg-white transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: REVIEW & SUBMIT */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-bold text-md text-text-primary">Verify Submission Details</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Please check your submission properties. Once submitted, proposal approach documentation cannot be edited due to security policy rules.
                    </p>
                  </div>

                  <div className="rounded-xl border border-border overflow-hidden text-xs">
                    
                    <div className="px-5 py-3 border-b border-border bg-off-white flex justify-between">
                      <span className="font-semibold text-text-muted uppercase text-4xs tracking-wider">Project File</span>
                      <span className="font-bold text-text-primary text-right">{fileName} ({fileSize} MB)</span>
                    </div>

                    <div className="p-5 space-y-2 bg-white">
                      <span className="font-semibold text-text-muted uppercase text-4xs tracking-wider block">Solution Abstract</span>
                      <p className="text-xs text-text-secondary leading-relaxed italic bg-off-white p-3 rounded-lg border border-border">
                        &ldquo;{summary}&rdquo;
                      </p>
                    </div>

                  </div>

                  <div className="p-4 rounded-xl bg-warning-soft border border-warning/20 text-4xs text-text-secondary leading-relaxed">
                    <strong>Warning:</strong> Your enrollment number, college name, and name will be automatically masked in this submission to enforce the platform's strictly anonymized review system.
                  </div>

                </div>
              )}

              {/* Navigation Actions */}
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
                    onClick={handleSubmit}
                    className="px-8 py-2.5 bg-cta hover:bg-cta-dark text-white text-xs font-bold rounded-full shadow-md shadow-cta/25 transition-all card-bounce"
                  >
                    Submit Solution Proposal
                  </button>
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
