import React, { useState, useEffect } from "react";
import styles from "./Providers.module.css";
import ProviderCard from "./components/ProviderCard"; // The card component
import SecondaryH2 from "../Headings/SecondaryH2"

const Providers = ({ symbol }) => {
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    fetch("/providers.json")
      .then((res) => res.json())
      .then((data) => setProviders(data.slice(0, 3))) // Take only first 3 providers
      .catch((err) => console.error("Error loading providers:", err));
  }, []);

  return (
    <div className={styles.container}>
      <SecondaryH2>{`Where to buy ${symbol} stock`}</SecondaryH2>

      <div className={styles.cardsContainer}>
        {providers.map((provider) => (
          <ProviderCard key={provider.name} provider={provider} />
        ))}
      </div>
    </div>
  );
};

export default Providers;
