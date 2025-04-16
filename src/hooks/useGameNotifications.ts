import { useToast } from '@/components/ui/use-toast';
import { WORDS_TO_COLLECT } from '@/constants/game';

export const useGameNotifications = () => {
  const { toast } = useToast();

  const notifyWordCollected = (word: string, translation: string, count: number) => {
    toast({
      title: `¡Palabra coleccionada! (${count}/${WORDS_TO_COLLECT})`,
      description: `${word}: ${translation}`,
      variant: "default",
    });
  };

  const notifyNoTranslation = () => {
    toast({
      title: "No translation available",
      description: "Sorry, we don't have a translation for this word.",
    });
  };

  const notifyEnoughWords = () => {
    toast({
      title: "¡Excelente!",
      description: "You've collected enough words! Start the challenge now.",
    });
  };

  const notifyCorrectAnswer = () => {
    toast({
      title: "¡Correcto!",
      description: "Great job! You answered correctly.",
      variant: "default",
    });
  };

  const notifyIncorrectAnswer = () => {
    toast({
      title: "Incorrect",
      description: "Try again after reviewing the passage.",
      variant: "destructive",
    });
  };

  const notifyNotEnoughWords = (currentCount: number) => {
    toast({
      title: "Not enough words collected",
      description: `You need to collect ${WORDS_TO_COLLECT} words first. Current: ${currentCount}`,
      variant: "destructive",
    });
  };

  const notifyChallengeFailed = () => {
    toast({
      title: "Challenge Failed",
      description: "You've lost all your hearts. Try again!",
      variant: "destructive",
    });
  };

  const notifyChallengeComplete = () => {
    toast({
      title: "Vocabulary Challenge Complete!",
      description: "Now try the reading comprehension question.",
      variant: "default",
    });
  };

  const notifyTranslationItemsDepleted = () => {
    toast({
      title: "翻译道具已用完",
      description: "您已经用完了所有的翻译道具。",
      variant: "destructive",
    });
  };

  return {
    notifyWordCollected,
    notifyNoTranslation,
    notifyEnoughWords,
    notifyCorrectAnswer,
    notifyIncorrectAnswer,
    notifyNotEnoughWords,
    notifyChallengeFailed,
    notifyChallengeComplete,
    notifyTranslationItemsDepleted
  };
};
