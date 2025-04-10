
import React from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { MAX_HEARTS } from '@/constants/game';
import { Heart } from 'lucide-react';

const ComprehensionQuestion: React.FC = () => {
  const { 
    currentPassage, 
    selectedAnswer, 
    isAnswerCorrect, 
    isGameComplete,
    remainingHearts,
    selectAnswer, 
    nextPassage,
    currentWordIndex,
    collectedWords
  } = useGame();
  
  if (!currentPassage) {
    return null;
  }

  // Only show comprehension question after vocabulary challenge is complete
  if (currentWordIndex < collectedWords.length) {
    return null;
  }
  
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-spanish-text">
          Comprehension Question:
        </h3>
        <div className="flex">
          {[...Array(MAX_HEARTS)].map((_, i) => (
            <Heart 
              key={i} 
              className={`h-5 w-5 ${i < remainingHearts ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} 
            />
          ))}
        </div>
      </div>
      <p className="text-lg mb-4">{currentPassage.question}</p>
      
      <div className="space-y-3">
        {currentPassage.options.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === index 
              ? (isAnswerCorrect ? "default" : "destructive") 
              : "outline"
            }
            className={`w-full justify-start text-left p-4 h-auto ${
              selectedAnswer === index && isAnswerCorrect 
                ? 'bg-green-500 hover:bg-green-600' 
                : ''
            }`}
            onClick={() => selectAnswer(index)}
            disabled={isGameComplete || remainingHearts <= 0}
          >
            {String.fromCharCode(65 + index)}. {option}
          </Button>
        ))}
      </div>
      
      {isGameComplete && (
        <div className="mt-6 flex justify-center">
          <Button 
            onClick={nextPassage}
            className="bg-spanish-gold hover:bg-yellow-600 animate-celebration"
          >
            Next Passage
          </Button>
        </div>
      )}
      
      {remainingHearts <= 0 && !isGameComplete && (
        <div className="mt-6 text-center">
          <p className="text-red-500 font-bold mb-3">Challenge Failed!</p>
          <Button 
            onClick={nextPassage}
            variant="destructive"
          >
            Try a New Passage
          </Button>
        </div>
      )}
    </div>
  );
};

export default ComprehensionQuestion;
