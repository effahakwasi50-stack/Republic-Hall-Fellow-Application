export interface ApplicationFormData {
  fullNameAndTitle: string;
  department: string;
  phoneNumber: string;
  emailAddress: string;
  date: string;
  crestUrl: string;
  signatureUrl: string;
}

export const DEFAULT_FORM_DATA: ApplicationFormData = {
  fullNameAndTitle: 'Dr. John Mensah, Senior Lecturer',
  department: 'Department of Mechanical Engineering',
  phoneNumber: '0240000000',
  emailAddress: 'jmensah@knust.edu.gh',
  date: 'November 10, 2026',
  crestUrl: '',
  signatureUrl: '',
};

export const OFFICIAL_LETTER_BODY = `I write to formally express my strong interest in serving as a Hall Fellow for Republic Hall, bringing a deep commitment to student mentorship, academic excellence, and holistic campus development to the Hall’s administration. Having closely supported student life within the university community, I am well-equipped to mediate student concerns, maintain disciplinary standards, and act as a reliable bridge between Hall Management and residents. If given the opportunity, I will collaborate effectively with the Hall Master, Senior Tutor, and student leaders to uphold the proud traditions and unity of Republic Hall, and I look forward to discussing my suitability in an interview.`;

/**
 * Sanitizes an applicant name to create a safe PDF filename.
 */
export function sanitizeFileName(fullName: string): string {
  const trimmed = fullName.trim() || 'Applicant';
  // Strip special characters, collapse multiple underscores/spaces
  const clean = trimmed
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .replace(/[\s-]+/g, '_')
    .slice(0, 45);
  return `Republic_Hall_Fellow_Application_${clean || 'Applicant'}.pdf`;
}

/**
 * Validates a Ghanaian phone number format (accepts 024xxxxxxx, +23324xxxxxxx, 050xxxxxxx, etc.)
 */
export function validateGhanaianPhone(phone: string): { isValid: boolean; message?: string } {
  const cleaned = phone.replace(/[\s-]/g, '');
  if (!cleaned) {
    return { isValid: false, message: 'Phone number is required.' };
  }
  // Standard Ghana phone: 10 digits starting with 0 (e.g. 024, 054, 055, 059, 020, 050, 027, 057, 026)
  // or +233 followed by 9 digits
  const localGhanaRegex = /^0(2[0345678]|5[03456789]|3[0-9])[0-9]{7}$/;
  const intlGhanaRegex = /^\+233(2[0345678]|5[03456789]|3[0-9])[0-9]{7}$/;

  if (localGhanaRegex.test(cleaned) || intlGhanaRegex.test(cleaned)) {
    return { isValid: true };
  }

  // If general numeric phone of 9-13 digits
  if (/^\+?[0-9]{9,15}$/.test(cleaned)) {
    return { isValid: true };
  }

  return { isValid: false, message: 'Please enter a valid phone number (e.g., 0240000000).' };
}

/**
 * Validates email address (optional field in the form).
 */
export function validateEmail(email: string): { isValid: boolean; message?: string } {
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: true }; // optional
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, message: 'Please enter a valid email address.' };
  }
  return { isValid: true };
}

/**
 * Generate a realistic cursive signature SVG data URI from applicant name as default fallback
 */
export function generateDefaultSignature(name: string): string {
  const safeName = name.split(',')[0].replace(/^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.|Engr\.)\s*/i, '').trim() || 'John Mensah';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 80" width="320" height="80">
    <path d="M 20 50 Q 35 20, 50 48 T 80 40 T 110 45 Q 130 15, 145 52 T 180 38 T 215 45 T 250 42 Q 280 25, 295 55" fill="none" stroke="#003366" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M 15 58 Q 60 52, 140 55 T 290 52" fill="none" stroke="#003366" stroke-width="1.8" stroke-linecap="round"/>
    <text x="30" y="44" font-family="'Brush Script MT', 'Dancing Script', 'Caveat', cursive, serif" font-size="34" font-style="italic" fill="#003366" letter-spacing="1.5">${safeName}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
