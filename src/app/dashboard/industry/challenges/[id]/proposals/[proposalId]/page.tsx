'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockDb, Proposal, Challenge, Message, User, SEED_CELLS } from '@/lib/mockDb';
import { 
  ArrowLeft, FileText, Send, Calendar, CheckCircle, Clock, 
  MessageSquare, ShieldCheck, Download, AlertTriangle, Check, XCircle 
} from 'lucide-react';

export default function IndustryProposalReview() {
  const params = useParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState<'PROPOSAL' | 'MESSAGES'>('PROPOSAL');

  // Actions Form State
  const [actionType, setActionType] = useState<'NONE' | 'APPROVE' | 'REVISION' | 'REJECT'>('NONE');
  const [feedback, setFeedback] = useState('');
  const [revisionNotes, setRevisionNotes] = useState('');

  // Chat message State
  const [msgBody, setMsgBody] = useState('');
  const [attachedFile, setAttachedFile] = useState('');

  const id = params?.id as string;
  const proposalId = params?.proposalId as string;
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    setCurrentUser(user);

    if (!id || !proposalId) return;

    // Load proposal
    const prop = mockDb.getProposalById(proposalId);
    if (!prop) {
      router.push(`/dashboard/industry/challenges/${id}/proposals`);
      return;
    }
    setProposal(prop);

    // Update status to UNDER_REVIEW on first load if it was SUBMITTED
    if (prop.status === 'SUBMITTED') {
      mockDb.updateProposalStatus(prop.id, 'UNDER_REVIEW');
      prop.status = 'UNDER_REVIEW';
      setProposal({ ...prop });
    }

    // Load challenge
    const chal = mockDb.getChallengeById(prop.challengeId);
    if (chal) setChallenge(chal);

    // Load messages
    setMessages(mockDb.getMessages(prop.id));

    setIsLoading(false);
  }, [id, proposalId, router]);

  // Scroll to bottom of chat
  useEffect(() => {
    if (activeTab === 'MESSAGES') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Periodic polling for chat and status updates
  useEffect(() => {
    if (!proposalId) return;
    const interval = setInterval(() => {
      const updatedProp = mockDb.getProposalById(proposalId);
      if (updatedProp) setProposal(updatedProp);
      setMessages(mockDb.getMessages(proposalId));
    }, 3000);
    return () => clearInterval(interval);
  }, [proposalId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !proposal || (!msgBody.trim() && !attachedFile)) return;

    mockDb.addMessage(proposal.id, currentUser.id, msgBody, false, attachedFile || undefined);
    setMsgBody('');
    setAttachedFile('');
    setMessages(mockDb.getMessages(proposal.id));
  };

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposal) return;

    if (actionType === 'APPROVE') {
      if (!feedback.trim()) {
        alert("Please provide feedback for the approved solution.");
        return;
      }
      mockDb.updateProposalStatus(proposal.id, 'APPROVED', feedback);
      alert("Proposal approved successfully! Institution SPOC and student have been notified.");
    } else if (actionType === 'REVISION') {
      if (!revisionNotes.trim()) {
        alert("Please detail what corrections are required in your revision notes.");
        return;
      }
      mockDb.updateProposalStatus(proposal.id, 'REVISION_REQUESTED', undefined, revisionNotes);
      alert("Revision request submitted. Student notified.");
    } else if (actionType === 'REJECT') {
      mockDb.updateProposalStatus(proposal.id, 'REJECTED', feedback || "Solution does not match our current parameters.");
      alert("Proposal rejected.");
    }

    // Refresh state
    const updated = mockDb.getProposalById(proposal.id);
    if (updated) setProposal(updated);
    setActionType('NONE');
    setFeedback('');
    setRevisionNotes('');
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
  const isUnderReview = proposal.status === 'UNDER_REVIEW';

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-border pb-6 flex items-center justify-between gap-4">
        <div className="space-y-2">
          <Link 
            href={`/dashboard/industry/challenges/${challenge.id}/proposals`} 
            className="inline-flex items-center gap-1.5 text-text-secondary hover:text-primary font-bold text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Proposals Received</span>
          </Link>
          
          <h1 className="text-2xl font-bold text-text-primary display-font">
            Review Solution Proposal #{proposal.id.slice(-6).toUpperCase()}
          </h1>
          <p className="text-xs text-text-secondary">
            Challenge: <strong className="text-text-primary">{challenge.title}</strong>
          </p>
        </div>

        <div className="bg-success-soft border border-success/20 px-4 py-2 rounded-xl text-success text-3xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Student PII Masked</span>
        </div>
      </div>

      {/* Overview stats cards */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex flex-wrap gap-x-8 gap-y-4 text-xs">
        <div>
          <span className="text-text-secondary block">Candidate Institution</span>
          <strong className="text-text-primary font-bold">{proposal.studentInstitution}</strong>
        </div>
        <div className="border-l border-border pl-8">
          <span className="text-text-secondary block">Submission Status</span>
          <span className={`font-bold px-2.5 py-0.5 rounded-full inline-block mt-1 ${
            isApproved ? 'bg-success-soft text-success' :
            isRevisionNeeded ? 'bg-warning-soft text-warning border border-warning/20' :
            isRejected ? 'bg-error-soft text-error' :
            'bg-primary-soft text-primary'
          }`}>
            {proposal.status.replace('_', ' ')}
          </span>
        </div>
        <div className="border-l border-border pl-8">
          <span className="text-text-secondary block">Submitted Date</span>
          <strong className="text-text-primary font-bold">{new Date(proposal.submittedAt).toLocaleDateString()}</strong>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border gap-4">
        {[
          { key: 'PROPOSAL', label: 'Solution Evaluation', icon: FileText },
          { key: 'MESSAGES', label: `Secure Chat Thread (${messages.filter(m => !m.isSystemMsg).length})`, icon: MessageSquare }
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
            <tab.icon className="w-4.5 h-4.5 shrink-0" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTAINER */}
      <div className="space-y-6">
        
        {/* EVALUATION TAB */}
        {activeTab === 'PROPOSAL' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left columns: files and abstract */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Abstract */}
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-3">
                <span className="text-4xs font-bold text-primary uppercase tracking-wider block">Solution Abstract summary</span>
                <p className="text-xs text-text-secondary leading-relaxed bg-off-white p-4 rounded-xl border border-border italic">
                  &ldquo;{proposal.summary}&rdquo;
                </p>
              </div>

              {/* Document download */}
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-text-primary border-b border-border pb-3 display-font">Approach Document</h3>
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
                    onClick={() => alert("Downloading approach file...")}
                    className="w-9 h-9 rounded-full bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-colors shadow-sm card-bounce"
                  >
                    <Download className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right column: Action form (Approve, Revision, Reject) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-text-primary border-b border-border pb-3 display-font">Evaluation Actions</h3>

                {actionType === 'NONE' ? (
                  <div className="space-y-3 pt-2">
                    <button 
                      disabled={isApproved || isRejected}
                      onClick={() => setActionType('APPROVE')}
                      className="w-full py-2.5 bg-success hover:bg-success/90 disabled:bg-text-muted text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Solution</span>
                    </button>
                    
                    <button 
                      disabled={isApproved || isRejected || isRevisionNeeded}
                      onClick={() => setActionType('REVISION')}
                      className="w-full py-2.5 bg-warning hover:bg-warning/90 disabled:bg-text-muted text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Request Revision Notes</span>
                    </button>

                    <button 
                      disabled={isApproved || isRejected}
                      onClick={() => setActionType('REJECT')}
                      className="w-full py-2.5 bg-white hover:bg-error-soft text-text-secondary hover:text-error border border-border hover:border-error/20 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Solution</span>
                    </button>
                  </div>
                ) : (
                  /* Action Forms */
                  <form onSubmit={handleStatusSubmit} className="space-y-4">
                    
                    {actionType === 'APPROVE' && (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-success uppercase">Provide Approval Feedback *</span>
                        <p className="text-4xs text-text-secondary leading-relaxed">Describe what was excellent about this solution. The student and their institution SPOC will see this.</p>
                        <textarea 
                          rows={3}
                          required
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Excellent software architecture. The mobile offline compression matches all criteria..."
                          className="px-3.5 py-2.5 rounded-xl border border-border text-xs focus:outline-none focus:border-success bg-off-white"
                        />
                      </div>
                    )}

                    {actionType === 'REVISION' && (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-warning uppercase font-bold">Provide Revision Notes *</span>
                        <p className="text-4xs text-text-secondary leading-relaxed">Specify exactly what blocks need detail or correction in the approach document (e.g. section 3 database details).</p>
                        <textarea 
                          rows={3}
                          required
                          value={revisionNotes}
                          onChange={(e) => setRevisionNotes(e.target.value)}
                          placeholder="Please elaborate on the database storage design in section 3. How do you handle schema caching?"
                          className="px-3.5 py-2.5 rounded-xl border border-border text-xs focus:outline-none focus:border-warning bg-off-white"
                        />
                      </div>
                    )}

                    {actionType === 'REJECT' && (
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-bold text-error uppercase">Provide Rejection Reason</span>
                        <textarea 
                          rows={3}
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Solution does not match our current parameters."
                          className="px-3.5 py-2.5 rounded-xl border border-border text-xs focus:outline-none focus:border-error bg-off-white"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <button 
                        type="button"
                        onClick={() => setActionType('NONE')}
                        className="px-4 py-2 bg-white hover:bg-off-white border border-border text-text-secondary text-xs font-bold rounded-lg transition-colors flex-1"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className={`px-4 py-2 text-white text-xs font-bold rounded-lg transition-colors flex-grow shadow-md ${
                          actionType === 'APPROVE' ? 'bg-success hover:bg-success/90' :
                          actionType === 'REVISION' ? 'bg-warning hover:bg-warning/90' :
                          'bg-error hover:bg-error/90'
                        }`}
                      >
                        Confirm
                      </button>
                    </div>

                  </form>
                )}

              </div>

              {/* Secure Notice */}
              <div className="p-4 bg-primary-soft/30 border border-primary/20 rounded-2xl text-4xs text-text-secondary leading-relaxed space-y-1">
                <p><strong>Note on Masking:</strong> Student personal data (PII) is strictly hidden to enforce compliance rules. You cannot ask for contact details in chat threads. Violations are audited.</p>
              </div>

            </div>

          </div>
        )}

        {/* SECURE CHAT TAB */}
        {activeTab === 'MESSAGES' && (
          <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-[500px]">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-off-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-text-primary leading-tight">Anonymized Candidate Thread</h3>
                  <p className="text-4xs text-text-muted mt-0.5">Secure inquiry and response log</p>
                </div>
              </div>
              
              <span className="text-4xs text-text-secondary font-bold uppercase tracking-wider">
                Candidate Institution: {proposal.studentInstitution}
              </span>
            </div>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-off-white/30">
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
                      {isMe ? 'You (Sponsor)' : `Student (Anonymized)`} · {new Date(m.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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

            {/* Send Box */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-white flex items-center gap-3">
              <div className="flex-1 relative flex items-center gap-2">
                <input 
                  type="text"
                  placeholder="Ask the candidate to clarify their approach blueprint..."
                  value={msgBody}
                  onChange={(e) => setMsgBody(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-xs bg-off-white focus:bg-white transition-all"
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

      </div>

    </div>
  );
}
