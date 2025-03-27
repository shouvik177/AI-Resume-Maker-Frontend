import { Input } from '@/components/ui/input'
import React, { useContext, useEffect, useState } from 'react'
import { Rating } from '@smastrom/react-rating'

import '@smastrom/react-rating/style.css'
import { Button } from '@/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { ResumeInfoContext } from '@/context/ResumeInfoContext'
import GlobalApi from './../../../../../service/GlobalApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

function Skills() {
    const { resumeId } = useParams();
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);

    const [skillsList, setSkillsList] = useState([]);  // ✅ Ensure it's always an array
    const [loading, setLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false); // ✅ Prevents flickering

    // ✅ Initialize skillsList once when resumeInfo is available
    useEffect(() => {
        if (resumeInfo?.skills && !isInitialized) {
            setSkillsList(resumeInfo.skills);
            setIsInitialized(true);  // Prevents repeated re-initialization
        }
    }, [resumeInfo, isInitialized]); 

    // ✅ Handle input changes properly
    const handleChange = (index, name, value) => {
        setSkillsList(prevSkills => {
            const newSkills = [...prevSkills];
            newSkills[index] = { ...newSkills[index], [name]: value };
            return newSkills;
        });
    };

    // ✅ Add a new skill field
    const addNewSkill = () => {
        setSkillsList(prevSkills => [...prevSkills, { name: '', rating: 0 }]);
    };

    // ✅ Remove the last skill field
    const removeSkill = () => {
        setSkillsList(prevSkills => prevSkills.slice(0, -1));
    };

    // ✅ Save data to API
    const onSave = () => {
        setLoading(true);
        const data = {
            data: {
                skills: skillsList.map(({ id, ...rest }) => rest)
            }
        };

        GlobalApi.UpdateResumeDetail(resumeId, data)
            .then(resp => {
                console.log(resp);
                setLoading(false);
                toast('Details updated!');
            })
            .catch(error => {
                setLoading(false);
                toast('Server Error, Try again!');
            });
    };

    // ✅ Sync local state with context
    useEffect(() => {
        setResumeInfo(prev => ({
            ...prev,
            skills: skillsList
        }));
    }, [skillsList]);

    return (
        <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
            <h2 className='font-bold text-lg'>Skills</h2>
            <p>Add Your top professional key skills</p>

            {/* ✅ Prevents errors if skillsList is empty */}
            {skillsList.length > 0 ? (
                skillsList.map((item, index) => (
                    <div key={index} className='flex justify-between mb-2 border rounded-lg p-3'>
                        <div>
                            <label className='text-xs'>Name</label>
                            <Input 
                                className="w-full"
                                value={item.name} 
                                onChange={(e) => handleChange(index, 'name', e.target.value)} 
                            />
                        </div>
                        <Rating 
                            style={{ maxWidth: 120 }} 
                            value={item.rating} 
                            onChange={(v) => handleChange(index, 'rating', v)} 
                        />
                    </div>
                ))
            ) : (
                <p>No skills added yet.</p>
            )}

            {/* Buttons for Adding, Removing, and Saving Skills */}
            <div className='flex justify-between mt-4'>
                <div className='flex gap-2'>
                    <Button variant="outline" onClick={addNewSkill} className="text-primary"> + Add More Skill</Button>
                    <Button variant="outline" onClick={removeSkill} className="text-primary"> - Remove</Button>
                </div>
                <Button disabled={loading} onClick={onSave}>
                    {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
                </Button>
            </div>
        </div>
    );
}

export default Skills;
