import React, { useRef } from 'react';
import {
  User,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
} from 'lucide-react';
import {
  ApplicationFormData,
  validateGhanaianPhone,
  validateEmail,
} from '../utils/validation';
import { SignaturePad } from './SignaturePad';

interface FormPanelProps {
  data: ApplicationFormData;
  onChange: (data: ApplicationFormData) => void;
  onResetSample: () => void;
}

export const FormPanel: React.FC<FormPanelProps> = ({
  data,
  onChange,
  onResetSample,
}) => {
  const phoneValidation = validateGhanaianPhone(data.phoneNumber);
  const emailValidation = validateEmail(data.emailAddress);

  const handleInputChange = (field: keyof ApplicationFormData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const handleSetTodayDate = () => {
    const today = new Date();
    const formatted = today.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    handleInputChange('date', formatted);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-5 md:p-6 shadow-xl space-y-6">
      {/* Header bar of form */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Applicant Details
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete your information for the Republic Hall Council letter.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetSample}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 hover:text-white bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/80 rounded-lg transition-colors"
          title="Clear all fields and start again"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear Form</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* 1. Lecturer Full Name and Academic Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="full-name-input"
            className="flex items-center justify-between text-xs font-semibold text-slate-200"
          >
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#d4af37]" />
              Lecturer Full Name & Academic Title
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Required</span>
          </label>
          <input
            id="full-name-input"
            type="text"
            value={data.fullNameAndTitle}
            onChange={(e) => handleInputChange('fullNameAndTitle', e.target.value)}
            placeholder="e.g. Dr. John Mensah, Senior Lecturer"
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0b6623] focus:border-[#d4af37] transition-all"
            required
          />
        </div>

        {/* 2. Department */}
        <div className="space-y-1.5">
          <label
            htmlFor="department-input"
            className="flex items-center justify-between text-xs font-semibold text-slate-200"
          >
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-[#d4af37]" />
              College/Faculty/Department/Office/Center (KNUST)
            </span>
            <span className="text-[10px] text-emerald-400 font-medium">Required</span>
          </label>
          <input
            id="department-input"
            type="text"
            value={data.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
            placeholder="e.g. Department of Mechanical Engineering"
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0b6623] focus:border-[#d4af37] transition-all"
            required
          />
        </div>

        {/* Phone & Email Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 3. Phone Number */}
          <div className="space-y-1.5">
            <label
              htmlFor="phone-input"
              className="flex items-center justify-between text-xs font-semibold text-slate-200"
            >
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                Phone Number
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Required</span>
            </label>
            <div className="relative">
              <input
                id="phone-input"
                type="tel"
                value={data.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="e.g. 0240000000"
                className={`w-full bg-slate-800/80 border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0b6623] focus:border-[#d4af37] transition-all ${
                  !phoneValidation.isValid && data.phoneNumber
                    ? 'border-rose-500'
                    : 'border-slate-700'
                }`}
                required
              />
              {phoneValidation.isValid && data.phoneNumber && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3 pointer-events-none" />
              )}
            </div>
            {!phoneValidation.isValid && data.phoneNumber && (
              <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {phoneValidation.message}
              </p>
            )}
          </div>

          {/* 4. Email Address (Required) */}
          <div className="space-y-1.5">
            <label
              htmlFor="email-input"
              className="flex items-center justify-between text-xs font-semibold text-slate-200"
            >
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                Email Address
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Required</span>
            </label>
            <div className="relative">
              <input
                id="email-input"
                type="email"
                value={data.emailAddress}
                onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                placeholder="e.g. jmensah@knust.edu.gh"
                className={`w-full bg-slate-800/80 border rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0b6623] focus:border-[#d4af37] transition-all ${
                  !emailValidation.isValid && data.emailAddress
                    ? 'border-rose-500'
                    : 'border-slate-700'
                }`}
                required
              />
              {emailValidation.isValid && data.emailAddress && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 absolute right-3 top-3 pointer-events-none" />
              )}
            </div>
            {!emailValidation.isValid && data.emailAddress && (
              <p className="text-[11px] text-rose-400 flex items-center gap-1 mt-0.5">
                <AlertCircle className="w-3 h-3" />
                {emailValidation.message}
              </p>
            )}
          </div>
        </div>

        {/* 5. Date */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="date-input"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-200"
            >
              <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
              Application Date
            </label>
            <button
              type="button"
              onClick={handleSetTodayDate}
              className="text-[11px] text-[#d4af37] hover:underline flex items-center gap-1 font-medium"
            >
              <Sparkles className="w-3 h-3" /> Set to Today
            </button>
          </div>
          <input
            id="date-input"
            type="text"
            value={data.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            placeholder="e.g. November 10, 2026"
            className="w-full bg-slate-800/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0b6623] focus:border-[#d4af37] transition-all"
            required
          />
        </div>

        {/* 7. Electronic Signature */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/80 space-y-2">
          <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0b6623]" />
            Applicant Electronic Signature (Draw or Upload)
          </label>
          <SignaturePad
            signatureUrl={data.signatureUrl}
            onSignatureChange={(sig) => handleInputChange('signatureUrl', sig)}
            defaultName={data.fullNameAndTitle}
          />
        </div>
      </div>
    </div>
  );
};
