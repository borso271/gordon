"use client";

import { useState, useEffect } from "react";

interface TypingHeadingProps {
  text: string;
  speed?: number;
  initialDelay?: number;
  onTypingComplete?: () => void;
}

const TypingHeading: React.FC<TypingHeadingProps> = ({
  text,
  speed = 40,
  initialDelay = 0,
  onTypingComplete = () => {},
}) => {
  const [typedText, setTypedText] = useState<string>("");
  const [showCaret, setShowCaret] = useState<boolean>(true); // Blinking caret state

  useEffect(() => {
    if (!text) return;

    let currentText = "";
    let charIndex = 0;
    setTypedText(""); // Reset text before typing

    // Typing effect
    const typingTimeout = setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (charIndex < text.length) {
          currentText = text.slice(0, charIndex + 1);
          setTypedText(currentText);
          charIndex++;
        } else {
          clearInterval(typingInterval);
          //clearInterval(caretInterval); // Stop blinking when typing is done
          setShowCaret(false); // Remove caret when complete
          onTypingComplete();
        }
      }, speed);
    }, initialDelay); // Optional delay before starting

    return () => {
      clearTimeout(typingTimeout);
    };
  }, [text, speed]);

  return (
    <span>
      {typedText}
    </span>
  );
};

export default TypingHeading;
