'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { mockDb, Notification, User } from '@/lib/mockDb';
import { Bell, CheckSquare, BellRing, ChevronRight, Check } from 'lucide-react';

export default function StudentNotifications() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = mockDb.getCurrentUser();
    setCurrentUser(user);
    
    const loadNotifs = () => {
      setNotifications(mockDb.getNotifications(user.id));
    };

    loadNotifs();
    setIsLoading(false);
  }, []);

  const handleMarkAsRead = (id: string) => {
    mockDb.markNotificationAsRead(id);
    if (currentUser) {
      setNotifications(mockDb.getNotifications(currentUser.id));
    }
  };

  const handleMarkAllAsRead = () => {
    if (!currentUser) return;
    mockDb.markAllNotificationsAsRead(currentUser.id);
    setNotifications(mockDb.getNotifications(currentUser.id));
  };

  if (isLoading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-border pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary display-font flex items-center gap-2">
            <Bell className="w-7 h-7 text-primary" />
            <span>My Notifications</span>
          </h1>
          <p className="text-sm text-text-secondary mt-1">Review review logs, system queries, and status updates.</p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary-soft text-primary hover:bg-primary hover:text-white text-xs font-bold rounded-lg border border-primary/10 transition-colors"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* List */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-16 text-center space-y-4 shadow-xs">
          <BellRing className="w-12 h-12 text-text-muted mx-auto" />
          <h3 className="font-bold text-lg text-text-primary">No Notifications Yet</h3>
          <p className="text-xs text-text-secondary">System notices will be logged here when proposal statuses change.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            return (
              <div 
                key={notif.id}
                className={`p-5 rounded-xl border transition-all flex items-start gap-4 ${
                  notif.isRead 
                    ? 'bg-white border-border' 
                    : 'bg-primary-soft/30 border-primary/20 shadow-xs'
                }`}
              >
                {/* Unread circle indicator */}
                <div className="mt-1 shrink-0">
                  {notif.isRead ? (
                    <div className="w-2.5 h-2.5 rounded-full bg-text-muted/30" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-cta animate-pulse" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow space-y-1">
                  <div className="flex justify-between items-center gap-4">
                    <h4 className={`text-xs font-bold text-text-primary ${!notif.isRead ? 'text-primary' : ''}`}>
                      {notif.title}
                    </h4>
                    <span className="text-5xs text-text-muted font-medium shrink-0">
                      {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
                    {notif.body}
                  </p>

                  <div className="flex gap-4 pt-2">
                    {notif.link && (
                      <Link 
                        href={notif.link}
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="inline-flex items-center gap-0.5 text-4xs font-bold text-primary hover:underline"
                      >
                        <span>Open solutions link</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
                    )}
                    {!notif.isRead && (
                      <button 
                        onClick={() => handleMarkAsRead(notif.id)}
                        className="inline-flex items-center gap-0.5 text-4xs font-bold text-text-secondary hover:text-text-primary hover:underline"
                      >
                        <Check className="w-3 h-3" />
                        <span>Dismiss</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
