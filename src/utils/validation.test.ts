import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeFileName,
  validateGhanaianPhone,
  validateEmail,
  generateDefaultSignature,
  DEFAULT_FORM_DATA,
} from './validation';

test('sanitizeFileName formats applicant name safely for PDF download', () => {
  const result = sanitizeFileName('Dr. John Mensah, Senior Lecturer');
  assert.equal(result, 'Republic_Hall_Fellow_Application_Dr_John_Mensah_Senior_Lecturer.pdf');
  
  const fallback = sanitizeFileName('');
  assert.equal(fallback, 'Republic_Hall_Fellow_Application_Applicant.pdf');
});

test('validateGhanaianPhone accepts valid Ghanaian phone numbers', () => {
  assert.equal(validateGhanaianPhone('0240000000').isValid, true);
  assert.equal(validateGhanaianPhone('0501234567').isValid, true);
  assert.equal(validateGhanaianPhone('+233240000000').isValid, true);
  assert.equal(validateGhanaianPhone('024 000 0000').isValid, true);
  
  const emptyRes = validateGhanaianPhone('');
  assert.equal(emptyRes.isValid, false);

  const invalidRes = validateGhanaianPhone('abc12');
  assert.equal(invalidRes.isValid, false);
});

test('validateEmail checks standard email syntax or permits optional empty string', () => {
  assert.equal(validateEmail('').isValid, true);
  assert.equal(validateEmail('jmensah@knust.edu.gh').isValid, true);
  assert.equal(validateEmail('invalid-email-address').isValid, false);
});

test('generateDefaultSignature returns valid svg data uri', () => {
  const sig = generateDefaultSignature('Dr. John Mensah');
  assert.ok(sig.startsWith('data:image/svg+xml;utf8,'));
  assert.ok(sig.includes('John%20Mensah'));
});

test('DEFAULT_FORM_DATA has correct official specifications', () => {
  assert.equal(DEFAULT_FORM_DATA.fullNameAndTitle, 'Dr. John Mensah, Senior Lecturer');
  assert.equal(DEFAULT_FORM_DATA.department, 'Department of Mechanical Engineering');
  assert.equal(DEFAULT_FORM_DATA.phoneNumber, '0240000000');
  assert.equal(DEFAULT_FORM_DATA.emailAddress, 'jmensah@knust.edu.gh');
  assert.equal(DEFAULT_FORM_DATA.date, 'November 10, 2026');
});
