import React, { useState, useEffect, useRef } from "react";
import { useGame } from "@/context/GameContext";
import type { ReadingPassage } from "@/data/readings";
import {
  spanishReadings,
  japaneseReadings,
  englishReadings,
} from "@/data/readings";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import ClickableWord from "@/components/ClickableWord";
import { ArrowRight, Languages } from "lucide-react";
import { AZURE_CONFIG } from "@/constants/game";
import { useGameNotifications } from "@/hooks/useGameNotifications";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import JapaneseText from "./JapaneseText";
import { getWordsfromJapeneseText } from "@/lib/utils";

const japaneseToRomaji = (text: string): string => {
  const mappings: Record<string, string> = {
    あ: "a",
    い: "i",
    う: "u",
    え: "e",
    お: "o",
    か: "ka",
    き: "ki",
    く: "ku",
    け: "ke",
    こ: "ko",
    さ: "sa",
    し: "shi",
    す: "su",
    せ: "se",
    そ: "so",
    た: "ta",
    ち: "chi",
    つ: "tsu",
    て: "te",
    と: "to",
    な: "na",
    に: "ni",
    ぬ: "nu",
    ね: "ne",
    の: "no",
    は: "ha",
    ひ: "hi",
    ふ: "fu",
    へ: "he",
    ほ: "ho",
    ま: "ma",
    み: "mi",
    む: "mu",
    め: "me",
    も: "mo",
    や: "ya",
    ゆ: "yu",
    よ: "yo",
    ら: "ra",
    り: "ri",
    る: "ru",
    れ: "re",
    ろ: "ro",
    わ: "wa",
    を: "wo",
    ん: "n",
    が: "ga",
    ぎ: "gi",
    ぐ: "gu",
    げ: "ge",
    ご: "go",
    ざ: "za",
    じ: "ji",
    ず: "zu",
    ぜ: "ze",
    ぞ: "zo",
    だ: "da",
    ぢ: "ji",
    づ: "zu",
    で: "de",
    ど: "do",
    ば: "ba",
    び: "bi",
    ぶ: "bu",
    べ: "be",
    ぼ: "bo",
    ぱ: "pa",
    ぴ: "pi",
    ぷ: "pu",
    ぺ: "pe",
    ぽ: "po",
    きゃ: "kya",
    きゅ: "kyu",
    きょ: "kyo",
    しゃ: "sha",
    しゅ: "shu",
    しょ: "sho",
    ちゃ: "cha",
    ちゅ: "chu",
    ちょ: "cho",
    にゃ: "nya",
    にゅ: "nyu",
    にょ: "nyo",
    ひゃ: "hya",
    ひゅ: "hyu",
    ひょ: "hyo",
    みゃ: "mya",
    みゅ: "myu",
    みょ: "myo",
    りゃ: "rya",
    りゅ: "ryu",
    りょ: "ryo",
    ぎゃ: "gya",
    ぎゅ: "gyu",
    ぎょ: "gyo",
    じゃ: "ja",
    じゅ: "ju",
    じょ: "jo",
    びゃ: "bya",
    びゅ: "byu",
    びょ: "byo",
    ぴゃ: "pya",
    ぴゅ: "pyu",
    ぴょ: "pyo",
    四: "shi",
    美: "bi",
    しい: "shii",
    あり: "ari",
    四つ: "yottsu",
    美しい: "utsukushii",
    あります: "arimasu",
  };

  let romaji = "";
  let i = 0;

  while (i < text.length) {
    let matched = false;

    for (let len = 4; len > 0; len--) {
      if (i + len <= text.length) {
        const substr = text.substring(i, i + len);
        if (mappings[substr]) {
          romaji += mappings[substr] + " ";
          i += len;
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      romaji += text[i];
      i++;
    }
  }

  return romaji.trim();
};

const romajiToKana = (text: string): string => {
  const mappings: Record<string, string> = {
    a: "あ",
    i: "い",
    u: "う",
    e: "え",
    o: "お",
    ka: "か",
    ki: "き",
    ku: "く",
    ke: "け",
    ko: "こ",
    sa: "さ",
    shi: "し",
    su: "す",
    se: "せ",
    so: "そ",
    ta: "た",
    chi: "ち",
    tsu: "つ",
    te: "て",
    to: "と",
    na: "な",
    ni: "に",
    nu: "ぬ",
    ne: "ね",
    no: "の",
    ha: "は",
    hi: "ひ",
    fu: "ふ",
    he: "へ",
    ho: "ほ",
    ma: "ま",
    mi: "み",
    mu: "む",
    me: "め",
    mo: "も",
    ya: "や",
    yu: "ゆ",
    yo: "よ",
    ra: "ら",
    ri: "り",
    ru: "る",
    re: "れ",
    ro: "ろ",
    wa: "わ",
    wo: "を",
    n: "ん",
    ga: "が",
    gi: "ぎ",
    gu: "ぐ",
    ge: "げ",
    go: "ご",
    za: "ざ",
    ji: "じ",
    zu: "ず",
    ze: "ぜ",
    zo: "ぞ",
    da: "だ",
    de: "で",
    do: "ど",
    ba: "ば",
    bi: "び",
    bu: "ぶ",
    be: "べ",
    bo: "ぼ",
    pa: "ぱ",
    pi: "ぴ",
    pu: "ぷ",
    pe: "ぺ",
    po: "ぽ",
    kya: "きゃ",
    kyu: "きゅ",
    kyo: "きょ",
    sha: "しゃ",
    shu: "しゅ",
    sho: "しょ",
    cha: "ちゃ",
    chu: "ちゅ",
    cho: "ちょ",
    nya: "にゃ",
    nyu: "にゅ",
    nyo: "にょ",
    hya: "ひゃ",
    hyu: "ひゅ",
    hyo: "ひょ",
    mya: "みゃ",
    myu: "みゅ",
    myo: "みょ",
    rya: "りゃ",
    ryu: "りゅ",
    ryo: "りょ",
    gya: "ぎゃ",
    gyu: "ぎゅ",
    gyo: "ぎょ",
    bya: "びゃ",
    byu: "びゅ",
    byo: "びょ",
    pya: "ぴゃ",
    pyu: "ぴゅ",
    pyo: "ぴょ",
  };

  let kana = "";
  let i = 0;

  while (i < text.length) {
    let matched = false;

    for (let len = 3; len > 0; len--) {
      if (i + len <= text.length) {
        const substr = text.substring(i, i + len).toLowerCase();
        if (mappings[substr]) {
          kana += mappings[substr];
          i += len;
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      kana += text[i];
      i++;
    }
  }

  return kana;
};

const getWordsFromSentence = (sentence: string, language: string): string[] => {
  if (language === "japanese") {
    // 对于日语，我们不需要把每个假名都分开
    return getWordsfromJapeneseText(sentence);
  } else {
    const words = [];
    const wordMatches = sentence.match(
      /[\wáéíóúüñÁÉÍÓÚÜÑ]+|[^\s\wáéíóúüñÁÉÍÓÚÜÑ]+/g
    );

    if (wordMatches) {
      return wordMatches.filter((word) => word.trim() !== "");
    }

    return [];
  }
};

const getKanaForSentence = (sentence: string): string => {
  const words = getWordsFromSentence(sentence, "japanese");
  return words
    .map((word) => {
      if (/^[、。！？]$/.test(word)) {
        return word;
      }
      // 使用 japaneseToRomaji 函数获取罗马音
      const romaji = japaneseToRomaji(word);
      // 然后将罗马音转换为假名
      const kana = romajiToKana(romaji);
      return kana || word; // 如果转换失败，返回原词
    })
    .join(" ");
};

const ReadingPassage: React.FC = () => {
  const {
    currentPassage,
    currentLanguage,
    highlightedSentenceIndex,
    translationItemCount,
    useTranslationItem,
  } = useGame();
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [displayedSentences, setDisplayedSentences] = useState<number[]>([0]);
  const [isPlaying, setIsPlaying] = useState<number | null>(null);
  const [translatedSentences, setTranslatedSentences] = useState<boolean[]>([]);
  const [showRomaji, setShowRomaji] = useState<Record<number, boolean>>({});
  const highlightedSentenceRef = useRef<HTMLSpanElement>(null);
  const { notifyTranslationItemsDepleted } = useGameNotifications();

  // Get the appropriate readings based on the current language
  const getReadings = (): ReadingPassage[] => {
    switch (currentLanguage) {
      case "japanese":
        return japaneseReadings;
      case "english":
        return englishReadings;
      case "spanish":
      default:
        return spanishReadings;
    }
  };

  const readings = getReadings();
  const passage = readings.find((p) => p.id === currentPassage?.id);

  const sentences = passage.text.split(/(?<=[.!?。])\s*/);

  const paragraphs = passage.text.split(/\n\n+/);

  const handleReadNext = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      const nextIndex = currentSentenceIndex + 1;
      setCurrentSentenceIndex(nextIndex);
      setDisplayedSentences([...displayedSentences, nextIndex]);
    }
  };

  const speakSentence = async (sentenceIndex: number) => {
    try {
      setIsPlaying(sentenceIndex);

      let sentence = sentences[sentenceIndex];

      let voiceName = "es-ES-AlvaroNeural";
      let langCode = "es-ES";

      if (currentLanguage === "japanese") {
        voiceName = "ja-JP-NanamiNeural";
        langCode = "ja-JP";
      }

      const ssml = `<speak version="1.0" xml:lang="${langCode}"><voice xml:lang="${langCode}" name="${voiceName}">${sentence}</voice></speak>`;

      const speechSynthesisRequestOptions = {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": AZURE_CONFIG.apiKey,
          "Content-Type": "application/ssml+xml",
          "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
        body: ssml,
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

      // 确保音频可以播放
      audio.oncanplaythrough = () => {
        const playPromise = audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // 音频播放成功
            })
            .catch((error) => {
              console.error("Error playing audio:", error);
              setIsPlaying(null);
            });
        }
      };

      audio.onended = () => {
        setIsPlaying(null);
        URL.revokeObjectURL(audioUrl);
      };
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(null);
    }
  };

  const toggleTranslation = (sentenceIndex: number) => {
    if (translationItemCount <= 0 && !translatedSentences[sentenceIndex]) {
      notifyTranslationItemsDepleted();
      return; // Don't allow translation if no items left
    }

    setTranslatedSentences((prev) => {
      const newTranslations = [...prev];
      if (!newTranslations[sentenceIndex]) {
        // Only use translation item when showing a new translation
        useTranslationItem();
      }
      newTranslations[sentenceIndex] = !newTranslations[sentenceIndex];
      return newTranslations;
    });
  };

  useEffect(() => {
    if (displayedSentences.length > 0) {
      const lastSentenceIndex =
        displayedSentences[displayedSentences.length - 1];
      speakSentence(lastSentenceIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedSentences.length]);

  useEffect(() => {
    if (highlightedSentenceIndex !== null && highlightedSentenceRef.current) {
      highlightedSentenceRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [highlightedSentenceIndex]);

  useEffect(() => {
    if (currentLanguage === "japanese" && passage) {
      console.log("Current language:", currentLanguage);
      console.log("Passage:", passage);
      console.log("Sentence romaji:", passage.sentenceRomaji);
    }
  }, [currentLanguage, passage]);

  const getDisplayedParagraphs = () => {
    const displayedText = displayedSentences
      .map((index) => sentences[index])
      .join(" ");
    return displayedText.split(/\n\n+/);
  };

  const displayedParagraphs = getDisplayedParagraphs();

  if (!passage) {
    return <div>No passage selected</div>;
  }

  return (
    <div className="prose max-w-none">
      <h2 className="text-2xl font-semibold text-spanish-text mb-4">
        <JapaneseText
          japanese={passage.title}
          kana={
            currentLanguage === "japanese"
              ? passage.sentenceKana?.[0] || ""
              : ""
          }
          showKanaToggle={false}
        />
      </h2>

      <div className="text-lg leading-relaxed bg-spanish-background p-6 rounded-lg shadow-md min-h-[200px] max-h-[500px] overflow-y-auto">
        {paragraphs.map((paragraph, paragraphIndex) => {
          if (
            !displayedSentences.some((sentIndex) => {
              const sentenceText = sentences[sentIndex];
              return paragraph.includes(sentenceText);
            })
          ) {
            return null;
          }

          const paragraphSentences = sentences.filter((sentence) =>
            paragraph.includes(sentence)
          );

          const paragraphSentenceIndexes = paragraphSentences.map((sentence) =>
            sentences.indexOf(sentence)
          );

          const visibleSentenceIndexes = paragraphSentenceIndexes.filter(
            (index) => displayedSentences.includes(index)
          );

          if (visibleSentenceIndexes.length === 0) {
            return null;
          }

          return (
            <div
              key={paragraphIndex}
              className="mb-6 last:mb-0 relative w-full"
            >
              <div className="w-full">
                {visibleSentenceIndexes.map((sentenceIndex) => {
                  const sentence = sentences[sentenceIndex];

                  return (
                    <div key={sentenceIndex} className="mb-4 last:mb-0 w-full">
                      <span
                        className={`flex items-start group w-full ${
                          highlightedSentenceIndex === sentenceIndex
                            ? "bg-yellow-100 -mx-2 px-2 py-1 rounded-md"
                            : ""
                        }`}
                        ref={
                          highlightedSentenceIndex === sentenceIndex
                            ? highlightedSentenceRef
                            : null
                        }
                      >
                        <span className="flex-grow word-wrap break-word">
                          {currentLanguage === "japanese" ? (
                            <div className="flex flex-col gap-1">
                              <div className="flex flex-wrap gap-1 w-full">
                                {getWordsFromSentence(sentence, "japanese").map(
                                  (word, wordIndex) => {
                                    if (/^[、。！？]$/.test(word)) {
                                      return (
                                        <span
                                          key={`${sentenceIndex}-${wordIndex}`}
                                        >
                                          {word}
                                        </span>
                                      );
                                    }
                                    return (
                                      <ClickableWord
                                        key={`${sentenceIndex}-${wordIndex}`}
                                        word={word
                                          .toLowerCase()
                                          .replace(/[.,;:!?'"()]/g, "")}
                                        originalWord={word}
                                      />
                                    );
                                  }
                                )}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-400 italic">
                                  {showRomaji[sentenceIndex]
                                    ? passage.sentenceRomaji?.[
                                        sentenceIndex.toString()
                                      ]
                                    : passage.sentenceKana?.[
                                        sentenceIndex.toString()
                                      ] || getKanaForSentence(sentence)}
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-6 text-xs px-2 py-0 border-gray-300 hover:bg-gray-100"
                                  onClick={() =>
                                    setShowRomaji((prev) => ({
                                      ...prev,
                                      [sentenceIndex]: !prev[sentenceIndex],
                                    }))
                                  }
                                >
                                  {showRomaji[sentenceIndex]
                                    ? "显示假名"
                                    : "显示罗马音"}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1 w-full">
                              {getWordsFromSentence(sentence, "spanish").map(
                                (word, wordIndex) => {
                                  if (!word || /^\s+$/.test(word)) {
                                    return null;
                                  }
                                  if (/^[.,;:!?'"()]$/.test(word)) {
                                    return (
                                      <span
                                        key={`${sentenceIndex}-${wordIndex}`}
                                      >
                                        {word}
                                      </span>
                                    );
                                  }
                                  return (
                                    <ClickableWord
                                      key={`${sentenceIndex}-${wordIndex}`}
                                      word={word
                                        .toLowerCase()
                                        .replace(/[.,;:!?'"()]/g, "")}
                                      originalWord={word}
                                    />
                                  );
                                }
                              )}
                            </div>
                          )}
                        </span>

                        <div className="flex items-center ml-1 space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-70 hover:opacity-100 h-6 w-6 mt-1 focus:ring-0"
                            onClick={() => speakSentence(sentenceIndex)}
                            disabled={isPlaying !== null}
                          >
                            <Volume2
                              className={`h-4 w-4 ${
                                isPlaying === sentenceIndex
                                  ? "text-spanish-red animate-pulse"
                                  : "text-spanish-text"
                              }`}
                            />
                          </Button>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6 opacity-70 hover:opacity-100 focus:ring-0 mt-1"
                                  onClick={() =>
                                    toggleTranslation(sentenceIndex)
                                  }
                                >
                                  <Languages
                                    className={`h-4 w-4 ${
                                      translatedSentences[sentenceIndex]
                                        ? "text-spanish-red"
                                        : "text-gray-500"
                                    }`}
                                  />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>翻译句子</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </span>

                      {translatedSentences[sentenceIndex] &&
                        passage.sentenceTranslations?.[sentenceIndex] && (
                          <div className="mt-1 mb-2 text-gray-600 italic bg-gray-100 p-2 rounded-md text-sm border-l-4 border-spanish-red w-full">
                            <h4 className="text-xs uppercase text-gray-500 mb-1 font-semibold">
                              中文翻译
                            </h4>
                            <div className="whitespace-pre-wrap word-wrap break-word w-full">
                              {passage.sentenceTranslations[sentenceIndex]}
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {currentSentenceIndex === sentences.length - 1 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">
            {currentLanguage === "japanese" ? (
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap gap-1 w-full">
                  {getWordsFromSentence(passage.question, "japanese").map(
                    (word, wordIndex) => {
                      if (/^[、。！？]$/.test(word)) {
                        return (
                          <span key={`question-${wordIndex}`}>{word}</span>
                        );
                      }
                      return (
                        <ClickableWord
                          key={`question-${wordIndex}`}
                          word={word.toLowerCase().replace(/[.,;:!?'"()]/g, "")}
                          originalWord={word}
                        />
                      );
                    }
                  )}
                </div>
                <div className="text-xs text-gray-400 italic">
                  {passage.sentenceRomaji?.[passage.text.split("。").length] ||
                    ""}
                </div>
              </div>
            ) : (
              passage.question
            )}
          </h3>
          <div className="space-y-2">
            {passage.options.map((option, index) => (
              <div key={index} className="p-2 border rounded">
                {currentLanguage === "japanese" ? (
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap gap-1 w-full">
                      {getWordsFromSentence(option, "japanese").map(
                        (word, wordIndex) => {
                          if (/^[、。！？]$/.test(word)) {
                            return (
                              <span key={`option-${index}-${wordIndex}`}>
                                {word}
                              </span>
                            );
                          }
                          return (
                            <ClickableWord
                              key={`option-${index}-${wordIndex}`}
                              word={word
                                .toLowerCase()
                                .replace(/[.,;:!?'"()]/g, "")}
                              originalWord={word}
                            />
                          );
                        }
                      )}
                    </div>
                    <div className="text-xs text-gray-400 italic">
                      {passage.sentenceRomaji?.[
                        passage.text.split("。").length + 1 + index
                      ] || ""}
                    </div>
                  </div>
                ) : (
                  option
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">
          Sentence {currentSentenceIndex + 1} of {sentences.length}
        </span>
        <div className="flex gap-2">
          {currentSentenceIndex < sentences.length - 1 && (
            <Button
              onClick={handleReadNext}
              className="bg-spanish-red hover:bg-spanish-red/90"
            >
              Read Next <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadingPassage;
