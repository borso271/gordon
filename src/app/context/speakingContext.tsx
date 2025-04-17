// context/SpeakingContext.tsx
import { createContext, useContext, useState } from 'react';

const SpeakingContext = createContext(null);
export const SpeakingProvider = ({ children }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [audio, setAudio] = useState(null);
  
    const speak = async (text, voice = 'onyx', instructions = '') => {
      if (!text) return;
      try {
        setIsLoading(true);
  
        const res = await fetch('/api/openai_speak', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, voice, instructions }),
        });
  
        if (!res.ok) throw new Error('Failed to stream speech');
  
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audioEl = new Audio(url);
  
        setAudio(audioEl);
  
        audioEl.onended = () => {
          setIsSpeaking(false);
          setIsLoading(false);
          URL.revokeObjectURL(url);
          setAudio(null);
        };
  
        audioEl.onerror = () => {
          console.error('Failed to play audio');
          setIsSpeaking(false);
          setIsLoading(false);
          setAudio(null);
        };
  
        audioEl.play();
        setIsSpeaking(true);
        setIsLoading(false); // loading is done once playback starts
  
      } catch (err) {
        console.error('TTS Error:', err);
        setIsSpeaking(false);
        setIsLoading(false);
      }
    };
  
    const stop = () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
        setIsSpeaking(false);
        setIsLoading(false);
        setAudio(null);
      }
    };
  
    return (
      <SpeakingContext.Provider value={{ isSpeaking, isLoading, speak, stop }}>
        {children}
      </SpeakingContext.Provider>
    );
  };
  
  export const useSpeaking = () => useContext(SpeakingContext);
  
// export const SpeakingProvider = ({ children }) => {
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [audio, setAudio] = useState(null);

//   const speak = async (text, voice = 'onyx', instructions = '') => {
//     if (!text) return;
//     try {
//       setIsSpeaking(true);

//       const res = await fetch('/api/openai_speak', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text, voice, instructions }),
//       });

//       if (!res.ok) throw new Error('Failed to stream speech');

//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       const audioEl = new Audio(url);

//       setAudio(audioEl);
//       audioEl.play();

//       audioEl.onended = () => {
//         setIsSpeaking(false);
//         URL.revokeObjectURL(url);
//         setAudio(null);
//       };

//       audioEl.onerror = () => {
//         console.error('Failed to play audio');
//         setIsSpeaking(false);
//         setAudio(null);
//       };
//     } catch (err) {
//       console.error('TTS Error:', err);
//       setIsSpeaking(false);
//     }
//   };

//   const stop = () => {
//     if (audio) {
//       audio.pause();
//       audio.currentTime = 0;
//       setIsSpeaking(false);
//       setAudio(null);
//     }
//   };

//   return (
//     <SpeakingContext.Provider value={{ isSpeaking, speak, stop }}>
//       {children}
//     </SpeakingContext.Provider>
//   );
// };

// export const useSpeaking = () => useContext(SpeakingContext);
