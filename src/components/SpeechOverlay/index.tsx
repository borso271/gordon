// components/SpeechOverlay.tsx
import { useSpeaking } from '../../app/context/speakingContext';
import ReadingModal from '../SpeakingModal';
import styles from './SpeechOverlay.module.css'
const SpeechOverlay = () => {
  const { isSpeaking, stop } = useSpeaking();

//   if (!isSpeaking) return null;

return (
    <div className={styles.overlay}>
      <ReadingModal isSpeaking={isSpeaking} handleSpeakToggle={stop} />
    </div>
  );
  
};

export default SpeechOverlay;
