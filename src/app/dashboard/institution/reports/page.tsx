'use client';

import React, { useEffect, useState } from 'react';
import { mockDb, User, Proposal, SEED_CELLS, CellTheme } from '@/lib/mockDb';
import { Activity, Sparkles, Building2, BarChart3, TrendingUp, CheckCircle } from 'lucide-react';

export default function InstitutionReports() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [cellStats, setCellStats] = useState<Record<CellTheme, number>>({
    FAMILY_BUSINESS: 0,
    TALENT_READINESS: 0,
    RESEARCH_INNOVATION: 0,
    AI_IN_BUSINESS: 0,
    AGRITECH: 0,
    SKILL_DEVELOPMENT: 0,
    STARTUP: 0
  });

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    const instId = user.institutionProfile?.institutionId || 'inst-10'; // LNCT default
    
    // Get students
    const allUsers = mockDb.getUsers();
    const instStudents = allUsers.filter(u => u.role === 'STUDENT' && u.studentProfile?.institutionId === instId);
    setStudentsCount(instStudents.length);

    // Get proposals
    const instStudentIds = instStudents.map(s => s.id);
    const allProps = mockDb.getProposals();
    const instProps = allProps.filter(p => instStudentIds.includes(p.studentProfileId));
    setProposals(instProps);

    // Calculate domain stats
    const stats: Record<CellTheme, number> = {
      FAMILY_BUSINESS: 0,
      TALENT_READINESS: 0,
      RESEARCH_INNOVATION: 0,
      AI_IN_BUSINESS: 0,
      AGRITECH: 0,
      SKILL_DEVELOPMENT: 0,
      STARTUP: 0
    };

    instProps.forEach(prop => {
      const chal = mockDb.getChallengeById(prop.challengeId);
      if (chal) {
        stats[chal.domain] = (stats[chal.domain] || 0) + 1;
      }
    });

    setCellStats(stats);
  }, []);

  const totalProps = proposals.length;
  const approvedCount = proposals.filter(p => p.status === 'APPROVED').length;

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-text-primary display-font flex items-center gap-2">
          <Activity className="w-7 h-7 text-primary" />
          <span>Cell Thematic Progress Reports</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">Review student research and innovation ratios across the 7 Excellence Cell domains.</p>
      </div>

      {/* Stats Summary Card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm text-center space-y-2">
          <TrendingUp className="w-8 h-8 text-primary mx-auto" />
          <h4 className="text-xs font-bold text-text-secondary uppercase">Conversion Rate</h4>
          <span className="text-2xl font-bold text-text-primary display-font">
            {totalProps > 0 ? `${Math.round((approvedCount / totalProps) * 100)}%` : '0%'}
          </span>
          <p className="text-4xs text-text-muted">Proposals submitted vs approvals</p>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm text-center space-y-2">
          <BarChart3 className="w-8 h-8 text-cta mx-auto" />
          <h4 className="text-xs font-bold text-text-secondary uppercase">Engagement Index</h4>
          <span className="text-2xl font-bold text-text-primary display-font">
            {studentsCount > 0 ? `${(totalProps / studentsCount).toFixed(1)}` : '0.0'}
          </span>
          <p className="text-4xs text-text-muted">Proposals submitted per active student</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm text-center space-y-2">
          <CheckCircle className="w-8 h-8 text-success mx-auto" />
          <h4 className="text-xs font-bold text-text-secondary uppercase">Total Cell Approvals</h4>
          <span className="text-2xl font-bold text-text-primary display-font">{approvedCount}</span>
          <p className="text-4xs text-text-muted">Approved technical approach documents</p>
        </div>
      </div>

      {/* Thematic Bar Chart */}
      <div className="bg-white p-8 rounded-2xl border border-border shadow-sm space-y-6">
        <h3 className="font-bold text-sm text-text-primary display-font flex items-center gap-1.5 border-b border-border pb-4">
          <Sparkles className="w-5 h-5 text-primary" />
          Thematic Ratios (Active Submissions by Cell Domain)
        </h3>

        <div className="space-y-5">
          {Object.entries(SEED_CELLS).map(([key, cell]) => {
            const count = cellStats[key as CellTheme] || 0;
            const percentage = totalProps > 0 ? (count / totalProps) * 100 : 0;
            
            return (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-text-primary">{cell.name}</span>
                  <span className="text-text-secondary font-bold">{count} Submissions ({Math.round(percentage)}%)</span>
                </div>
                
                {/* Custom Progress Bar */}
                <div className="h-3 w-full bg-off-white rounded-full overflow-hidden border border-border">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${Math.max(percentage, totalProps > 0 ? 3 : 0)}%`,
                      backgroundColor: cell.primaryColor 
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {totalProps === 0 && (
          <p className="text-xs text-text-muted text-center pt-4">No submissions exist currently to generate ratio charts.</p>
        )}
      </div>

    </div>
  );
}
