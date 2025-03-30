import React from 'react';

function CustomPreview({ resumeInfo, sectionKey }) {
  // Get live data from context
  const items = Array.isArray(resumeInfo?.[sectionKey]) 
    ? resumeInfo[sectionKey].filter(item => item?.title?.trim())
    : [];

  const sectionTitle = resumeInfo?.[`${sectionKey}_title`] || 
    sectionKey.replace(/([A-Z])/g, ' $1')
             .replace(/^./, str => str.toUpperCase())
             .replace('custom-section-', '');

  if (items.length === 0) return null;

  const themeColor = resumeInfo?.themeColor || '#3b82f6';

  return (
    <div className='my-6'>
      <h2 className='text-center font-bold text-sm mb-2' style={{ color: themeColor }}>
        {sectionTitle.toUpperCase()}
      </h2>
      <hr style={{ borderColor: themeColor }} />
      
      <div className='space-y-3'>
        {items.map((item, index) => (
          <div key={index} className='mb-3'>
            <h3 className='text-sm font-bold' style={{ color: themeColor }}>
              {item.title || 'Untitled Item'}
            </h3>
            {item.description?.trim() && (
              <p className='text-xs mt-1 text-gray-700'>
                {item.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomPreview;