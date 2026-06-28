'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockDb, Challenge, CellTheme, SEED_CELLS } from '@/lib/mockDb';
import { Search, Calendar, MapPin, Tag, ArrowRight, Filter, Briefcase, RefreshCw } from 'lucide-react';

export default function Challenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [filteredList, setFilteredList] = useState<Challenge[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Cell theme filter checkboxes
  const [selectedThemes, setSelectedThemes] = useState<Record<CellTheme, boolean>>({
    FAMILY_BUSINESS: false,
    TALENT_READINESS: false,
    RESEARCH_INNOVATION: false,
    AI_IN_BUSINESS: false,
    AGRITECH: false,
    SKILL_DEVELOPMENT: false,
    STARTUP: false
  });

  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  useEffect(() => {
    // Increment view counts or load challenges
    const list = mockDb.getChallenges();
    setChallenges(list);
    setFilteredList(list);
  }, []);

  useEffect(() => {
    let result = challenges;

    // Filter by search query
    if (searchTerm.trim() !== '') {
      result = result.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.problemStatement.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by status
    if (selectedStatus !== 'ALL') {
      result = result.filter(c => c.status === selectedStatus);
    }

    // Filter by selected cell themes
    const activeThemes = Object.entries(selectedThemes)
      .filter(([_, checked]) => checked)
      .map(([theme, _]) => theme as CellTheme);

    if (activeThemes.length > 0) {
      result = result.filter(c => activeThemes.includes(c.domain));
    }

    setFilteredList(result);
  }, [searchTerm, selectedThemes, selectedStatus, challenges]);

  const handleCheckboxChange = (theme: CellTheme) => {
    setSelectedThemes(prev => ({
      ...prev,
      [theme]: !prev[theme]
    }));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('ALL');
    setSelectedThemes({
      FAMILY_BUSINESS: false,
      TALENT_READINESS: false,
      RESEARCH_INNOVATION: false,
      AI_IN_BUSINESS: false,
      AGRITECH: false,
      SKILL_DEVELOPMENT: false,
      STARTUP: false
    });
  };

  return (
    <div className="bg-off-white min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Compact Hero Header */}
        <div className="bg-gradient-to-br from-primary/95 to-sky-deep rounded-3xl p-8 text-white mb-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-xl">
            <span className="text-3xs uppercase font-bold tracking-widest bg-white/20 text-white px-3 py-1 rounded-full inline-block">
              Innovation Opportunities
            </span>
            <h1 className="text-3xl md:text-4xl font-bold display-font">Active Challenges</h1>
            <p className="text-xs text-white/80 leading-relaxed">
              Browse and apply to real-world operational and research problem statements posted directly by industries across Madhya Pradesh.
            </p>
          </div>
          {/* Overlay elements */}
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-xl" />
        </div>

        {/* Search Input Box */}
        <div className="relative max-w-2xl mx-auto -mt-16 mb-12 shadow-md rounded-2xl overflow-hidden z-20">
          <Search className="absolute left-5 top-5 w-5 h-5 text-text-muted" />
          <input 
            type="text"
            placeholder="Search challenges by keyword, tag, or skill requirement..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4.5 bg-white border-0 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-medium"
          />
        </div>

        {/* Listing layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Filters */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6 sticky top-24 z-10">
            
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-xs font-bold text-text-primary uppercase flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-primary" />
                Filters
              </span>
              <button 
                onClick={handleClearFilters}
                className="text-4xs text-text-muted hover:text-primary font-bold uppercase transition-colors"
              >
                Clear All
              </button>
            </div>

            {/* Filter by Status */}
            <div className="space-y-2">
              <h4 className="text-2xs font-bold text-text-secondary uppercase">Status</h4>
              <div className="flex flex-col gap-2">
                {['ALL', 'OPEN', 'CLOSED'].map((status) => (
                  <label key={status} className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
                    <input 
                      type="radio" 
                      name="status"
                      checked={selectedStatus === status}
                      onChange={() => setSelectedStatus(status)}
                      className="rounded-full text-primary border-border focus:ring-primary"
                    />
                    <span>{status === 'ALL' ? 'All Challenges' : status}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter by Cell theme */}
            <div className="space-y-3">
              <h4 className="text-2xs font-bold text-text-secondary uppercase">Excellence Cells</h4>
              <div className="flex flex-col gap-2.5">
                {Object.entries(SEED_CELLS).map(([key, cell]) => {
                  const theme = key as CellTheme;
                  return (
                    <label key={key} className="flex items-start gap-2.5 text-xs text-text-secondary cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={selectedThemes[theme]}
                        onChange={() => handleCheckboxChange(theme)}
                        className="rounded border-border focus:ring-primary mt-0.5"
                        style={{ color: cell.primaryColor }}
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-text-primary leading-tight">{cell.name.split(' ')[0]}...</span>
                        <span className="text-4xs text-text-muted leading-tight">{cell.hostName.split(',')[0]}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Challenge Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-semibold text-text-secondary uppercase">
                Showing <strong className="text-primary">{filteredList.length}</strong> of {challenges.length} Challenges
              </span>
            </div>

            {filteredList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border p-16 text-center space-y-4">
                <div className="w-14 h-14 bg-off-white rounded-full flex items-center justify-center mx-auto text-text-muted">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-text-primary">No Challenges Found</h3>
                <p className="text-xs text-text-secondary max-w-xs mx-auto">
                  We couldn't find any challenges matching your keywords or cell filters. Try expanding your search.
                </p>
                <button 
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-cta hover:bg-cta-dark text-white text-xs font-semibold rounded-full shadow-md"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredList.map((chal) => {
                  const cell = SEED_CELLS[chal.domain];
                  const isClosed = chal.status === 'CLOSED';
                  
                  return (
                    <div 
                      key={chal.id}
                      className="bg-white rounded-2xl border border-border shadow-xs card-bounce p-6 flex flex-col justify-between h-[300px]"
                    >
                      <div className="space-y-3">
                        {/* Tags / Status */}
                        <div className="flex items-center justify-between">
                          <span 
                            className="text-4xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white shadow-3xs"
                            style={{ backgroundColor: cell.primaryColor }}
                          >
                            {cell.name.split(' ')[0]} Cell
                          </span>
                          <span className={`inline-flex items-center gap-1 text-4xs font-bold px-2 py-0.5 rounded-full ${
                            isClosed ? 'bg-off-white text-text-muted border border-border' : 'bg-success-soft text-success'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {chal.status}
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/challenges/${chal.id}`}>
                          <h3 className="font-bold text-sm text-text-primary hover:text-primary transition-colors leading-snug line-clamp-2">
                            {chal.title}
                          </h3>
                        </Link>

                        {/* Description Summary */}
                        <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                          {chal.problemStatement}
                        </p>
                      </div>

                      {/* Footer Actions */}
                      <div className="border-t border-border pt-4 flex flex-col gap-3">
                        {/* Skills Required Tags */}
                        <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6">
                          {chal.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="bg-off-white px-2 py-0.5 border border-border rounded-lg text-4xs text-text-secondary font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-4xs text-text-muted font-bold uppercase tracking-wider flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-cta shrink-0" />
                            {chal.industryProfileId}
                          </span>
                          <Link 
                            href={`/challenges/${chal.id}`}
                            className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 group"
                          >
                            <span>Details</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
