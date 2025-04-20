import { useEffect, useRef, useState } from 'react';

// import React from "react";
import styles from "./SuggestionsTopBar.module.css";
import TopSuggestionButton from "../Buttons/TopSuggestionButton";
import { useManualSubmit } from '../../app/hooks/useManualSubmit';
import { useSessionCallback } from '../../app/hooks/useSessionCallback';
import CircledIconButton from '../Buttons/CircleActionButton';
import { useTranslation } from 'react-i18next';
type Suggestion = {
  label: string;
  prompt: string;
};

type Props = {
  suggestions: Suggestion[];
};
const SuggestionsTopBar: React.FC<Props> = ({ suggestions }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftFade, setShowLeftFade] = useState(false);
const [showRightFade, setShowRightFade] = useState(true);

const { i18n } = useTranslation();
const isRTL = i18n.dir() === 'rtl';

const scrollAmount = 250; // px to scroll on each click

const handleScrollClick = () => {
  if (!scrollRef.current) return;
  scrollRef.current.scrollBy({
    left: isRTL ? -scrollAmount : scrollAmount,
    behavior: 'smooth',
  });
};

const { submitQuery } = useManualSubmit();
const {withNewSession}  =useSessionCallback();
const handleScroll = () => {
  if (!scrollRef.current) return;
  const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
  setShowLeftFade(scrollLeft > 0);
  setShowRightFade(scrollLeft + clientWidth < scrollWidth - 1); // tiny offset to avoid rounding issues
};

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll);
    handleScroll(); // initialize on mount

    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.scrollWrapper}>
        <div className={styles.scrollArea} ref={scrollRef}>
          {suggestions.map((suggestion, index) => (
            <div className={styles.buttonWrapper} key={index}>
              <TopSuggestionButton
                text={suggestion.label}
                icon="green_magic_stick"

                onClick={() =>
                  withNewSession(
                    (sessionId) => submitQuery(suggestion.label, true, sessionId),
                    0, // no delay needed
                    true // showOverlay = true
                  )
                }
              />
            </div>
          ))}
        </div>



        {showLeftFade && <div className={styles.fadeLeft} />}
{showRightFade && <div className={styles.fadeRight} />}

{(isRTL ? showLeftFade : showRightFade) && (
  <div className={styles.scrollButton}>
    <CircledIconButton 
      onClick={handleScrollClick}
      iconName={isRTL ? "arrow_left" : "arrow_right"}
      iconSize={20}
    />
  </div>
)}


      </div>
       <div className={styles.bottom_fade}></div> 
    </div>
  );
};


export default SuggestionsTopBar;

