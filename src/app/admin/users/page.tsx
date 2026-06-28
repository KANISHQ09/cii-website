'use client';

import React, { useEffect, useState } from 'react';
import { mockDb, User, Role } from '@/lib/mockDb';
import { Users, Search, ToggleLeft, ToggleRight, CheckCircle, ShieldAlert } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredList, setFilteredList] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUsers(mockDb.getUsers());
    setFilteredList(mockDb.getUsers());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let result = users;

    if (searchTerm.trim() !== '') {
      result = result.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedRole !== 'ALL') {
      result = result.filter(u => u.role === selectedRole);
    }

    setFilteredList(result);
  }, [searchTerm, selectedRole, users]);

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    const list = [...users];
    const idx = list.findIndex(u => u.id === id);
    if (idx !== -1) {
      list[idx].isActive = !currentStatus;
      setUsers(list);
      
      // Update in localStorage
      localStorage.setItem('ciisic_users', JSON.stringify(list));
      
      // Log audit log
      const admin = mockDb.getCurrentUser();
      mockDb.addAuditLog(
        admin.id, 
        `Toggled user ${list[idx].name} status to ${!currentStatus ? 'ACTIVE' : 'INACTIVE'}`, 
        'User', 
        id
      );
    }
  };

  const handleChangeRole = (id: string, newRole: Role) => {
    const list = [...users];
    const idx = list.findIndex(u => u.id === id);
    if (idx !== -1) {
      const oldRole = list[idx].role;
      list[idx].role = newRole;
      setUsers(list);

      // Update in localStorage
      localStorage.setItem('ciisic_users', JSON.stringify(list));

      // Log audit log
      const admin = mockDb.getCurrentUser();
      mockDb.addAuditLog(
        admin.id,
        `Changed user ${list[idx].name} role from ${oldRole} to ${newRole}`,
        'User',
        id
      );
    }
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
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-text-primary display-font flex items-center gap-2">
          <Users className="w-7 h-7 text-primary" />
          <span>User Management</span>
        </h1>
        <p className="text-sm text-text-secondary mt-1">Review user roles, access statuses, and manage accounts platform-wide.</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-5 rounded-2xl border border-border shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-text-muted" />
          <input 
            type="text"
            placeholder="Search users by name, email..."
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
        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            
            <thead className="bg-off-white text-text-secondary font-bold border-b border-border text-4xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Access Role</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredList.map((user) => (
                <tr key={user.id} className="hover:bg-off-white transition-colors">
                  <td className="p-4 font-semibold text-text-primary">
                    {user.name}
                  </td>
                  <td className="p-4 text-text-secondary">
                    {user.email}
                  </td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value as Role)}
                      className="px-2 py-1 bg-off-white border border-border rounded-lg text-xs text-text-primary focus:outline-none"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="INDUSTRY_SPOC">Industry SPOC</option>
                      <option value="INSTITUTION_SPOC">Institution SPOC</option>
                      <option value="CII_ADMIN">CII Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    {user.isActive ? (
                      <span className="inline-flex items-center gap-1 bg-success-soft text-success px-2 py-0.5 rounded-full text-5xs font-bold border border-success/15">
                        <CheckCircle className="w-2.5 h-2.5" />
                        ACTIVE
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-error-soft text-error px-2 py-0.5 rounded-full text-5xs font-bold border border-error/15">
                        <ShieldAlert className="w-2.5 h-2.5" />
                        INACTIVE
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleActive(user.id, user.isActive)}
                      className={`text-xs font-bold px-3 py-1 rounded-lg border transition-colors ${
                        user.isActive 
                          ? 'border-error/25 hover:bg-error-soft text-error' 
                          : 'border-success/25 hover:bg-success-soft text-success'
                      }`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}
