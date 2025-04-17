import { useEffect, useState, useCallback } from "react";


export type SpeechOptions = {
  lang?: string; // "en", "ar", etc.
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice;
};

export function useSpeechSynthesis(defaultOptions: SpeechOptions = {}) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        setVoices(allVoices);
      }
    };

    if (typeof window !== "undefined") {
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const getVoiceForLang = (lang?: string) => {
    if (!lang || voices.length === 0) return null;

    // Match language prefix (e.g. "en" will match "en-US", "en-GB")
    const voice = voices.find((v) => v.lang?.toLowerCase().startsWith(lang.toLowerCase()));
    return voice || null;
  };

  const speak = useCallback(
    (text: string, options: SpeechOptions = {}) => {
      if (!text || typeof window === "undefined") return;

      const utterance = new SpeechSynthesisUtterance(text);
      const lang = options.lang || defaultOptions.lang || "en";

      utterance.lang = lang;
      utterance.rate = options.rate ?? defaultOptions.rate ?? 1;
      utterance.pitch = options.pitch ?? defaultOptions.pitch ?? 1;
      utterance.volume = options.volume ?? defaultOptions.volume ?? 1;

      // Choose a voice either explicitly or based on language
      utterance.voice =
        options.voice ??
        defaultOptions.voice ??
        getVoiceForLang(lang);

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    },
    [defaultOptions, voices]
  );

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return {
    speak,
    stop,
    isSpeaking,
    voices,
  };
}
