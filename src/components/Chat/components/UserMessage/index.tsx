
import styles from './UserMessage.module.css'
const UserMessage = ({ text }: { text: string }) => {
    return  (
    <div className={styles.userMessageOuter}>
    <div className={styles.userMessage}>{text}</div>
    </div>
    )
  };
  
  export default UserMessage