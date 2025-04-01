import React from 'react';

function ExperiencePreview({ resumeInfo, showHeader = true }) {
    if (!resumeInfo?.Experience || resumeInfo.Experience.length === 0) {
        return null;
    }

    const renderWorkSummary = (htmlContent) => {
        if (!htmlContent) return null;
        
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        // Extract text content while preserving line breaks
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        
        // Format as bullet points if not already formatted
        if (!textContent.includes('•')) {
            return textContent.split('\n')
                .filter(line => line.trim())
                .map((line, index) => (
                    <div key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{line.trim()}</span>
                    </div>
                ));
        }

        // If already has bullet points, render as is
        return (
            <div className="whitespace-pre-wrap">
                {textContent}
            </div>
        );
    };

    return (
        <div className='my-6'>
            {showHeader && (
                <>
                    <h2 
                        className='text-center font-bold text-sm mb-2'
                        style={{ color: resumeInfo?.themeColor }}
                    >
                        PROFESSIONAL EXPERIENCE
                    </h2>
                    <hr style={{ borderColor: resumeInfo?.themeColor }} />
                </>
            )}

            {resumeInfo.Experience.map((exp, index) => (
                <div key={index} className='my-5'>
                    <div className='flex justify-between items-baseline'>
                        <h2 
                            className='text-sm font-bold'
                            style={{ color: resumeInfo?.themeColor }}
                        >
                            {exp.title || 'Position Title'}
                        </h2>
                        <span className='text-xs'>
                            {exp.startDate || 'Start Date'} - {exp.currentlyWorking ? 'Present' : (exp.endDate || 'End Date')}
                        </span>
                    </div>
                    
                    <h3 className='text-xs font-semibold'>
                        {exp.companyName || 'Company Name'}
                        {(exp.city || exp.state) && ', '}
                        {exp.city}{exp.city && exp.state && ', '}
                        {exp.state}
                    </h3>
                    
                    {exp.workSummery && (
                        <div className='text-xs mt-2 pl-4 space-y-1'>
                            {renderWorkSummary(exp.workSummery)}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ExperiencePreview;