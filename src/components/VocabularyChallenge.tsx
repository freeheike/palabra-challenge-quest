import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { MAX_HEARTS } from '@/constants/game';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const VocabularyChallenge: React.FC = () => {
  const { collectedWords, currentWordIndex, remainingHearts, checkVocabularyAnswer, nextWord } = useGame();
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const currentWord = collectedWords[currentWordIndex]?.word || '';
  const correctTranslation = collectedWords[currentWordIndex]?.translation || '';
  
  // Generate 3 random incorrect options from other collected words
  const generateOptions = () => {
    const correctAnswer = correctTranslation;
    const options = [correctAnswer];
    
    // Copy the translations and filter out the correct one
    const otherTranslations = collectedWords
      .filter((_, idx) => idx !== currentWordIndex)
      .map(word => word.translation);
    
    // If we don't have enough words yet, add some default wrong answers
    const defaultOptions = ['house', 'car', 'dog', 'tree', 'book', 'family', 'food', 'city'];
    
    // Shuffle and pick alternatives
    const alternativePool = [...otherTranslations, ...defaultOptions];
    const shuffled = [...alternativePool].sort(() => 0.5 - Math.random());
    
    // Add unique options until we have 4 total
    for (const option of shuffled) {
      if (options.length < 4 && !options.includes(option)) {
        options.push(option);
      }
      
      if (options.length === 4) break;
    }
    
    // Shuffle the options so the correct answer isn't always first
    return options.sort(() => 0.5 - Math.random());
  };
  
  const options = generateOptions();
  
  const handleOptionSelect = (selectedOption: string) => {
    if (isCorrect !== null) return; // Prevent clicking after an answer is selected
    
    const correct = selectedOption === correctTranslation;
    setIsCorrect(correct);
    checkVocabularyAnswer(selectedOption);
  };
  
  const handleContinue = () => {
    setIsCorrect(null);
    nextWord();
  };
  
  // If we've gone through all words
  if (currentWordIndex >= collectedWords.length) {
    return null;
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Vocabulary Challenge</h2>
        <div className="flex">
          {[...Array(MAX_HEARTS)].map((_, i) => (
            <Heart 
              key={i} 
              className={`h-5 w-5 ${i < remainingHearts ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>
      
      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 mb-2">Translate to English:</p>
        <p className="text-2xl font-bold text-spanish-red">{currentWord}</p>
      </div>
      
      <div className="space-y-4">
        <RadioGroup className="gap-3">
          {options.map((option, idx) => (
            <div 
              key={idx} 
              className={`flex items-center space-x-2 p-3 rounded-md border cursor-pointer ${
                isCorrect !== null && option === correctTranslation 
                  ? 'border-green-500 bg-green-50' 
                  : isCorrect === false && option === correctTranslation
                  ? 'border-green-500 bg-green-50'
                  : isCorrect === false && option !== correctTranslation
                  ? 'border-gray-200 opacity-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <RadioGroupItem value={option} id={`option-${idx}`} checked={isCorrect !== null && option === correctTranslation} />
              <label htmlFor={`option-${idx}`} className="text-lg flex-grow cursor-pointer">
                {option}
              </label>
            </div>
          ))}
        </RadioGroup>
        
        {isCorrect === true && (
          <div className="flex justify-center mt-4">
            <Button 
              onClick={handleContinue}
              className="bg-spanish-red hover:bg-spanish-red/90"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">
            Word {currentWordIndex + 1} of {collectedWords.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VocabularyChallenge;
