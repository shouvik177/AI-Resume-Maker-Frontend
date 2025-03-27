import React from 'react';

function ExperiencePreview({ resumeInfo }) {
    if (!resumeInfo?.Experience || resumeInfo.Experience.length === 0) {
        return null;
    }

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    return (
        <div className='my-6'>
            <h2 
                className='text-center font-bold text-sm mb-2'
                style={{ color: resumeInfo?.themeColor }}
            >
                PROFESSIONAL EXPERIENCE
            </h2>
            <hr style={{ borderColor: resumeInfo?.themeColor }} />

            {resumeInfo.Experience.map((exp, index) => (
                <div key={index} className='my-5'>
                    <div className='flex justify-between items-baseline'>
                        <h2 
                            className='text-sm font-bold'
                            style={{ color: resumeInfo?.themeColor }}
                        >
                            {exp.title}
                        </h2>
                        <span className='text-xs'>
                            {formatDate(exp.startDate)} - {exp.currentlyWorking ? 'Present' : formatDate(exp.endDate)}
                        </span>
                    </div>
                    
                    <h3 className='text-xs font-semibold'>
                        {exp.companyName}
                        {(exp.city || exp.state) && ', '}
                        {exp.city}{exp.city && exp.state && ', '}
                        {exp.state}
                    </h3>
                    
                    {exp.workSummery && (
                        <ul className='text-xs mt-2 pl-5 list-disc space-y-1'>
                            {exp.workSummery
                                .replace(/<\/?ul>/g, '')
                                .replace(/<\/?ol>/g, '')
                                .split(/<\/?li>/g)
                                .filter(item => item.trim().length > 0)
                                .map((item, i) => (
                                    <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                                ))
                            }
                        </ul>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ExperiencePreview;