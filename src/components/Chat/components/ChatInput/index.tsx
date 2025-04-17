"use client";

import React, { useRef, useState, FormEvent } from "react";
import styles from "./ChatInput.module.css";

import { useScreenSize } from "../../../../app/context/screenSizeContext";
import Icon from "../../../Icons/Icon";
import SendButton from "../../../Buttons/SendButton";
import { useFunctionExecution } from "../../../../app/context/functionExecutionContext";


import { useTranslation } from 'react-i18next';
import { useLanguage } from "../../../../app/hooks/useLanguage";
import InputButtons from "../InputButtons";

import useSpeechRecognition from "../../../../app/hooks/useSpeechRecognition";
type ChatInputProps = {
  isFirstPrompt?: boolean;
  userInput: string;
  setUserInput: (val: string) => void;
  // handleSubmit: (event: FormEvent) => void;
  handleSubmit: (event: FormEvent | MouseEvent | null) => void;

  inputDisabled: boolean;
};

export default function ChatInput({
  isFirstPrompt = false,
  userInput,
  setUserInput,
  handleSubmit,
  inputDisabled,
}: ChatInputProps) {
  const { t } = useTranslation();
  const {startListening} = useSpeechRecognition();
  const {currentLang} = useLanguage();
  const { isMobile } = useScreenSize(); // ✅ Get isMobile globally
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false); // Track input focus
  const { onManualFunctionCall } = useFunctionExecution();
  const isSendDisabled = inputDisabled || userInput.trim().length < 2;
  
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 3 * 24)}px`; // cap at ~3 lines (24px each)
  };

  return (
    <div className={`${styles.container} ${isFirstPrompt ? styles.centered : styles.fixed}`}>
      <div className={styles.innerContainer}>
        <div className={styles.form}>
          <form ref={formRef} onSubmit={(e)=>handleSubmit(e)} className={styles.inputForm}>
<div className={styles.inputWrapper}>
  <textarea
    className={styles.input}
    value={userInput}
    placeholder={t("main_input_placeholder_text")}
    onChange={handleInput}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!isSendDisabled) {
          formRef.current?.requestSubmit(); // Submit the form
        }
      }
    }}
    disabled={inputDisabled}
    ref={inputRef}
    onFocus={() => setIsFocused(true)}
    onBlur={(e) => {
      if (!e.relatedTarget || !e.relatedTarget.classList.contains("sendButton")) {
        setIsFocused(false);
      }
    }}
    rows={1}
  />

  <div className={styles.inputButtons}>

  <div className={styles.microphoneIconWrapper}  onClick={startListening}>
<Icon name="microphone" size={24}></Icon>
</div>

  <SendButton
    disabled={isSendDisabled}
    isFirstPrompt={isFirstPrompt}
    className={isMobile ? "isMobile" : "isDesktop"}
    handleSubmit={handleSubmit}
  />
</div>
</div>
          </form>
        </div>

        <div className={styles.inputButtons}>
<InputButtons/>
</div>

      </div>
    </div>
  );
}
