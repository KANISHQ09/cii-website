'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { mockDb, User, SEED_USERS } from '@/lib/mockDb';
import { Layers, Shield, User as UserIcon, LogOut, ChevronDown, Check, Menu, X, Bell } from 'lucide-react';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load current user from mockDb
    setCurrentUser(mockDb.getCurrentUser());

    // Set unread notifications count
    const updateNotifs = () => {
      const user = mockDb.getCurrentUser();
      const notifs = mockDb.getNotifications(user.id);
      setUnreadCount(notifs.filter(n => !n.isRead).length);
    };

    updateNotifs();
    const interval = setInterval(updateNotifs, 3000); // Poll notifications
    return () => clearInterval(interval);
  }, [pathname]);

  const handleUserSwitch = (user: User) => {
    mockDb.setCurrentUser(user);
    setCurrentUser(user);
    setIsDropdownOpen(false);

    // Redirect based on role
    if (user.role === 'STUDENT') {
      router.push('/dashboard/student');
    } else if (user.role === 'INDUSTRY_SPOC') {
      router.push('/dashboard/industry');
    } else if (user.role === 'INSTITUTION_SPOC') {
      router.push('/dashboard/institution');
    } else if (user.role === 'SUPER_ADMIN' || user.role === 'CII_ADMIN') {
      router.push('/admin');
    }

    // Quick refresh to reset layout states
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const activeLinkClass = "text-primary font-semibold transition-colors duration-200";
  const inactiveLinkClass = "text-text-secondary hover:text-primary transition-colors duration-200";

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-border shadow-xs">
      <div className="container mx-auto px-4 md:px-6 h-18 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md">
            <span className="font-bold text-lg display-font">CII</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl text-text-primary leading-tight display-font tracking-tight">CIISIC</span>
            <span className="text-2xs text-text-muted font-medium tracking-wide">STUDENT-INDUSTRY HUB</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/" className={pathname === '/' ? activeLinkClass : inactiveLinkClass}>Home</Link>
          <Link href="/cells" className={pathname.startsWith('/cells') ? activeLinkClass : inactiveLinkClass}>Excellence Cells</Link>
          <Link href="/institutions" className={pathname === '/institutions' ? activeLinkClass : inactiveLinkClass}>Institutions</Link>
          <Link href="/challenges" className={pathname.startsWith('/challenges') ? activeLinkClass : inactiveLinkClass}>Challenges</Link>
          <Link href="/about" className={pathname === '/about' ? activeLinkClass : inactiveLinkClass}>About</Link>
          <Link href="/contact" className={pathname === '/contact' ? activeLinkClass : inactiveLinkClass}>Contact</Link>
        </nav>

        {/* Actions / Role Switcher */}
        <div className="hidden sm:flex items-center gap-4">

          {/* Notifications Link */}
          {currentUser && (
            <Link
              href={
                currentUser.role === 'STUDENT' ? '/dashboard/student/notifications' :
                  currentUser.role === 'INDUSTRY_SPOC' ? '/dashboard/industry/notifications' : // we will route to general notifications
                    '/dashboard/student/notifications'
              }
              className="relative p-2 text-text-secondary hover:text-primary transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cta text-white text-3xs font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {/* Role Switcher Widget */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary-soft/50 hover:bg-primary-soft text-primary font-medium text-xs card-bounce"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Role: <strong className="text-text-primary">{currentUser?.role?.replace('_', ' ')}</strong></span>
              <ChevronDown className="w-3 h-3 text-text-secondary" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-border shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="px-4 py-2 border-b border-border mb-1">
                  <span className="text-2xs text-text-muted font-semibold tracking-wider block">TEST ROLE SWITCHER</span>
                  <span className="text-3xs text-primary font-medium block">Simulate role perspective in real-time</span>
                </div>
                {SEED_USERS.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleUserSwitch(user)}
                    className="w-full flex items-center justify-between px-4 py-2 hover:bg-sky-light text-left transition-colors"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-text-primary">{user.name}</span>
                      <span className="text-3xs text-text-secondary">
                        {user.role.replace('_', ' ')} {user.role === 'STUDENT' ? `(${user.studentProfile?.skills[0]}...)` : user.role === 'INDUSTRY_SPOC' ? `(${user.industryProfile?.companyName})` : ''}
                      </span>
                    </div>
                    {currentUser?.id === user.id && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Get Started Button */}
          {currentUser && (
            <Link
              href={
                currentUser.role === 'STUDENT' ? '/dashboard/student' :
                  currentUser.role === 'INDUSTRY_SPOC' ? '/dashboard/industry' :
                    currentUser.role === 'INSTITUTION_SPOC' ? '/dashboard/institution' :
                      '/admin'
              }
              className="px-5 py-2.5 bg-cta hover:bg-cta-dark text-white font-semibold text-sm rounded-full shadow-md shadow-cta/25 hover:shadow-lg transition-all card-bounce"
            >
              Go to Portal →
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-3 lg:hidden">
          {/* Notifications for Mobile */}
          {currentUser && (
            <Link href="/dashboard/student/notifications" className="relative p-2 text-text-secondary">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cta text-white text-3xs font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 border border-border rounded-xl text-text-primary bg-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white py-4 px-6 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-4 mb-6">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={pathname === '/' ? "text-primary font-bold" : "text-text-secondary"}
            >
              Home
            </Link>
            <Link
              href="/cells"
              onClick={() => setIsMobileMenuOpen(false)}
              className={pathname.startsWith('/cells') ? "text-primary font-bold" : "text-text-secondary"}
            >
              Excellence Cells
            </Link>
            <Link
              href="/institutions"
              onClick={() => setIsMobileMenuOpen(false)}
              className={pathname === '/institutions' ? "text-primary font-bold" : "text-text-secondary"}
            >
              Institutions
            </Link>
            <Link
              href="/challenges"
              onClick={() => setIsMobileMenuOpen(false)}
              className={pathname.startsWith('/challenges') ? "text-primary font-bold" : "text-text-secondary"}
            >
              Challenges
            </Link>
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={pathname === '/about' ? "text-primary font-bold" : "text-text-secondary"}
            >
              About
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={pathname === '/contact' ? "text-primary font-bold" : "text-text-secondary"}
            >
              Contact
            </Link>
          </nav>

          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-text-secondary font-medium">Simulation Role:</span>
              <span className="text-xs text-primary font-bold">{currentUser?.role.replace('_', ' ')}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {SEED_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    handleUserSwitch(user);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-2xs font-semibold px-2 py-1.5 rounded-lg border text-center transition-colors ${currentUser?.id === user.id
                      ? 'border-primary bg-primary-soft text-primary'
                      : 'border-border bg-white text-text-secondary'
                    }`}
                >
                  {user.name.split(' ')[0]} ({user.role.split('_')[0]})
                </button>
              ))}
            </div>

            {currentUser && (
              <Link
                href={
                  currentUser.role === 'STUDENT' ? '/dashboard/student' :
                    currentUser.role === 'INDUSTRY_SPOC' ? '/dashboard/industry' :
                      currentUser.role === 'INSTITUTION_SPOC' ? '/dashboard/institution' :
                        '/admin'
                }
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-cta text-white font-semibold text-sm rounded-full shadow-md"
              >
                Go to Portal →
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;
