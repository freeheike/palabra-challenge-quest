import React from 'react';
import { useGame } from '@/context/GameContext';
import { Languages } from 'lucide-react';

const TranslationItems: React.FC = () => {
  const { translationItemCount } = useGame();
  
  return (
    <div className="flex items-center gap-2">
      <Languages className="h-5 w-5 text-spanish-red" />
      <span className="font-medium">翻译道具: {translationItemCount}</span>
    </div>
  );
};

export default TranslationItems; 