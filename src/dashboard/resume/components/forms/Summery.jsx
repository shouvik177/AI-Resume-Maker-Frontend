import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AIChatSession } from './../../../../../service/AIModal';

const generatePrompt = (type, jobTitle) => {
    return `
    Generate **three ATS-optimized ${type} summary variations** for a ${jobTitle} with quantifiable achievements:

    1️⃣ **Entry-Level (0-2 years experience)**
    - Include: 2-3 measurable outcomes (e.g., "Improved process efficiency by 25%")
    - Focus: Core skills and academic/training achievements
    - Metrics: % improvements, $ savings, time reductions
    - Keywords: 5-7 ${jobTitle}-specific terms

    2️⃣ **Mid-Career (3-7 years experience)**
    - Include: 3-4 quantifiable results (e.g., "Increased sales by 40% in Q3 2023")
    - Focus: Project impacts and measurable contributions
    - Metrics: Revenue growth, cost savings, productivity gains
    - Keywords: 5-7 ${jobTitle}-specific terms

    3️⃣ **Senior-Level (8+ years experience)**
    - Include: 4-5 strategic metrics (e.g., "Reduced operational costs by $1.2M annually")
    - Focus: Leadership impact and organizational KPIs
    - Metrics: Budgets managed, team sizes, strategic outcomes
    - Keywords: 5-7 ${jobTitle}-specific terms

    Required JSON format:
    {
      "summaries": [
        {
          "experience_level": "Entry-Level|Mid-Career|Senior",
          "summary": "Achievement-focused text with [X%] and [$Y] metrics",
          "keywords": ["list", "of", "5-7", "industry", "terms"]
        }
      ]
    }

    Example Senior-Level:
    "Results-driven ${jobTitle} with 10+ years reducing costs by 30% while improving quality. 
    Led cross-functional teams of 15+ to deliver $2M+ annual savings. 
    Spearheaded digital transformation increasing productivity by 45%."
    `;
};

function Summery({ enabledNext }) {
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [summery, setSummery] = useState(resumeInfo?.summery || '');
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);
    const [loadingType, setLoadingType] = useState(null);

    useEffect(() => {
        if (summery) {
            setResumeInfo(prev => ({ ...prev, summery }));
        }
    }, [summery]);

    const generateSummaryFromAI = async (type) => {
        setLoadingType(type);
        setLoading(true);
        
        try {
            const prompt = generatePrompt(type, resumeInfo?.jobTitle || 'Professional');
            const result = await AIChatSession.sendMessage(prompt);
            const responseText = await result.response.text();
            
            // Improved parsing with fallbacks
            let parsedData;
            try {
                parsedData = JSON.parse(responseText);
                if (!parsedData.summaries && Array.isArray(parsedData)) {
                    parsedData = { summaries: parsedData };
                }
            } catch {
                // Try extracting JSON from markdown response
                const jsonMatch = responseText.match(/{.*}/s);
                if (jsonMatch) parsedData = JSON.parse(jsonMatch[0]);
            }

            if (parsedData?.summaries) {
                setAiGenerateSummeryList(parsedData.summaries);
                toast.success(`Generated ${type} summaries!`);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.error('AI generation error:', error);
            toast.error(`Failed to generate ${type} summaries`);
            setAiGenerateSummeryList([]);
        } finally {
            setLoading(false);
            setLoadingType(null);
        }
    };

    const onSave = async (e) => {
        e.preventDefault();
        if (!summery.trim()) {
            toast.warning('Please add a summary');
            return;
        }

        setLoading(true);
        try {
            await GlobalApi.UpdateResumeDetail(params?.resumeId, { 
                data: { summery } 
            });
            enabledNext(true);
            toast.success('Summary saved!');
        } catch (error) {
            console.error('Save error:', error);
            toast.error('Failed to save summary');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='space-y-6'>
            <div className='p-6 bg-white rounded-lg shadow-sm border border-gray-200'>
                <div className='mb-6'>
                    <h2 className='text-2xl font-bold text-gray-800'>Professional Summary</h2>
                    <p className='text-gray-600'>Create an ATS-friendly summary highlighting your achievements</p>
                </div>

                <form onSubmit={onSave} className='space-y-4'>
                    <div className='flex flex-wrap gap-3'>
                        {['Professional', 'Technical', 'Leadership'].map((type) => (
                            <Button
                                key={type}
                                variant="outline"
                                onClick={() => generateSummaryFromAI(type)}
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

                    <Textarea
                        value={summery}
                        onChange={(e) => setSummery(e.target.value)}
                        placeholder="E.g.: 'Software engineer with 5+ years experience, reduced system latency by 40% and increased throughput by 2.5x...'"
                        className='min-h-[150px]'
                        required
                    />

                    <div className='flex justify-end'>
                        <Button type="submit" disabled={loading}>
                            {loading ? <LoaderCircle className="animate-spin mr-2" /> : null}
                            Save Summary
                        </Button>
                    </div>
                </form>
            </div>

            {aiGeneratedSummeryList.length > 0 && (
                <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
                    <h3 className='text-lg font-semibold mb-4'>AI Suggestions</h3>
                    <div className='space-y-4'>
                        {aiGeneratedSummeryList.map((item, index) => (
                            <div 
                                key={index}
                                onClick={() => setSummery(item.summary)}
                                className='p-4 border rounded-lg hover:bg-blue-50 cursor-pointer transition-colors'
                            >
                                <div className='flex justify-between items-start'>
                                    <span className='inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded'>
                                        {item.experience_level}
                                    </span>
                                    {item.keywords && (
                                        <span className='text-xs text-gray-500'>
                                            Keywords: {item.keywords.join(', ')}
                                        </span>
                                    )}
                                </div>
                                <p className='mt-2 text-gray-700'>{item.summary}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Summery;