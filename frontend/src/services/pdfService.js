import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Yeh function ek HTML element lega, uska screenshot banayega, aur use ek PDF ke roop mein download karega.
 * @param {HTMLElement} elementToCapture - Woh HTML element jiska PDF banana hai.
 * @param {string} fileName - PDF file ka naam.
 */
export const generatePdfFromElement = async (elementToCapture, fileName) => {
  // Check karein ki element maujood hai ya nahi
  if (!elementToCapture) {
    console.error("Error: Element to capture for PDF was not found.");
    return;
  }

  try {
    // 1. html2canvas ka istemal karke element ka screenshot (canvas) banayein
    const canvas = await html2canvas(elementToCapture, {
      // Scale badhane se PDF ki quality aachi hoti hai
      scale: 2,
      // Page ke background color ka istemal karein
      useCORS: true,
      backgroundColor: window.getComputedStyle(document.body).backgroundColor,
    });

    // 2. Canvas se image ka data URL nikalein
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    // 3. jsPDF se ek naya PDF document banayein
    // 'p' = portrait, 'px' = pixels, [width, height]
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [imgWidth, imgHeight]
    });

    // 4. Image ko PDF mein add karein
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // 5. PDF ko download karein
    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Sorry, there was an error creating the PDF report.");
  }
};