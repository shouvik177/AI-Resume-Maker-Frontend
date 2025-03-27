import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { LoaderCircle } from 'lucide-react';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';

function Education() {
  const [loading, setLoading] = useState(false);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const params = useParams();
  const isFirstRender = useRef(true);

  const [educationalList, setEducationalList] = useState(
    resumeInfo?.education || [
      {
        universityName: '',
        degree: '',
        major: '',
        startDate: '',
        endDate: '',
        description: ''
      }
    ]
  );

  // Prevent unnecessary re-renders by checking if data is different before updating state
  useEffect(() => {
    if (resumeInfo?.education && JSON.stringify(resumeInfo.education) !== JSON.stringify(educationalList)) {
      setEducationalList(resumeInfo.education);
    }
  }, [resumeInfo]);

  const handleChange = (event, index) => {
    const { name, value } = event.target;
    setEducationalList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [name]: value } : item))
    );
  };

  const addNewEducation = () => {
    setEducationalList((prev) => [
      ...prev,
      { universityName: '', degree: '', major: '', startDate: '', endDate: '', description: '' }
    ]);
  };

  const removeEducation = (index) => {
    setEducationalList((prev) => prev.filter((_, i) => i !== index));
  };

  const onSave = () => {
    setLoading(true);
    const data = {
      data: {
        education: educationalList.map(({ id, ...rest }) => rest)
      }
    };

    GlobalApi.UpdateResumeDetail(params.resumeId, data)
      .then(() => {
        setLoading(false);
        toast.success('Details updated!');
      })
      .catch(() => {
        setLoading(false);
        toast.error('Server Error, Please try again!');
      });
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setResumeInfo((prev) => {
      if (JSON.stringify(prev.education) !== JSON.stringify(educationalList)) {
        return { ...prev, education: educationalList };
      }
      return prev;
    });
  }, [educationalList, setResumeInfo]);

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg">Education</h2>
      <p>Add Your educational details</p>

      {educationalList.map((item, index) => (
        <div key={index} className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
          <div className="col-span-2">
            <label>University Name</label>
            <Input
              name="universityName"
              value={item.universityName}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label>Degree</label>
            <Input
              name="degree"
              value={item.degree}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label>Major</label>
            <Input
              name="major"
              value={item.major}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label>Start Date</label>
            <Input
              type="date"
              name="startDate"
              value={item.startDate}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div>
            <label>End Date</label>
            <Input
              type="date"
              name="endDate"
              value={item.endDate}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          <div className="col-span-2">
            <label>Description</label>
            <Textarea
              name="description"
              value={item.description}
              onChange={(e) => handleChange(e, index)}
            />
          </div>
          {educationalList.length > 1 && (
            <Button
              variant="outline"
              onClick={() => removeEducation(index)}
              className="text-red-500 mt-2"
            >
              Remove
            </Button>
          )}
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNewEducation} className="text-primary">
            + Add More Education
          </Button>
        </div>
        <Button disabled={loading} onClick={onSave}>
          {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
        </Button>
      </div>
    </div>
  );
}

export default Education;
