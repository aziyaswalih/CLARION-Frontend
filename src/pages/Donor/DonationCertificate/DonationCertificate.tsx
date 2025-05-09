
// import React from 'react';
import { useRef } from 'react';
import { Button } from '../../../components/ui/button'; // adjust as needed
import { useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface DonationCertificateProps {
  donorName: string;
  requestType: 'financial' | 'organ' | 'blood';
  amount?: number;
  organ?: string;
  bloodGroup?: string;
  date: string;
}

const DonationCertificate = () => {
  const { state } = useLocation();
  const certificateData = (state || {}) as DonationCertificateProps;
  const { donorName, requestType, bloodGroup, organ, amount, date } = certificateData;

  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
      scale: 2, // improve quality
      useCORS: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pageWidth;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    const yOffset = (pageHeight - pdfHeight) / 2;

    pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight);
    pdf.save(`Donation_Certificate_${donorName?.replace(/\s+/g, '_') || 'Donor'}_${new Date(date || '').getFullYear()}.pdf`);
  };

  if (!donorName || !date || !requestType) {
    return (
      <div className="text-center mt-8 text-red-600">
        Loading certificate data... or Data not found. Please ensure you reached this page correctly.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Certificate Content */}
      <div
        ref={certificateRef}
        className="w-full max-w-2xl border-2 border-gray-300 rounded-lg px-8 py-12 shadow-xl bg-white font-serif text-gray-900"
      >
        <div className="text-center mb-24">
          <h1 className="text-5xl font-semibold text-blue-800 mb-4">Certificate of Donation</h1>
        </div>

        <p className="text-xl leading-relaxed mb-8 text-center">
          This is to certify that{' '}
          <span className="font-bold text-blue-900">{donorName}</span> has made a generous{' '}
          <span className={`capitalize font-semibold ${
            requestType === 'financial'
              ? 'text-green-700'
              : requestType === 'organ'
              ? 'text-red-700'
              : 'text-blue-700'
          }`}>
            {requestType} donation
          </span> on{' '}
          <span className="font-semibold text-gray-700">
            {new Date(date).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          .
        </p>

        {requestType === 'financial' && amount !== undefined && (
          <p className="mb-8 text-center text-xl">
            The donated amount is <span className="font-bold text-green-800">₹{amount}</span>.
          </p>
        )}

        {requestType === 'organ' && organ && (
          <p className="mb-8 text-center text-xl">
            The donor has pledged to donate the following organ(s):{' '}
            <span className="font-bold text-red-800">{organ}</span>.
          </p>
        )}

        {requestType === 'blood' && bloodGroup && (
          <p className="mb-8 text-center text-xl">
            The donor has contributed blood of type:{' '}
            <span className="font-bold text-red-800">{bloodGroup}</span>.
          </p>
        )}

        <div className="mt-12 text-right">
          <p className="italic text-lg text-gray-700 mb-1">
            We deeply appreciate your selfless contribution.
          </p>
          <p className="font-semibold text-lg text-gray-800">– Clarion Team</p>
        </div>
      </div>

      <Button
        onClick={downloadPDF}
        className="mt-6 bg-blue-600 text-white hover:bg-blue-700 py-2 px-8 rounded-md shadow-lg text-lg font-medium transition-all duration-300 transform hover:scale-105"
      >
        Download as PDF
      </Button>
    </div>
  );
};

export default DonationCertificate;
