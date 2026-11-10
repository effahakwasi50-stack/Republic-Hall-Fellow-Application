/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  FileDown,
  Printer,
  Sparkles,
  Eye,
  Edit3,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle,
  HelpCircle,
  Award,
  Building2,
  Clock,
  Download,
} from 'lucide-react';
import {
  ApplicationFormData,
  DEFAULT_FORM_DATA,
  generateDefaultSignature,
} from './utils/validation';
import { FormPanel } from './components/FormPanel';
import { A4LetterPreview } from './components/A4LetterPreview';
import { CrestEmblem } from './components/CrestEmblem';
import { generateA4Pdf } from './utils/pdfGenerator';

export default function App() {
  // Initialize with official default sample inputs
  const [formData, setFormData] = useState<ApplicationFormData>(() => ({
    ...DEFAULT_FORM_DATA,
    // Initialize with a clean signature sample for John Mensah so the preview is ready immediately
    signatureUrl: generateDefaultSignature(DEFAULT_FORM_DATA.fullNameAndTitle),
  }));

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfStatus, setPdfStatus] = useState<string>('');
  const [manualZoom, setManualZoom] = useState<number | undefined>(undefined);
  const [activeMobileView, setActiveMobileView] = useState<'both' | 'form' | 'preview'>('both');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Auto-hide toast after 4s
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  const handleResetSample = () => {
    setFormData({
      ...DEFAULT_FORM_DATA,
      signatureUrl: generateDefaultSignature(DEFAULT_FORM_DATA.fullNameAndTitle),
    });
    setSuccessToast('Sample academic inputs restored successfully.');
  };

  const handleDownloadPdf = async () => {
    if (!sheetRef.current) return;
    setIsGeneratingPdf(true);
    setPdfStatus('Initiating PDF export...');

    try {
      await generateA4Pdf({
        element: sheetRef.current,
        fullName: formData.fullNameAndTitle,
        onProgress: (status) => setPdfStatus(status),
      });
      setSuccessToast('Official PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF Generation failed:', err);
      alert('Could not generate PDF. Please try using "Print / Save as PDF" instead.');
    } finally {
      setIsGeneratingPdf(false);
      setPdfStatus('');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleZoomIn = () => {
    setManualZoom((prev) => Math.min(1.4, (prev || 0.85) + 0.1));
  };

  const handleZoomOut = () => {
    setManualZoom((prev) => Math.max(0.4, (prev || 0.85) - 0.1));
  };

  const handleResetZoom = () => {
    setManualZoom(undefined); // returns to responsive auto-fit
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans selection:bg-[#d4af37] selection:text-black">
      {/* Top Banner / Navbar */}
      <header className="no-print sticky top-0 z-40 bg-[#0b6623] border-b-2 border-[#d4af37] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Left brand details */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center shrink-0">
                <CrestEmblem customImage={formData.crestUrl} size={40} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-white tracking-wide font-times leading-tight">
                    REPUBLIC HALL
                  </h1>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded bg-[#d4af37] text-slate-950 font-bold uppercase tracking-wider">
                    KNUST
                  </span>
                </div>
                <p className="text-xs text-yellow-100 font-medium tracking-wide hidden sm:block">
                  Office of the Hall Council • Fellow Appointment Portal
                </p>
              </div>
            </div>

            {/* Right Action buttons */}
            <div className="flex items-center gap-2.5">
              {/* Mobile View Toggle (Visible only on small screens) */}
              <div className="flex lg:hidden bg-slate-900/60 p-0.5 rounded-lg border border-emerald-800">
                <button
                  type="button"
                  onClick={() => setActiveMobileView('form')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded ${
                    activeMobileView === 'form'
                      ? 'bg-[#d4af37] text-slate-950'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Form</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMobileView('preview')}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded ${
                    activeMobileView === 'preview'
                      ? 'bg-[#d4af37] text-slate-950'
                      : 'text-slate-200 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
              </div>

              {/* Print / Save as PDF Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg text-emerald-100 hover:text-white bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 transition-all shadow-sm"
                title="Use browser native print dialog with A4 page styles"
              >
                <Printer className="w-4 h-4 text-[#d4af37]" />
                <span>Print / Save</span>
              </button>

              {/* Prominent Download Official PDF Button */}
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className={`inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg shadow-md transition-all ${
                  isGeneratingPdf
                    ? 'bg-amber-600/80 text-white cursor-wait'
                    : 'bg-[#d4af37] hover:bg-[#e6c34e] text-slate-950 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {isGeneratingPdf ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Generating Crisp A4...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-4 h-4 text-slate-950" />
                    <span>Download Official PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sub-header Information Strip */}
      <div className="no-print bg-slate-950/80 border-b border-slate-800/80 py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#d4af37] font-medium">
              <Award className="w-3.5 h-3.5" />
              Motto: "Set The Pace"
            </span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:inline">Kwame Nkrumah University of Science and Technology, Kumasi</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              Official A4 Academic Format
            </span>
            <span>•</span>
            <span className="text-slate-300">Times New Roman 12pt Standard</span>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {successToast && (
        <div className="no-print fixed bottom-6 right-6 z-50 bg-[#0b6623] text-white px-4 py-3 rounded-xl shadow-2xl border-2 border-[#d4af37] flex items-center gap-2.5 animate-bounce text-sm font-medium">
          <CheckCircle className="w-5 h-5 text-[#d4af37]" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Left Panel: Form Inputs */}
          <section
            className={`no-print lg:col-span-5 space-y-4 ${
              activeMobileView === 'preview' ? 'hidden lg:block' : 'block'
            }`}
          >
            <FormPanel
              data={formData}
              onChange={setFormData}
              onResetSample={handleResetSample}
            />

            {/* Quick Actions Card */}
            <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileDown className="w-4 h-4 text-[#d4af37]" />
                Export & Print Options
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                The downloaded document produces a clean, high-resolution A4 sheet (794px × 1123px at 2x scale) compliant with Hall Council submission protocols.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#0b6623] hover:bg-[#0e7c2c] text-white text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                  <span>Print Sheet</span>
                </button>
              </div>
            </div>
          </section>

          {/* Right Panel: Live A4 Paper Preview */}
          <section
            className={`lg:col-span-7 flex flex-col items-center ${
              activeMobileView === 'form' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Preview Toolbar */}
            <div className="no-print w-full flex items-center justify-between bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 mb-4 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-200 tracking-wide uppercase font-times">
                  Live A4 Paper Preview
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  (Official Hall Council Memorandum)
                </span>
              </div>

              {/* Zoom & Fit controls */}
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  className="p-1 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="px-2 py-0.5 text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  title="Auto fit to screen"
                >
                  Fit
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  className="p-1 hover:bg-slate-700 text-slate-300 hover:text-white rounded transition-colors"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* A4 Sheet Container */}
            <div className="w-full flex justify-center bg-slate-950/60 rounded-2xl border border-slate-800/80 p-2 sm:p-4 shadow-2xl overflow-hidden min-h-[500px]">
              <A4LetterPreview
                data={formData}
                sheetRef={sheetRef}
                zoomLevel={manualZoom}
              />
            </div>

            {/* Mobile Helper switch notice */}
            <div className="no-print lg:hidden w-full mt-3 text-center">
              <button
                type="button"
                onClick={() => setActiveMobileView('form')}
                className="text-xs text-[#d4af37] underline font-medium"
              >
                ← Back to Edit Application Form
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print mt-12 border-t border-slate-800/80 bg-slate-950/90 py-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-medium text-slate-400">
          Kwame Nkrumah University of Science and Technology • Republic Hall
        </p>
        <p className="text-[11px] text-slate-500">
          Hall Fellows Appointment Application Portal • All processing occurs entirely in-browser
        </p>
      </footer>
    </div>
  );
}
