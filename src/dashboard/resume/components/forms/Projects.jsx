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

const projectPrompt = `
Generate **three project descriptions** for a resume based on the project name: {projectName}.  
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
    const [projects, setProjects] = useState([{ name: '', description: '', startDate: '', endDate: '', isPresent: false }]);
    const [aiLoading, setAiLoading] = useState(false);
    const params = useParams();
    const [aiSuggestions, setAiSuggestions] = useState({});

    useEffect(() => {
        if (resumeInfo.projects) {
            setProjects(resumeInfo.projects);
        }
    }, [resumeInfo.projects]);

    const handleProjectChange = (index, field, value) => {
        const updatedProjects = [...projects];
        updatedProjects[index][field] = value;
        setProjects(updatedProjects);
        setResumeInfo(prevState => ({
            ...prevState,
            projects: updatedProjects
        }));
    };

    const addProject = () => {
        setProjects([...projects, { name: '', description: '', startDate: '', endDate: '', isPresent: false }]);
    };

    const removeProject = (index) => {
        setProjects(projects.filter((_, i) => i !== index));
    };

    /**
     * 🔥 Fetch AI-generated project descriptions
     */
    const generateProjectSuggestions = async (index) => {
        const projectName = projects[index].name.trim();
        if (!projectName) {
            toast.error("Please enter a project name first!");
            return;
        }

        setAiLoading(true);
        const PROMPT = projectPrompt.replace('{projectName}', projectName);

        try {
            const result = await AIChatSession.sendMessage(PROMPT);
            const responseText = await result.response.text();
            console.log("🔍 Raw AI Response:", responseText);

            const parsedData = JSON.parse(responseText);

            if (Array.isArray(parsedData)) {
                setAiSuggestions(prev => ({ ...prev, [index]: parsedData }));
            } else if (parsedData?.projects && Array.isArray(parsedData.projects)) {
                setAiSuggestions(prev => ({ ...prev, [index]: parsedData.projects }));
            } else {
                console.error("❌ Unexpected AI Response:", parsedData);
                toast.error("AI response format is incorrect.");
            }
        } catch (error) {
            console.error("⚠️ AI Processing Error:", error);
            toast.error("AI service is currently unavailable.");
        }

        setAiLoading(false);
    };

    const saveProjects = async () => {
        try {
            await GlobalApi.UpdateResumeDetail(params?.resumeId, { data: { projects } });
            enabledNext(true);
            toast.success("✅ Projects saved successfully!");
        } catch (error) {
            console.error("❌ Error saving projects:", error);
            toast.error("Failed to save projects. Try again.");
        }
    };

    return (
        <div>
            <h1 className='text-2xl font-bold mb-4'>Add Your Projects</h1>
            <p className='text-gray-600 mb-6'>Showcase your work by adding details about your projects.</p>

            {projects.map((project, index) => (
                <div key={index} className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-6 relative'>
                    <h2 className='font-bold text-lg mb-4'>Project {index + 1}</h2>

                    <div className='mb-4'>
                        <label className='block font-semibold mb-2'>Project Name</label>
                        <Input 
                            className="w-full"
                            value={project.name}
                            placeholder="Enter project name..."
                            onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block font-semibold mb-2'>Project Description</label>
                        <div className='flex gap-2'>
                            <Textarea 
                                className="w-full"
                                value={project.description}
                                placeholder="Enter project description..."
                                onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                            />
                            <Button 
                                variant="outline" 
                                onClick={() => generateProjectSuggestions(index)} 
                                className="border-primary text-primary flex gap-2"
                                disabled={aiLoading || !project.name.trim()}
                            > 
                                {aiLoading ? <LoaderCircle className="animate-spin" /> : <Brain className='h-4 w-4' />}
                                {aiLoading ? "Generating..." : "AI"}
                            </Button>
                        </div>
                    </div>

                    {/* 🔥 AI-Generated Suggestions (Now displayed instead of dropdown) */}
                    {aiSuggestions[index] && aiSuggestions[index].length > 0 && (
                        <div className="my-4">
                            <h2 className="font-bold text-lg text-primary">AI Suggestions</h2>
                            {aiSuggestions[index].map((suggestion, i) => (
                                <div key={i} 
                                    onClick={() => handleProjectChange(index, 'description', suggestion.description)}
                                    className="p-4 bg-gray-100 shadow-md rounded-lg cursor-pointer hover:bg-gray-200 transition">
                                    <p>{suggestion.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='grid grid-cols-2 gap-4 mb-4'>
                        <div>
                            <label className='block font-semibold mb-2'>Start Date</label>
                            <Input 
                                type="date"
                                value={project.startDate}
                                onChange={(e) => handleProjectChange(index, 'startDate', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className='block font-semibold mb-2'>End Date</label>
                            <Input 
                                type="date"
                                value={project.endDate}
                                onChange={(e) => handleProjectChange(index, 'endDate', e.target.value)}
                                disabled={project.isPresent}
                            />
                            <div className='mt-2 flex items-center'>
                                <input 
                                    type="checkbox"
                                    checked={project.isPresent}
                                    onChange={(e) => handleProjectChange(index, 'isPresent', e.target.checked)}
                                />
                                <label className='ml-2'>Present</label>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-between'>
                        <Button variant="destructive" onClick={() => removeProject(index)} className="flex gap-2">
                            <Trash className='h-4 w-4' /> Remove
                        </Button>
                        <Button onClick={addProject} className="bg-yellow-200 text-black flex gap-2">
                            <Plus className='h-4 w-4' /> Add Project
                        </Button>
                    </div>
                </div>
            ))}

            <div className='mt-6 flex justify-end'>
                <Button onClick={saveProjects} className="flex gap-2">
                    <Save className='h-4 w-4' />
                    Save All
                </Button>
            </div>
        </div>
    );
}

export default Projects;
