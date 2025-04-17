import React, { useState, useEffect, useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { MAX_HEARTS } from "@/constants/game";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Heart, ArrowRight, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AZURE_CONFIG } from "@/constants/game";

const VocabularyChallenge: React.FC = () => {
  const {
    collectedWords,
    currentWordIndex,
    remainingHearts,
    checkVocabularyAnswer,
    nextWord,
    currentLanguage,
    currentPassage,
    highlightSentenceWithWord,
  } = useGame();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentWord = collectedWords[currentWordIndex]?.word || "";
  const correctTranslation =
    collectedWords[currentWordIndex]?.translation || "";

  // Generate options only once per word
  const options = useMemo(() => {
    const correctAnswer = correctTranslation;
    const options = [correctAnswer];

    // Copy the translations and filter out the correct one
    const otherTranslations = collectedWords
      .filter((_, idx) => idx !== currentWordIndex)
      .map((word) => word.translation);

    // If we don't have enough words yet, add some default wrong answers
    const defaultOptions = [
      "house",
      "car",
      "dog",
      "tree",
      "book",
      "family",
      "food",
      "city",
    ];

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
  }, [correctTranslation, collectedWords, currentWordIndex]);

  const handleOptionSelect = (selectedOption: string) => {
    if (isCorrect === true) return; // Prevent clicking only if the answer is correct

    setSelectedOption(selectedOption);
    const correct = selectedOption === correctTranslation;
    setIsCorrect(correct);
    checkVocabularyAnswer(selectedOption);
  };

  const handleContinue = () => {
    setIsCorrect(null);
    setSelectedOption(null);
    nextWord();
  };

  const speakWord = async () => {
    try {
      setIsPlaying(true);

      let wordToSpeak = currentWord;

      // Configure voice settings based on language
      let voiceName = "es-ES-AlvaroNeural";
      let langCode = "es-ES";

      if (currentLanguage === "japanese") {
        voiceName = "ja-JP-NanamiNeural";
        langCode = "ja-JP";

        // Special handling for Japanese particles
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

      const speechSynthesisRequestOptions = {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_CONFIG.apiKey,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        },
        body: `<speak version='1.0' xml:lang='${langCode}'><voice xml:lang='${langCode}' name='${voiceName}'>${wordToSpeak}</voice></speak>`,
      };

      const response = await fetch(
        AZURE_CONFIG.ttsUrl,
        speechSynthesisRequestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  // Auto-highlight sentence with the current word and speak the word when quiz displays
  useEffect(() => {
    if (currentWord && currentPassage) {
      highlightSentenceWithWord(currentWord);
      speakWord();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWord, currentWordIndex]);

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
              className={`h-5 w-5 ${
                i < remainingHearts
                  ? "text-red-500 fill-red-500"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-gray-500 mb-2">Translate to English:</p>
        <div className="flex items-center justify-center">
          <p className="text-2xl font-bold text-spanish-red">{currentWord}</p>
          <button
            className="ml-2 opacity-70 hover:opacity-100 focus:outline-none"
            onClick={speakWord}
            disabled={isPlaying}
          >
            <Volume2
              className={`h-5 w-5 ${
                isPlaying
                  ? "text-spanish-gold animate-pulse"
                  : "text-spanish-red"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <RadioGroup value={selectedOption || ""} className="gap-3">
          {options.map((option, idx) => (
            <div
              key={idx}
              className={`flex items-center space-x-2 p-3 rounded-md border cursor-pointer ${
                isCorrect !== null && option === correctTranslation
                  ? "border-green-500 bg-green-50"
                  : isCorrect === false && option === selectedOption
                  ? "border-red-500 bg-red-50"
                  : isCorrect === false && option !== selectedOption
                  ? "border-gray-200 opacity-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              <RadioGroupItem
                value={option}
                id={`option-${idx}`}
                checked={selectedOption === option}
              />
              <label
                htmlFor={`option-${idx}`}
                className="text-lg flex-grow cursor-pointer"
              >
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
