"use client";

import React, { useRef, useState, useEffect, FormEvent } from "react";
import styles from "./ChatInput.module.css";
import SecondaryButton from "../../../Buttons/SecondaryButton";
import BotHeading from '../../../Headings/BotHeading'
import { useScreenSize } from "../../../../app/context/screenSizeContext";
import { useTranslation } from 'react-i18next';
import SendButton from "../../../Buttons/SendButton";
import { useFunctionExecution } from "../../../../app/context/functionExecutionContext";
import TypingHeading from "../../../TypingHeading";

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

  const { isMobile } = useScreenSize(); // ✅ Get isMobile globally
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false); // Track input focus
  const { onManualFunctionCall } = useFunctionExecution();
  const isSendDisabled = inputDisabled || userInput.trim().length < 2;

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
            <input
              type="text"
              className={styles.input}
              value={userInput}
              placeholder={"Talk money to me. What’s on your mind?"}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={inputDisabled}
              ref={inputRef}
              
              onFocus={() => setIsFocused(true)}
              onBlur={(e) => {
                if (!e.relatedTarget || !e.relatedTarget.classList.contains("sendButton")) {
                  setIsFocused(false);
                }
              }}
            />
            <button type="submit" style={{ display: "none" }} />
          </form>
        </div>

        <div className={styles.buttonGroup}>
          <div className={styles.promptButtons}>
            <SecondaryButton
              text={t("suggest_stocks")}
              onClick={() => onManualFunctionCall("suggest_securities", { asset_type: "stock" }, isFirstPrompt)}
              disabled={inputDisabled}
              icon={"dollar_icon"}
            />
            <SecondaryButton
              text={t("suggest_cryptos")}
              onClick={() => onManualFunctionCall("suggest_securities", { asset_type: "crypto" },isFirstPrompt)}
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
