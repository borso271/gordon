// import { useOverlay } from "../../app/context/overlayContext";
// import { useConversation } from "../../app/context/conversationContext";
// import ChatUI from "../ChatUi";
// import styles from "./OverlayRenderer.module.css";

import { AnimatePresence, motion } from "framer-motion";
import { useOverlay } from "../../app/context/overlayContext";
import { useConversation } from "../../app/context/conversationContext";
import ChatUI from "../ChatUi";
import styles from "./OverlayRenderer.module.css";

export default function OverlayRenderer() {
  const { overlay, setOverlay } = useOverlay();
  const { setThreadId } = useConversation();

  const handleClose = () => {
    setOverlay(null);
    setThreadId("");
  };

  return (
    <AnimatePresence>
      {overlay === "chat" && (
        <motion.div
          className={styles.overlay}
          onClick={handleClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={styles.panel}
            onClick={(e) => e.stopPropagation()}
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <ChatUI />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


// import { useEffect, useState } from "react";
// import { useOverlay } from "../../app/context/overlayContext";
// import { useConversation } from "../../app/context/conversationContext";
// import ChatUI from "../ChatUi";
// import styles from "./OverlayRenderer.module.css";
// export default function OverlayRenderer() {
//   const { overlay, setOverlay } = useOverlay();
//   const { setThreadId } = useConversation();

//   const [visible, setVisible] = useState(false);
//   const [shouldRender, setShouldRender] = useState(false);

//   useEffect(() => {
//     if (overlay) {
//       setShouldRender(true); // mount immediately

//       // Delay setting visible so CSS transition applies AFTER mount
//       requestAnimationFrame(() => {
//         setVisible(true);
//       });
//     } else {
//       setVisible(false); // slide out
//       const timeout = setTimeout(() => {
//         setShouldRender(false); // unmount after animation
//       }, 300);
//       return () => clearTimeout(timeout);
//     }
//   }, [overlay]);

//   const handleClose = () => {
//     setVisible(false);
//     setTimeout(() => {
//       setOverlay(null);
//       setThreadId("");
//     }, 300);
//   };

//   if (!shouldRender) return null;

//   return (
//     <div className={styles.overlay} onClick={handleClose}>
//       <div
//         className={`${styles.panel} ${
//           visible ? styles.slideIn : styles.slideOut
//         }`}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {overlay === "chat" && <ChatUI />}
//       </div>
//     </div>
//   );
// }



// export default function OverlayRenderer() {
//   const { overlay, setOverlay } = useOverlay();
//   const { setThreadId } = useConversation();

//   if (!overlay) return null;

//   const handleClose = () => {
//     setOverlay(null);
//     setThreadId(""); // reset thread when closing chat
//   };

//   return (
//     <div className={styles.overlay} onClick={handleClose}>
//       <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
//         {overlay === "chat" && <ChatUI />}
//       </div>
//     </div>
//   );
// }

