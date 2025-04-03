import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext } from 'react';
import PersonalDetailPreview from './preview/PersonalDetailPreview';
import SummeryPreview from './preview/SummeryPreview';
import HighlightsPreview from './preview/HighlightsPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillsPreview from './preview/SkillsPreview';
import ProjectsPreview from './preview/ProjectsPreview';
import AchievementsPreview from './preview/AchievementsPreview';
import DeclarationPreview from './preview/DeclarationPreview'; // Add this import

function ResumePreview() {
    const { resumeInfo } = useContext(ResumeInfoContext);

    // Get all custom sections (excluding predefined sections)
    const customSections = Object.entries(resumeInfo || {})
        .filter(([key, value]) => 
            !['themeColor', 'personalDetail', 'summary', 'Experience', 
              'education', 'skills', 'projects', 'awards', 'highlights', 'Achievements', 'Declaration'].includes(key) && // Added Declaration to exclude
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

            {/* Highlights (Conditional) */}
            {resumeInfo?.highlights?.length > 0 && (
                <section className='my-6'>
                    <h2 className='text-center font-bold text-sm mb-2' 
                        style={{ color: resumeInfo?.themeColor }}>
                        HIGHLIGHTS
                    </h2>
                    <hr style={{ borderColor: resumeInfo?.themeColor }} />
                    <HighlightsPreview resumeInfo={resumeInfo} />
                </section>
            )}

            {/* Professional Experience (Conditional) */}
            {resumeInfo?.Experience?.length > 0 && (
                <ExperiencePreview 
                    resumeInfo={resumeInfo} 
                    hideHeader={true}
                />
            )}

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

            {/* Achievements (Conditional) - Added after Projects */}
            {resumeInfo?.Achievements?.filter(a => a.trim()).length > 0 && (
                <section className='my-6'>
                    <h2 className='text-center font-bold text-sm mb-2' 
                        style={{ color: resumeInfo?.themeColor }}>
                        ACHIEVEMENTS
                    </h2>
                    <hr style={{ borderColor: resumeInfo?.themeColor }} />
                    <AchievementsPreview resumeInfo={resumeInfo} />
                </section>
            )}

            {/* Declaration (Conditional) - Added after Achievements */}
            {resumeInfo?.Declaration && (
                <section className='my-6'>
                    <h2 className='text-center font-bold text-sm mb-2' 
                        style={{ color: resumeInfo?.themeColor }}>
                        DECLARATION
                    </h2>
                    <hr style={{ borderColor: resumeInfo?.themeColor }} />
                    <DeclarationPreview resumeInfo={resumeInfo} />
                </section>
            )}

            {/* Awards (Conditional) */}
            {resumeInfo?.awards?.length > 0 && (
                <CustomPreview 
                    resumeInfo={resumeInfo}
                    sectionKey="awards"
                    sectionTitle="AWARDS"
                />
            )}

            {/* Custom Sections */}
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