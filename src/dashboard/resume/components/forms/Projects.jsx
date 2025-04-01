import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { Brain, LoaderCircle, Trash, Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { AIChatSession } from './../../../../../service/AIModal';

const projectPrompt = (projectName) => `
Generate **three project descriptions** for a resume based on the project name: ${projectName}.  
Each description should be:  
✔️ Concise (3-4 lines)  
✔️ Industry-relevant with strong action words  
✔️ Highlight key achievements & technologies  
✔️ Formatted in JSON with fields:  
   - "title": Project Name  
   - "description": Well-crafted project summary  
`;

function Projects({ enabledNext }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [projects, setProjects] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const params = useParams();
    const [aiSuggestions, setAiSuggestions] = useState({});

    // Load projects from context when available
    useEffect(() => {
        setProjects(resumeInfo.projects?.length ? resumeInfo.projects : [{ name: '', description: '', startDate: '', endDate: '', isPresent: false }]);
    }, [resumeInfo.projects]);

    const handleProjectChange = (index, field, value) => {
        setProjects((prevProjects) => {
            const updatedProjects = [...prevProjects];
            if (field === 'isPresent') {
                updatedProjects[index].isPresent = value;
                updatedProjects[index].endDate = value ? '' : updatedProjects[index].endDate;
            } else {
                updatedProjects[index][field] = value;
            }
            return updatedProjects;
        });

        setResumeInfo((prevState) => ({
            ...prevState,
            projects,
        }));
    };

    const addProject = () => {
        setProjects((prevProjects) => [
            ...prevProjects,
            { name: '', description: '', startDate: '', endDate: '', isPresent: false },
        ]);
    };

    const removeProject = (index) => {
        setProjects((prevProjects) => prevProjects.filter((_, i) => i !== index));
    };

    const generateProjectSuggestions = async (index) => {
        const projectName = projects[index].name.trim();
        if (!projectName) {
            toast.error('Please enter a project name first!');
            return;
        }

        setAiLoading(true);
        const prompt = projectPrompt(projectName);

        try {
            const result = await AIChatSession.sendMessage(prompt);
            const responseText = await result.response.text();
            console.log('🔍 Raw AI Response:', responseText);

            let parsedData;
            try {
                parsedData = JSON.parse(responseText);
            } catch (err) {
                console.error('❌ JSON Parse Error:', err);
                toast.error('AI response is invalid.');
                setAiLoading(false);
                return;
            }

            if (Array.isArray(parsedData)) {
                setAiSuggestions((prev) => ({ ...prev, [index]: parsedData }));
            } else if (parsedData?.projects && Array.isArray(parsedData.projects)) {
                setAiSuggestions((prev) => ({ ...prev, [index]: parsedData.projects }));
            } else {
                console.error('❌ Unexpected AI Response:', parsedData);
                toast.error('AI response format is incorrect.');
            }
        } catch (error) {
            console.error('⚠️ AI Processing Error:', error);
            toast.error('AI service is currently unavailable.');
        }

        setAiLoading(false);
    };

    const saveProjects = async () => {
        try {
            // Remove the extra { data: ... } wrapper
            const payload = {
                projects: projects.map(project => ({
                    name: project.name || null,
                    description: project.description || null,
                    startDate: project.startDate || null,
                    endDate: project.isPresent ? null : (project.endDate || null),
                    isPresent: project.isPresent || false
                }))
            };
    
            console.log('🔄 Sending request:', JSON.stringify(payload, null, 2));
            console.log('Resume ID:', params?.resumeId);
    
            if (!params?.resumeId) {
                throw new Error('Resume ID is missing.');
            }
    
            const response = await GlobalApi.UpdateResumeDetail(params.resumeId, payload);
            console.log('API Response:', response);
    
            if (typeof enabledNext === 'function') {
                enabledNext(true);
            }
    
            toast.success('✅ Projects saved successfully!');
        } catch (error) {
            console.error('❌ Error saving projects:', error);
            toast.error('Failed to save projects. Try again.');
        }
    };


    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Add Your Projects</h1>
            <p className="text-gray-600 mb-6">Showcase your work by adding details about your projects.</p>

            {projects.map((project, index) => (
                <div key={index} className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-6 relative">
                    <h2 className="font-bold text-lg mb-4">Project {index + 1}</h2>

                    <Input
                        className="w-full mb-4"
                        value={project.name}
                        placeholder="Enter project name..."
                        onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                    />

                    <Textarea
                        className="w-full mb-4"
                        value={project.description}
                        placeholder="Enter project description..."
                        onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                    />

                    <div className="flex gap-4 mb-4">
                        <Input
                            className="w-1/2"
                            value={project.startDate}
                            placeholder="Start Date"
                            type="date"
                            onChange={(e) => handleProjectChange(index, 'startDate', e.target.value)}
                        />
                        <Input
                            className="w-1/2"
                            value={project.endDate}
                            placeholder="End Date"
                            type="date"
                            onChange={(e) => handleProjectChange(index, 'endDate', e.target.value)}
                            disabled={project.isPresent}
                        />
                    </div>

                    <div className="flex gap-4 mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={project.isPresent}
                                onChange={(e) => handleProjectChange(index, 'isPresent', e.target.checked)}
                            />
                            <span className="ml-2">Present</span>
                        </label>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => generateProjectSuggestions(index)}
                        className="border-primary text-primary flex gap-2 mb-4"
                        disabled={aiLoading || !project.name.trim()}
                    >
                        {aiLoading ? <LoaderCircle className="animate-spin" /> : <Brain className="h-4 w-4" />}
                        {aiLoading ? 'Generating...' : 'AI'}
                    </Button>

                    {aiSuggestions[index]?.length > 0 && (
                        <div className="my-4">
                            <h2 className="font-bold text-lg text-primary">AI Suggestions</h2>
                            {aiSuggestions[index].map((suggestion, i) => (
                                <div
                                    key={i}
                                    onClick={() => handleProjectChange(index, 'description', suggestion.description)}
                                    className="p-4 bg-gray-100 shadow-md rounded-lg cursor-pointer hover:bg-gray-200 transition"
                                >
                                    <p>{suggestion.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button variant="destructive" onClick={() => removeProject(index)} className="flex gap-2 mt-4">
                        <Trash className="h-4 w-4" /> Remove
                    </Button>
                </div>
            ))}

            <div className="mt-6 flex justify-between">
                <Button onClick={addProject} className="bg-yellow-200 text-black flex gap-2">
                    <Plus className="h-4 w-4" /> Add Project
                </Button>

                <Button onClick={saveProjects} className="flex gap-2">
                    <Save className="h-4 w-4" />
                    Save All
                </Button>
            </div>
        </div>
    );
}

export default Projects;
