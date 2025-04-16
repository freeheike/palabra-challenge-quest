import React from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Book, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReadingPassage, spanishReadings, japaneseReadings } from '@/data/readings';

const ReadingSelectionList: React.FC = () => {
  const { startGame, currentLanguage } = useGame();
  
  // Get the appropriate readings based on the current language
  const getReadings = (): ReadingPassage[] => {
    switch (currentLanguage) {
      case 'japanese':
        return japaneseReadings;
      case 'spanish':
      default:
        return spanishReadings;
    }
  };

  const readings = getReadings();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Book className="h-4 w-4" />
          Reading List
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[250px] bg-white">
        {readings.map((passage) => (
          <DropdownMenuItem 
            key={passage.id}
            onClick={() => startGame(passage.id)}
            className="cursor-pointer"
          >
            {passage.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ReadingSelectionList;
