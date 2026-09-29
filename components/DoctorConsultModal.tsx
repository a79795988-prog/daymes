'use client';

import React, { useState } from 'react';
import { X, Stethoscope, Calendar, Clock, Video, User } from 'lucide-react';
import { ApiService } from '@/services/api';

interface DoctorConsultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorConsultModal: React.FC<DoctorConsultModalProps> = ({ isOpen, onClose }) => {
  const [patientName, setPatientName] = useState('');
  const [specialty, setSpecialty] = useState('General Medicine');
  const [date, setDate] = useState('');
  const [consultType, setConsultType] = useState('telehealth');
  const [status, setStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await ApiService.bookDoctor({ patientName, specialty, date, consultType });
    if (res.success) {
      setStatus(`Appointment scheduled! Confirmation ID: ${res.bookingId}`);
      setTimeout(() => {
        setStatus(null);
        onClose();
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl w-full max-w-lg p-6 sm:p-7 space-y-5 text-left my-8 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-950 text-teal-400 border border-teal-800 flex items-center justify-center font-bold flex-shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">Consult a Certified Doctor</h3>
              <p className="text-xs text-slate-400">Book an online teleconsultation or clinic visit</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {status ? (
          <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-2xl text-center text-xs font-bold">
            {status}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Patient Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Patient Name"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Medical Specialty</label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-teal-500"
                >
                  <option>General Medicine</option>
                  <option>Cardiology</option>
                  <option>Endocrinology (Diabetes)</option>
                  <option>Dermatology</option>
                  <option>Pediatrics</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Appointment Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300">Consultation Format</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConsultType('telehealth')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                    consultType === 'telehealth'
                      ? 'bg-teal-500/10 border-teal-500 text-teal-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Video Call (Online)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConsultType('clinic')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                    consultType === 'clinic'
                      ? 'bg-teal-500/10 border-teal-500 text-teal-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Clinic In-Person</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl shadow-lg transition-all"
            >
              Confirm Appointment
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
