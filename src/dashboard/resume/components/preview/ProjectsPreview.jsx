import React from 'react';

function ProjectsPreview({ resumeInfo }) {
    return (
        <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Projects</h2>
            {resumeInfo.projects.map((project, index) => (
                <div key={index} className="mb-4 p-4 border rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold">{project.name}</h3>
                    <p className="text-gray-700">{project.description}</p>
                    <p className="text-sm text-gray-500">From: {project.startDate} to {project.isPresent ? "Present" : project.endDate}</p>
                </div>
            ))}
        </div>
    );
}

export default ProjectsPreview;
