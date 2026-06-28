'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockDb, User, Proposal } from '@/lib/mockDb';
import { FileText, Search, Clock, CheckCircle, ArrowUpRight, Award } from 'lucide-react';

export default function InstitutionProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredList, setFilteredList] = useState<Proposal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    const instId = user.institutionProfile?.institutionId || 'inst-10'; // LNCT default
    
    // Get all students for this institution
    const allUsers = mockDb.getUsers();
    const instStudents = allUsers.filter(u => u.role === 'STUDENT' && u.studentProfile?.institutionId === instId);
    
    // Get proposals
    const instStudentIds = instStudents.map(s => s.id);
    const allProps = mockDb.getProposals();
    const instProps = allProps.filter(p => instStudentIds.includes(p.studentProfileId));
    
    setProposals(instProps);
    setFilteredList(instProps);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredList(proposals);
    } else {
      setFilteredList(
        proposals.filter(p => 
          p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.approachDoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.summary.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, proposals]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-text-primary display-font flex items-center gap-2">
          <FileText className="w-7 h-7 text-primary" />
          <span>All Student Submissions</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">Audit approach documentation and track evaluation lifecycles for your students.</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
        <input 
          type="text"
          placeholder="Search proposals by student name, filename..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-xs bg-white transition-all shadow-xs"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            
            <thead className="bg-off-white text-text-secondary font-bold border-b border-border text-4xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Challenge</th>
                <th className="p-4">Solution Document</th>
                <th className="p-4">Submitted Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    No solutions submitted by your students yet.
                  </td>
                </tr>
              ) : (
                filteredList.map((prop) => {
                  const challenge = mockDb.getChallengeById(prop.challengeId);
                  const isApproved = prop.status === 'APPROVED';
                  
                  return (
                    <tr key={prop.id} className="hover:bg-sky-light/10 transition-colors">
                      <td className="p-4 font-semibold text-text-primary">
                        {prop.studentName}
                      </td>
                      <td className="p-4 text-text-secondary font-medium max-w-xs truncate" title={challenge?.title}>
                        {challenge ? challenge.title : 'Untitled Challenge'}
                      </td>
                      <td className="p-4 font-mono text-text-muted">
                        {prop.approachDoc}
                      </td>
                      <td className="p-4 text-text-secondary">
                        {new Date(prop.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-5xs font-bold border ${
                          isApproved ? 'bg-success-soft text-success border-success/15' :
                          prop.status === 'REVISION_REQUESTED' ? 'bg-warning-soft text-warning border-warning/15' :
                          prop.status === 'REJECTED' ? 'bg-error-soft text-error border-error/15' :
                          'bg-primary-soft text-primary border-primary/10'
                        }`}>
                          {prop.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Link 
                          href={`/dashboard/student/proposals/${prop.id}`}
                          className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border bg-white text-text-secondary hover:text-primary hover:bg-primary-soft transition-colors"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
