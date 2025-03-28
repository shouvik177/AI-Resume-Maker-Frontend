import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext } from 'react';
import PersonalDetailPreview from './preview/PersonalDetailPreview';
import SummeryPreview from './preview/SummeryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillsPreview from './preview/SkillsPreview';
import ProjectsPreview from './preview/ProjectsPreview';

function ResumePreview() {
    const { resumeInfo } = useContext(ResumeInfoContext);

    return (
        <div className='shadow-lg h-full p-14 border-t-[20px] bg-white'
            style={{ borderColor: resumeInfo?.themeColor }}>
            
            {/* Personal Details (Always shown) */}
            <PersonalDetailPreview resumeInfo={resumeInfo} />
            
            {/* Summary (Always shown) */}
            <SummeryPreview resumeInfo={resumeInfo} />
            
            {/* Professional Experience (Conditional) */}
            <section className='my-6'>
                <h2 className='text-center font-bold text-sm mb-2' 
                    style={{ color: resumeInfo?.themeColor }}>
                    Professional Experience
                </h2>
                <hr style={{ borderColor: resumeInfo?.themeColor }} />
                {resumeInfo?.Experience?.length > 0 ? (
                    <ExperiencePreview resumeInfo={resumeInfo} />
                ) : (
                    <p className='text-xs text-gray-400 text-center py-2'>
                        Add your work experience
                    </p>
                )}
            </section>
            
            {/* Education (Conditional) */}
            <section className='my-6'>
                <h2 className='text-center font-bold text-sm mb-2' 
                    style={{ color: resumeInfo?.themeColor }}>
                    Education
                </h2>
                <hr style={{ borderColor: resumeInfo?.themeColor }} />
                {resumeInfo?.education?.length > 0 ? (
                    <EducationalPreview resumeInfo={resumeInfo} />
                ) : (
                    <p className='text-xs text-gray-400 text-center py-2'>
                        Add your education details
                    </p>
                )}
            </section>
            
            {/* Skills (Always shown with live updates) */}
            <section className='my-6'>
                <h2 className='text-center font-bold text-sm mb-2' 
                    style={{ color: resumeInfo?.themeColor }}>
                    Skills
                </h2>
                <hr style={{ borderColor: resumeInfo?.themeColor }} />
                <SkillsPreview 
                    skills={resumeInfo?.skills || []} 
                    themeColor={resumeInfo?.themeColor} 
                />
            </section>
            
            {/* Projects (Conditional) */}
            <section className='my-6'>
                <h2 className='text-center font-bold text-sm mb-2' 
                    style={{ color: resumeInfo?.themeColor }}>
                    Projects
                </h2>
                <hr style={{ borderColor: resumeInfo?.themeColor }} />
                {resumeInfo?.projects?.length > 0 ? (
                    <ProjectsPreview resumeInfo={resumeInfo} />
                ) : (
                    <p className='text-xs text-gray-400 text-center py-2'>
                        Add your projects
                    </p>
                )}
            </section>
        </div>
    );
}

export default ResumePreview;