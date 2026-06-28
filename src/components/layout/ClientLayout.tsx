'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

export const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  const isOnboarding = pathname.startsWith('/onboarding');
  const isAuth = pathname.startsWith('/auth');

  if (isDashboard) {
    return (
      <div className="flex min-h-screen bg-off-white">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-x-hidden min-h-screen">
          <div className="flex-1 p-6 md:p-10">
            {children}
          </div>
        </main>
      </div>
    );
  }

  if (isOnboarding || isAuth) {
    return (
      <div className="min-h-screen flex flex-col bg-sky-light/20">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};
export default ClientLayout;
