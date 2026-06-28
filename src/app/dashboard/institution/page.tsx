'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockDb, User, Proposal, Institution, SEED_CELLS } from '@/lib/mockDb';
import { 
  Building2, Users, FileText, CheckCircle, 
  Sparkles, Award, ArrowRight, Inbox, Clock
} from 'lucide-react';

export default function InstitutionDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [studentsCount, setStudentsCount] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    setCurrentUser(user);

    const instId = user.institutionProfile?.institutionId || 'inst-10'; // Default LNCT
    
    // Load institution details
    const inst = mockDb.getInstitutions().find(i => i.id === instId);
    if (inst) setInstitution(inst);

    // Get all students for this institution
    const allUsers = mockDb.getUsers();
    const instStudents = allUsers.filter(u => u.role === 'STUDENT' && u.studentProfile?.institutionId === instId);
    setStudentsCount(instStudents.length);

    // Get all proposals submitted by these students
    const instStudentIds = instStudents.map(s => s.id);
    const allProps = mockDb.getProposals();
    const instProps = allProps.filter(p => instStudentIds.includes(p.studentProfileId));
    setProposals(instProps);

    setIsLoading(false);
  }, []);

  if (isLoading || !currentUser || !institution) {
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
      
      {/* Greeting Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-text-primary display-font">
          Welcome back, {currentUser.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-xs text-text-secondary flex items-center gap-1.5 mt-1">
          <Building2 className="w-4 h-4 text-primary" />
          Coordinator Panel: <strong className="text-text-primary">{institution.name}</strong> ({institution.city}, MP)
        </p>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{studentsCount}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Registered Students</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cta-soft text-cta flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{proposals.length}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Student Submissions</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-warning-soft text-warning flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{activeCount}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Active Evaluations</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-success-soft text-success flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-text-primary display-font leading-none">{approvedCount}</span>
            <h4 className="text-4xs text-text-muted font-bold uppercase tracking-wider mt-1">Total Approvals</h4>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Recent proposals by their students */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h3 className="font-bold text-md text-text-primary display-font">Recent Student Submissions</h3>
            <Link href="/dashboard/institution/proposals" className="text-xs text-primary hover:underline font-bold">
              All Student Proposals
            </Link>
          </div>

          {proposals.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-border text-center space-y-4 shadow-sm">
              <Inbox className="w-10 h-10 text-text-muted mx-auto" />
              <h4 className="font-bold text-sm text-text-primary">No submissions made by your students yet</h4>
              <p className="text-xs text-text-secondary mt-1">Invite students to register and apply to active excellence cell prompts.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.slice(0, 3).map((prop) => {
                const chal = mockDb.getChallengeById(prop.challengeId);
                const isApproved = prop.status === 'APPROVED';
                
                return (
                  <div key={prop.id} className="bg-white p-5 rounded-xl border border-border shadow-xs hover:border-primary/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-4xs font-bold px-2 py-0.5 rounded-full ${
                          isApproved ? 'bg-success-soft text-success' : 'bg-primary-soft text-primary'
                        }`}>
                          {prop.status}
                        </span>
                        <span className="text-4xs text-text-muted">Student Name (PII visible to SPOC): <strong>{prop.studentName}</strong></span>
                      </div>
                      <h4 className="font-bold text-xs text-text-primary leading-tight block truncate max-w-sm">
                        {chal ? chal.title : 'Solution document'}
                      </h4>
                      <p className="text-4xs text-text-muted">File: {prop.approachDoc} · Submitted {new Date(prop.submittedAt).toLocaleDateString()}</p>
                    </div>

                    <Link 
                      href={`/dashboard/student/proposals/${prop.id}`} // redirect to view details (read-only for SPOC)
                      className="px-4 py-2 bg-off-white hover:bg-primary hover:text-white border border-border hover:border-primary text-4xs font-bold rounded-lg transition-colors shrink-0"
                    >
                      Audit Submission →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Hosted Cell Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-b border-border pb-3">
            <h3 className="font-bold text-md text-text-primary display-font">Hosted Cell Hub</h3>
          </div>

          {institution.cellTheme ? (
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-text-primary">
                  {SEED_CELLS[institution.cellTheme].name.split(' ')[0]} Cell Host
                </h4>
                <p className="text-4xs text-text-secondary leading-relaxed italic">
                  &ldquo;{SEED_CELLS[institution.cellTheme].tagline}&rdquo;
                </p>
              </div>
              
              <Link 
                href={`/cells/${institution.cellTheme.toLowerCase()}`}
                className="w-full py-2 bg-cta hover:bg-cta-dark text-white text-xs font-bold rounded-xl transition-colors block"
              >
                Open Excellence Cell Page
              </Link>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-border shadow-sm text-center py-8">
              <Award className="w-10 h-10 text-text-muted mx-auto mb-2" />
              <h4 className="font-bold text-xs text-text-primary">Participating Institution</h4>
              <p className="text-4xs text-text-secondary mt-1">Your college participates in all cells but does not host a theme cell.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
