import React from 'react'

function PersonalDetailPreview({resumeInfo}) {
  return (
    <div>
        <h2 className='font-bold text-xl text-center'
            style={{
                color: resumeInfo?.themeColor
            }}>
            {resumeInfo?.firstName} {resumeInfo?.lastName}
        </h2>
        
        <h2 className='text-center text-sm font-medium'>
            {resumeInfo?.jobTitle}
        </h2>
        
        <h2 className='text-center font-normal text-xs'
            style={{
                color: resumeInfo?.themeColor
            }}>
            {resumeInfo?.address}
        </h2>

        <div className='flex justify-between'>
            <h2 className='font-normal text-xs'
                style={{
                    color: resumeInfo?.themeColor
                }}>
                {resumeInfo?.phone}
            </h2>
            <h2 className='font-normal text-xs'
                style={{
                    color: resumeInfo?.themeColor
                }}>
                {resumeInfo?.email}
            </h2>
        </div>

        {/* Display optional links if they exist */}
        {(resumeInfo?.linkedinUrl || resumeInfo?.githubUrl || resumeInfo?.portfolioUrl) && (
            <div className="flex justify-center gap-4 mt-2">
                {resumeInfo?.linkedinUrl && (
                    <a href={resumeInfo.linkedinUrl} target="_blank" rel="noopener noreferrer"
                       className="text-xs underline"
                       style={{ color: resumeInfo?.themeColor }}>
                        LinkedIn
                    </a>
                )}
                {resumeInfo?.githubUrl && (
                    <a href={resumeInfo.githubUrl} target="_blank" rel="noopener noreferrer"
                       className="text-xs underline"
                       style={{ color: resumeInfo?.themeColor }}>
                        GitHub
                    </a>
                )}
                {resumeInfo?.portfolioUrl && (
                    <a href={resumeInfo.portfolioUrl} target="_blank" rel="noopener noreferrer"
                       className="text-xs underline"
                       style={{ color: resumeInfo?.themeColor }}>
                        Portfolio
                    </a>
                )}
            </div>
        )}

        <hr className='border-[1.5px] my-2'
            style={{
                borderColor: resumeInfo?.themeColor
            }}
        />
    </div>
  )
}

export default PersonalDetailPreview