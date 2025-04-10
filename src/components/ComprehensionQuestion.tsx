
import React from 'react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';

const ComprehensionQuestion: React.FC = () => {
  const { 
    currentPassage, 
    selectedAnswer, 
    isAnswerCorrect, 
    isGameComplete,
    selectAnswer, 
    nextPassage 
  } = useGame();
  
  if (!currentPassage) {
    return null;
  }
  
  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-spanish-text mb-4">
        Comprehension Question:
      </h3>
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
            disabled={isGameComplete}
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
    </div>
  );
};

export default ComprehensionQuestion;
