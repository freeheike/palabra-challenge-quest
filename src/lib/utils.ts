import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import TinySegmenter from "tiny-segmenter";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let segmenter;

export function getWordsfromJapeneseText(text: string): string[] {
  if (!segmenter) {
    segmenter = new TinySegmenter();
  }
  const words = segmenter.segment(text);
  return words;
}
