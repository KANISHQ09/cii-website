'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockDb, Role } from '@/lib/mockDb';
import { Shield, Sparkles, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

export default function Register() {
  const params = useParams();
  const router = useRouter();
  
  const roleStr = params?.role as string; // student, industry, institution

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [enrollmentNo, setEnrollmentNo] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [yearOfStudy, setYearOfStudy] = useState(3);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name || !email) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    // Map role string to DB enum Role
    let roleEnum: Role = 'STUDENT';
    const profileData: any = {};

    if (roleStr === 'industry') {
      roleEnum = 'INDUSTRY_SPOC';
      profileData.companyName = companyName || 'New Company';
      profileData.industry = industry || 'IT Services';
      profileData.isCIIMember = true;
    } else if (roleStr === 'institution') {
      roleEnum = 'INSTITUTION_SPOC';
      profileData.institutionId = 'inst-10'; // Default LNCT
      profileData.designation = 'Assistant Professor';
      profileData.department = department;
    } else {
      // student
      roleEnum = 'STUDENT';
      profileData.enrollmentNo = enrollmentNo || `LNCT/CS/${Date.now().toString().slice(-4)}`;
      profileData.institutionId = 'inst-10'; // Default LNCT
      profileData.department = department;
      profileData.yearOfStudy = yearOfStudy;
      profileData.skills = ["HTML", "JavaScript", "React", "Python"];
    }

    // Call mockDb
    const newUser = mockDb.addUser(email, name, roleEnum, profileData);
    
    if (!newUser) {
      setErrorMsg("Email address already registered. Try logging in or use another email.");
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      router.push('/auth/login');
    }, 2000);
  };

  const getRoleTitle = () => {
    if (roleStr === 'industry') return 'Industry Partner';
    if (roleStr === 'institution') return 'Institution SPOC';
    return 'Student Candidate';
  };

  return (
    <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 min-h-screen bg-white">
      
      {/* Left marketing panel */}
      <div className="hidden lg:flex lg:col-span-7 bg-gradient-to-br from-primary via-primary/95 to-sky-deep text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" />
        
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-lg bg-white/25 flex items-center justify-center font-bold text-white shadow-inner">
            CII
          </div>
          <span className="font-bold text-lg display-font">CIISIC</span>
        </Link>

        <div className="space-y-4 max-w-lg relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight display-font tracking-tight text-white">
            Register as {getRoleTitle()}
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Create your account to join Madhya Pradesh's state coordination innovation network. Verify credentials locally to initialize.
          </p>
        </div>

        <p className="text-5xs text-white/50 tracking-wide uppercase font-semibold relative z-10">
          Confederation of Indian Industry © {new Date().getFullYear()} MP
        </p>
      </div>

      {/* Right form panel */}
      <div className="lg:col-span-5 flex items-center justify-center p-8 md:p-12 bg-white">
        <div className="w-full max-w-sm space-y-8">
          
          <div className="space-y-2">
            <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors font-semibold">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
            <h1 className="text-2xl font-bold text-text-primary display-font tracking-tight">Onboard Roster Account</h1>
            <p className="text-xs text-text-secondary">Register to initialize your student portfolio or corporate account.</p>
          </div>

          {isSuccess ? (
            <div className="p-6 bg-success-soft border border-success/20 rounded-xl text-center space-y-3">
              <div className="w-10 h-10 bg-success/15 text-success rounded-full flex items-center justify-center mx-auto">✓</div>
              <h4 className="font-bold text-xs text-text-primary">Registration Completed!</h4>
              <p className="text-4xs text-text-secondary">Redirecting to login dashboard workspace...</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              
              {errorMsg && (
                <div className="p-4 bg-error-soft border border-error/25 rounded-xl text-error text-xs flex items-center gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Full Name *</label>
                <input 
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-xs bg-off-white focus:bg-white transition-all font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Email Address *</label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-xs bg-off-white focus:bg-white transition-all font-semibold"
                />
              </div>

              {/* Role-specific fields */}
              {roleStr === 'industry' ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Company Name *</label>
                    <input 
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Netlink Solutions"
                      className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-xs bg-off-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Industry Sector *</label>
                    <input 
                      type="text"
                      required
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g. Information Technology"
                      className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-xs bg-off-white"
                    />
                  </div>
                </>
              ) : roleStr === 'institution' ? (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Department / Branch *</label>
                    <input 
                      type="text"
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Computer Science & Engineering"
                      className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-xs bg-off-white"
                    />
                  </div>
                </>
              ) : (
                // Student
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Enrollment Number</label>
                    <input 
                      type="text"
                      value={enrollmentNo}
                      onChange={(e) => setEnrollmentNo(e.target.value)}
                      placeholder="LNCT/CS/2023/128"
                      className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-xs bg-off-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Department</label>
                      <input 
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-xs bg-off-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Year of Study</label>
                      <select 
                        value={yearOfStudy}
                        onChange={(e) => setYearOfStudy(parseInt(e.target.value))}
                        className="px-4 py-2.5 rounded-xl border border-border focus:outline-none text-xs bg-off-white"
                      >
                        <option value={1}>Year 1</option>
                        <option value={2}>Year 2</option>
                        <option value={3}>Year 3</option>
                        <option value={4}>Year 4</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <button 
                type="submit"
                className="w-full py-3 bg-cta hover:bg-cta-dark text-white font-bold text-sm rounded-full shadow-lg shadow-cta/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 pt-2.5 card-bounce"
              >
                <span>Complete Registration</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>

            </form>
          )}

          <div className="text-center text-xs text-text-secondary">
            <span>Already have an account? </span>
            <Link href="/auth/login" className="text-primary font-bold hover:underline">Log in</Link>
          </div>

        </div>
      </div>

    </div>
  );
}
