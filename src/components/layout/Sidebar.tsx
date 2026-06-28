'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { mockDb, User } from '@/lib/mockDb';
import { 
  Home, Folder, FileText, Bookmark, User as UserIcon, Bell, 
  PlusCircle, Building, Shield, Activity, Settings, LogOut, ChevronRight, MessageSquare
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [items, setItems] = useState<SidebarItem[]>([]);

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    setCurrentUser(user);

    // Dynamic items based on roles
    let menuItems: SidebarItem[] = [];

    // Calculate unread notifications & messages
    const notifs = mockDb.getNotifications(user.id);
    const unreadNotifsCount = notifs.filter(n => !n.isRead).length;

    if (user.role === 'STUDENT') {
      menuItems = [
        { name: 'Overview', href: '/dashboard/student', icon: Home },
        { name: 'My Proposals', href: '/dashboard/student/proposals', icon: FileText },
        { name: 'Bookmarks', href: '/dashboard/student/bookmarks', icon: Bookmark },
        { name: 'My Profile', href: '/dashboard/student/profile', icon: UserIcon },
        { name: 'Notifications', href: '/dashboard/student/notifications', icon: Bell, badge: unreadNotifsCount }
      ];
    } else if (user.role === 'INDUSTRY_SPOC') {
      menuItems = [
        { name: 'Overview', href: '/dashboard/industry', icon: Home },
        { name: 'Manage Challenges', href: '/dashboard/industry/challenges', icon: Folder },
        { name: 'Post Challenge', href: '/dashboard/industry/challenges/create', icon: PlusCircle },
        { name: 'Company Profile', href: '/dashboard/industry/profile', icon: UserIcon }
      ];
    } else if (user.role === 'INSTITUTION_SPOC') {
      menuItems = [
        { name: 'Overview', href: '/dashboard/institution', icon: Home },
        { name: 'Manage Students', href: '/dashboard/institution/students', icon: UserIcon },
        { name: 'All Proposals', href: '/dashboard/institution/proposals', icon: FileText },
        { name: 'Cell Reports', href: '/dashboard/institution/reports', icon: Activity }
      ];
    } else if (user.role === 'SUPER_ADMIN' || user.role === 'CII_ADMIN') {
      menuItems = [
        { name: 'Dashboard', href: '/admin', icon: Home },
        { name: 'User Directory', href: '/admin/users', icon: UserIcon },
        { name: 'Institutions', href: '/admin/institutions', icon: Building },
        { name: 'All Challenges', href: '/admin/challenges', icon: Folder },
        { name: 'Proposals Lifecycle', href: '/admin/proposals', icon: FileText },
        { name: 'Audit Log (Immutable)', href: '/admin/audit', icon: Shield },
        { name: 'Platform Settings', href: '/admin/settings', icon: Settings }
      ];
    }

    setItems(menuItems);
  }, [pathname]);

  const handleLogout = () => {
    // Switch to first student user as default or go to homepage
    router.push('/');
  };

  if (!currentUser) return null;

  return (
    <aside className="w-64 bg-text-primary text-white flex flex-col min-h-screen sticky top-0 z-40 shadow-xl">
      
      {/* Brand Header */}
      <div className="h-18 flex items-center px-6 border-b border-white/10 gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">
          CII
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-md tracking-tight display-font text-white">CIISIC</span>
          <span className="text-4xs text-white/50 tracking-wider font-semibold">PORTAL PANEL</span>
        </div>
      </div>

      {/* Menu Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {items.map((item) => {
          // Check active state
          const isActive = pathname === item.href || (item.href !== '/admin' && item.href !== '/dashboard/student' && item.href !== '/dashboard/industry' && item.href !== '/dashboard/institution' && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary text-white shadow-md shadow-primary/20 font-semibold' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white'}`} />
                <span className="text-sm">{item.name}</span>
              </div>
              
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-cta text-white text-3xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}

              {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
            </Link>
          );
        })}
      </nav>

      {/* User Identity Footer */}
      <div className="p-4 border-t border-white/10 bg-white/3">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 overflow-hidden flex items-center justify-center text-primary font-bold text-sm">
            {currentUser.avatarUrl ? (
              <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.name.split(' ').map(n => n[0]).join('')
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold text-white truncate">{currentUser.name}</span>
            <span className="text-4xs text-white/40 font-medium tracking-wide uppercase">
              {currentUser.role.replace('_', ' ')}
            </span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-white/10 hover:border-white/20 bg-white/3 hover:bg-white/5 text-xs text-white/70 hover:text-white transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Panel</span>
        </button>
      </div>

    </aside>
  );
};
export default Sidebar;
