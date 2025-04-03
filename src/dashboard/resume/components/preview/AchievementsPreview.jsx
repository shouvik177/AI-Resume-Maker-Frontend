import React from 'react';
import { convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';

function AchievementsPreview({ resumeInfo }) {
  if (!resumeInfo?.Achievements || !Array.isArray(resumeInfo.Achievements) || 
      resumeInfo.Achievements.length === 0) {
    return null;
  }

  const renderAchievement = (achievement, index) => {
    try {
      const content = typeof achievement === 'string' ? JSON.parse(achievement) : achievement;
      
      if (!content.blocks || !Array.isArray(content.blocks)) {
        throw new Error('Invalid achievement format');
      }

      const hasContent = content.blocks.some(block => block.text.trim() !== '');
      if (!hasContent) return null;

      const htmlContent = draftToHtml(content);
      const cleanHtml = DOMPurify.sanitize(htmlContent);

      return (
        <li 
          key={index}
          className="text-xs my-1 list-disc ml-4"
          dangerouslySetInnerHTML={{ __html: cleanHtml }}
        />
      );
    } catch (error) {
      console.error("Error rendering achievement:", error);
      return (
        <li key={index} className="text-xs my-1 list-disc ml-4">
          {typeof achievement === 'string' ? achievement : 'Achievement content'}
        </li>
      );
    }
  };

  return (
    <div className='my-6'>

      <ul className='my-3'>
        {resumeInfo.Achievements
          .map((achievement, index) => renderAchievement(achievement, index))
          .filter(Boolean)}
      </ul>
    </div>
  );
}

export default AchievementsPreview;