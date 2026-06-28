import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-text-primary text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Logo & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-md">
                CII
              </div>
              <span className="font-bold text-lg text-white display-font tracking-tight">CIISIC</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              A collaborative cell platform bridging the gap between industry requirements and student innovation across Madhya Pradesh.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all text-xs">𝕏</a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all text-xs">in</a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all text-xs">fb</a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-sm text-white/90 uppercase tracking-wider mb-4 display-font">Platform</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/challenges" className="hover:text-primary transition-colors">Browse Challenges</Link></li>
              <li><Link href="/institutions" className="hover:text-primary transition-colors">Participating Institutions</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">About Program</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Get Support</Link></li>
            </ul>
          </div>

          {/* Excellence Cells */}
          <div>
            <h4 className="font-semibold text-sm text-white/90 uppercase tracking-wider mb-4 display-font">Excellence Cells</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><Link href="/cells/family_business" className="hover:text-primary transition-colors">Family Business</Link></li>
              <li><Link href="/cells/talent_readiness" className="hover:text-primary transition-colors">Talent Readiness</Link></li>
              <li><Link href="/cells/research_innovation" className="hover:text-primary transition-colors">Research & Innovation</Link></li>
              <li><Link href="/cells/ai_in_business" className="hover:text-primary transition-colors">AI in Business</Link></li>
              <li><Link href="/cells/startup" className="hover:text-primary transition-colors">Startup Cell</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-semibold text-sm text-white/90 uppercase tracking-wider mb-4 display-font">Contact Office</h4>
            <p className="text-sm text-white/60 leading-relaxed mb-3">
              CII Madhya Pradesh State Office,<br />
              Bhopal, MP, India
            </p>
            <div className="text-sm text-white/60 space-y-1">
              <p>Email: <a href="mailto:admin@ciisic.in" className="hover:text-primary text-white/80">admin@ciisic.in</a></p>
              <p>Support: <a href="mailto:helpdesk@ciisic.in" className="hover:text-primary text-white/80">helpdesk@ciisic.in</a></p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} CII MP Chapter. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">CII Directory</a>
          </div>
          <p className="font-medium tracking-wide">Industry-Academia Collaboration Portal</p>
        </div>

      </div>
    </footer>
  );
};
export default Footer;
