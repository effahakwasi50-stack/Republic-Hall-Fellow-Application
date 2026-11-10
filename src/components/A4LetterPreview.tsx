import React, { useRef, useState, useEffect } from 'react';
import { ApplicationFormData, OFFICIAL_LETTER_BODY } from '../utils/validation';
import { CrestEmblem } from './CrestEmblem';

interface A4LetterPreviewProps {
  data: ApplicationFormData;
  sheetRef: React.RefObject<HTMLDivElement | null>;
  zoomLevel?: number; // optional manual override
}

export const A4LetterPreview: React.FC<A4LetterPreviewProps> = ({
  data,
  sheetRef,
  zoomLevel,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [autoScale, setAutoScale] = useState<number>(1);

  // Responsive auto-scaler: scales the 794px A4 sheet to fit available container width
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const availableWidth = containerRef.current.clientWidth - 24; // padding allowance
      if (availableWidth < 794) {
        const calculated = Math.max(0.35, Math.min(1, availableWidth / 794));
        setAutoScale(calculated);
      } else {
        setAutoScale(1);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const effectiveScale = zoomLevel ?? autoScale;
  const a4Width = 794;
  const a4Height = 1123; // Standard A4 aspect ratio height at 96 DPI

  const contactLine = [data.phoneNumber, data.emailAddress]
    .filter(Boolean)
    .join(' / ');

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center items-start overflow-hidden py-4"
    >
      {/* Outer sizing box that takes the scaled height so surrounding layout flows correctly */}
      <div
        style={{
          width: `${a4Width * effectiveScale}px`,
          height: `${a4Height * effectiveScale}px`,
          position: 'relative',
        }}
        className="transition-all duration-200"
      >
        {/* The Actual A4 Sheet - Always 794px fixed desktop width */}
        <div
          ref={sheetRef}
          id="a4-letter-sheet"
          style={{
            width: `${a4Width}px`,
            minHeight: `${a4Height}px`,
            transform: `scale(${effectiveScale})`,
            transformOrigin: 'top left',
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            color: '#111827',
          }}
          className="font-times p-[65px] flex flex-col justify-between select-text"
        >
          {/* Top Section */}
          <div className="space-y-6">
            {/* Centered Header */}
            <div className="text-center space-y-2">
              {/* Hall Crest Image (75px tall) */}
              <div className="flex justify-center mb-2">
                <CrestEmblem customImage={data.crestUrl} size={75} />
              </div>

              {/* University Title */}
              <h1
                style={{ color: '#0f172a' }}
                className="text-[17px] font-bold tracking-wider uppercase font-times leading-snug"
              >
                KWAME NKRUMAH UNIVERSITY OF SCIENCE AND TECHNOLOGY
              </h1>

              {/* Office of Hall Council */}
              <h2
                style={{ color: '#0b6623' }}
                className="text-[14px] font-bold tracking-widest uppercase font-times"
              >
                OFFICE OF THE HALL COUNCIL — REPUBLIC HALL
              </h2>

              {/* Green & Gold horizontal divider line */}
              <div className="pt-2">
                <div style={{ backgroundColor: '#0b6623' }} className="h-[3px] w-full rounded-sm" />
                <div style={{ backgroundColor: '#d4af37' }} className="h-[2px] w-full mt-[2px] rounded-sm" />
              </div>
            </div>

            {/* Metadata (Left-aligned, standard Times New Roman spacing) */}
            <div
              style={{ color: '#111827' }}
              className="text-[14.5px] leading-relaxed pt-2 space-y-1.5 text-left font-times"
            >
              <div>
                <span className="font-bold">Date:</span> {data.date || 'November 10, 2026'}
              </div>
              <div>
                <span className="font-bold">To:</span> The Chairman, Hall Council, Republic Hall, KNUST, Kumasi
              </div>
              <div>
                <span className="font-bold">From:</span> {data.fullNameAndTitle || 'Dr. John Mensah, Senior Lecturer'}, {data.department || 'Department of Mechanical Engineering'}
              </div>
              <div className="pt-2">
                <span
                  style={{ borderBottomColor: '#111827' }}
                  className="font-bold uppercase tracking-wide border-b pb-0.5 inline-block"
                >
                  Subject: APPLICATION FOR APPOINTMENT AS HALL FELLOW
                </span>
              </div>
            </div>

            {/* Body Paragraph (Left-aligned text, standard word spacing) */}
            <div className="pt-4 text-left">
              <p
                style={{ color: '#111827' }}
                className="text-[15px] leading-[1.8] font-times text-left"
              >
                {OFFICIAL_LETTER_BODY}
              </p>
            </div>
          </div>

          {/* Bottom Section: Sign-off */}
          <div className="pt-8 text-left space-y-2">
            <p style={{ color: '#111827' }} className="text-[15px] font-times">
              Yours faithfully,
            </p>

            {/* Rendered Signature Image (60px tall) */}
            <div className="py-1">
              {data.signatureUrl ? (
                <img
                  src={data.signatureUrl}
                  alt="Applicant Signature"
                  style={{ height: '60px', maxHeight: '60px' }}
                  className="object-contain object-left block"
                />
              ) : (
                <div
                  style={{ height: '60px', color: '#94a3b8' }}
                  className="flex items-center italic text-sm"
                >
                  [Signature will appear here]
                </div>
              )}
            </div>

            {/* Full Name and Department Details */}
            <div
              style={{ color: '#111827' }}
              className="text-[14.5px] leading-snug space-y-0.5 font-times text-left"
            >
              <p className="font-bold">{data.fullNameAndTitle || 'Dr. John Mensah, Senior Lecturer'}</p>
              <p>{data.department || 'Department of Mechanical Engineering'}, KNUST</p>
              {contactLine && (
                <p style={{ color: '#334155' }}>
                  <span className="font-semibold">Contact:</span> {contactLine}
                </p>
              )}
            </div>

            {/* Official Footer Hallmark / Hall Motto Watermark */}
            <div
              style={{ borderTopColor: '#e2e8f0', color: '#64748b' }}
              className="pt-8 border-t flex justify-between items-center text-[10px] font-sans uppercase tracking-widest"
            >
              <span style={{ color: '#0b6623' }} className="font-bold">Republic Hall • KNUST</span>
              <span>Official Fellow Appointment Portal</span>
              <span style={{ color: '#d4af37' }} className="font-semibold">Set The Pace</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
