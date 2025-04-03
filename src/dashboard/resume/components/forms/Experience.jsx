import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState, useRef } from 'react';
import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { LoaderCircle, Plus, Trash2 } from 'lucide-react';

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
    const [validationErrors, setValidationErrors] = useState({});
    const [activeAccordion, setActiveAccordion] = useState(null);
    const isFirstRender = useRef(true);
    const [forceOpenAccordion, setForceOpenAccordion] = useState(null);

    // Initialize with resumeInfo data
    useEffect(() => {
        if (resumeInfo?.Experience?.length > 0) {
            setExperienceList(resumeInfo.Experience.map(exp => ({
                ...exp,
                currentlyWorking: exp.endDate === null
            })));
            setActiveAccordion(0);
        }
    }, [resumeInfo]);

    // Sync local state with context for live preview
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        
        setResumeInfo((prev) => {
            if (!prev) return prev;
            
            // Format data for preview
            const formattedExperience = experienceList.map(exp => ({
                ...exp,
                endDate: exp.currentlyWorking ? null : exp.endDate,
                workSummery: formatAsBulletPoints(exp.workSummery)
            }));
            
            if (JSON.stringify(prev.Experience) !== JSON.stringify(formattedExperience)) {
                return { ...prev, Experience: formattedExperience };
            }
            return prev;
        });
    }, [experienceList, setResumeInfo]);

    const validateExperience = (exp, index) => {
        const errors = {};
        if (!exp.title?.trim()) errors[`title-${index}`] = 'Position title is required';
        if (!exp.companyName?.trim()) errors[`companyName-${index}`] = 'Company name is required';
        if (!exp.startDate) errors[`startDate-${index}`] = 'Start date is required';
        
        if (exp.endDate && !exp.currentlyWorking && new Date(exp.endDate) < new Date(exp.startDate)) {
            errors[`endDate-${index}`] = 'End date must be after start date';
        }
        
        return errors;
    };

    const formatAsBulletPoints = (text) => {
        if (!text) return '';
        if (text.includes('•') || text.includes('<li>')) return text;
        return text.split('\n')
            .filter(line => line.trim())
            .map(line => `• ${line.trim()}`)
            .join('\n');
    };

    const handleChange = (index, event) => {
        const newEntries = [...experienceList];
        const { name, value, type, checked } = event.target;

        newEntries[index][name] = type === "checkbox" ? checked : value;
        
        if (name === 'currentlyWorking' && checked) {
            newEntries[index].endDate = '';
        }

        setExperienceList(newEntries);
        setIsDirty(true);
        
        setValidationErrors(prev => {
            const newErrors = {...prev};
            delete newErrors[`${name}-${index}`];
            return newErrors;
        });

        // Keep the accordion open when editing
        setForceOpenAccordion(index);
    };

    const addNewExperience = () => {
        const newExperience = { ...formField };
        const newIndex = experienceList.length;
        setExperienceList([...experienceList, newExperience]);
        setActiveAccordion(newIndex);
        setForceOpenAccordion(newIndex);
        setIsDirty(true);
    };

    const removeExperience = (index) => {
        if (experienceList.length > 0) {
            const newEntries = [...experienceList];
            newEntries.splice(index, 1);
            setExperienceList(newEntries);
            setIsDirty(true);
            
            setValidationErrors(prev => {
                const newErrors = {...prev};
                Object.keys(newErrors).forEach(key => {
                    if (key.endsWith(`-${index}`)) delete newErrors[key];
                });
                return newErrors;
            });

            if (activeAccordion === index) {
                setActiveAccordion(null);
            } else if (activeAccordion > index) {
                setActiveAccordion(activeAccordion - 1);
            }

            setForceOpenAccordion(null);
        }
    };

    const handleRichTextEditor = (event, name, index) => {
        const newEntries = [...experienceList];
        newEntries[index][name] = event.target.value;
        setExperienceList(newEntries);
        setIsDirty(true);
        setForceOpenAccordion(index);
    };

    const onSave = async () => {
        setLoading(true);
        
        const errors = {};
        experienceList.forEach((exp, index) => {
            const expErrors = validateExperience(exp, index);
            Object.assign(errors, expErrors);
        });
        
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            toast.error('Please fix validation errors before saving');
            setLoading(false);
            return;
        }

        try {
            const experienceData = experienceList.map(exp => ({
                title: exp.title.trim(),
                companyName: exp.companyName.trim(),
                city: exp.city.trim(),
                state: exp.state.trim(),
                startDate: exp.startDate,
                endDate: exp.currentlyWorking ? null : exp.endDate,
                workSummery: formatAsBulletPoints(exp.workSummery)
            }));

            const response = await GlobalApi.UpdateResumeDetail(params?.resumeId, { 
                Experience: experienceData 
            });
    
            const responseData = response?.data || response;
            if (responseData?.Experience) {
                setResumeInfo(prev => ({
                    ...prev,
                    Experience: responseData.Experience
                }));
            }
    
            toast.success("Experience saved successfully!");
            setIsDirty(false);
            setForceOpenAccordion(null);
        } catch (error) {
            console.error("Save error:", error);
            toast.error(error.response?.data?.error?.message || "Failed to save experience");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Professional Experience</h2>
                    <p className="text-gray-600 mt-1">Showcase your work history with ATS-friendly descriptions</p>
                </div>

                <div className="space-y-4">
                    {experienceList.map((item, index) => (
                        <div key={index} className="border rounded-lg overflow-hidden">
                            <button
                                className="w-full p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                                onClick={() => {
                                    if (forceOpenAccordion !== index) {
                                        setActiveAccordion(activeAccordion === index ? null : index);
                                    }
                                }}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium">
                                        {index + 1}
                                    </span>
                                    <div className="text-left">
                                        <h3 className="font-medium text-gray-800">
                                            {item.title || 'Untitled Position'}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {item.companyName || 'Company not specified'}
                                        </p>
                                    </div>
                                </div>
                                <svg
                                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                                        (activeAccordion === index || forceOpenAccordion === index) ? 'rotate-180' : ''
                                    }`}
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

                            {(activeAccordion === index || forceOpenAccordion === index) && (
                                <div className="p-5 space-y-4">
                                    <div className="flex justify-end">
                                        <Button 
                                            variant="ghost" 
                                            size="sm"
                                            onClick={() => removeExperience(index)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Remove Experience
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                                Position Title*
                                            </label>
                                            <Input 
                                                name="title" 
                                                onChange={(event) => handleChange(index, event)} 
                                                value={item.title} 
                                                className={validationErrors[`title-${index}`] ? 'border-red-500' : ''}
                                            />
                                            {validationErrors[`title-${index}`] && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {validationErrors[`title-${index}`]}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                                Company Name*
                                            </label>
                                            <Input 
                                                name="companyName" 
                                                onChange={(event) => handleChange(index, event)} 
                                                value={item.companyName} 
                                                className={validationErrors[`companyName-${index}`] ? 'border-red-500' : ''}
                                            />
                                            {validationErrors[`companyName-${index}`] && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {validationErrors[`companyName-${index}`]}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                                Start Date*
                                            </label>
                                            <Input 
                                                type="date" 
                                                name="startDate" 
                                                onChange={(event) => handleChange(index, event)} 
                                                value={item.startDate} 
                                                className={validationErrors[`startDate-${index}`] ? 'border-red-500' : ''}
                                            />
                                            {validationErrors[`startDate-${index}`] && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {validationErrors[`startDate-${index}`]}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                                End Date
                                            </label>
                                            <Input 
                                                type="date" 
                                                name="endDate" 
                                                onChange={(event) => handleChange(index, event)} 
                                                value={item.endDate} 
                                                disabled={item.currentlyWorking}
                                                className={validationErrors[`endDate-${index}`] ? 'border-red-500' : ''}
                                            />
                                            {validationErrors[`endDate-${index}`] && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {validationErrors[`endDate-${index}`]}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                                City
                                            </label>
                                            <Input 
                                                name="city" 
                                                onChange={(event) => handleChange(index, event)} 
                                                value={item.city} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1 text-gray-700">
                                                State
                                            </label>
                                            <Input 
                                                name="state" 
                                                onChange={(event) => handleChange(index, event)} 
                                                value={item.state} 
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="currentlyWorking"
                                            checked={item.currentlyWorking}
                                            onChange={(event) => handleChange(index, event)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <label className="text-sm font-medium text-gray-700">
                                            I currently work here
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-gray-700">
                                            Job Description & Achievements
                                        </label>
                                        <div className="border rounded-lg p-2">
                                            <RichTextEditor 
                                                index={index} 
                                                value={item.workSummery}
                                                onRichTextEditorChange={(event) => handleRichTextEditor(event, 'workSummery', index)} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
                    <Button 
                        onClick={addNewExperience}
                        variant="outline"
                        className="gap-2 w-full sm:w-auto"
                    >
                        <Plus className="h-4 w-4" />
                        Add New Experience
                    </Button>
                    
                    <Button 
                        onClick={onSave} 
                        disabled={loading || !isDirty}
                        className="w-full sm:w-auto min-w-[120px]"
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