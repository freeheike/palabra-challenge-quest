import React, { useState } from 'react';

interface JapaneseTextProps {
  japanese: string;
  kana?: string;
  romaji?: string;
  className?: string;
  showKanaToggle?: boolean;
}

const JapaneseText: React.FC<JapaneseTextProps> = ({ 
  japanese, 
  kana = '', 
  romaji = '', 
  className = '',
  showKanaToggle = false 
}) => {
  const [showKana, setShowKana] = useState(false);

  return (
    <div className={`relative group ${className}`}>
      <span className="text-lg">
        {showKanaToggle && showKana ? kana : japanese}
      </span>
      {showKanaToggle && (
        <button
          onClick={() => setShowKana(!showKana)}
          className="ml-2 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          aria-label={showKana ? "显示汉字" : "显示假名"}
        >
          {showKana ? "汉字" : "假名"}
        </button>
      )}
    </div>
  );
};

export default JapaneseText; 