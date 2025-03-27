import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { LoaderCircle, Plus } from 'lucide-react';

const formField = {
    title: '',
    companyName: '',
    city: '',
    state: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    workSummery: '',
};

function Experience() {
    const [experienceList, setExperienceList] = useState([]);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        if (resumeInfo?.Experience?.length > 0) {
            setExperienceList(resumeInfo.Experience);
        }
    }, [resumeInfo]);

    const handleChange = (index, event) => {
        const newEntries = [...experienceList];
        const { name, value, type, checked } = event.target;

        if (type === "checkbox") {
            newEntries[index][name] = checked;
            if (checked) newEntries[index].endDate = "";
        } else {
            newEntries[index][name] = value;
        }

        setExperienceList(newEntries);
        setIsDirty(true);
    };

    const addNewExperience = () => {
        setExperienceList([...experienceList, { ...formField }]);
        setIsDirty(true);
    };

    const removeExperience = () => {
        if (experienceList.length > 0) {
            setExperienceList(experienceList.slice(0, -1));
            setIsDirty(true);
        }
    };

    const handleRichTextEditor = (event, name, index) => {
        const newEntries = [...experienceList];
        newEntries[index][name] = event.target.value;
        setExperienceList(newEntries);
        setIsDirty(true);
    };

    const onSave = async () => {
        if (!isDirty) return;
        
        setLoading(true);
        
        try {
            // Prepare data without the currentlyWorking field
            const data = {
                data: {
                    Experience: experienceList.map(exp => {
                        const cleanExp = {
                            title: exp.title || '',
                            companyName: exp.companyName || '',
                            city: exp.city || '',
                            state: exp.state || '',
                            startDate: exp.startDate || '',
                            endDate: exp.currentlyWorking ? null : exp.endDate || '',
                            workSummery: exp.workSummery || ''
                        };
    
                        // Remove empty optional fields
                        Object.keys(cleanExp).forEach(key => {
                            if (cleanExp[key] === '' || cleanExp[key] === null) {
                                delete cleanExp[key];
                            }
                        });
    
                        return cleanExp;
                    }).filter(exp => exp.title) // Only include entries with a title
                }
            };
    
            console.log("Sending data:", data); // Debug log
    
            const response = await GlobalApi.UpdateResumeDetail(params?.resumeId, data);
            
            if (response?.data) {
                // Update local state with the response data
                setResumeInfo(prev => ({
                    ...prev,
                    Experience: response.data.data?.attributes?.Experience || 
                              experienceList.map(exp => ({
                                  ...exp,
                                  // Re-add currentlyWorking flag based on endDate
                                  currentlyWorking: exp.endDate === null || exp.endDate === ''
                              }))
                }));
                
                toast.success("✅ Experience saved successfully!");
                setIsDirty(false);
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error(error.response?.data?.error?.message || "Failed to save experience.");
        } finally {
            setLoading(false);
        }
    };
    return (
        <div>
            <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
                <h2 className='font-bold text-lg'>Professional Experience</h2>
                <p>Add your work history with ATS-optimized descriptions</p>

                <Button 
                    onClick={addNewExperience} 
                    className="mt-3 mb-5"
                    variant="outline"
                >
                    <Plus size={16} className="mr-2" />
                    Add Experience
                </Button>

                <div>
                    {experienceList.map((item, index) => (
                        <div key={index} className='border p-3 my-5 rounded-lg'>
                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='text-xs'>Position Title*</label>
                                    <Input 
                                        name="title" 
                                        onChange={(event) => handleChange(index, event)} 
                                        value={item.title} 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>Company Name*</label>
                                    <Input 
                                        name="companyName" 
                                        onChange={(event) => handleChange(index, event)} 
                                        value={item.companyName} 
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 my-3">
                                <div>
                                    <label className='text-xs'>Start Date*</label>
                                    <Input 
                                        type="date" 
                                        name="startDate" 
                                        onChange={(event) => handleChange(index, event)} 
                                        value={item.startDate} 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className='text-xs'>End Date</label>
                                    <Input 
                                        type="date" 
                                        name="endDate" 
                                        onChange={(event) => handleChange(index, event)} 
                                        value={item.endDate} 
                                        disabled={item.currentlyWorking} 
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <input
                                    type="checkbox"
                                    name="currentlyWorking"
                                    checked={item.currentlyWorking}
                                    onChange={(event) => handleChange(index, event)}
                                    className="h-4 w-4"
                                />
                                <label className='text-xs'>Currently Working</label>
                            </div>

                            <RichTextEditor 
                                index={index} 
                                value={item.workSummery}
                                onRichTextEditorChange={(event) => handleRichTextEditor(event, 'workSummery', index)} 
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-between mt-4">
                    {experienceList.length > 0 && (
                        <Button 
                            variant="outline" 
                            onClick={removeExperience}
                            className="text-red-500 border-red-500 hover:text-red-600 hover:border-red-600"
                        >
                            Remove Last Experience
                        </Button>
                    )}
                    
                    <Button 
                        onClick={onSave} 
                        disabled={loading || !isDirty}
                        className="min-w-[120px]"
                    >
                        {loading ? (
                            <>
                                <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
                                Saving...
                            </>
                        ) : 'Save Experiences'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Experience;