'use client';

import React, { useEffect, useState } from 'react';
import { mockDb, AuditLog } from '@/lib/mockDb';
import { Shield, Search, Calendar, RefreshCw, Lock } from 'lucide-react';

export default function AdminAuditTrail() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const list = mockDb.getAuditLogs();
    setLogs(list);
    setFilteredLogs(list);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let result = logs;

    if (searchTerm.trim() !== '') {
      result = result.filter(l => 
        l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.entityType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== 'ALL') {
      result = result.filter(l => l.userRole === selectedRole);
    }

    setFilteredLogs(result);
  }, [searchTerm, selectedRole, logs]);

  const handleRefresh = () => {
    setLogs(mockDb.getAuditLogs());
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
            <Shield className="w-7 h-7 text-primary" />
            <span>Immutable System Audit Trail</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            All database writes, proposal lifecycle transitions, and chat messages are permanently logged. This history is append-only.
          </p>
        </div>
        
        <div className="bg-cta-soft text-cta px-4 py-2.5 rounded-xl text-3xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm border border-cta/10 shrink-0">
          <Lock className="w-4 h-4" />
          <span>Write Rule: Append-Only Enforced</span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-text-muted" />
          <input 
            type="text"
            placeholder="Search audit actions, user names, or entities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border focus:border-primary focus:outline-none text-xs bg-off-white focus:bg-white transition-all"
          />
        </div>

        <div className="flex gap-4 w-full sm:w-auto items-center justify-end shrink-0">
          
          <div className="flex items-center gap-1.5">
            <span className="text-4xs font-bold text-text-secondary uppercase">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-1.5 bg-off-white border border-border rounded-xl text-xs font-semibold text-text-primary focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Student</option>
              <option value="INDUSTRY_SPOC">Industry SPOC</option>
              <option value="INSTITUTION_SPOC">Institution SPOC</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2 border border-border bg-off-white hover:bg-white text-text-secondary hover:text-primary rounded-xl transition-all"
            title="Refresh Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            
            <thead className="bg-off-white text-text-secondary font-bold border-b border-border text-4xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Operator</th>
                <th className="p-4">Role</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Entity Type</th>
                <th className="p-4">Target Entity ID</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    No auditable logs recorded matching filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-off-white transition-colors">
                    <td className="p-4 font-medium text-text-muted">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="p-4 font-semibold text-text-primary">
                      {log.userName}
                    </td>
                    <td className="p-4">
                      <span className="bg-off-white px-2 py-0.5 border border-border rounded-md text-5xs font-bold text-text-secondary">
                        {log.userRole.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-text-primary">
                      {log.action}
                    </td>
                    <td className="p-4 text-text-secondary">
                      {log.entityType}
                    </td>
                    <td className="p-4 font-mono font-semibold text-text-muted">
                      {log.entityId}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
