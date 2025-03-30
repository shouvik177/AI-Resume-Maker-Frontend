import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { LoaderCircle, Plus, Trash2 } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';

function Custom({ sectionKey, initialTitle = '', enabledNext }) {
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const themeColor = resumeInfo?.themeColor || '#6b7280'; // Default to gray if no theme

  // State management
  const [sectionTitle, setSectionTitle] = useState(initialTitle);
  const [items, setItems] = useState(
    resumeInfo?.[sectionKey]?.filter(item => item?.title?.trim()) || 
    [{ title: '', description: '' }]
  );

  // Live updates with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setResumeInfo(prev => ({
        ...prev,
        [sectionKey]: items,
        [`${sectionKey}_title`]: sectionTitle
      }));
    }, 300);

    return () => clearTimeout(timer);
  }, [items, sectionTitle, sectionKey, setResumeInfo]);

  const onSave = async () => {
    setLoading(true);
    try {
      await GlobalApi.UpdateResumeDetail(params.resumeId, {
        data: {
          ...resumeInfo,
          [sectionKey]: items,
          [`${sectionKey}_title`]: sectionTitle
        }
      });
      toast.success('Changes saved!');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleItemChange = (e, index) => {
    const { name, value } = e.target;
    setItems(prev => prev.map((item, i) => 
      i === index ? { ...item, [name]: value } : item
    ));
  };

  const addNewItem = () => setItems(prev => [...prev, { title: '', description: '' }]);

  const removeItem = (index) => {
    if (items.length <= 1) return toast.info('Keep at least one item');
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div 
      className="p-5 shadow-lg rounded-lg border-t-4 mt-10 bg-white"
      style={{ borderTopColor: themeColor }}
    >
      <div className="mb-6">
        <Input
          value={sectionTitle}
          onChange={(e) => setSectionTitle(e.target.value)}
          className="text-xl font-bold"
          style={{ borderColor: themeColor }}
          placeholder="Section title"
        />
        <p className="text-sm text-gray-600 mt-1">
          {items.filter(i => i.title.trim()).length} items
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="border p-4 rounded-lg bg-gray-50 shadow-sm">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input
                  name="title"
                  value={item.title}
                  onChange={(e) => handleItemChange(e, index)}
                  placeholder="Enter title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea
                  name="description"
                  value={item.description}
                  onChange={(e) => handleItemChange(e, index)}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeItem(index)}
              className="mt-2 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <Button 
          variant="outline"
          onClick={addNewItem}
          style={{ borderColor: themeColor, color: themeColor }}
          className="hover:bg-gray-100"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
        <Button 
          onClick={onSave}
          disabled={loading}
          style={{ backgroundColor: themeColor }}
          className="hover:opacity-90 text-white"
        >
          {loading ? <LoaderCircle className="animate-spin h-4 w-4" /> : 'Save Backup'}
        </Button>
      </div>
    </div>
  );
}

export default Custom;