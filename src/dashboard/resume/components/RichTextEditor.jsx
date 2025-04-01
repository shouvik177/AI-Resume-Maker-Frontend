import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { BtnBold, BtnBulletList, BtnItalic, Editor, EditorProvider, Separator, Toolbar } from 'react-simple-wysiwyg';
import { AIChatSession } from './../../../../service/AIModal';
import { toast } from 'sonner';

const getIndustrySpecifics = (jobTitle) => {
    const techKeywords = ["Agile", "CI/CD", "DevOps", "SDLC", "cloud architecture", "APIs", "microservices"];
    const managementKeywords = ["KPIs", "ROI", "stakeholder management", "strategic planning", "budget management"];
    const analystKeywords = ["data modeling", "SQL", "Power BI", "predictive analytics", "ETL"];

    if (/developer|engineer|programmer/i.test(jobTitle)) {
        return {
            keywords: [...techKeywords, "code quality", "system design"],
            metrics: ["performance", "throughput", "load time", "system uptime", "bug reduction"]
        };
    } else if (/manager|director|lead/i.test(jobTitle)) {
        return {
            keywords: [...managementKeywords, "team leadership", "process improvement"],
            metrics: ["revenue growth", "cost reduction", "team productivity", "customer satisfaction", "project delivery"]
        };
    } else if (/analyst/i.test(jobTitle)) {
        return {
            keywords: [...analystKeywords, "data visualization", "business intelligence"],
            metrics: ["reporting accuracy", "insight generation", "process efficiency", "decision speed"]
        };
    }
    return {
        keywords: ["project management", "cross-functional collaboration", "process optimization"],
        metrics: ["efficiency gains", "time savings", "quality improvement", "stakeholder satisfaction"]
    };
};

const generateExperiencePrompt = (type, jobTitle, companyName) => {
    const { keywords, metrics } = getIndustrySpecifics(jobTitle);
    
    return `
    Generate three ATS-optimized experience variations for a ${jobTitle} at ${companyName || 'a company'} with these strict requirements:

    ### Response Format Requirements
    1. Return ONLY valid JSON format
    2. No markdown, no additional text
    3. Structure must match exactly:

    {
      "experiences": [
        {
          "experience_level": "Entry-Level",
          "bullets": [
            "Action verb + achievement with [X%] or [$Y] metrics",
            "Second measurable bullet point"
          ],
          "keywords": ["list", "of", "5-7", "terms"]
        },
        {
          "experience_level": "Mid-Career",
          "bullets": ["...", "..."],
          "keywords": ["..."]
        },
        {
          "experience_level": "Senior",
          "bullets": ["...", "..."],
          "keywords": ["..."]
        }
      ]
    }

    ### Content Requirements
    For each experience level, include:

    1️⃣ Entry-Level (0-2 years):
    - 3-4 bullet points
    - 1 quantifiable metric per point
    - Focus: Core skills and early achievements
    - Example: "Reduced report generation time by 30% using Excel macros"

    2️⃣ Mid-Career (3-7 years):
    - 4-5 bullet points
    - 2 quantifiable metrics
    - Focus: Project leadership
    - Example: "Led team of 5 to implement CRM system, increasing sales by 25%"

    3️⃣ Senior-Level (8+ years):
    - 5-6 bullet points
    - 2-3 strategic metrics
    - Focus: Organizational impact
    - Example: "Directed digital transformation saving $1.2M annually"

    ### Required Elements
    - Start each bullet with strong action verbs
    - Include ${metrics.join(', ')} metrics
    - Use these keywords naturally: ${keywords.join(', ')}
    - Keep bullets 15-25 words each
    `;
};

function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
    const [value, setValue] = useState(defaultValue);
    const { resumeInfo } = useContext(ResumeInfoContext);
    const [loadingType, setLoadingType] = useState(null);
    const [aiGeneratedExperiences, setAiGeneratedExperiences] = useState([]);

    const generateExperienceFromAI = async (type) => {
        if (!resumeInfo?.Experience?.[index]?.title) {
            toast.warning('Please add a job title first');
            return;
        }

        setLoadingType(type);
        setAiGeneratedExperiences([]);

        try {
            const jobTitle = resumeInfo.Experience[index].title;
            const companyName = resumeInfo.Experience[index].company;
            const prompt = generateExperiencePrompt(type, jobTitle, companyName);

            const result = await AIChatSession.sendMessage(prompt);
            const responseText = await result.response.text();

            let parsed;
            try {
                parsed = JSON.parse(responseText);
            } catch (e) {
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
                else throw new Error('Response is not valid JSON');
            }

            if (!parsed.experiences || !Array.isArray(parsed.experiences)) {
                throw new Error('Invalid response structure');
            }

            const validatedExperiences = parsed.experiences.map(exp => {
                if (!exp.experience_level || !exp.bullets || !exp.keywords) {
                    throw new Error('Missing required experience fields');
                }
                return {
                    experience_level: exp.experience_level,
                    bullets: exp.bullets.filter(b => typeof b === 'string'),
                    keywords: exp.keywords.filter(k => typeof k === 'string')
                };
            });

            setAiGeneratedExperiences(validatedExperiences);
            toast.success(`Generated ${validatedExperiences.length} experience variations`);
        } catch (error) {
            console.error('Generation error:', error);
            toast.error(`Failed to generate: ${error.message}`);
        } finally {
            setLoadingType(null);
        }
    };

    const applyExperience = (bullets) => {
        const htmlContent = `<ul>${bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
        setValue(htmlContent);
        onRichTextEditorChange({ target: { value: htmlContent } });
        toast.success('Experience applied!');
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
                {["Professional", "Technical", "Leadership"].map(type => (
                    <Button
                        key={type}
                        variant="outline"
                        onClick={() => generateExperienceFromAI(type)}
                        disabled={loadingType === type}
                        className="flex items-center gap-2"
                    >
                        {loadingType === type ? (
                            <>
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Brain className="h-4 w-4" />
                                {type} AI
                            </>
                        )}
                    </Button>
                ))}
            </div>

            <EditorProvider>
                <Editor
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onRichTextEditorChange(e);
                    }}
                    className="border rounded-md p-2 min-h-[150px] bg-white"
                >
                    <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                        <BtnBulletList />
                        <Separator />
                    </Toolbar>
                </Editor>
            </EditorProvider>

            {aiGeneratedExperiences.length > 0 && (
                <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">AI Suggestions</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        {aiGeneratedExperiences.map((exp, i) => (
                            <div
                                key={i}
                                className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => applyExperience(exp.bullets)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        exp.experience_level === 'Entry-Level' ? 'bg-green-100 text-green-800' :
                                        exp.experience_level === 'Mid-Career' ? 'bg-blue-100 text-blue-800' :
                                        'bg-purple-100 text-purple-800'
                                    }`}>
                                        {exp.experience_level}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {exp.bullets.length} bullets
                                    </span>
                                </div>
                                <ul className="space-y-2 mb-3">
                                    {exp.bullets.slice(0, 3).map((bullet, j) => (
                                        <li key={j} className="text-sm text-gray-700 flex">
                                            <span className="text-gray-500 mr-2">•</span>
                                            <span className="line-clamp-2">{bullet}</span>
                                        </li>
                                    ))}
                                    {exp.bullets.length > 3 && (
                                        <li className="text-xs text-gray-500 mt-1">
                                            +{exp.bullets.length - 3} more
                                        </li>
                                    )}
                                </ul>
                                {exp.keywords && (
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <h4 className="text-xs font-medium text-gray-500 mb-2">Key Skills:</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {exp.keywords.slice(0, 5).map((kw, k) => (
                                                <span 
                                                    key={k} 
                                                    className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                                                >
                                                    {kw}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default RichTextEditor;