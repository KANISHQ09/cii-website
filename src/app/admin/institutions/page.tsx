'use client';

import React, { useEffect, useState } from 'react';
import { mockDb, Institution, CellTheme, SEED_CELLS } from '@/lib/mockDb';
import { Building2, Search, Plus, MapPin, Tag, Check } from 'lucide-react';

export default function AdminInstitutions() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredList, setFilteredList] = useState<Institution[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [cellTheme, setCellTheme] = useState<CellTheme | ''>('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    setInstitutions(mockDb.getInstitutions());
    setFilteredList(mockDb.getInstitutions());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredList(institutions);
    } else {
      setFilteredList(
        institutions.filter(inst => 
          inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          inst.city.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, institutions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !city) return;

    const newInst = mockDb.addInstitution(name, city, cellTheme || undefined);
    
    // Log audit
    const admin = mockDb.getCurrentUser();
    mockDb.addAuditLog(admin.id, `Created new institution: ${name}`, 'Institution', newInst.id);

    // Refresh state
    const list = mockDb.getInstitutions();
    setInstitutions(list);
    
    setName('');
    setCity('');
    setCellTheme('');
    setIsFormOpen(false);
    alert(`Institution "${name}" added successfully!`);
  };

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
      <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary display-font flex items-center gap-2">
            <Building2 className="w-7 h-7 text-primary" />
            <span>Institution Management</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">Review the roster of participating colleges and universities or onboard a new institution.</p>
        </div>
        
        <button 
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-5 py-2.5 bg-cta hover:bg-cta-dark text-white text-xs font-bold rounded-full shadow-md flex items-center gap-1.5 transition-all card-bounce"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Institution</span>
        </button>
      </div>

      {/* Add Form Panel */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-border shadow-md space-y-4 max-w-xl animate-in slide-in-from-top duration-250">
          <h3 className="font-bold text-sm text-text-primary display-font">Onboard New College</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase">College Name *</label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sagar Institute of Technology"
                className="px-3.5 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-primary bg-off-white"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase">City *</label>
              <input 
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Bhopal"
                className="px-3.5 py-2 rounded-xl border border-border text-xs focus:outline-none focus:border-primary bg-off-white"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-text-primary uppercase">Assign Excellence Cell Theme (Optional)</label>
            <select
              value={cellTheme}
              onChange={(e) => setCellTheme(e.target.value as CellTheme | '')}
              className="px-3.5 py-2 rounded-xl border border-border text-xs focus:outline-none bg-off-white"
            >
              <option value="">No Cell Hosted (Participating Member only)</option>
              {Object.entries(SEED_CELLS).map(([key, cell]) => (
                <option key={key} value={key}>{cell.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button 
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 border border-border text-text-secondary text-xs font-semibold rounded-xl hover:bg-off-white"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Submit Onboarding
            </button>
          </div>
        </form>
      )}

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
        <input 
          type="text"
          placeholder="Search colleges by name or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-xs bg-white transition-all shadow-xs"
        />
      </div>

      {/* List Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            
            <thead className="bg-off-white text-text-secondary font-bold border-b border-border text-4xs uppercase tracking-wider">
              <tr>
                <th className="p-4">College Name</th>
                <th className="p-4">Location</th>
                <th className="p-4">Hosted Excellence Cell</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-text-secondary">
                    No colleges found.
                  </td>
                </tr>
              ) : (
                filteredList.map((inst) => {
                  const cell = inst.cellTheme ? SEED_CELLS[inst.cellTheme] : null;
                  
                  return (
                    <tr key={inst.id} className="hover:bg-off-white transition-colors">
                      <td className="p-4 font-semibold text-text-primary">
                        {inst.name}
                      </td>
                      <td className="p-4 text-text-secondary">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-cta shrink-0" />
                          {inst.city}, MP
                        </span>
                      </td>
                      <td className="p-4">
                        {cell ? (
                          <span 
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-5xs font-bold text-white shadow-3xs"
                            style={{ backgroundColor: cell.primaryColor }}
                          >
                            <Tag className="w-2.5 h-2.5" />
                            {cell.name.split(' ')[0]} Cell
                          </span>
                        ) : (
                          <span className="text-4xs text-text-muted uppercase font-semibold">
                            Participating Member
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 bg-success-soft text-success px-2 py-0.5 rounded-full text-5xs font-bold border border-success/15">
                          <Check className="w-2.5 h-2.5" />
                          VERIFIED
                        </span>
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
