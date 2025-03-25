"use client";

import React, { useRef, useState, FormEvent } from "react";
import styles from "./ChatInput.module.css";
import SecondaryButton from "../../../Buttons/SecondaryButton";
import BotHeading from '../../../Headings/BotHeading'
import { useScreenSize } from "../../../../app/context/screenSizeContext";
import { useTranslation } from 'react-i18next';
import SendButton from "../../../Buttons/SendButton";
import { useFunctionExecution } from "../../../../app/context/functionExecutionContext";
import TypingHeading from "../../../TypingHeading";
import { useLanguage } from "../../../../app/hooks/useLanguage";

type ChatInputProps = {
  isFirstPrompt?: boolean;
  userInput: string;
  setUserInput: (val: string) => void;
  handleSubmit: (event: FormEvent, isFirstPrompt: boolean) => void;
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
        {isFirstPrompt && (
          <BotHeading className={styles.botHeading}>
            <TypingHeading text={t("bot_first_message")} speed={20} />
          </BotHeading>
        )}
        
        <div className={styles.form}>
          <form ref={formRef} onSubmit={(e)=>handleSubmit(e, isFirstPrompt)} className={styles.inputForm}>
            
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
        
        // onChange={(e) => setUserInput(e.target.value)}
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

            <button type="submit" style={{ display: "none" }} />
          </form>
        </div>

        <div className={styles.buttonGroup}>
          <div className={styles.promptButtons}>
            <SecondaryButton
              text={t("suggest_stocks")}
              onClick={() => onManualFunctionCall("suggest_securities", { asset_type: "stock", language:currentLang }, isFirstPrompt)}
              disabled={inputDisabled}
              icon={"dollar_icon"}
            />
            <SecondaryButton
              text={t("suggest_cryptos")}
              onClick={() => onManualFunctionCall("suggest_securities", { asset_type: "crypto", language:currentLang },isFirstPrompt)}
              disabled={inputDisabled}
              icon={"crypto_icon"}
            />
          </div>

          {/* Send Button - Hidden until input is focused */}
          <div
            style={{
              opacity:  (!isFocused && userInput.length < 2) ? 0 : 1,
              visibility: (!isFocused && userInput.length < 2) ? "hidden" : "visible",
              transition: "opacity 0.3s ease",
            }}
          >
            <SendButton
  disabled={isSendDisabled}
 isFirstPrompt={isFirstPrompt}
className={isMobile ? "isMobile" : "isDesktop"} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
