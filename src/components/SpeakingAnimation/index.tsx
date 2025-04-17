// ReadingIndicator.jsx (React component using CSS modules)
// ------------------------------------------------------
import { motion } from "framer-motion";
import styles from "./SpeakingAnimation.module.css";

/**
 * <ReadingIndicator />
 * ---------------------------------------------------
 * Four slender bars that grow and shrink, mimicking an
 * audio/reading equaliser. Written with CSS modules—no Tailwind.
 *
 * Props (all optional)
 * ───────────────────────────────────────────────
 * @param {string}  color       Bar colour (any valid CSS colour)   default: "#4ade80"
 * @param {number}  barWidth    Width of each bar in **pixels**     default: 5
 * @param {number}  barCount    Total bars rendered                 default: 4
 * @param {number}  minHeight   Minimum bar height **px**           default: 8
 * @param {number}  maxHeight   Maximum bar height **px**           default: 32
 * @param {string}  className   Extra classes for the wrapper
 *
 * Usage
 * ───────────────────────────────────────────────
 * ```jsx
 * <ReadingIndicator />
 * // or customise ⤵︎
 * <ReadingIndicator color="hotpink" maxHeight={48} />
 * ```
 */
export default function ReadingIndicator({
    color = "#4ade80",
    barWidth = 3,
    barCount = 4,
    minHeight = 6,
    maxHeight = 18,
    className = "",
    isSpeaking = false, // ✅ new prop
  }) {
    const bars = Array.from({ length: barCount });
  
    return (
      <div
        className={`${styles.wrapper} ${className}`.trim()}
        style={{ height: maxHeight }}
      >
        {bars.map((_, index) => (
          <motion.div
            key={index}
            className={styles.bar}
            style={{ width: barWidth, backgroundColor: color, height: minHeight }}
            animate={
              isSpeaking
                ? { height: [minHeight, maxHeight, minHeight] }
                : { height: minHeight }
            }
            transition={
              isSpeaking
                ? {
                    duration: 0.9 + index * 0.12,
                    repeat: Infinity,
                    repeatType: "mirror",
                    delay: index * 0.15,
                    ease: "easeInOut",
                  }
                : { duration: 0.1 }
            }
          />
        ))}
      </div>
    );
  }
  
// export default function ReadingIndicator({
//   color = "#4ade80",
//   barWidth = 3,
//   barCount = 4,
//   minHeight = 6,
//   maxHeight = 18,
//   className = "",
// }) {
//   // Create an array [undefined × barCount] for rendering bars
//   const bars = Array.from({ length: barCount });

//   return (
//     <div
//       className={`${styles.wrapper} ${className}`.trim()}
//       style={{ height: maxHeight }}
//     >
//       {bars.map((_, index) => (
//         <motion.div
//           key={index}
//           className={styles.bar}
//           style={{ width: barWidth, backgroundColor: color }}
//           animate={{ height: [minHeight, maxHeight, minHeight] }}
//           transition={{
//             duration: 0.9 + index * 0.12,
//             repeat: Infinity,
//             repeatType: "mirror",
//             delay: index * 0.15,
//             ease: "easeInOut",
//           }}
//         />
//       ))}
//     </div>
//   );
// }
