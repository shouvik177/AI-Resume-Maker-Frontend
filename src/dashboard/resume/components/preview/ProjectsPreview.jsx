import React from 'react';

function ProjectsPreview({ resumeInfo, showHeader = true }) {
    const themeColor = resumeInfo?.themeColor || '#6b7280'; // Default to gray if undefined

    if (!resumeInfo?.projects || resumeInfo.projects.length === 0) {
        return null;
    }

    return (
        <div className="my-6">
            {showHeader && (
                <>
                    <h2 
                        className="text-center font-bold text-sm mb-2" 
                        style={{ color: themeColor }}
                    >
                        PROJECTS
                    </h2>
                    <hr style={{ borderColor: themeColor }} />
                </>
            )}

            {resumeInfo.projects.map((project, index) => (
                <div 
                    key={index} 
                    className="my-5 p-4 border rounded-lg shadow-sm"
                    style={{ borderColor: themeColor }}
                >
                    <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-bold" style={{ color: themeColor }}>
                            {project.name || "Untitled Project"}
                        </h3>
                        <span className="text-xs">
                            {project.startDate || "Start Date"} - {project.isPresent ? "Present" : (project.endDate || "End Date")}
                        </span>
                    </div>

                    {project.description && (
                        <p className="text-xs mt-2 text-gray-700">{project.description}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

export default ProjectsPreview;
