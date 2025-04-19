
import styles from './UserMessage.module.css'
const UserMessage = ({ text, show =true}: { text: string, show?:boolean }) => {
  if (!show) return null;

  return (
    <div className={styles.userMessageOuter}>
      <div className={styles.userMessage}>{text}</div>
    </div>
  );
};

export default UserMessage;
