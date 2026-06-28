'use client';

import React, { useEffect, useState } from 'react';
import { mockDb, User } from '@/lib/mockDb';
import { User as UserIcon, Plus, X, GraduationCap, Code, Award, Check } from 'lucide-react';

export default function StudentProfile() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    setCurrentUser(user);
    if (user.studentProfile) {
      setSkills(user.studentProfile.skills);
      
      const inst = mockDb.getInstitutions().find(i => i.id === user.studentProfile?.institutionId);
      if (inst) setInstitutionName(inst.name);
    }
  }, []);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || !currentUser || !currentUser.studentProfile) return;
    
    const term = newSkill.trim();
    if (skills.includes(term)) return;

    const updatedSkills = [...skills, term];
    setSkills(updatedSkills);
    setNewSkill('');

    // Update in mockDb
    const users = mockDb.getUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1 && users[idx].studentProfile) {
      users[idx].studentProfile!.skills = updatedSkills;
      localStorage.setItem('ciisic_users', JSON.stringify(users));
      
      // Update session user too
      const sessionUser = mockDb.getCurrentUser();
      if (sessionUser.studentProfile) {
        sessionUser.studentProfile.skills = updatedSkills;
        localStorage.setItem('ciisic_session_user', JSON.stringify(sessionUser));
      }
    }
  };

  const handleRemoveSkill = (tag: string) => {
    if (!currentUser || !currentUser.studentProfile) return;

    const updatedSkills = skills.filter(s => s !== tag);
    setSkills(updatedSkills);

    // Update in mockDb
    const users = mockDb.getUsers();
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1 && users[idx].studentProfile) {
      users[idx].studentProfile!.skills = updatedSkills;
      localStorage.setItem('ciisic_users', JSON.stringify(users));

      // Update session user too
      const sessionUser = mockDb.getCurrentUser();
      if (sessionUser.studentProfile) {
        sessionUser.studentProfile.skills = updatedSkills;
        localStorage.setItem('ciisic_session_user', JSON.stringify(sessionUser));
      }
    }
  };

  const handleSaveProfile = () => {
    if (!currentUser) return;
    
    // Log audit log
    mockDb.addAuditLog(currentUser.id, "Updated student profile skills and details", "User", currentUser.id);
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Header */}
      <div className="border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-text-primary display-font">Academic Profile</h1>
        <p className="text-sm text-text-secondary mt-1">Manage your credentials, verify skills tags, and inspect institution details.</p>
      </div>

      {isSaved && (
        <div className="p-4 bg-success-soft border border-success/20 rounded-xl text-success text-xs flex items-center gap-2">
          <Check className="w-4.5 h-4.5" />
          <span>Profile changes saved and logged in the immutable audit log successfully!</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary to-sky-deep relative" />

        {/* Identity row */}
        <div className="px-8 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 gap-4">
            
            {/* Avatar */}
            <div className="w-28 h-28 rounded-full border-4 border-white bg-off-white overflow-hidden shadow-md shrink-0 flex items-center justify-center text-primary text-3xl font-bold">
              {currentUser.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                currentUser.name.split(' ').map(n => n[0]).join('')
              )}
            </div>

            {/* Save Action */}
            <button 
              onClick={handleSaveProfile}
              className="px-6 py-2 bg-cta hover:bg-cta-dark text-white text-xs font-bold rounded-full shadow-md transition-all card-bounce shrink-0"
            >
              Save Profile Updates
            </button>

          </div>

          <div className="mt-4 space-y-1">
            <h2 className="text-2xl font-bold text-text-primary display-font">{currentUser.name}</h2>
            <p className="text-xs text-text-secondary font-medium">Role: {currentUser.role.replace('_', ' ')}</p>
          </div>

        </div>

      </div>

      {/* Grid Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left: Academic Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-text-primary border-b border-border pb-3 display-font flex items-center gap-1.5">
            <GraduationCap className="w-5 h-5 text-primary" />
            Academic Details
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary">Enrollment Number</span>
              <strong className="text-text-primary font-bold">{currentUser.studentProfile?.enrollmentNo}</strong>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary">Institution Name</span>
              <strong className="text-text-primary font-bold text-right max-w-[200px] truncate" title={institutionName}>
                {institutionName || "LNCT Group"}
              </strong>
            </div>
            <div className="flex justify-between border-b border-border/50 pb-2">
              <span className="text-text-secondary">Branch / Department</span>
              <strong className="text-text-primary font-bold text-right truncate max-w-[200px]">
                {currentUser.studentProfile?.department}
              </strong>
            </div>
            <div className="flex justify-between pb-1">
              <span className="text-text-secondary">Current Year of Study</span>
              <strong className="text-text-primary font-bold">Year {currentUser.studentProfile?.yearOfStudy} (Undergrad)</strong>
            </div>
          </div>
        </div>

        {/* Right: Skills Cloud */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-text-primary border-b border-border pb-3 display-font flex items-center gap-1.5">
            <Code className="w-5 h-5 text-cta" />
            Skills Portfolio
          </h3>

          {/* Add skill tag */}
          <form onSubmit={handleAddSkill} className="flex gap-2">
            <input 
              type="text"
              placeholder="Add skill (e.g. Node.js)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl border border-border text-xs focus:outline-none focus:border-primary flex-grow bg-off-white focus:bg-white transition-all"
            />
            <button 
              type="submit"
              disabled={!newSkill.trim()}
              className="p-2 bg-primary hover:bg-primary-dark disabled:bg-text-muted text-white rounded-xl flex items-center justify-center transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          {/* Tag cloud */}
          <div className="flex flex-wrap gap-2 pt-2">
            {skills.length === 0 ? (
              <p className="text-xs text-text-muted">No skills added yet. Add skills to display on your anonymized application drafts.</p>
            ) : (
              skills.map((skill) => (
                <span 
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-soft text-primary rounded-full text-xs font-semibold"
                >
                  <span>{skill}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSkill(skill)}
                    className="w-4 h-4 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center text-3xs font-bold transition-colors"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
