
import styles from './CodeMessage.module.css'
const CodeMessage = ({ text }: { text: string }) => {
    return (
      <div className={styles.codeMessage}>
        {text.split("\n").map((line, index) => (
          <div key={index}>
            <span>{`${index + 1}. `}</span>
            {line}
          </div>
        ))}
      </div>
    );
  };

  export default CodeMessage