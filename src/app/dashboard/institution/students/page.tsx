'use client';

import React, { useEffect, useState } from 'react';
import { mockDb, User } from '@/lib/mockDb';
import { Users, GraduationCap, Search, CheckCircle } from 'lucide-react';

export default function InstitutionStudents() {
  const [students, setStudents] = useState<User[]>([]);
  const [filteredList, setFilteredList] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    const instId = user.institutionProfile?.institutionId || 'inst-10'; // LNCT default
    
    const allUsers = mockDb.getUsers();
    const instStudents = allUsers.filter(u => u.role === 'STUDENT' && u.studentProfile?.institutionId === instId);
    setStudents(instStudents);
    setFilteredList(instStudents);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredList(students);
    } else {
      setFilteredList(
        students.filter(s => 
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.studentProfile?.department.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, students]);

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
            <Users className="w-7 h-7 text-primary" />
            <span>Manage Registered Students</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">Review student enrollment details, verified skills, and active standings.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-text-muted" />
        <input 
          type="text"
          placeholder="Search students by name, email, department..."
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
                <th className="p-4">Student Name</th>
                <th className="p-4">Enrollment Number</th>
                <th className="p-4">Branch / Department</th>
                <th className="p-4">Year</th>
                <th className="p-4">Verified Skills</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    No students registered matching search parameters.
                  </td>
                </tr>
              ) : (
                filteredList.map((st) => (
                  <tr key={st.id} className="hover:bg-sky-light/10 transition-colors">
                    <td className="p-4 font-semibold text-text-primary">
                      <div className="flex flex-col">
                        <span>{st.name}</span>
                        <span className="text-4xs text-text-muted font-normal">{st.email}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-text-secondary">
                      {st.studentProfile?.enrollmentNo}
                    </td>
                    <td className="p-4 text-text-secondary">
                      {st.studentProfile?.department}
                    </td>
                    <td className="p-4 text-text-secondary font-semibold">
                      Year {st.studentProfile?.yearOfStudy}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {st.studentProfile?.skills.slice(0, 3).map(skill => (
                          <span key={skill} className="bg-primary-soft text-primary px-2 py-0.5 rounded-md text-5xs font-bold border border-primary/5">
                            {skill}
                          </span>
                        ))}
                        {(st.studentProfile?.skills.length || 0) > 3 && (
                          <span className="text-4xs text-text-muted font-medium ml-1">
                            +{st.studentProfile!.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 bg-success-soft text-success px-2 py-0.5 rounded-full text-5xs font-bold border border-success/15">
                        <CheckCircle className="w-2.5 h-2.5" />
                        ACTIVE
                      </span>
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
