import { useState } from "react";
import { useTranslation } from "react-i18next";
import ReadingIndicator from "../SpeakingAnimation";
import Icon from "../Icons/Icon";
import styles from "./ReadingModal.module.css";

/**
 * <ReadingModal handleSpeakToggle={fn} />
 * ────────────────────────────────────────
 * Displays a reading animation modal with a localized label and a close button.
 *
 * Props:
 * @param {Function} handleSpeakToggle - function to call when closing modal
 */
export default function ReadingModal({ isSpeaking, handleSpeakToggle }) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(isSpeaking);

  if (!isSpeaking) return null;

  const handleClose = () => {
    setVisible(false);
    if (handleSpeakToggle) handleSpeakToggle();
  };

  return (
    <div className={styles.modal}>
      <div className={styles.left}>

      <button onClick={handleClose} className={styles.closeButton}>
          <Icon name="cross" size={16} />
        </button>

      
      </div>
      <div className={styles.center}>
        {t("reading")}
      </div>
      <div className={styles.right}>
      <ReadingIndicator isSpeaking={isSpeaking}/>
      </div>
    </div>
  );
}

