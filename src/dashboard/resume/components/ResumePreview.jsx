import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext } from 'react';
import PersonalDetailPreview from './preview/PersonalDetailPreview';
import SummeryPreview from './preview/SummeryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillsPreview from './preview/SkillsPreview';
import ProjectsPreview from './preview/ProjectsPreview'; // Add a new import for ProjectsPreview

function ResumePreview() {

    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    return (
        <div className='shadow-lg h-full p-14 border-t-[20px]'
            style={{
                borderColor: resumeInfo?.themeColor
            }}>
            {/* Personal Detail */}
            <PersonalDetailPreview resumeInfo={resumeInfo} />
            
            {/* Summery */}
            <SummeryPreview resumeInfo={resumeInfo} />
            
            {/* Professional Experience */}
            {resumeInfo?.Experience?.length > 0 && <ExperiencePreview resumeInfo={resumeInfo} />}
            
            {/* Educational */}
            {resumeInfo?.education?.length > 0 && <EducationalPreview resumeInfo={resumeInfo} />}
            
            {/* Skills */}
            {resumeInfo?.skills?.length > 0 && <SkillsPreview resumeInfo={resumeInfo} />}
            
            {/* Projects */}
            {resumeInfo?.projects?.length > 0 && <ProjectsPreview resumeInfo={resumeInfo} />} {/* Add the Projects Preview here */}
        </div>
    );
}

export default ResumePreview;
