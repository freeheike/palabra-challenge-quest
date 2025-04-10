
import React, { useState } from 'react';
import { useGame, MAX_HEARTS } from '@/context/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRight } from 'lucide-react';

const VocabularyChallenge: React.FC = () => {
  const { collectedWords, currentWordIndex, remainingHearts, checkVocabularyAnswer, nextWord } = useGame();
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  
  const currentWord = collectedWords[currentWordIndex]?.word || '';
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;
    
    const correct = checkVocabularyAnswer(userAnswer);
    setIsCorrect(correct);
    
    if (correct) {
      setTimeout(() => {
        setUserAnswer('');
        setIsCorrect(null);
        nextWord();
      }, 1000);
    }
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Type the English translation..."
          className={`text-center ${
            isCorrect === true ? 'border-green-500 bg-green-50' : 
            isCorrect === false ? 'border-red-500 bg-red-50' : ''
          }`}
        />
        
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">
            Word {currentWordIndex + 1} of {collectedWords.length}
          </span>
          <Button type="submit">
            Check <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default VocabularyChallenge;
