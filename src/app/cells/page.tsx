'use client';

import React from 'react';
import Link from 'next/link';
import { SEED_CELLS } from '@/lib/mockDb';
import { ArrowRight, LayoutGrid, BookOpen, Layers } from 'lucide-react';

export default function Cells() {
  const cells = Object.values(SEED_CELLS);

  return (
    <div className="bg-off-white min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header Block */}
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-soft text-primary rounded-full text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>Excellence Domains</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight tracking-tight">
            The 7 Excellence Cells
          </h1>
          <p className="text-text-secondary leading-relaxed">
            CII Industry Academia Excellence Cells operate across Madhya Pradesh, each focusing on a distinct strategic theme to coordinate real-world challenges, mentorship, and research projects.
          </p>
        </div>

        {/* Cells Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cells.map((cell) => {
            return (
              <div 
                key={cell.theme}
                className="group relative rounded-2xl border border-border bg-white shadow-card card-bounce overflow-hidden flex flex-col justify-between h-[380px]"
              >
                {/* Header Image/Background in Cell Colors */}
                <div 
                  className="h-40 w-full relative overflow-hidden flex items-center justify-center text-white"
                  style={{ background: `linear-gradient(135deg, ${cell.primaryColor}, ${cell.primaryColor}dd)` }}
                >
                  <img 
                    src={cell.imagePath} 
                    alt={cell.name}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="relative z-10 text-center px-6">
                    <span 
                      className="text-3xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block"
                      style={{ backgroundColor: cell.accentColor, color: '#0D1B2A' }}
                    >
                      {cell.colorName} CELL
                    </span>
                    <h3 className="font-bold text-xl leading-snug">{cell.name}</h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <div className="space-y-3">
                    <div>
                      <span className="text-4xs text-text-muted font-bold uppercase tracking-wider block">HOSTING INSTITUTION</span>
                      <span className="text-xs font-semibold text-text-secondary">{cell.hostName}</span>
                    </div>
                    <p className="text-sm font-medium italic text-text-secondary leading-relaxed border-l-2 pl-3" style={{ borderColor: cell.primaryColor }}>
                      &ldquo;{cell.tagline}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
                    <span className="text-3xs text-text-muted font-semibold uppercase tracking-wider">CII CELL CELL</span>
                    <Link 
                      href={`/cells/${cell.theme.toLowerCase()}`}
                      className="text-xs font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 group-hover:underline"
                    >
                      <span>Explore Cell Page</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
