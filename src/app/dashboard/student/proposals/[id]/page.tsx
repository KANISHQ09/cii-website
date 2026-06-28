'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockDb, Proposal, Challenge, Message, User, SEED_CELLS } from '@/lib/mockDb';
import { 
  ArrowLeft, FileText, Send, Calendar, Briefcase, Award, 
  MessageSquare, History, CheckCircle, ShieldAlert, Download, Upload 
} from 'lucide-react';

export default function StudentProposalDetail() {
  const params = useParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeTab, setActiveTab] = useState<'PROPOSAL' | 'MESSAGES' | 'TIMELINE'>('PROPOSAL');
  const [isLoading, setIsLoading] = useState(true);

  // Message Form State
  const [msgBody, setMsgBody] = useState('');
  const [attachedFile, setAttachedFile] = useState('');

  // Revision Form State
  const [revisedFile, setRevisedFile] = useState('');
  const [isSubmittingRevision, setIsSubmittingRevision] = useState(false);

  const id = params?.id as string;
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    setCurrentUser(user);

    if (!id) return;

    // Load proposal details
    const prop = mockDb.getProposalById(id);
    if (!prop) {
      router.push('/dashboard/student/proposals');
      return;
    }

    setProposal(prop);

    // Load challenge
    const chal = mockDb.getChallengeById(prop.challengeId);
    if (chal) setChallenge(chal);

    // Load message history
    setMessages(mockDb.getMessages(prop.id));

    setIsLoading(false);
  }, [id, router]);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (activeTab === 'MESSAGES') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Periodic polling for new messages/updates
  useEffect(() => {
    if (!id) return;
    const interval = setInterval(() => {
      const updatedProp = mockDb.getProposalById(id);
      if (updatedProp) setProposal(updatedProp);
      setMessages(mockDb.getMessages(id));
    }, 3000);
    return () => clearInterval(interval);
  }, [id]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !proposal || (!msgBody.trim() && !attachedFile)) return;

    // Send via mockDb
    mockDb.addMessage(proposal.id, currentUser.id, msgBody, false, attachedFile || undefined);
    setMsgBody('');
    setAttachedFile('');
    setMessages(mockDb.getMessages(proposal.id));
  };

  const handleSubmitRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal || !revisedFile) return;

    setIsSubmittingRevision(true);
    setTimeout(() => {
      // Update proposal document and return status to SUBMITTED
      const allProps = mockDb.getProposals();
      const propIndex = allProps.findIndex(p => p.id === proposal.id);
      if (propIndex !== -1) {
        allProps[propIndex].approachDoc = revisedFile;
        allProps[propIndex].status = 'SUBMITTED';
        allProps[propIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('ciisic_proposals', JSON.stringify(allProps));
      }

      // System message
      mockDb.addMessage(proposal.id, 'system', `Student submitted a revised approach document: ${revisedFile}`, true);
      
      // Notify Industry SPOC
      if (challenge) {
        const users = mockDb.getUsers();
        users.filter(u => u.role === 'INDUSTRY_SPOC' && u.industryProfile?.companyName === challenge.industryProfileId).forEach(indUser => {
          mockDb.triggerNotification(
            indUser.id,
            'Revised Proposal Submitted',
            `A revised solution was submitted for challenge: "${challenge.title}".`,
            `/dashboard/industry/challenges/${challenge.id}/proposals/${proposal.id}`
          );
        });
      }

      // Refresh state
      const updatedProp = mockDb.getProposalById(proposal.id);
      if (updatedProp) setProposal(updatedProp);
      
      setRevisedFile('');
      setIsSubmittingRevision(false);
      alert("Revision submitted successfully!");
    }, 1500);
  };

  if (isLoading || !proposal || !challenge) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const cell = SEED_CELLS[challenge.domain];
  const isApproved = proposal.status === 'APPROVED';
  const isRevisionNeeded = proposal.status === 'REVISION_REQUESTED';
  const isRejected = proposal.status === 'REJECTED';

  return (
    <div className="space-y-6">
      
      {/* Back Link */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <Link 
          href="/dashboard/student/proposals" 
          className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Proposals</span>
        </Link>
        <span className="text-4xs text-text-muted uppercase tracking-widest font-semibold">
          Proposal ID: #{proposal.id.slice(-6).toUpperCase()}
        </span>
      </div>

      {/* Main Info Card */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span 
              className="text-4xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white shadow-3xs"
              style={{ backgroundColor: cell.primaryColor }}
            >
              {cell.name.split(' ')[0]} Cell
            </span>
            <span className={`inline-flex items-center gap-1 text-4xs font-bold px-2 py-0.5 rounded-full ${
              isApproved ? 'bg-success-soft text-success' :
              isRevisionNeeded ? 'bg-warning-soft text-warning border border-warning/20' :
              isRejected ? 'bg-error-soft text-error' :
              'bg-primary-soft text-primary'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {proposal.status.replace('_', ' ')}
            </span>
          </div>
          <span className="text-4xs text-text-muted font-medium">Submitted on {new Date(proposal.submittedAt).toLocaleDateString()}</span>
        </div>

        <h2 className="text-xl font-bold text-text-primary display-font leading-snug">
          {challenge.title}
        </h2>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-border gap-4">
        {[
          { key: 'PROPOSAL', label: 'Approach Details', icon: FileText },
          { key: 'MESSAGES', label: `Secure Chat (${messages.filter(m => !m.isSystemMsg).length})`, icon: MessageSquare },
          { key: 'TIMELINE', label: 'Lifecycle Timeline', icon: History }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold border-b-2 -mb-0.5 transition-all ${
              activeTab === tab.key 
                ? 'border-primary text-primary font-bold' 
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <tab.icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="space-y-6">
        
        {/* 1. PROPOSAL TAB */}
        {activeTab === 'PROPOSAL' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Details */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Document Info */}
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-text-primary border-b border-border pb-3 display-font">Submitted Approach</h3>
                <div className="p-4 bg-off-white rounded-xl border border-border flex items-center justify-between group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-soft text-primary flex items-center justify-center">
                      <FileText className="w-5.5 h-5.5" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-bold text-text-primary truncate">{proposal.approachDoc}</h4>
                      <p className="text-4xs text-text-muted uppercase font-bold">PDF Solution Cartridge</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => alert("File downloading...")}
                    className="w-8 h-8 rounded-full border border-border bg-white text-text-secondary hover:text-primary hover:bg-primary-soft flex items-center justify-center transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <span className="text-4xs font-semibold text-text-muted uppercase block">Solution Abstract summary</span>
                  <p className="text-xs text-text-secondary leading-relaxed bg-off-white p-4 rounded-xl border border-border italic">
                    &ldquo;{proposal.summary}&rdquo;
                  </p>
                </div>
              </div>

              {/* Revision Submission Form (only visible if status = REVISION_REQUESTED) */}
              {isRevisionNeeded && (
                <div className="bg-white p-6 rounded-2xl border border-warning/20 shadow-sm space-y-4">
                  <div className="flex items-start gap-2.5 text-warning">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-sm text-text-primary display-font">Revision Requested by Sponsor</h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Please review the feedback and submit a corrected solution blueprint.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-warning-soft/30 rounded-xl border border-warning/15 text-xs text-text-secondary italic">
                    <strong>Revision Notes:</strong> &ldquo;{proposal.revisionNotes || "Please elaborate on your algorithm details."}&rdquo;
                  </div>

                  {/* Revision Form */}
                  <form onSubmit={handleSubmitRevision} className="space-y-4 pt-2">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-text-primary uppercase">Upload Revised Solution Document</label>
                      <div className="flex items-center gap-3">
                        <input 
                          type="text"
                          required
                          value={revisedFile}
                          onChange={(e) => setRevisedFile(e.target.value)}
                          placeholder="solution_revised_v2.pdf"
                          className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-sm bg-off-white flex-1"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingRevision || !revisedFile}
                          className="px-6 py-2.5 bg-cta hover:bg-cta-dark disabled:bg-text-muted text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
                        >
                          <Upload className="w-4 h-4" />
                          <span>{isSubmittingRevision ? "Uploading..." : "Submit Revision"}</span>
                        </button>
                      </div>
                      <p className="text-4xs text-text-muted">PDF or DOCX documents only. Max size 10MB.</p>
                    </div>
                  </form>
                </div>
              )}

            </div>

            {/* Right Column: Contact/Institution SPOC details */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Decision/Industry Feedback Card */}
              {proposal.feedbackByIndustry && (
                <div className="bg-white p-6 rounded-2xl border border-success/20 shadow-sm space-y-3">
                  <h4 className="font-bold text-xs text-success flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Industry Sponsor Feedback
                  </h4>
                  <p className="text-xs text-text-secondary leading-relaxed bg-success-soft/30 p-3 rounded-lg border border-success/10 italic">
                    &ldquo;{proposal.feedbackByIndustry}&rdquo;
                  </p>
                </div>
              )}

              {/* Secure Redactor Info */}
              <div className="bg-text-primary text-white p-6 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-cta/15 rounded-full blur-lg" />
                <h4 className="font-bold text-xs display-font flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-cta" />
                  Secure Masking Active
                </h4>
                <p className="text-4xs text-white/70 leading-relaxed">
                  Your identity details remain anonymized to industry sponsors. Do not send phone numbers, personal emails, or social media links in the chat window. All contact details will be automatically redacted.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* 2. MESSAGES TAB (SECURE CHAT) */}
        {activeTab === 'MESSAGES' && (
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-[500px]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-off-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                <MessageSquare className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-text-primary leading-tight">Anonymized Inquiry Thread</h3>
                <p className="text-4xs text-text-muted mt-0.5">Secure communication thread with Industry review panel</p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-off-white/30">
              {messages.map((m) => {
                if (m.isSystemMsg) {
                  return (
                    <div key={m.id} className="text-center my-3">
                      <span className="inline-block bg-white/80 border border-border px-3 py-1 rounded-full text-5xs text-text-muted uppercase tracking-wider font-semibold">
                        System: {m.body} · {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                  );
                }

                const isMe = m.senderId === currentUser?.id;

                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}>
                    <span className="text-5xs text-text-muted px-2">
                      {isMe ? 'You (Anonymized)' : m.senderName} · {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <div className={`p-3 rounded-2xl max-w-sm text-xs leading-relaxed ${
                      isMe 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white text-text-primary border border-border rounded-tl-none'
                    }`}>
                      <p>{m.body}</p>
                      {m.attachmentUrl && (
                        <div className={`mt-2 p-2 rounded-lg text-4xs flex items-center gap-2 ${
                          isMe ? 'bg-white/10 text-white' : 'bg-off-white text-primary border border-border'
                        }`}>
                          <FileText className="w-3.5 h-3.5" />
                          <span className="font-bold truncate max-w-2xs">{m.attachmentUrl}</span>
                          <Download className="w-3 h-3 cursor-pointer ml-auto" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            {/* Send box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-white flex items-center gap-3">
              <div className="flex-1 relative flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="Type a message to the industry reviewer (anonymized)..."
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-xs bg-off-white focus:bg-white transition-all pr-12"
                />
                
                {/* Mock File Attachment Input */}
                <input 
                  type="text"
                  placeholder="Attach file..."
                  value={attachedFile}
                  onChange={(e) => setAttachedFile(e.target.value)}
                  className="w-24 px-2 py-2 rounded-lg border border-border text-5xs focus:outline-none bg-off-white"
                  title="Mock File attachment"
                />
              </div>

              <button 
                type="submit"
                disabled={!msgBody.trim() && !attachedFile}
                className="w-10 h-10 bg-primary hover:bg-primary-dark disabled:bg-text-muted text-white rounded-full flex items-center justify-center transition-all shrink-0 card-bounce"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        )}

        {/* 3. TIMELINE TAB */}
        {activeTab === 'TIMELINE' && (
          <div className="bg-white p-8 rounded-2xl border border-border shadow-sm space-y-6">
            <h3 className="font-bold text-sm text-text-primary border-b border-border pb-3 display-font">Proposal Lifecycle Timeline</h3>
            
            <div className="relative pl-6 border-l-2 border-primary/20 space-y-8 py-2">
              
              <div className="relative">
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-success text-white flex items-center justify-center text-5xs font-bold ring-4 ring-white">✓</div>
                <div>
                  <h4 className="font-bold text-xs text-text-primary">Proposal Submitted</h4>
                  <p className="text-4xs text-text-muted mt-0.5">{new Date(proposal.submittedAt).toLocaleString()}</p>
                  <p className="text-xs text-text-secondary mt-1">Approach document `{proposal.approachDoc}` registered and logged.</p>
                </div>
              </div>

              <div className="relative">
                <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-5xs font-bold ring-4 ring-white ${
                  proposal.status !== 'SUBMITTED' ? 'bg-success text-white' : 'bg-primary text-white'
                }`}>{proposal.status !== 'SUBMITTED' ? '✓' : '●'}</div>
                <div>
                  <h4 className="font-bold text-xs text-text-primary">Under Industry Review</h4>
                  <p className="text-4xs text-text-muted mt-0.5">
                    {proposal.status !== 'SUBMITTED' ? 'Completed' : 'Pending industry check'}
                  </p>
                  <p className="text-xs text-text-secondary mt-1">Sponsor parses approach abstract and runs dataset compatibility tests.</p>
                </div>
              </div>

              {isRevisionNeeded && (
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-warning text-white flex items-center justify-center text-5xs font-bold ring-4 ring-white">!</div>
                  <div>
                    <h4 className="font-bold text-xs text-text-primary">Revision Requested</h4>
                    <p className="text-xs text-text-secondary mt-1">
                      Sponsor flagged solution: &ldquo;{proposal.revisionNotes}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              <div className="relative">
                <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center text-5xs font-bold ring-4 ring-white ${
                  isApproved ? 'bg-success text-white' : 
                  isRejected ? 'bg-error text-white' : 
                  'bg-white text-text-muted border border-border'
                }`}>{isApproved ? '✓' : isRejected ? '✗' : '○'}</div>
                <div>
                  <h4 className="font-bold text-xs text-text-primary">Final Decision</h4>
                  <p className="text-xs text-text-secondary mt-1">
                    {isApproved ? 'Proposal Approved! Solution matches all target milestones.' :
                     isRejected ? 'Proposal Rejected.' :
                     'Pending final evaluation.'}
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
