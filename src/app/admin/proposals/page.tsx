'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockDb, Proposal } from '@/lib/mockDb';
import { FileText, Search, ArrowUpRight, CheckCircle } from 'lucide-react';

export default function AdminProposals() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredList, setFilteredList] = useState<Proposal[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const list = mockDb.getProposals();
    setProposals(list);
    setFilteredList(list);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredList(proposals);
    } else {
      setFilteredList(
        proposals.filter(p => 
          p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.studentInstitution.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.approachDoc.toLowerCase().includes(searchTerm.toLowerCase())
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
          <span>Proposals Lifecycle Management</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">Review all submissions, solution documents, and partner decisions globally.</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
        <input 
          type="text"
          placeholder="Search proposals by student, college, file..."
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
                <th className="p-4">Student operator</th>
                <th className="p-4">College Institution</th>
                <th className="p-4">Solution Document</th>
                <th className="p-4">Submitted Timestamp</th>
                <th className="p-4 text-center">Lifecycle Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    No solutions submitted on the platform yet.
                  </td>
                </tr>
              ) : (
                filteredList.map((p) => {
                  const isApproved = p.status === 'APPROVED';
                  return (
                    <tr key={p.id} className="hover:bg-off-white transition-colors">
                      <td className="p-4 font-semibold text-text-primary">
                        {p.studentName}
                      </td>
                      <td className="p-4 text-text-secondary">
                        {p.studentInstitution}
                      </td>
                      <td className="p-4 font-mono text-text-muted">
                        {p.approachDoc}
                      </td>
                      <td className="p-4 text-text-secondary">
                        {new Date(p.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-5xs font-bold border ${
                          isApproved ? 'bg-success-soft text-success border-success/15' :
                          p.status === 'REVISION_REQUESTED' ? 'bg-warning-soft text-warning border-warning/15' :
                          p.status === 'REJECTED' ? 'bg-error-soft text-error border-error/15' :
                          'bg-primary-soft text-primary border-primary/10'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Link 
                          href={`/dashboard/student/proposals/${p.id}`}
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
