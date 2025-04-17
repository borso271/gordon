
import React from "react";
import styles from "./MessageActions.module.css";
import Icon from "../Icons/Icon";

import { useConversation } from "../../app/context/conversationContext";
import { useOpenaiSpeech } from "../../app/hooks/useOpenaiSpeech";
import { useSpeaking } from "../../app/context/speakingContext";

import { marked } from "marked";




function stripMarkdown(markdownText: string): string {
  // Convert markdown to HTML
  const html = marked.parse(markdownText) as string;
  const cleanText = html.replace(/<\/?[^>]+(>|$)/g, "");
  return cleanText.trim();
}

interface MessageActionsProps {
  text?: string;
  language?:string;
}

export function copyToClipboard(text: string): void {
  if (!text) return;

  try {
    navigator.clipboard.writeText(text);
    console.log("✅ Copied to clipboard");
  } catch (err) {
    console.error("❌ Failed to copy text: ", err);
  }
}

export function shareContent(text: string): void {
  if (!text) return;

  if (navigator.share) {
    navigator
      .share({
        title: "Check this out",
        text,
      })
      .then(() => console.log("✅ Shared successfully"))
      .catch((error) => console.error("❌ Error sharing:", error));
  } else {
    // Fallback: copy instead
    copyToClipboard(text);
    alert("Sharing not supported. Text copied to clipboard instead.");
  }
}

interface MessageActionsProps {
  text?: string;
  language?: string;
}

const MessageActions: React.FC<MessageActionsProps> = ({ text = "", language = "en" }) => {

  // console.log("TEXT IS: ", text)

  const { inputDisabled } = useConversation();



const { speak, stop, isSpeaking, isLoading } = useSpeaking();
 
  const trimmedText = text.trim();
  const cleanedText = stripMarkdown(trimmedText);

  const canSpeak = !inputDisabled && trimmedText !== "";

  const handleSpeakToggle = () => {
    if (!canSpeak) return;
    if (isSpeaking) stop();
    else speak(cleanedText);
  };

  const actions = [
    {
      iconName: "copy",
      onClick: () => copyToClipboard(cleanedText),
      disabled: !trimmedText,
    },
    {
      iconName: "share",
      onClick: () => shareContent(cleanedText),
      disabled: !trimmedText,
    },
    {
      iconName: isSpeaking ? "pause" : "speak", // toggle icon
      onClick: handleSpeakToggle,
      disabled: !canSpeak,
      isActive: isLoading || isSpeaking, // optional style
    },
  ];

  return (
    <div className={styles.actionsGroup}>
      {actions.map(({ iconName, onClick, disabled, isActive }, index) => (
        <div
          key={index}
          className={`${styles.iconWrapper} ${disabled ? styles.disabled : ""} ${
            isActive ? styles.active : ""
          }`}
          onClick={disabled ? undefined : onClick}
        >
          <Icon name={iconName} />
        </div>
      ))}
    </div>
  );
};

export default MessageActions;

// const MessageActions: React.FC<MessageActionsProps> = ({ text = "", language = "en" }) => {
//   const { inputDisabled } = useConversation();

//   const { speak } = useSpeechSynthesis({ lang: language });

//   const trimmedText = text.trim();
//   const canSpeak = !inputDisabled && trimmedText !== "";

//   const actions = [
//     {
//       iconName: "copy",
//       onClick: () => copyToClipboard(trimmedText),
//       disabled: !trimmedText,
//     },
//     {
//       iconName: "share",
//       onClick: () => shareContent(trimmedText),
//       disabled: !trimmedText,
//     },
//     {
//       iconName: "speak",
//       onClick: () => {
//         if (canSpeak) speak(trimmedText);
//       },
//       disabled: !canSpeak,
//     },
//   ];

//   return (
//     <div className={styles.actionsGroup}>
//       {actions.map(({ iconName, onClick, disabled }, index) => (
//         <div
//           key={index}
//           className={`${styles.iconWrapper} ${disabled ? styles.disabled : ""}`}
//           onClick={disabled ? undefined : onClick}
//         >
//           <Icon name={iconName} />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MessageActions;


// interface MessageAction {
//   iconName: string;
//   text?: string;
//   onClick: () => void;
// }

// interface MessageActionsProps {
//   actions: MessageAction[];
//   disabled?: boolean;
// }

// const MessageActions: React.FC<MessageActionsProps> = ({ actions, disabled = false }) => {
//   return (
//     <div className={styles.actionsGroup}>
//       {actions.map(({ iconName, text, onClick }, index) => (
//         <div
//           key={index}
//           className={`${styles.iconWrapper} ${disabled ? styles.disabled : ""}`}
//           onClick={disabled ? undefined : onClick}
//         >
//           <Icon name={iconName} />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MessageActions;
