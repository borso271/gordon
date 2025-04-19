  import React, { useRef, useState, useCallback,useEffect } from 'react';
  import styles from './InputButtons.module.css';
  import Icon from '../../../Icons/Icon';
  import { useTranslation } from 'react-i18next';
import { useConversation } from '../../../../app/context/conversationContext';
  
  import { useKnowledgeCenter } from '../../../../app/hooks/useKnowledgeCenter';
  const InputButtons = () => {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';
    const scrollRef = useRef<HTMLDivElement>(null);
  const {threadId} = useConversation();
  const { sendKnowledgeMessage } = useKnowledgeCenter();
    const handleSuggest = () => {
      console.log("Suggesting:", t('landing.suggestions.suggest.prompt'));
      // or submitQuery(t(...), false)
    };
  
    const handleCompare = () => {
      console.log("Comparing:", t('landing.suggestions.compare.prompt'));
    };
  
    const handleSummarize = () => {
      console.log("Summarizing:", t('landing.suggestions.summarize.prompt'));
    };
  
    const handleAnalyze = () => {
      console.log("Analyzing:", t('landing.suggestions.analyze.prompt'));
    };
  
    const handleLearn = () => {

        sendKnowledgeMessage(
          "I want to learn about finance.",
          t("knowledge.introMessage"),
          false 
        );
      
      
    };
  
    const buttons = [
      {
        text: t('landing.suggestions.suggest.label'),
        icon: "search_asset",
        onClick: handleSuggest,
      },
      {
        text: t('landing.suggestions.compare.label'),
        icon: "comparison",
        onClick: handleCompare,
      },
      {
        text: t('landing.suggestions.summarize.label'),
        icon: "summarize",
        onClick: handleSummarize,
      },
      {
        text: t('landing.suggestions.analyze.label'),
        icon: "suggest",
        onClick: handleAnalyze,
      },
      {
        text: t('landing.suggestions.learn.label'),
        icon: "lamp",
        onClick: handleLearn,
      },
    ];
  
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(false);
  
    const updateFades = useCallback(() => {
      const el = scrollRef.current;
      if (!el) return;
      const threshold = 1;
      const canScrollStart = el.scrollLeft > threshold;
      const canScrollEnd = el.scrollLeft < el.scrollWidth - el.clientWidth - threshold;
      setShowLeftFade(isRTL ? canScrollEnd : canScrollStart);
      setShowRightFade(isRTL ? canScrollStart : canScrollEnd);
    }, [isRTL]);
  
    useEffect(() => {
      const el = scrollRef.current;
      if (!el) return;
      updateFades();
      el.addEventListener("scroll", updateFades, { passive: true });
      window.addEventListener("resize", updateFades);
      return () => {
        el.removeEventListener("scroll", updateFades);
        window.removeEventListener("resize", updateFades);
      };
    }, [updateFades]);
  
    return (
      <div className={styles.wrapper}>
        {showLeftFade && <div className={`${styles.fade} ${styles.fadeLeft}`} />}
        {showRightFade && <div className={`${styles.fade} ${styles.fadeRight}`} />}
  
        <div ref={scrollRef} className={styles.container}>
          {buttons.map((btn, index) => (
            <button key={index} className={styles.button} onClick={btn.onClick}>
              <Icon name={btn.icon} />
              <span>{btn.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default InputButtons;
  
// const InputButtons = () => {
//   const { t, i18n } = useTranslation(); // Get i18n instance

//   const isRTL = i18n.dir() === 'rtl';

//   const buttons = [
//     {
//       text: t('landing.suggestions.suggest.label'),
//       prompt: t('landing.suggestions.suggest.prompt'),
//       icon: "search_asset",
//     },
//     {
//       text: t('landing.suggestions.compare.label'),
//       prompt: t('landing.suggestions.compare.prompt'),
//       icon: "comparison",
//     },
//     {
//       text: t('landing.suggestions.summarize.label'),
//       prompt: t('landing.suggestions.summarize.prompt'),
//       icon: "summarize",
//     },
//     {
//       text: t('landing.suggestions.analyze.label'),
//       prompt: t('landing.suggestions.analyze.prompt'),
//       icon: "suggest",
//     },
//     {
//       text: t('landing.suggestions.learn.label'),
//       prompt: t('landing.suggestions.learn.prompt'),
//       icon: "lamp",
//     },
//   ];

//   const scrollRef = useRef<HTMLDivElement>(null);

//   // --- Initial State (less critical now, as useEffect updates it) ---
//   // We'll set the correct state immediately in useEffect based on direction
//   const [showLeftFade, setShowLeftFade] = useState(false);
//   const [showRightFade, setShowRightFade] = useState(false);

//   // --- Updated Fade Logic ---
//   const updateFades = useCallback(() => {
//     const el = scrollRef.current;
//     if (!el) return;

//     // Use a small threshold to avoid floating point inaccuracies near edges
//     const scrollThreshold = 1;

//     // Can we scroll towards the "start"? (Left in LTR, Right in RTL)
//     const canScrollStart = el.scrollLeft > scrollThreshold;

//     // Can we scroll towards the "end"? (Right in LTR, Left in RTL)
//     const canScrollEnd = el.scrollLeft < (el.scrollWidth - el.clientWidth - scrollThreshold);
//     setShowLeftFade(isRTL ? canScrollEnd : canScrollStart);
//     setShowRightFade(isRTL ? canScrollStart : canScrollEnd);

//   }, [isRTL]); // Dependency: re-run if direction changes


//   // --- Effect for Initial Setup, Scroll, Resize, and Language Change ---
//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;

//     // Initial update on mount or when updateFades changes (due to language change)
//     updateFades();

//     // Add listeners
//     el.addEventListener('scroll', updateFades, { passive: true }); // Use passive listener
//     window.addEventListener('resize', updateFades);

//     // Cleanup
//     return () => {
//       el.removeEventListener('scroll', updateFades);
//       window.removeEventListener('resize', updateFades);
//     };
//     // Dependency: updateFades callback itself changes when isRTL changes
//   }, [updateFades]);

//   return (
//     <div className={styles.wrapper}>
//       {/* Use CSS to flip fade position in RTL if needed, or keep fixed */}
//       {showLeftFade && <div className={`${styles.fade} ${styles.fadeLeft}`} aria-hidden="true" />}
//       {showRightFade && <div className={`${styles.fade} ${styles.fadeRight}`} aria-hidden="true" />}

//       {/* Container handles scrolling */}
//       <div ref={scrollRef} className={styles.container}>
//         {buttons.map((btn, index) => (
//           <button
//             key={index}
//             className={styles.button}
//             onClick={() => console.log(btn.prompt)} // Replace with actual handler
//           >
//             {/* Assuming Icon component handles potential mirroring */}
//             <Icon name={btn.icon} />
//             <span>{btn.text}</span> {/* Wrap text for potential styling */}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default InputButtons;



