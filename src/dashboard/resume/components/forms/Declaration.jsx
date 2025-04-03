import { Button } from '@/components/ui/button';
import React, { useContext, useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { LoaderCircle, Plus, Trash2, Wand2 } from 'lucide-react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// Declaration templates array
const DECLARATION_TEMPLATES = [
  "I hereby declare that the information furnished above is true to the best of my knowledge and belief.",
  "I solemnly declare that the particulars provided in this resume are correct to the best of my knowledge and belief.",
  "I declare that all the information contained in this resume is accurate and correct to the best of my knowledge.",
  "This is to certify that all the information provided in this resume is true and authentic to the best of my knowledge.",
  "I affirm that the facts set forth in this resume are accurate and complete to the best of my knowledge.",
  "I hereby certify that the information provided in this document is correct and complete to the best of my knowledge.",
  "I declare that all statements made in this resume are true, complete, and correct to the best of my knowledge and belief.",
  "I attest that the information presented herein is true and correct to the best of my knowledge.",
  "I confirm that the details provided in this resume are accurate and truthful to the best of my knowledge.",
  "I verify that all information contained in this resume is complete and accurate according to my knowledge."
];

export default function Declaration() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [suggestedTemplates, setSuggestedTemplates] = useState([]);

  // Initialize with resumeInfo data
  useEffect(() => {
    if (resumeInfo?.Declaration) {
      try {
        const content = JSON.parse(resumeInfo.Declaration);
        setEditorState(EditorState.createWithContent(convertFromRaw(content)));
      } catch {
        setEditorState(EditorState.createWithContent(
          ContentState.createFromText(resumeInfo.Declaration)
        ));
      }
    }
  }, [resumeInfo]);

  // Generate random templates when component mounts or when user wants to see suggestions
  useEffect(() => {
    if (showTemplates) {
      const shuffled = [...DECLARATION_TEMPLATES].sort(() => 0.5 - Math.random());
      setSuggestedTemplates(shuffled.slice(0, 1)); 
    }
  }, [showTemplates]);

  const updateContextDeclaration = (state) => {
    const content = JSON.stringify(convertToRaw(state.getCurrentContent()));
    setResumeInfo(prev => ({
      ...prev,
      Declaration: content
    }));
  };

  const handleChange = (newEditorState) => {
    setEditorState(newEditorState);
    setIsDirty(true);
    updateContextDeclaration(newEditorState);
  };

  const useTemplate = (template) => {
    const contentState = ContentState.createFromText(template);
    const newState = EditorState.createWithContent(contentState);
    
    // Move selection to the end of the content
    const selectionState = EditorState.moveSelectionToEnd(newState);
    setEditorState(selectionState);
    
    setIsDirty(true);
    updateContextDeclaration(selectionState);
    setShowTemplates(false);
  };

  const onSave = async () => {
    setLoading(true);
    try {
      const response = await GlobalApi.UpdateResumeDetail(params?.resumeId, { 
        Declaration: resumeInfo.Declaration
      });
      toast.success("Declaration saved successfully!");
      setIsDirty(false);
    } catch (error) {
      toast.error("Failed to save declaration");
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Declaration</h2>
          <p className="text-gray-600 mt-1">Add a formal statement to certify your resume's authenticity</p>
        </div>

        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden p-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium">
                1
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-primary hover:text-primary-dark"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                {showTemplates ? 'Hide Templates' : 'Show Templates'}
              </Button>
            </div>

            {showTemplates && (
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-gray-700">Suggested Templates</h4>
                <div className="grid gap-2">
                  {suggestedTemplates.map((template, index) => (
                    <div 
                      key={index} 
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      onClick={() => useTemplate(template)}
                    >
                      <p className="text-sm text-gray-700">{template}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Declaration Statement
              </label>
              <div className="border rounded-lg p-2 bg-white">
                <Editor
                  editorState={editorState}
                  onEditorStateChange={handleChange}
                  toolbar={{
                    options: ['inline', 'list', 'textAlign'],
                    inline: { options: ['bold', 'italic', 'underline'] },
                    list: { options: ['unordered', 'ordered'] }
                  }}
                  editorClassName="min-h-[100px] p-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
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
            ) : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}