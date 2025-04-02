import Header from '@/components/custom/Header';
import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../service/GlobalApi';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';

function ViewResume() {
    const [resumeInfo, setResumeInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPrinting, setIsPrinting] = useState(false);
    const { resumeId } = useParams();
    const printRef = useRef(null);

    // Fetch Resume Info
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const resp = await GlobalApi.GetResumeById(resumeId);
                console.log("Resume Data:", resp.data.data);
                console.log("Full Resume API Response:", JSON.stringify(resp.data, null, 2));
                setResumeInfo(resp.data.data);
            } catch (error) {
                console.error("Error fetching resume:", error);
                toast.error("Failed to load resume data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [resumeId]);

    // Enhanced download handler with fallback
   // In ViewResume.js
const handleDownload = async () => {
    if (!printRef.current) {
      toast.error("Resume content not loaded yet");
      return;
    }
  
    try {
      // First try react-to-print
      await new Promise((resolve, reject) => {
        const print = useReactToPrint({
          content: () => printRef.current,
          documentTitle: `${resumeInfo?.firstName || 'My'}_Resume`,
          pageStyle: `
            @page { size: A4; margin: 10mm; }
            @media print {
              body { 
                -webkit-print-color-adjust: exact;
                font-family: Arial, sans-serif;
              }
              #no-print { display: none !important; }
              h2 {
                word-break: break-word;
                white-space: normal;
              }
            }
          `,
          onAfterPrint: resolve,
          onPrintError: reject
        });
        print();
      });
      toast.success("Resume downloaded successfully!");
    } catch (error) {
      console.error("Print failed:", error);
      // Fallback to jsPDF
      try {
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        await doc.html(printRef.current, {
          margin: [10, 10, 10, 10],
          autoPaging: 'text',
          width: 190,
          windowWidth: printRef.current?.clientWidth || 800,
          callback: () => {
            doc.save(`${resumeInfo?.firstName || 'My'}_Resume.pdf`);
            toast.success("Resume downloaded!");
          }
        });
      } catch (fallbackError) {
        console.error("Fallback failed:", fallbackError);
        toast.error("Download failed. Please try again.");
      }
    }
  };

    // Handle Share
    const handleShare = async () => {
        const shareUrl = `${import.meta.env.VITE_BASE_URL}/my-resume/${resumeId}/view`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: resumeInfo ? `${resumeInfo.firstName} ${resumeInfo.lastName}'s Resume` : "My Resume",
                    text: "Hello Everyone, check out my resume!",
                    url: shareUrl,
                });
            } catch (error) {
                console.error("Error sharing resume:", error);
            }
        } else {
            // Fallback for browsers without Web Share API
            navigator.clipboard.writeText(shareUrl).then(() => {
                toast.success("Link copied to clipboard!");
            }).catch(() => {
                toast.info("Please copy this link: " + shareUrl);
            });
        }
    };

    return (
        <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
            <div id="no-print">
                <Header />
                <div className="my-10 mx-10 md:mx-20 lg:mx-36">
                    <h2 className="text-center text-2xl font-medium">
                        🎉 Congrats! Your AI-generated Resume is Ready! 🚀
                    </h2>
                    <p className="text-center text-gray-400">
                        Download your resume and share your unique resume URL with friends and family!
                    </p>

                    <div className="flex justify-between px-44 my-10">
                        <Button 
                            onClick={handleDownload} 
                            disabled={!resumeInfo || isLoading || isPrinting}
                        >
                            {isPrinting ? 'Preparing...' : '📥 Download Resume'}
                        </Button>

                        <Button 
                            onClick={handleShare} 
                            disabled={!resumeInfo || isLoading}
                        >
                            🔗 Share Resume
                        </Button>
                    </div>
                </div>
            </div>

            {/* Resume Preview for Printing */}
            <div className="my-10 mx-10 md:mx-20 lg:mx-36">
                {isLoading ? (
                    <p className="text-center text-gray-500">Loading resume...</p>
                ) : resumeInfo ? (
                    <div ref={printRef} id="print-area">
                        <ResumePreview resumeInfo={resumeInfo} />
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Failed to load resume</p>
                )}
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default ViewResume;