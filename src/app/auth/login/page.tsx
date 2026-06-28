'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockDb } from '@/lib/mockDb';
import { Shield, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('student@lnct.ac.in'); // Default for quick test
  const [password, setPassword] = useState('password123');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const users = mockDb.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      setErrorMsg("Email address not registered in the system. Use 'student@lnct.ac.in' or 'admin@ciisic.in' for demo testing.");
      return;
    }

    // Set active session user in mockDb
    mockDb.setCurrentUser(user);

    // Redirect to correct dashboard
    if (user.role === 'STUDENT') {
      router.push('/dashboard/student');
    } else if (user.role === 'INDUSTRY_SPOC') {
      router.push('/dashboard/industry');
    } else if (user.role === 'INSTITUTION_SPOC') {
      router.push('/dashboard/institution');
    } else if (user.role === 'SUPER_ADMIN' || user.role === 'CII_ADMIN') {
      router.push('/admin');
    }
  };

  return (
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
      
      {/* Left panel: Illustration & Marketing */}
      <div className="hidden lg:flex lg:col-span-7 bg-gradient-to-br from-primary via-primary/95 to-sky-deep text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse" />
        
        {/* Branding header */}
        <div className="flex items-center gap-2 relative z-10">
          <div className="w-9 h-9 rounded-lg bg-white/25 flex items-center justify-center font-bold text-white shadow-inner">
            CII
          </div>
          <span className="font-bold text-lg display-font">CIISIC</span>
        </div>

        {/* Big quote */}
        <div className="space-y-4 max-w-lg relative z-10">
          <span className="text-3xs uppercase font-bold tracking-widest text-cta bg-cta-soft/20 px-3 py-1 rounded-full inline-block">
            CII Industry Academia Initiative
          </span>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight display-font tracking-tight text-white">
            Where Real Problems Meet Real Solutions.
          </h2>
          <p className="text-sm text-white/80 leading-relaxed">
            Onboard onto Madhya Pradesh's unified portal coordinate engineering solutions directly with CII industrial partners.
          </p>
        </div>

        {/* Footer info */}
        <p className="text-5xs text-white/50 tracking-wide uppercase font-semibold relative z-10">
          Confederation of Indian Industry © {new Date().getFullYear()} MP
        </p>

      </div>

      {/* Right panel: Login form */}
      <div className="lg:col-span-5 bg-white flex items-center justify-center p-8 md:p-12">
        <div className="w-full max-w-sm space-y-8">
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-text-primary display-font tracking-tight">Welcome back 👋</h1>
            <p className="text-xs text-text-secondary">Enter your registered email address to access your workspace dashboard.</p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-error-soft border border-error/25 rounded-xl text-error text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-text-primary uppercase tracking-wider">Email Address</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@lnct.ac.in"
                className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-sm bg-off-white focus:bg-white transition-all font-semibold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-text-primary uppercase tracking-wider">
                <span>Password</span>
                <a href="#" onClick={(e) => { e.preventDefault(); alert("Use standard credentials in demo mode."); }} className="text-5xs text-primary hover:underline lowercase">Forgot Password?</a>
              </div>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-sm bg-off-white focus:bg-white transition-all"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-cta hover:bg-cta-dark text-white font-bold text-sm rounded-full shadow-lg shadow-cta/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 card-bounce"
            >
              <span>Log In Dashboard</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </button>

          </form>

          {/* Quick Demo Credentials Guide */}
          <div className="p-4 bg-off-white border border-border rounded-2xl text-xs space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-1.5 uppercase text-3xs">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Demo Credentials Guide
            </h4>
            <ul className="text-4xs text-text-secondary space-y-1 list-disc pl-4 font-mono">
              <li>Student: <strong className="text-text-primary">student@lnct.ac.in</strong></li>
              <li>Sponsor: <strong className="text-text-primary">spoc@netlink.com</strong></li>
              <li>Admin: <strong className="text-text-primary">admin@ciisic.in</strong></li>
              <li>SPOC: <strong className="text-text-primary">spoc@lnct.ac.in</strong></li>
            </ul>
          </div>

          <div className="text-center text-xs text-text-secondary">
            <span>Don't have an account? </span>
            <Link href="/auth/register/student" className="text-primary font-bold hover:underline">Sign up</Link>
          </div>

        </div>
      </div>

    </div>
  );
}
