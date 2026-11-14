import React, { useRef, useState, useEffect } from 'react';
import { ApplicationFormData, OFFICIAL_LETTER_PARAGRAPHS } from '../utils/validation';

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

  const ph = (value: string, placeholder: string) =>
    value.trim() ? value.trim() : placeholder;

  const fullName = ph(data.fullNameAndTitle, '[Full Name & Academic Title]');
  const unit = ph(data.department, '[College/Faculty/Department/Office/Center]');
  const phone = ph(data.phoneNumber, '[Phone Number]');
  const email = ph(data.emailAddress, '[Email Address]');

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
          className="font-times px-[72px] py-[64px] select-text"
        >
          <div style={{ color: '#000000', fontSize: '16px', lineHeight: 1.85 }}>
            {/* Memo header: Date / To / From */}
            <table style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ width: '100px', verticalAlign: 'top', paddingBottom: '10px' }} className="font-bold">Date:</td>
                  <td style={{ verticalAlign: 'top', paddingBottom: '10px' }}>{ph(data.date, '[Application Date]')}</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top', paddingBottom: '10px' }} className="font-bold">To:</td>
                  <td style={{ verticalAlign: 'top', paddingBottom: '10px' }}>The Hall Warden, Republic Hall</td>
                </tr>
                <tr>
                  <td style={{ verticalAlign: 'top' }} className="font-bold">From:</td>
                  <td style={{ verticalAlign: 'top' }}>
                    <div>{fullName}</div>
                    <div>{unit}, KNUST</div>
                  </td>
                </tr>
              </tbody>
            </table>

            <p style={{ marginTop: '36px' }}>Dear Hall Master/Warden,</p>

            <p
              style={{ marginTop: '24px', textDecoration: 'underline', textUnderlineOffset: '3px' }}
              className="font-bold uppercase"
            >
              APPLICATION TO BECOME A FELLOW OF REPUBLIC HALL, KNUST
            </p>

            {OFFICIAL_LETTER_PARAGRAPHS.map((para, i) => (
              <p key={i} style={{ marginTop: '18px' }}>
                {para}
              </p>
            ))}

            <p style={{ marginTop: '40px' }}>Yours faithfully,</p>

            {/* Signature */}
            <div style={{ marginTop: '12px', minHeight: '60px' }} className="flex items-center">
              {data.signatureUrl ? (
                <img
                  src={data.signatureUrl}
                  alt="Applicant Signature"
                  style={{ height: '60px', maxHeight: '60px' }}
                  className="object-contain object-left block"
                />
              ) : (
                <span style={{ color: '#94a3b8', fontSize: '14px' }} className="italic">
                  [Electronic Signature Pending]
                </span>
              )}
            </div>

            <div style={{ marginTop: '16px', lineHeight: 1.6 }}>
              <p className="font-bold" style={{ fontSize: '17px' }}>{fullName}</p>
              <p>{unit}, KNUST</p>
              <p style={{ color: '#475569' }}>
                Contact: {phone} / {email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
