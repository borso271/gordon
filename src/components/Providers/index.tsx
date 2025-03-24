import React, { useState, useEffect } from "react";
import styles from "./Providers.module.css";
import ProviderCard from "./components/ProviderCard";
import ProvidersLoader from "../Loaders/ProvidersLoader";
import SectionHeader from "../Headings/SectionHeader";
import { Provider } from "../../interfaces";

interface ProvidersProps {
  symbol: string;
  language: string;
}

const Providers: React.FC<ProvidersProps> = ({ symbol, language }) => {
  const [providers, setProviders] = useState<Provider[]>([]);

  useEffect(() => {
    const jsonName = language === "ar" ? "providers_ar.json" : "providers_en.json";

    fetch(`/${jsonName}`)
      .then((res) => res.json())
      .then((data: Provider[]) => setProviders(data.slice(0, 3)))
      .catch((err) => console.error("Error loading providers:", err));
  }, [language]);

  if (providers.length === 0) {
    return <ProvidersLoader />;
  }

  const sectionTitle =
    language === "ar"
      ? `أين تشتري سهم ${symbol}`
      : `Where to buy ${symbol} stock`;

  return (
    <div className={styles.container}>
      <SectionHeader icon="providers_icon" title={sectionTitle} size={24} />
      <div className={styles.cardsContainer}>
        {providers.map((provider) => (
          <ProviderCard key={provider.name} provider={provider} language={language} />
        ))}
      </div>
    </div>
  );
};

export default Providers;

// const Providers: React.FC<ProvidersProps> = ({ symbol, language }) => {
//   const [providers, setProviders] = useState<Provider[]>([]);

//   useEffect(() => {
//     fetch("/providers_en.json")
//       .then((res) => res.json())
//       .then((data: Provider[]) => setProviders(data.slice(0, 3)))
//       .catch((err) => console.error("Error loading providers:", err));
//   }, []);

//   if (providers.length === 0) {
//     return <ProvidersLoader />;
//   }

//   return (
//     <div className={styles.container}>
//       <SectionHeader icon="providers_icon" title={`Where to buy ${symbol} stock`} size={24} />
//       <div className={styles.cardsContainer}>
//         {providers.map((provider) => (
//           <ProviderCard key={provider.name} provider={provider} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Providers;
