import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { sanitizeFileName } from './validation';

export interface GeneratePdfOptions {
  element: HTMLElement;
  fullName: string;
  onProgress?: (status: string) => void;
}

/**
 * Captures the A4 sheet at full desktop dimensions (794px width, scale 2)
 * and generates a high-definition A4 PDF.
 */
export async function generateA4Pdf({
  element,
  fullName,
  onProgress,
}: GeneratePdfOptions): Promise<void> {
  onProgress?.('Preparing document for export...');

  // Save previous inline styles
  const prevTransform = element.style.transform;
  const prevTransformOrigin = element.style.transformOrigin;
  const prevBoxShadow = element.style.boxShadow;

  try {
    // Reset transform to 100% full desktop dimensions for capturing
    element.style.transform = 'none';
    element.style.transformOrigin = 'top left';
    element.style.boxShadow = 'none';

    // Brief delay to allow browser layout reflow
    await new Promise((resolve) => setTimeout(resolve, 80));

    onProgress?.('Rendering high-resolution print canvas (Scale 2.0)...');

    const canvas = await html2canvas(element, {
      scale: 2, // Crisp 2x retina print quality
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: 794,
      windowWidth: 1200,
      imageTimeout: 15000,
      onclone: (clonedDoc) => {
        // Remove or sanitize any style tags with oklch to ensure html2canvas parser compatibility
        const styles = clonedDoc.querySelectorAll('style');
        styles.forEach((style) => {
          if (style.textContent && style.textContent.includes('oklch')) {
            style.textContent = style.textContent.replace(/oklch\([^)]+\)/g, '#111827');
          }
        });
      },
    });

    onProgress?.('Assembling official A4 PDF document...');

    const imgData = canvas.toDataURL('image/png', 1.0);

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Center or fit onto A4
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, Math.min(297, pdfHeight), undefined, 'FAST');

    const fileName = sanitizeFileName(fullName);
    pdf.save(fileName);

    onProgress?.('PDF download completed!');
  } finally {
    // Restore original responsive scale styles
    element.style.transform = prevTransform;
    element.style.transformOrigin = prevTransformOrigin;
    element.style.boxShadow = prevBoxShadow;
  }
}
