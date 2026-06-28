'use client';

import React, { useState } from 'react';
import { Send, MapPin, Mail, Clock, Phone, ChevronDown, Check } from 'lucide-react';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [body, setBody] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How is student data protected from industries?",
      a: "All student solutions are anonymized by default. The industry receives only an approach document and a text summary. Personal details like names, email addresses, and phone numbers are hidden until a proposal is officially accepted, or strictly withheld based on admin security rules."
    },
    {
      q: "Who can post challenges on the platform?",
      a: "Only verified Industry SPOCs representing companies associated with the Confederation of Indian Industry (CII) can post challenges. All posted challenges are reviewed by CII state administrators before they are opened to the public."
    },
    {
      q: "What is the file size limit for uploads?",
      a: "Logo uploads and image avatars are limited to a maximum size of 2MB. Technical approach files, blueprints, and dataset attachments must be in PDF or DOCX format and are restricted to a maximum size of 10MB."
    },
    {
      q: "How does the secure chat messaging thread work?",
      a: "When a student submits a proposal, a secure messaging thread is initialized. Students and industry sponsors can chat directly within this thread. To maintain confidentiality, any emails or phone numbers entered in the chat are automatically redacted."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !body) return;
    setIsSubmitted(true);
    setName('');
    setEmail('');
    setBody('');
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <div className="bg-off-white min-h-screen py-16">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 space-y-4">
          <span className="text-xs uppercase tracking-widest text-cta font-bold">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight tracking-tight">
            Contact CII Desk & FAQs
          </h1>
          <p className="text-text-secondary leading-relaxed">
            Have questions about student registrations, corporate postings, or the 7 Excellence Cells? Send us a message or review the frequently asked questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-border shadow-sm space-y-6">
            <h2 className="text-2xl font-bold text-text-primary display-font">Send Partner Inquiry</h2>
            
            {isSubmitted ? (
              <div className="bg-success-soft border border-success/20 p-6 rounded-xl text-center space-y-3">
                <div className="w-10 h-10 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-md text-text-primary">Inquiry Sent Successfully!</h4>
                <p className="text-xs text-text-secondary">Thank you for writing to us. Our state cell coordinator will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-primary uppercase">Full Name *</label>
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-sm bg-off-white focus:bg-white transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-primary uppercase">Email Address *</label>
                    <input 
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-sm bg-off-white focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-primary uppercase">I represent *</label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-border focus:outline-none text-sm bg-off-white"
                  >
                    <option value="STUDENT">Student Researcher</option>
                    <option value="INDUSTRY_SPOC">Industry Partner / Sponsor</option>
                    <option value="INSTITUTION_SPOC">Institution SPOC / Coordinator</option>
                    <option value="OTHER">Other Partner</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-primary uppercase">Message *</label>
                  <textarea 
                    rows={4}
                    required
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Write details about your partnership proposal or question..."
                    className="px-4 py-2.5 rounded-xl border border-border focus:border-primary focus:outline-none text-sm bg-off-white focus:bg-white transition-all"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-cta hover:bg-cta-dark text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all card-bounce"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}

          </div>

          {/* Right Column: Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-text-primary text-white p-8 rounded-2xl shadow-lg space-y-6">
              <h3 className="font-bold text-lg display-font">State Office Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-xs text-white/80">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <p>
                    <strong>CII Madhya Pradesh State Office</strong><br />
                    E-2/198, Arera Colony, Bhopal,<br />
                    Madhya Pradesh - 462016
                  </p>
                </div>
                <div className="flex items-start gap-3 text-xs text-white/80">
                  <Mail className="w-5 h-5 text-cta shrink-0" />
                  <div>
                    <p className="font-bold">Desk Email Contacts</p>
                    <a href="mailto:admin@ciisic.in" className="hover:underline">admin@ciisic.in</a><br />
                    <a href="mailto:helpdesk@ciisic.in" className="hover:underline">helpdesk@ciisic.in</a>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs text-white/80">
                  <Clock className="w-5 h-5 text-success shrink-0" />
                  <p>
                    <strong>Operating Hours</strong><br />
                    Monday - Friday (10:00 AM - 6:00 PM)
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Warning */}
            <div className="p-5 rounded-2xl bg-primary-soft/50 border border-primary/20 text-xs text-text-secondary leading-relaxed">
              <strong>Notice:</strong> All operational communications regarding submissions and proposal evaluations must be conducted strictly within the platform messaging threads. External exchanges are flagged and logs are checked by state cell coordinators.
            </div>

          </div>

        </div>

        {/* FAQs Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl font-bold text-text-primary text-center display-font mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isActive = activeFaq === index;
              return (
                <div key={index} className="bg-white rounded-xl border border-border shadow-xs overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(isActive ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between font-bold text-sm text-text-primary text-left"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${isActive ? 'rotate-180' : ''}`} />
                  </button>
                  {isActive && (
                    <div className="px-6 pb-4 pt-1 border-t border-border/50 text-xs text-text-secondary leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
