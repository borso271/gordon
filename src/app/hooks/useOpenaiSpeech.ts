
import { useState } from "react";

export function useOpenaiSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const speak = async (text: string, voice = "onyx", instructions = "") => {
    if (!text) return;
    try {
      setIsSpeaking(true);

      const res = await fetch("/api/openai_speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, instructions }),
      });

      if (!res.ok) throw new Error("Failed to stream speech");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audioEl = new Audio(url);

      setAudio(audioEl);
      audioEl.play();

      audioEl.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(url);
        setAudio(null);
      };

      audioEl.onerror = () => {
        console.error("Failed to play audio");
        setIsSpeaking(false);
        setAudio(null);
      };
    } catch (err) {
      console.error("TTS Error:", err);
      setIsSpeaking(false);
    }
  };

  const stop = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsSpeaking(false);
      setAudio(null);
    }
  };

  return { speak, stop, isSpeaking };
}
