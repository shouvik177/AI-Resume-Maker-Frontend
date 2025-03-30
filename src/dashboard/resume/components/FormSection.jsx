import React, { useState } from 'react';
import PersonalDetail from './forms/PersonalDetail';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Home, Plus } from 'lucide-react';
import Summery from './forms/Summery';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';
import Projects from './forms/Projects';
import Custom from './forms/Custom';
import { Link, Navigate, useParams } from 'react-router-dom';
import ThemeColor from './ThemeColor';

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(true);
  const { resumeId } = useParams();
  const [customSections, setCustomSections] = useState([
    { id: 1, title: 'Custom Section', key: 'custom-section-1' }
  ]);

  const addCustomSection = () => {
    const newId = customSections.length > 0 ? Math.max(...customSections.map(s => s.id)) + 1 : 1;
    setCustomSections([
      ...customSections,
      { 
        id: newId, 
        title: `Section ${newId}`, 
        key: `custom-section-${newId}` 
      }
    ]);
  };

  const updateSectionTitle = (id, newTitle) => {
    setCustomSections(customSections.map(section => 
      section.id === id ? { ...section, title: newTitle } : section
    ));
  };

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
          <Experience />
        ) : activeFormIndex === 4 ? (
          <Education />
        ) : activeFormIndex === 5 ? (
          <Skills />
        ) : activeFormIndex === 6 ? (
          <Projects />
        ) : activeFormIndex === 7 ? (
          <div className="space-y-6">
            {customSections.map((section) => (
              <Custom
                key={section.id}
                sectionKey={section.key}
                sectionTitle={section.title}
                onTitleChange={(newTitle) => updateSectionTitle(section.id, newTitle)}
                enabledNext={setEnableNext}
              />
            ))}
            <Button
              variant="outline"
              className="mt-4 border-dashed border-gray-300 text-gray-500 hover:border-solid hover:border-primary hover:text-primary"
              onClick={addCustomSection}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Section
            </Button>
          </div>
        ) : activeFormIndex === 8 ? (
          <Navigate to={'/my-resume/' + resumeId + "/view"} />
        ) : null}
      </div>
    </div>
  );
}

export default FormSection;