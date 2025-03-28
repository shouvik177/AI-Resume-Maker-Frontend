import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import GlobalApi from './../../../../../service/GlobalApi';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';


function Skills() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initialize with existing skills if available
    useEffect(() => {
        if (resumeInfo?.skills && !isInitialized) {
            setSkills(resumeInfo.skills);
            setIsInitialized(true);
        }
    }, [resumeInfo, isInitialized]);

    // Handle adding a new skill
    const addNewSkill = () => {
        setSkills(prev => [...prev, { name: '', rating: 0, category: '' }]);
    };

    // Handle removing a skill
    const removeSkill = (index) => {
        setSkills(prev => prev.filter((_, i) => i !== index));
    };

    // Handle field changes
    const handleChange = (index, field, value) => {
        const updatedSkills = [...skills];
        updatedSkills[index] = {
            ...updatedSkills[index],
            [field]: value
        };
        
        // Update local state
        setSkills(updatedSkills);
        
        // Immediately update global context for live preview
        setResumeInfo(prev => ({
            ...prev,
            skills: updatedSkills
        }));
    };

    // Initialize with existing skills and force preview visibility
    useEffect(() => {
        if (resumeInfo?.skills) {
            setSkills(resumeInfo.skills);
            setIsInitialized(true);
        } else {
            // Initialize with empty skill if none exists
            setSkills([{ name: '', rating: 0, category: '' }]);
            setResumeInfo(prev => ({
                ...prev,
                skills: [{ name: '', rating: 0, category: '' }]
            }));
        }
    }, []);

    // Save to backend
    const onSave = () => {
        setLoading(true);
        
        // Prepare skills data without IDs
        const cleanSkills = skills.map(({ id, ...rest }) => rest);
        
        // Create the request payload
        const payload = {
          skills: cleanSkills
        };
      
        GlobalApi.UpdateResumeDetail(resumeId, payload)
          .then(() => {
            setLoading(false);
            toast('Skills updated!');
          })
          .catch((err) => {
            console.error("API Error Details:", {
              url: err.config?.url,
              requestData: JSON.parse(err.config?.data),
              response: err.response?.data
            });
            setLoading(false);
            toast('Error updating skills');
          });
      };
      

    // Update context
    useEffect(() => {
        setResumeInfo(prev => ({ ...prev, skills }));
    }, [skills]);

    const skillsByCategory = skills.reduce((acc, skill) => {
        const category = skill.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
    }, {});

    // Add new skill to a specific category
    const addSkillToCategory = (category) => {
        setSkills(prev => [...prev, { 
            name: '', 
            rating: 0, 
            category: category === 'Uncategorized' ? '' : category 
        }]);
    };

    // Add new category
    const addNewCategory = () => {
        if (newCategoryName.trim()) {
            setSkills(prev => [...prev, { 
                name: '', 
                rating: 0, 
                category: newCategoryName 
            }]);
            setNewCategoryName('');
        }
    };

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Skills</h2>
            <p>Add your skills grouped by categories.</p>

            {Object.keys(skillsByCategory).length > 0 ? (
                Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                    <div key={category} className='mb-6 border rounded-lg p-4'>
                        <div className='flex justify-between items-center mb-3'>
                            <Input
                                className='w-full max-w-md font-medium'
                                placeholder='Category Name'
                                value={category === 'Uncategorized' ? '' : category}
                                onChange={(e) => {
                                    // Update category for all skills in this group
                                    const categorySkillsIndices = skills
                                        .map((skill, index) => ({...skill, index}))
                                        .filter(skill => skill.category === (category === 'Uncategorized' ? '' : category))
                                        .map(skill => skill.index);
                                    
                                    categorySkillsIndices.forEach(index => {
                                        handleChange(index, 'category', e.target.value);
                                    });
                                }}
                            />
                            <Button 
                                variant='outline' 
                                size='sm'
                                onClick={() => addSkillToCategory(category)}
                                className='ml-2'
                            >
                                + Add Skill
                            </Button>
                        </div>
                        
                        {categorySkills.map((skill, skillIndex) => {
                            const originalIndex = skills.findIndex(s => 
                                s.name === skill.name && 
                                s.rating === skill.rating && 
                                s.category === (category === 'Uncategorized' ? '' : category)
                            );
                            
                            return (
                                <div key={originalIndex} className='flex items-center gap-3 p-2 border rounded mb-2'>
                                    <Input
                                        className='flex-1'
                                        placeholder='Skill Name'
                                        value={skill.name}
                                        onChange={(e) => handleChange(originalIndex, 'name', e.target.value)}
                                    />
                                    <Rating
                                        style={{ maxWidth: 120 }}
                                        value={skill.rating}
                                        onChange={(v) => handleChange(originalIndex, 'rating', v)}
                                    />
                                    <Button 
                                        variant='outline' 
                                        onClick={() => removeSkill(originalIndex)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                ))
            ) : (
                <p>No skills added yet.</p>
            )}

            <div className='mt-6 p-4 border rounded-lg bg-gray-50'>
                <h3 className='font-medium mb-2'>Add New Category</h3>
                <div className='flex gap-2'>
                    <Input
                        placeholder='Enter new category name'
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Button 
                        variant='outline' 
                        onClick={addNewCategory}
                        disabled={!newCategoryName.trim()}
                    >
                        + Create Category
                    </Button>
                </div>
            </div>

            <div className='flex justify-end mt-4'>
                <Button disabled={loading} onClick={onSave}>
                    {loading ? <LoaderCircle className='animate-spin' /> : 'Save All Skills'}
                </Button>
            </div>
        </div>
    );
}

export default Skills;