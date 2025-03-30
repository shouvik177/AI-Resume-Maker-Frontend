import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext } from 'react';
import PersonalDetailPreview from './preview/PersonalDetailPreview';
import SummeryPreview from './preview/SummeryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillsPreview from './preview/SkillsPreview';
import ProjectsPreview from './preview/ProjectsPreview';
import CustomPreview from './preview/CustomPreview';

function ResumePreview() {
    const { resumeInfo } = useContext(ResumeInfoContext);

    // Get all custom sections (excluding predefined sections)
    const customSections = Object.entries(resumeInfo || {})
        .filter(([key, value]) => 
            !['themeColor', 'personalDetail', 'summary', 'Experience', 
              'education', 'skills', 'projects', 'awards'].includes(key) &&
            Array.isArray(value) && 
            value.length > 0
        )
        .map(([key, value]) => ({
            sectionKey: key,
            sectionTitle: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            items: value
        }));

    return (
        <div className='shadow-lg h-full p-14 border-t-[20px] bg-white'
            style={{ borderColor: resumeInfo?.themeColor }}>

            {/* Personal Details (Always shown) */}
            <PersonalDetailPreview resumeInfo={resumeInfo} />

            {/* Summary (Always shown) */}
            <SummeryPreview resumeInfo={resumeInfo} />

            {/* Professional Experience (Conditional) */}
            {resumeInfo?.Experience?.length > 0 && <ExperiencePreview resumeInfo={resumeInfo} />}

            {/* Education (Conditional) */}
            {resumeInfo?.education?.length > 0 && <EducationalPreview resumeInfo={resumeInfo} />}

            {/* Skills (Always shown with live updates) */}
            <section className='my-6'>
                <h2 className='text-center font-bold text-sm mb-2' 
                    style={{ color: resumeInfo?.themeColor }}>
                    SKILLS
                </h2>
                <hr style={{ borderColor: resumeInfo?.themeColor }} />
                <SkillsPreview 
                    skills={resumeInfo?.skills || []} 
                    themeColor={resumeInfo?.themeColor} 
                />
            </section>

            {/* Projects (Conditional) */}
            {resumeInfo?.projects?.length > 0 && <ProjectsPreview resumeInfo={resumeInfo} />}

            {/* Awards (Conditional) */}
            {resumeInfo?.awards?.length > 0 && (
                <CustomPreview 
                    resumeInfo={resumeInfo}
                    sectionKey="awards"
                    sectionTitle="AWARDS"
                />
            )}

            {/* Dynamic Custom Sections */}
            {customSections.map((section) => (
                <CustomPreview
                    key={section.sectionKey}
                    resumeInfo={resumeInfo}
                    sectionKey={section.sectionKey}
                    sectionTitle={section.sectionTitle}
                />
            ))}
        </div>
    );
}

export default ResumePreview;