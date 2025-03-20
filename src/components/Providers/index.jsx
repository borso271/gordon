import React, { useState, useEffect } from "react";
import styles from "./Providers.module.css";
import ProviderCard from "./components/ProviderCard"; // The card component

import ProvidersLoader from "../Loaders/ProvidersLoader";

import SectionHeader from "../Headings/SectionHeader";
const Providers = ({ symbol }) => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetch("/providers.json")
      .then((res) => res.json())
      .then((data) => setProviders(data.slice(0, 3))) // Take only first 3 providers
      .catch((err) => console.error("Error loading providers:", err));
  }, []);
     if (providers.length == 0){
      return <ProvidersLoader/>
     }
  return (
    <div className={styles.container}>
    
      <SectionHeader icon={"providers_icon"} title={`Where to buy ${symbol} stock`} size={24}/>

      <div className={styles.cardsContainer}>
        {providers.map((provider) => (
          <ProviderCard key={provider.name} provider={provider} />
        ))}
      </div>
    </div>
  );
};

export default Providers;
