'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockDb, Institution, SEED_CELLS } from '@/lib/mockDb';
import { Building2, Search, MapPin, Tag, ArrowUpRight, GraduationCap } from 'lucide-react';

export default function Institutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredList, setFilteredList] = useState<Institution[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedTheme, setSelectedTheme] = useState('All');

  useEffect(() => {
    const list = mockDb.getInstitutions();
    setInstitutions(list);
    setFilteredList(list);
  }, []);

  useEffect(() => {
    let result = institutions;

    // Filter by search query
    if (searchTerm.trim() !== '') {
      result = result.filter(inst => 
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inst.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by city
    if (selectedCity !== 'All') {
      result = result.filter(inst => inst.city === selectedCity);
    }

    // Filter by Cell Theme
    if (selectedTheme !== 'All') {
      result = result.filter(inst => inst.cellTheme === selectedTheme);
    }

    setFilteredList(result);
  }, [searchTerm, selectedCity, selectedTheme, institutions]);

  // Extract cities
  const cities = ['All', ...Array.from(new Set(institutions.map(inst => inst.city)))];
  
  // Extract themes
  const themes = ['All', ...Object.keys(SEED_CELLS)];

  return (
    <div className="bg-off-white min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary via-primary/95 to-sky-deep rounded-3xl p-8 md:p-12 text-white mb-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-3xs uppercase font-bold tracking-widest bg-white/20 text-white px-3 py-1 rounded-full inline-block">
              State Networking Directory
            </span>
            <h1 className="text-4xl md:text-5xl font-bold display-font">Participating Institutions</h1>
            <p className="text-sm md:text-md text-white/80 leading-relaxed">
              Explore the 37+ universities and engineering colleges in Madhya Pradesh participating in the CII Excellence Cells program to deliver student solutions.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search box */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
            <input 
              type="text"
              placeholder="Search institutions by name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-sm bg-off-white focus:bg-white transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 w-full md:w-auto items-center justify-end">
            
            {/* City Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-2xs font-bold text-text-secondary uppercase">City:</span>
              <select 
                value={selectedCity} 
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-2 bg-off-white border border-border rounded-xl text-xs font-semibold text-text-primary focus:outline-none"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Cell Theme Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-2xs font-bold text-text-secondary uppercase">Hosted Cell:</span>
              <select 
                value={selectedTheme} 
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="px-3 py-2 bg-off-white border border-border rounded-xl text-xs font-semibold text-text-primary focus:outline-none"
              >
                <option value="All">All Themes</option>
                {Object.entries(SEED_CELLS).map(([key, cell]) => (
                  <option key={key} value={key}>{cell.name.split(' ')[0]}...</option>
                ))}
              </select>
            </div>

          </div>

        </div>

        {/* Count Label */}
        <div className="mb-6 flex justify-between items-center px-2">
          <span className="text-xs font-semibold text-text-secondary uppercase">
            Showing <strong className="text-primary">{filteredList.length}</strong> of {institutions.length} Institutions
          </span>
        </div>

        {/* Grid List */}
        {filteredList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-16 text-center space-y-3">
            <Building2 className="w-12 h-12 text-text-muted mx-auto" />
            <h3 className="font-bold text-lg text-text-primary">No Institutions Found</h3>
            <p className="text-xs text-text-secondary">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((inst) => {
              const hostedCell = inst.cellTheme ? SEED_CELLS[inst.cellTheme] : null;
              
              return (
                <div 
                  key={inst.id}
                  className="bg-white rounded-2xl border border-border shadow-xs card-bounce p-6 flex flex-col justify-between h-56"
                >
                  <div className="space-y-4">
                    {/* Top Row: Icon & Location */}
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                        <GraduationCap className="w-5.5 h-5.5" />
                      </div>
                      <span className="inline-flex items-center gap-1 text-3xs text-text-muted font-bold uppercase tracking-wider">
                        <MapPin className="w-3 h-3 text-cta" />
                        {inst.city}, MP
                      </span>
                    </div>

                    {/* Name */}
                    <h3 className="font-bold text-sm text-text-primary leading-snug line-clamp-2">
                      {inst.name}
                    </h3>
                  </div>

                  {/* Footer cell details */}
                  <div className="border-t border-border pt-4 flex items-center justify-between">
                    {hostedCell ? (
                      <span 
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-3xs font-bold text-white shadow-xs"
                        style={{ backgroundColor: hostedCell.primaryColor }}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        Host: {hostedCell.name.split(' ')[0]} Cell
                      </span>
                    ) : (
                      <span className="text-4xs text-text-muted uppercase tracking-widest font-semibold">
                        Participating Member
                      </span>
                    )}

                    <Link 
                      href="/challenges"
                      className="w-8 h-8 rounded-lg bg-off-white hover:bg-primary-soft hover:text-primary flex items-center justify-center text-text-secondary transition-colors"
                      title="View Challenges"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
