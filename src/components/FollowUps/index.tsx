
"use client";

import Icon from "../Icons/Icon";
import styles from "./FollowUps.module.css";
import { useManualSubmit } from "../../app/hooks/useManualSubmit";
type SuggestionListProps = {
  suggestions: string[];

};


export default function FollowUps({ suggestions }: SuggestionListProps) {
  const {submitQuery} = useManualSubmit()
  return (
    <div className={styles.container}>
      {suggestions.map((item, index) => (
        <div
          key={index}
          className={styles.suggestion}
          onClick={() => submitQuery(item)} // 👈 use passed function
        >
          <span className={styles.text}>{item}</span>
          <div className={styles.iconWrapper}>
            <Icon name="circled_plus" size={18} className={styles.icon} />
          </div>
        </div>
      ))}
    </div>
  );
}


// export default function FollowUps({ suggestions }: SuggestionListProps) {
//  // console.log("SUGGESTIONS ARE ",  suggestions)
//   return (

//     <div className={styles.container}>
//         {/* <h3>You Might Also Want To explore:</h3> */}
//       {suggestions.map((item, index) => (
//         <div key={index} className={styles.suggestion} onClick={() => newSearch(item)}>
//           <span className={styles.text}>{item}</span>

// <div className={styles.iconWrapper}>
//           <Icon name="circled_plus" size={18} className={styles.icon} />
//           </div>
//         </div>
        
//       )
     
//       )}
//       </div>
//   );
// }
