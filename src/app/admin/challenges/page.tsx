'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockDb, Challenge, SEED_CELLS } from '@/lib/mockDb';
import { Folder, Search, Calendar, Briefcase, Eye } from 'lucide-react';

export default function AdminChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredList, setFilteredList] = useState<Challenge[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const list = mockDb.getChallenges();
    setChallenges(list);
    setFilteredList(list);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredList(challenges);
    } else {
      setFilteredList(
        challenges.filter(c => 
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.industryProfileId.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, challenges]);

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
          <Folder className="w-7 h-7 text-primary" />
          <span>All Posted Challenges</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">Global directory of all active and closed corporate problem statements.</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
        <input 
          type="text"
          placeholder="Search challenges by title or company..."
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
                <th className="p-4">Challenge Title</th>
                <th className="p-4">Excellence Cell</th>
                <th className="p-4">Sponsoring Partner</th>
                <th className="p-4">Deadline</th>
                <th className="p-4">Budget Range</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredList.map((c) => {
                const cell = SEED_CELLS[c.domain];
                return (
                  <tr key={c.id} className="hover:bg-off-white transition-colors">
                    <td className="p-4 font-semibold text-text-primary">
                      {c.title}
                    </td>
                    <td className="p-4">
                      <span 
                        className="px-2 py-0.5 rounded-full text-5xs font-bold text-white shadow-3xs"
                        style={{ backgroundColor: cell.primaryColor }}
                      >
                        {cell.name.split(' ')[0]} Cell
                      </span>
                    </td>
                    <td className="p-4 text-text-secondary font-semibold">
                      {c.industryProfileId}
                    </td>
                    <td className="p-4 text-text-muted">
                      {new Date(c.deadline).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-success font-bold">
                      {c.budgetRange}
                    </td>
                    <td className="p-4 text-center">
                      <Link 
                        href={`/challenges/${c.id}`}
                        className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border bg-white text-text-secondary hover:text-primary hover:bg-primary-soft transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
