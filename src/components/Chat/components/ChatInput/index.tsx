"use client";

import React, { useRef, useState, useEffect, FormEvent } from "react";

import styles from "./ChatInput.module.css";
import SecondaryButton from "../../../Buttons/SecondaryButton";
import BotHeading from '../../../Headings/BotHeading'
import { useScreenSize } from "../../../../app/context/screenSizeContext";
import { useTranslation } from 'react-i18next';
import SendButton from "../../../Buttons/SendButton";


const TypingHeading = ({ text, speed = 40, initialDelay=0, onTypingComplete = () => {} }) => {
  const [typedText, setTypedText] = useState("");
  const [showCaret, setShowCaret] = useState(true); // Blinking caret state

  useEffect(() => {
    if (!text) return;

    let currentText = "";
    let charIndex = 0;
    setTypedText(""); // Reset text before typing

    // Blinking caret effect
    const caretInterval = setInterval(() => {
      setShowCaret((prev) => !prev);
    }, initialDelay); // Caret blinks every 500ms

    // Typing effect
    const typingTimeout = setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (charIndex < text.length) {
          currentText = text.slice(0, charIndex + 1);
          setTypedText(currentText);
          charIndex++;
        } else {
          clearInterval(typingInterval);
          clearInterval(caretInterval); // Stop blinking when typing is done
          setShowCaret(false); // Remove caret when complete
          onTypingComplete(true);
        }
      }, speed);
    }, initialDelay); // Optional delay before starting

    return () => {
      clearTimeout(typingTimeout);
      clearInterval(caretInterval);
    };
  }, [text, speed]);

  return (
    <span>
      {typedText}
      {/* {showCaret && <span className="caret">|</span>} */}
    </span>
  );
};



type ChatInputProps = {
  isFirstPrompt?: boolean;
  userInput: string;
  setUserInput: (val: string) => void;
  handleSubmit: (event: FormEvent) => void;
  inputDisabled: boolean;
  handleManualFunctionCall: (fn: string, args: any) => void;

};

export default function ChatInput({
  isFirstPrompt = false,
  userInput,
  setUserInput,
  handleSubmit,
  inputDisabled,
  handleManualFunctionCall,
 
}: ChatInputProps) {

  const { t } = useTranslation();

  //const router = useRouter(); // Initialize useRouter
  const headingText = t("bot_first_message");
  const basePlaceholder = "";
  const [placeholder, setPlaceholder] = useState(basePlaceholder);
  const [showCaret, setShowCaret] = useState(true);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!inputDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputDisabled]); // Re-run effect when inputDisabled changes


  useEffect(() => {
    // Blinking caret effect
    const caretInterval = setInterval(() => {
      setShowCaret((prev) => !prev);
    }, 500); // Blink every 500ms

    return () => clearInterval(caretInterval);
  }, []);

  // 1️⃣ Create the ref to the <form>
  const { isMobile } = useScreenSize(); // ✅ Get isMobile globally

  const formRef = useRef<HTMLFormElement>(null);

  // 2️⃣ Request form submission on button click
  const handleSendClick = () => {
    if (formRef.current) {
      formRef.current.requestSubmit(); 
    }
  };

  const isSendDisabled = inputDisabled || userInput.trim() === "";

  return (
    <div
      className={`${styles.container} ${
        isFirstPrompt ? styles.centered : styles.fixed
      }`}
    >
      <div className={styles.innerContainer}>
        {isFirstPrompt && (
          <BotHeading className={styles.botHeading}>
             <TypingHeading text={headingText} speed={20} />
          {/* {t("bot_first_message")}  */}

          </BotHeading>
        )}

        <div className={styles.form}>
          {/* 3️⃣ Attach the ref to the <form> */}
          <form ref={formRef} onSubmit={handleSubmit} className={styles.inputForm}>

            {/* <input
              type="text"
              className={styles.input}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={inputDisabled}
              ref={inputRef}
            />

 */}



<input
  type="text"
  className={styles.input}
  value={userInput}
  onChange={(e) => setUserInput(e.target.value)}
  disabled={inputDisabled}
  ref={inputRef}
  onBlur={() => inputRef.current && inputRef.current.focus()}
/>



            {/* Hidden submit button ensures requestSubmit() works in all browsers */}
            <button type="submit" style={{ display: "none" }} />
          </form>
        </div>

        <div className={styles.buttonGroup}>
          <SecondaryButton
            text={t("suggest_stocks")}
            onClick={() =>
              handleManualFunctionCall("suggest_securities", { asset_type: "stock" })
            }
            disabled={inputDisabled}
          />
          <SecondaryButton
              text={t("suggest_cryptos")}
            onClick={() =>
              handleManualFunctionCall("suggest_securities", { asset_type: "crypto" })
            }
            disabled={inputDisabled}
          />
          {isMobile && (
            <SendButton onClick={handleSendClick} disabled={isSendDisabled} />
          )}
        </div>
      </div>
    </div>
  );
}
