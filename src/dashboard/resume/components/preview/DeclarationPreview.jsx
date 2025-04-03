import React from 'react';
import { convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';

function DeclarationPreview({ resumeInfo }) {
  if (!resumeInfo?.Declaration) {
    return null;
  }

  const renderDeclaration = () => {
    try {
      // Handle both raw content (from editor) and plain text
      const content = typeof resumeInfo.Declaration === 'string' 
        ? JSON.parse(resumeInfo.Declaration) 
        : resumeInfo.Declaration;
      
      if (!content.blocks || !Array.isArray(content.blocks)) {
        throw new Error('Invalid declaration format');
      }

      const hasContent = content.blocks.some(block => block.text.trim() !== '');
      if (!hasContent) return null;

      const htmlContent = draftToHtml(content);
      const cleanHtml = DOMPurify.sanitize(htmlContent);

      return (
        <div className="mt-4">

          <div 
            className="text-xs italic"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
         
            </div>
         
      );
    } catch (error) {
      console.error("Error rendering declaration:", error);
      return (
        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">Declaration</h3>
          <p className="text-xs italic">
            {typeof resumeInfo.Declaration === 'string' 
              ? resumeInfo.Declaration 
              : 'I hereby declare that the information provided is true to the best of my knowledge.'}
          </p>
        </div>
      );
    }
  };

  return renderDeclaration();
}

export default DeclarationPreview;