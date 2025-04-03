import React from 'react';

function HighlightsPreview({ resumeInfo }) {
  if (!resumeInfo?.highlights?.length) return null;

  return (
    <section className='my-6'>
      <div className="text-xs space-y-1">
        {resumeInfo.highlights.map((highlight, index) => (
          <div key={index} className="flex items-start">
            <span className="inline-block w-1.5 h-1.5 bg-gray-600 rounded-full mt-1.5 mr-2"></span>
            <div 
              className="highlight-content"
              dangerouslySetInnerHTML={{ 
                __html: highlight
                  .replace(/<strong>/g, '<strong style="font-weight:600;">')
                  .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight:600;">$1</strong>')
              }} 
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default HighlightsPreview;