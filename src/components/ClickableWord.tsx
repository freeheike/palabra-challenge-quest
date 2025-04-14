import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useGame } from '@/context/GameContext';
import { AZURE_CONFIG } from '@/constants/game';
import { Volume2 } from 'lucide-react';

interface ClickableWordProps {
  word: string;
  originalWord: string;
}

const ClickableWord: React.FC<ClickableWordProps> = ({ word, originalWord }) => {
  const { collectWord, collectedWords, currentLanguage, getWordTranslation } = useGame();
  const [translation, setTranslation] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Clean the word for lookup (remove punctuation)
  const cleanWord = word.toLowerCase().replace(/[.,;:!?'"()]/g, '');
  
  // Check if this word has already been collected
  const isCollected = collectedWords.some(item => item.word === cleanWord);
  
  // If a translation already exists in the game context, use it
  const existingTranslation = getWordTranslation(cleanWord);
  
  const speakWord = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      setIsPlaying(true);
      
      let wordToSpeak = cleanWord;
      
      // Configure voice settings based on language
      let voiceName = 'es-ES-AlvaroNeural';
      let langCode = 'es-ES';
      
      if (currentLanguage === 'japanese') {
        voiceName = 'ja-JP-NanamiNeural';
        langCode = 'ja-JP';
        
        // Special handling for Japanese particles
        if (wordToSpeak.length === 1) {
          // For single character particles, use their actual form
          if (/[はをにがのへでとも]/.test(originalWord)) {
            wordToSpeak = originalWord;
          }
        } else {
          // For multiple character words, apply replacements if needed
          wordToSpeak = wordToSpeak
            .replace(/wa$|^wa\s|\swa\s/g, " は ")
            .replace(/wo$|^wo\s|\swo\s/g, " を ")
            .replace(/ni$|^ni\s|\sni\s/g, " に ")
            .replace(/ga$|^ga\s|\sga\s/g, " が ")
            .replace(/no$|^no\s|\sno\s/g, " の ")
            .replace(/e$|^e\s|\se\s/g, " へ ")
            .replace(/de$|^de\s|\sde\s/g, " で ")
            .replace(/to$|^to\s|\sto\s/g, " と ")
            .replace(/mo$|^mo\s|\smo\s/g, " も ")
            .replace(/ka$|^ka\s|\ska\s/g, " か ")
            .replace(/yo$|^yo\s|\syo\s/g, " よ ")
            .replace(/ne$|^ne\s|\sne\s/g, " ね ")
            .replace(/na$|^na\s|\sna\s/g, " な ")
            .replace(/kara$|^kara\s|\skara\s/g, " から ")
            .replace(/made$|^made\s|\smade\s/g, " まで ");
        }
      }
      
      const speechSynthesisRequestOptions = {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_CONFIG.apiKey,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
        },
        body: `<speak version='1.0' xml:lang='${langCode}'><voice xml:lang='${langCode}' name='${voiceName}'>${wordToSpeak}</voice></speak>`
      };

      const response = await fetch(AZURE_CONFIG.ttsUrl, speechSynthesisRequestOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };
  
  const handleClick = () => {
    // If we already have a translation (either from collection or pre-loaded), use it
    if (existingTranslation) {
      setTranslation(existingTranslation);
      return;
    }
    
    // Otherwise try to collect the word
    const result = collectWord(word);
    if (result) {
      setTranslation(result);
    }
    
    // Speak the word when it's collected
    speakWord({ stopPropagation: () => {} } as React.MouseEvent);
  };
  
  // If the word has already been collected or has a pre-existing translation, show tooltip
  if ((isCollected || existingTranslation) && (translation || existingTranslation)) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span 
              className="relative cursor-help underline decoration-dotted underline-offset-4 text-spanish-red group"
              onClick={handleClick}
            >
              {originalWord}
              <button 
                className="ml-1 opacity-0 group-hover:opacity-100 absolute -right-5 top-0"
                onClick={speakWord}
                disabled={isPlaying}
              >
                <Volume2 
                  className={`h-3.5 w-3.5 ${isPlaying ? 'text-spanish-gold animate-pulse' : 'text-spanish-red'}`} 
                />
              </button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>{translation || existingTranslation}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  // Otherwise, show clickable word
  return (
    <span 
      className={`relative cursor-pointer hover:text-spanish-gold transition-colors duration-150 ${isCollected ? 'text-spanish-red' : ''} group`} 
      onClick={handleClick}
    >
      {originalWord}
      {isCollected && (
        <button 
          className="ml-1 opacity-0 group-hover:opacity-100 absolute -right-5 top-0"
          onClick={speakWord}
          disabled={isPlaying}
        >
          <Volume2 
            className={`h-3.5 w-3.5 ${isPlaying ? 'text-spanish-gold animate-pulse' : 'text-spanish-red'}`} 
          />
        </button>
      )}
    </span>
  );
};

export default ClickableWord;
