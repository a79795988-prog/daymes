'use client';

import React, { useState } from 'react';
import { Phone, Mail, MapPin, ChevronDown, Send, CheckCircle2 } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How do prescription orders work?',
    answer:
      "For medicines marked Rx, upload a clear picture of your doctor's prescription at checkout. Our verified pharmacists check and approve it before dispatch.",
  },
  {
    question: 'What is the Smart Reordering System?',
    answer:
      "Smart Reordering automatically tracks your remaining pills based on dosage recommendations and notifies you when it's time to refill with 1-click ordering.",
  },
  {
    question: 'How fast is delivery?',
    answer:
      'Standard delivery arrives within 24-48 hours. Express same-day delivery is available in select areas for orders placed before 2:00 PM.',
  },
  {
    question: 'Is payment secure on this website?',
    answer:
      'This is a prototype application created for college/project demonstration. No real money or payments are processed.',
  },
];

export const ContactPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'Prescription Verification',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        fullName: '',
        email: '',
        subject: 'Prescription Verification',
        message: '',
      });
    }, 4000);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto py-4">
      {/* Top 3 Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: 24/7 Phone Helpline */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 p-8 text-center space-y-3.5 shadow-lg shadow-black/40 hover:border-slate-700 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-sky-950 text-sky-400 border border-sky-800/60 flex items-center justify-center mx-auto">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">24/7 Phone Helpline</h3>
            <p className="text-xs text-slate-400 mt-1">+1 (800) 555-DAYZ (3299)</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 border border-emerald-800 px-3 py-1 rounded-full inline-block">
              Toll Free
            </span>
          </div>
        </div>

        {/* Card 2: Pharmacist Email */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 p-8 text-center space-y-3.5 shadow-lg shadow-black/40 hover:border-slate-700 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-teal-950 text-teal-400 border border-teal-800/60 flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Pharmacist Email</h3>
            <p className="text-xs text-slate-400 mt-1">support@daymes.com</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-sky-300 bg-sky-950 border border-sky-800 px-3 py-1 rounded-full inline-block">
              Avg reply: 15 mins
            </span>
          </div>
        </div>

        {/* Card 3: Pharmacy Location */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 p-8 text-center space-y-3.5 shadow-lg shadow-black/40 hover:border-slate-700 transition-all">
          <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center mx-auto">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Pharmacy Location</h3>
            <p className="text-xs text-slate-400 mt-1">450 Medical Center Plaza, Suite 102</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-full inline-block border border-slate-700/60">
              Open Mon-Sun 8am-10pm
            </span>
          </div>
        </div>
      </div>

      {/* Two Columns: Send Us a Message + FAQs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Send Us a Message */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 p-8 space-y-6 shadow-xl shadow-black/40">
          <h2 className="text-base font-extrabold text-white">Send Us a Message</h2>

          {submitted && (
            <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 text-emerald-200 rounded-2xl flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Thank you! Your message has been sent to our verified pharmacist team.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Your Full Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Sarah Jenkins"
                className="w-full px-4 py-3 bg-[#0d1624] border border-slate-800 text-white placeholder-slate-500 rounded-2xl text-xs outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="sarah@example.com"
                className="w-full px-4 py-3 bg-[#0d1624] border border-slate-800 text-white placeholder-slate-500 rounded-2xl text-xs outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Subject
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 bg-[#0d1624] border border-slate-800 text-slate-200 rounded-2xl text-xs outline-none focus:border-sky-500 transition-colors font-medium cursor-pointer"
              >
                <option value="Prescription Verification">Prescription Verification</option>
                <option value="Order Status Inquiry">Order Status Inquiry</option>
                <option value="Smart Reorder Refill Request">Smart Reorder Refill Request</option>
                <option value="General Pharmacist Question">General Pharmacist Question</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Message
              </label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your question or medicine inquiry..."
                className="w-full px-4 py-3 bg-[#0d1624] border border-slate-800 text-white placeholder-slate-500 rounded-2xl text-xs outline-none focus:border-sky-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>Submit Message</span>
            </button>
          </form>
        </div>

        {/* Right Column: Frequently Asked Questions */}
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800/90 p-8 space-y-4 shadow-xl shadow-black/40">
          <h2 className="text-base font-extrabold text-white mb-2">Frequently Asked Questions</h2>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="border border-slate-800/80 rounded-2xl overflow-hidden bg-[#0d1624]/60 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-4 flex items-center justify-between text-left text-xs font-bold text-slate-200 hover:text-white transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
                        isOpen ? 'rotate-180 text-sky-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 animate-in fade-in duration-150">
                      {faq.answer}
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
};
