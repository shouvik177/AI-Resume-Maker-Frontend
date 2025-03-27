import Header from '@/components/custom/Header';
import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import ResumePreview from '@/dashboard/resume/components/ResumePreview';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../service/GlobalApi';
import { useReactToPrint } from 'react-to-print';

function ViewResume() {
    const [resumeInfo, setResumeInfo] = useState(null);
    const { resumeId } = useParams();
    const printRef = useRef(null);

    // Fetch Resume Info
    useEffect(() => {
        GetResumeInfo();
    }, []);

    const GetResumeInfo = () => {
        GlobalApi.GetResumeById(resumeId)
            .then((resp) => {
                console.log("Resume Data:", resp.data.data);
                setResumeInfo(resp.data.data);
            })
            .catch((error) => {
                console.error("❌ Error fetching resume:", error);
            });
    };

    // Handle Print/Download
    const HandleDownload = useReactToPrint({
        content: () => printRef.current,
        documentTitle: resumeInfo ? `${resumeInfo.firstName}_Resume` : "Resume",
        removeAfterPrint: true,
        onBeforePrint: () => console.log("📄 Preparing resume for download..."),
        onAfterPrint: () => console.log("✅ Resume downloaded successfully!"),
    });

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
                console.log("✅ Resume shared successfully!");
            } catch (error) {
                console.error("❌ Error sharing resume:", error);
            }
        } else {
            alert("⚠️ Web Share API is not supported on this browser.");
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
                        <Button onClick={HandleDownload} disabled={!resumeInfo}>
                            📥 Download Resume
                        </Button>

                        <Button onClick={handleShare} disabled={!resumeInfo}>
                            🔗 Share Resume
                        </Button>
                    </div>
                </div>
            </div>

            {/* Resume Preview for Printing */}
            <div className="my-10 mx-10 md:mx-20 lg:mx-36">
                {resumeInfo ? (
                    <div ref={printRef} id="print-area">
                        <ResumePreview resumeInfo={resumeInfo} />
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Loading resume...</p>
                )}
            </div>
        </ResumeInfoContext.Provider>
    );
}

export default ViewResume;
