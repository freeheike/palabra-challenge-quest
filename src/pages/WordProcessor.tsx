import React, { useState } from "react";
import { getWordsfromJapeneseText } from "@/lib/utils";

const WordProcessor: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [words, setWords] = useState<string[]>([]);

  const handleProcess = () => {
    const result = getWordsfromJapeneseText(inputText);
    const filteredWords = result.filter(
      (word) => !/^[\p{P}\p{S}]+$/u.test(word)
    ); // 筛选掉标点符号
    // 去重
    const uniqueWords = new Set(filteredWords);
    // 转换为数组
    const uniqueFilteredWords = Array.from(uniqueWords);
    setWords(uniqueFilteredWords);
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">日语句子分词工具</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        rows={4}
        placeholder="请输入日语句子..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleProcess}
      >
        Process
      </button>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">分词结果:</h2>
        <ul className="list-disc pl-5">
          {words.map((word, index) => (
            <li key={index} className="mb-1">
              {word}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WordProcessor;
