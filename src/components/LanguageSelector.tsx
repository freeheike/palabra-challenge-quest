import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { languageOptions } from '@/types/language';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage } = useGame();
  const [open, setOpen] = useState(false);
  
  const currentLanguageOption = languageOptions.find(lang => lang.id === currentLanguage);
  
  const handleLanguageChange = (languageId: string) => {
    changeLanguage(languageId as 'spanish' | 'japanese');
    setOpen(false);
  };
  
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          {currentLanguageOption?.nativeName || 'Language'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {languageOptions.map((language) => (
          <DropdownMenuItem 
            key={language.id}
            onClick={() => handleLanguageChange(language.id)}
            className={language.id === currentLanguage ? 'bg-accent' : ''}
          >
            {language.nativeName} ({language.name})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
