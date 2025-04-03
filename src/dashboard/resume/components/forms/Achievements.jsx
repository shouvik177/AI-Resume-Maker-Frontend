import { Button } from '@/components/ui/button';
import React, { useContext, useEffect, useState } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { LoaderCircle, Plus, Trash2 } from 'lucide-react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default function Achievements() {
  const [achievementsList, setAchievementsList] = useState([EditorState.createEmpty()]);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Initialize with resumeInfo data
  useEffect(() => {
    if (resumeInfo?.Achievements?.length > 0) {
      const loadedAchievements = resumeInfo.Achievements.map(achievement => {
        try {
          const content = JSON.parse(achievement);
          return EditorState.createWithContent(convertFromRaw(content));
        } catch {
          return EditorState.createWithContent(
            ContentState.createFromText(achievement)
          );
        }
      });
      setAchievementsList(loadedAchievements);
    }
  }, [resumeInfo]);

  const updateContextAchievements = (editorStates) => {
    const updatedAchievements = editorStates.map(state => 
      JSON.stringify(convertToRaw(state.getCurrentContent()))
    );
    setResumeInfo(prev => ({
      ...prev,
      Achievements: updatedAchievements
    }));
  };

  const handleChange = (index, editorState) => {
    const newEntries = [...achievementsList];
    newEntries[index] = editorState;
    setAchievementsList(newEntries);
    setIsDirty(true);
    updateContextAchievements(newEntries);
  };

  const addNewAchievement = () => {
    const newList = [...achievementsList, EditorState.createEmpty()];
    setAchievementsList(newList);
    setIsDirty(true);
    updateContextAchievements(newList);
  };

  const removeAchievement = (index) => {
    if (achievementsList.length > 1) {
      const newEntries = [...achievementsList];
      newEntries.splice(index, 1);
      setAchievementsList(newEntries);
      setIsDirty(true);
      updateContextAchievements(newEntries);
    }
  };

  const onSave = async () => {
    setLoading(true);
    try {
      const response = await GlobalApi.UpdateResumeDetail(params?.resumeId, { 
        Achievements: resumeInfo.Achievements
      });
      toast.success("Achievements saved successfully!");
      setIsDirty(false);
    } catch (error) {
      toast.error("Failed to save achievements");
      console.error("Save error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Achievements</h2>
          <p className="text-gray-600 mt-1">Highlight your professional accomplishments</p>
        </div>

        <div className="space-y-4">
          {achievementsList.map((item, index) => (
            <div key={index} className="border rounded-lg overflow-hidden p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-sm font-medium">
                  {index + 1}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => removeAchievement(index)}
                  className="text-red-500 hover:text-red-600"
                  disabled={achievementsList.length <= 1}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">
                  Description
                </label>
                <div className="border rounded-lg p-2 bg-white">
                  <Editor
                    editorState={item}
                    onEditorStateChange={(state) => handleChange(index, state)}
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
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
          <Button 
            onClick={addNewAchievement}
            variant="outline"
            className="gap-2 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Add New
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
            ) : 'Save'}
          </Button>
        </div>
      </div>
    </div>
  );
}