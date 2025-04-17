import { useEffect, useRef, useState } from 'react';

// import React from "react";
import styles from "./SuggestionsTopBar.module.css";
import TopSuggestionButton from "../Buttons/TopSuggestionButton";

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

  const handleClick = (prompt: string) => {
    console.log('Clicked suggestion:', prompt);
  };

  return (
    <div className={styles.container}>
      <div className={styles.scrollWrapper}>
        <div className={styles.scrollArea} ref={scrollRef}>
          {suggestions.map((suggestion, index) => (
            <div className={styles.buttonWrapper} key={index}>
              <TopSuggestionButton
                text={suggestion.label}
                icon="magic_stick"
                onClick={() => handleClick(suggestion.prompt)}
              />
            </div>
          ))}
        </div>

        {showLeftFade && <div className={styles.fadeLeft} />}
{showRightFade && <div className={styles.fadeRight} />}

      </div>
    </div>
  );
};


export default SuggestionsTopBar;


// import React from "react";
// import styles from "./SuggestionsTopBar.module.css";
// import TopSuggestionButton from "../Buttons/TopSuggestionButton";

// type Suggestion = {
//   label: string;
//   prompt: string;
// };

// type Props = {
//   suggestions: Suggestion[];
// };

// const SuggestionsTopBar: React.FC<Props> = ({ suggestions }) => {
//   const handleClick = (prompt: string) => {
//     // TODO: Do something with the prompt
//     console.log("Clicked suggestion:", prompt);
//   };

//   return (
//     <div className={styles.container}>
//   <div className={styles.scrollWrapper}>
//     <div className={styles.scrollArea}>
//       {suggestions.map((suggestion, index) => (
//         <div className={styles.buttonWrapper} key={index}>
//           <TopSuggestionButton
//             text={suggestion.label}
//             icon="magic_stick"
//             onClick={() => handleClick(suggestion.prompt)}
//           />
//         </div>
//       ))}
//     </div>
//     <div className={styles.fadeRight} />
//   </div>
// </div>
//   );
// };

// export default SuggestionsTopBar;
