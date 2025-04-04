import React, { useState } from 'react';
import PersonalDetail from './forms/PersonalDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, Plus } from 'lucide-react';
import Summery from './forms/Summery';
import Highlights from './forms/Highlights';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';
import Projects from './forms/Projects';
import Achievements from './forms/Achievements';
import Declaration from './forms/Declaration'; // Add this import
import { Link, Navigate, useParams } from 'react-router-dom';
import ThemeColor from './ThemeColor';

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(true);
  const { resumeId } = useParams();

  return (
    <div className='p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen'>
      <div className='flex justify-between items-center mb-8'>
        <div className='flex gap-5'>
          <Link to={"/dashboard"}>
            <Button className='bg-blue-500 hover:bg-blue-600 text-white shadow-lg'>
              <Home />
            </Button>
          </Link>
          <ThemeColor />
        </div>
        <div className='flex gap-2'>
          {activeFormIndex > 1 && (
            <Button
              size="sm"
              className='bg-purple-500 hover:bg-purple-600 text-white shadow-lg'
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
            >
              <ArrowLeft />
            </Button>
          )}
          <Button
            disabled={!enableNext}
            className="flex gap-2 bg-green-500 hover:bg-green-600 text-white shadow-lg"
            size="sm"
            onClick={() => setActiveFormIndex(activeFormIndex + 1)}
          >
            Next
            <ArrowRight />
          </Button>
        </div>
      </div>

      <div className='bg-white p-8 rounded-lg shadow-xl'>
        {activeFormIndex === 1 ? (
          <PersonalDetail enabledNext={(v) => setEnableNext(v)} />
        ) : activeFormIndex === 2 ? (
          <Summery enabledNext={(v) => setEnableNext(v)} />
        ) : activeFormIndex === 3 ? (
          <Highlights enabledNext={(v) => setEnableNext(v)} />
        ) : activeFormIndex === 4 ? (
          <Experience enabledNext={(v) => setEnableNext(v)} />
        ) : activeFormIndex === 5 ? (
          <Education enabledNext={(v) => setEnableNext(v)} />
        ) : activeFormIndex === 6 ? (
          <Skills enabledNext={(v) => setEnableNext(v)} />
        ) : activeFormIndex === 7 ? (
          <Projects enabledNext={(v) => setEnableNext(v)} />
        ) : activeFormIndex === 8 ? (
          <Achievements enabledNext={(v) => setEnableNext(v)} />
        ) : activeFormIndex === 9 ? ( 
          <Declaration enabledNext={(v) => setEnableNext(v)} />
        ) : (
          <Navigate to={`/my-resume/${resumeId}/view`} />
        )}
      </div>
    </div>
  );
}

export default FormSection;