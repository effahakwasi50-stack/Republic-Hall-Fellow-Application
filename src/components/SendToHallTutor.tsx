import React, { useState } from 'react';
import { Copy, Check, MessageCircle, Share2 } from 'lucide-react';
import { HALL_TUTOR_PHONE, HALL_TUTOR_WHATSAPP } from '../utils/validation';

interface SendToHallTutorProps {
  /** The most recently downloaded PDF, used for direct file sharing on supported devices. */
  pdf: { blob: Blob; fileName: string } | null;
}

const WHATSAPP_MESSAGE =
  'Hello, please find attached my signed application to become a Fellow of Republic Hall, KNUST.';

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers/contexts without the async clipboard API
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'fixed';
    el.style.opacity = '0';
    document.body.appendChild(el);
    el.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(el);
    return ok;
  }
}

export const SendToHallTutor: React.FC<SendToHallTutorProps> = ({ pdf }) => {
  const [copied, setCopied] = useState(false);

  const pdfFile = pdf ? new File([pdf.blob], pdf.fileName, { type: 'application/pdf' }) : null;
  const canShareFile = Boolean(
    pdfFile && typeof navigator !== 'undefined' && navigator.canShare?.({ files: [pdfFile] })
  );

  const handleCopy = async () => {
    if (await copyText(HALL_TUTOR_PHONE)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappUrl = `https://wa.me/${HALL_TUTOR_WHATSAPP}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  const handleShareFile = async () => {
    if (!pdfFile) return;
    try {
      await navigator.share({ files: [pdfFile], title: pdfFile.name, text: WHATSAPP_MESSAGE });
    } catch {
      // User cancelled the share sheet; nothing to do
    }
  };

  return (
    <div className="rounded-2xl border-2 border-[#d4af37] bg-[#fffbea] p-4 sm:p-5 text-slate-800 shadow-md">
      <div className="flex flex-col gap-4">
        <div className="space-y-2">
          <span className="inline-block rounded-md bg-[#0b6623] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            Step 2: Where to send your downloaded PDF
          </span>
          <p className="text-sm text-slate-700 leading-snug">
            After downloading your signed PDF, send it via WhatsApp to the{' '}
            <span className="font-bold">Hall Tutor</span>:
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Hall Tutor:</span>
            <span className="rounded-lg border border-emerald-200 bg-white px-3 py-1.5 text-xl font-extrabold tracking-wide text-[#0b6623] select-all">
              {HALL_TUTOR_PHONE}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-slate-500" />}
            <span>{copied ? 'Copied!' : 'Copy Number'}</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0b6623] px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#0e7c2c] transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Send to Hall Tutor on WhatsApp</span>
          </a>

          {canShareFile && (
            <button
              type="button"
              onClick={handleShareFile}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#0b6623] bg-white px-4 py-2.5 text-sm font-bold text-[#0b6623] shadow-sm hover:bg-emerald-50 transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>Share PDF File</span>
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-500 leading-snug">
          WhatsApp opens a chat with the Hall Tutor — tap the attachment (📎) icon and select your downloaded PDF.
          {canShareFile && ' On this device you can also use "Share PDF File" and pick WhatsApp.'}
        </p>
      </div>
    </div>
  );
};
