import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { Brain, LoaderCircle, Plus, X, Save, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { AIChatSession } from './../../../../../service/AIModal';

const boldTechNames = (text) => {
  if (!text) return text;
  
  const techKeywords = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB',
    'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'CI/CD', 'REST API',
    'GraphQL', 'TypeScript', 'HTML', 'CSS', 'SASS', 'Redux', 'Express',
    'Django', 'Flask', 'Spring', 'MySQL', 'PostgreSQL', 'Firebase'
  ];
  
  const pattern = new RegExp(`(^|\\s)(${techKeywords.join('|')})(?=\\s|$|[.,;!?])`, 'gi');
  return text.replace(pattern, '$1<strong>$2</strong>');
};

const generateHighlightsPrompt = (type, jobTitle, summary) => {
    return `
    Generate **three ATS-optimized career highlights variations** for a ${jobTitle} based on the provided summary. Focus on quantifiable achievements and ensure each highlight is impactful:

    **Summary Context:**
    ${summary || "No summary provided"}

    **Requirements:**
    1️⃣ **Professional Highlights** (${type} Focus)
    - 3-5 bullet points with measurable results
    - Each highlight should contain at least one metric (% improvement, $ amount, time reduction)
    - Include action verbs (Led, Spearheaded, Optimized, etc.)
    - Focus on ${type.toLowerCase()} aspects
    - Bold all technology names in the generated suggestions

    2️⃣ **Format:**
    [
      {
        "experience_level": "Entry-Level|Mid-Career|Senior",
        "highlights": [
          "Increased X by Y% through Z innovation",
          "Saved $A by implementing B process",
          "Reduced processing time by C% using D technique"
        ],
        "keywords": ["list", "of", "5-7", "industry", "terms"]
      }
    ]

    **Example Senior-Level Output:**
    {
      "experience_level": "Senior",
      "highlights": [
        "Reduced operational costs by $1.2M annually through <strong>AWS</strong> automation",
        "Led 15-member cross-functional team to deliver 45% productivity improvement using <strong>React</strong>",
        "Spearheaded digital transformation increasing customer satisfaction by 30% with <strong>Node.js</strong>"
      ],
      "keywords": ["leadership", "cost reduction", "digital transformation", ...]
    }
    `;
};

function Highlights({ enabledNext }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [highlights, setHighlights] = useState(resumeInfo?.highlights || []);
    const [loading, setLoading] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const params = useParams();
    const [aiGeneratedHighlights, setAiGeneratedHighlights] = useState([]);
    const [loadingType, setLoadingType] = useState(null);
    const [customHighlight, setCustomHighlight] = useState('');
    const [editingHighlight, setEditingHighlight] = useState({
        index: null,
        value: ''
    });

    useEffect(() => {
        if (highlights) {
            setResumeInfo(prev => ({ ...prev, highlights }));
        }
    }, [highlights]);

    useEffect(() => {
        console.log("Received highlights data:", highlights);
      }, [highlights]);

    const generateHighlightsFromAI = async (type) => {
        setLoadingType(type);
        setLoading(true);
        
        try {
            const prompt = generateHighlightsPrompt(
                type, 
                resumeInfo?.jobTitle || 'Professional', 
                resumeInfo?.summery || ''
            );
            
            const result = await AIChatSession.sendMessage(prompt);
            const responseText = await result.response.text();
            
            let parsedData;
            try {
                parsedData = JSON.parse(responseText);
                if (!Array.isArray(parsedData) && parsedData.highlights) {
                    parsedData = [parsedData];
                }
            } catch {
                const jsonMatch = responseText.match(/\[.*\]/s);
                if (jsonMatch) parsedData = JSON.parse(jsonMatch[0]);
            }

            if (parsedData && parsedData.length > 0) {
                setAiGeneratedHighlights(parsedData);
                toast.success(`Generated ${type} highlights!`);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('AI generation error:', error);
            toast.error(`Failed to generate ${type} highlights`);
            setAiGeneratedHighlights([]);
        } finally {
            setLoading(false);
            setLoadingType(null);
        }
    };

    const handleSave = async () => {
        if (highlights.length === 0) {
            toast.warning('Please add at least one highlight');
            return;
        }

        setSaveLoading(true);
        try {
            await GlobalApi.UpdateResumeDetail(params?.resumeId, { 
                highlights
            });
            toast.success('All data saved successfully!');
            enabledNext(true);
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save data');
        } finally {
            setSaveLoading(false);
        }
    };

    const addHighlight = (highlight) => {
        setHighlights(prev => [...prev, highlight]);
        toast.success('Highlight added!');
    };

    const addCustomHighlight = () => {
        if (customHighlight.trim()) {
            addHighlight(customHighlight);
            setCustomHighlight('');
        }
    };

    const removeHighlight = (index) => {
        setHighlights(prev => prev.filter((_, i) => i !== index));
        toast.success('Highlight removed');
    };

    const startEditingHighlight = (index, value) => {
        setEditingHighlight({
            index: index,
            value: value
        });
    };

    const saveEditedHighlight = () => {
        const updated = [...highlights];
        updated[editingHighlight.index] = editingHighlight.value;
        setHighlights(updated);
        setEditingHighlight({
            index: null,
            value: ''
        });
        toast.success('Highlight updated!');
    };

    const cancelEditing = () => {
        setEditingHighlight({
            index: null,
            value: ''
        });
    };

    return (
        <div className='space-y-6'>
            <div className='p-6 bg-white rounded-lg shadow-sm border border-gray-200'>
                <div className='mb-6'>
                    <h2 className='text-2xl font-bold text-gray-800'>Career Highlights</h2>
                    <p className='text-gray-600'>Showcase your top achievements with measurable results</p>
                </div>

                <div className='space-y-4'>
                    <div className='flex flex-wrap gap-3'>
                        {['Professional', 'Technical', 'Leadership'].map((type) => (
                            <Button
                                key={type}
                                variant="outline"
                                onClick={() => generateHighlightsFromAI(type)}
                                disabled={loading}
                                className={`flex items-center gap-2 ${loadingType === type ? 'bg-gray-100' : ''}`}
                            >
                                {loadingType === type ? (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Brain className="h-4 w-4" />
                                )}
                                {type} AI
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Input
                                value={customHighlight}
                                onChange={(e) => setCustomHighlight(e.target.value)}
                                placeholder="Add your own highlight (e.g., 'Increased sales by 30% in Q2 2023')"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={addCustomHighlight}
                                disabled={!customHighlight.trim()}
                            >
                                <Plus className="h-4 w-4 mr-1" /> Add
                            </Button>
                        </div>
                    </div>

                    <div className='flex justify-between mt-4'>
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setHighlights([]);
                                toast.success('All highlights cleared');
                            }}
                            className="text-red-500 hover:text-red-700"
                            disabled={highlights.length === 0}
                        >
                            Clear All
                        </Button>
                        <Button 
                            type="button"
                            onClick={handleSave}
                            disabled={saveLoading || highlights.length === 0}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {saveLoading ? (
                                <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Save className="h-4 w-4 mr-2" />
                            )}
                            Save All Data
                        </Button>
                    </div>
                </div>
            </div>

            {highlights.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold mb-4">Your Highlights</h3>
                    <div className="space-y-2">
                        {highlights.map((highlight, index) => (
                            <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-md">
                                {editingHighlight.index === index ? (
                                    <div className="flex-1 flex flex-col gap-2">
                                        <Textarea
                                            value={editingHighlight.value}
                                            onChange={(e) => setEditingHighlight(prev => ({
                                                ...prev,
                                                value: e.target.value
                                            }))}
                                            className="min-h-[60px]"
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                onClick={saveEditedHighlight}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={cancelEditing}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex-1 text-sm" dangerouslySetInnerHTML={{ __html: boldTechNames(highlight) }} />
                                        <div className="flex gap-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => startEditingHighlight(index, highlight)}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeHighlight(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {aiGeneratedHighlights.length > 0 && (
                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                    <h3 className='text-lg font-semibold mb-4'>AI Suggestions</h3>
                    <div className='space-y-4'>
                        {aiGeneratedHighlights.map((item, index) => (
                            <div key={index} className='p-4 border rounded-lg hover:bg-blue-50 transition-colors'>
                                <div className='flex justify-between items-start mb-3'>
                                    <span className='inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded'>
                                        {item.experience_level}
                                    </span>
                                    {item.keywords && (
                                        <span className='text-xs text-gray-500'>
                                            Keywords: {item.keywords.join(', ')}
                                        </span>
                                    )}
                                </div>
                                
                                <ul className='space-y-2'>
                                    {item.highlights.map((highlight, hIndex) => {
                                        const highlightedText = boldTechNames(highlight);
                                        return (
                                            <li key={hIndex} className="flex items-start">
                                                <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2"></span>
                                                <div className="flex-1 flex justify-between items-start">
                                                    <p 
                                                        className='text-gray-700'
                                                        dangerouslySetInnerHTML={{ __html: highlightedText }}
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => addHighlight(highlight)}
                                                        className="text-green-600 hover:text-green-800"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Highlights;