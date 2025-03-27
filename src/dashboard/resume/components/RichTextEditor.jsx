import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { BtnBold, BtnBulletList, BtnItalic, Editor, EditorProvider, Separator, Toolbar } from 'react-simple-wysiwyg';
import { AIChatSession } from './../../../../service/AIModal';
import { toast } from 'sonner';

const generateExperiencePrompt = (type, jobTitle, companyName) => {
    // Get industry-specific keywords and metrics
    const { keywords, metrics } = getIndustrySpecifics(jobTitle);
    
    return `
        **Job Title:** ${jobTitle}
        **Company:** ${companyName || '[Company]'}
        **Type:** ${type} experience summary

        Generate a powerful, ATS-optimized professional summary with these requirements:

        ✅ ESSENTIAL COMPONENTS:
        - 5-7 bullet points in HTML <li> format
        - Each point should be 15-25 words
        - Start each with strong action verbs (Led, Engineered, Optimized, etc.)
        - Include 1-2 quantifiable achievements per point using these metric types: ${metrics.join(', ')}
        - Incorporate these keywords naturally: ${keywords.join(', ')}

        ✅ REQUIRED ELEMENTS PER POINT:
        1. Action verb + what you did
        2. Technology/tools used (if applicable)
        3. Business impact with numbers (${metrics.join(', ')})
        4. Problem-Action-Result structure

        ✅ EXAMPLE STRUCTURES:
        <li>Increased [metric] by X% through [action] using [technology], resulting in [business impact]</li>
        <li>Reduced [process time/cost] by X% by implementing [solution], saving $Y annually</li>
        <li>Led team of X to deliver [project] Y days ahead of schedule using [methodology]</li>

        ✅ INDUSTRY-SPECIFIC FOCUS:
        - Technical roles: Highlight ${keywords.filter(k => !k.includes('management')).join(', ')}
        - Leadership roles: Emphasize ${keywords.filter(k => k.includes('management')).join(', ') || 'team leadership'}

        Make the content specific, measurable, and achievement-oriented.
    `;
};

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

function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
    const [value, setValue] = useState(defaultValue);
    const { resumeInfo } = useContext(ResumeInfoContext);
    const [loadingType, setLoadingType] = useState(null);
    const [aiGenerated, setAiGenerated] = useState(!!defaultValue);

    const generateSummaryFromAI = async (type) => {
        if (!resumeInfo?.Experience[index]?.title) {
            toast('Please Add Position Title');
            return;
        }

        setLoadingType(type);
        const jobTitle = resumeInfo.Experience[index].title;
        const prompt = generateExperiencePrompt(type, jobTitle);

        try {
            const result = await AIChatSession.sendMessage(prompt);
            const rawText = await result.response.text();

            const bulletPoints = rawText
                .split('\n')
                .map(item => item.trim())
                .filter(item => item.length > 0)
                .map(item => `<li>${item}</li>`)
                .join('');

            const newValue = `<ul>${bulletPoints}</ul>`;
            setValue(newValue);
            setAiGenerated(true);

            // ✅ Manually trigger onRichTextEditorChange so preview updates immediately
            onRichTextEditorChange({ target: { value: newValue } });

        } catch (error) {
            console.error('AI response error:', error);
            toast.error(`Failed to generate ${type} experience.`);
        }

        setLoadingType(null);
    };

    const handleFormatting = (callback) => {
        if (!aiGenerated) {
            if (!window.confirm("⚠️ You must generate from AI first! Do you want to generate now?")) return;
            generateSummaryFromAI("Professional");
            return;
        }
        callback();
    };

    return (
        <div>
            {/* AI Experience Type Buttons */}
            <div className="flex gap-3 my-3">
                {["Professional", "Technical", "Leadership"].map(type => (
                    <Button key={type} variant="outline"
                        onClick={() => generateSummaryFromAI(type)}
                        disabled={loadingType === type}
                        className="border-primary text-primary flex gap-2">
                        {loadingType === type
                            ? <LoaderCircle className="animate-spin" />
                            : <Brain className='h-4 w-4' />}
                        {loadingType === type ? "Generating..." : type}
                    </Button>
                ))}
            </div>

            {/* Rich Text Editor */}
            <EditorProvider>
                <Editor value={value} onChange={(e) => {
                    setValue(e.target.value);
                    onRichTextEditorChange(e);
                }}>
                    <Toolbar>
                        <BtnBold onClick={() => handleFormatting(() => document.execCommand("bold"))} />
                        <BtnItalic onClick={() => handleFormatting(() => document.execCommand("italic"))} />
                        <BtnBulletList onClick={() => handleFormatting(() => document.execCommand("insertUnorderedList"))} />
                        <Separator />
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </div>
    );
}

export default RichTextEditor;
