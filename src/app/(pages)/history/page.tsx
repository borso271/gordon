"use client"

import React from 'react';
import styles from './page.module.css'
import TransactionHistory from './components/TransactionHistory';
import LayoutWithNavbar from '../../../components/Layout/MainLayout';

const suggestions = [
    { label: "Top Gainers and Losers", prompt: "show top gainers" },
    { label: "What Makes a Good Investment?", prompt: "show top losers" },
    { label: "What Are the Latest News on the Market?", prompt: "suggest tech" },
    { label: "Upcoming IPOs in Saudi Arabia", prompt: "show undervalued" },
    { label: "What is a Bullish Market?", prompt: "show bullish" },
  ];


const HistoryPage = () => {
 
  return (
    <div className={styles.container}>
           <LayoutWithNavbar suggestions={suggestions}>
          
        
        {/* <SuggestionsTopBar
    suggestions={[
    { label: "Top Gainers and Losers", prompt: "show top gainers" },
    { label: "What Makes a Good Investment?", prompt: "show top losers" },
    { label: "What Are the Latest News on the Market?", prompt: "suggest tech" },
    { label: "Upcoming Ipos in Saudi Arabia", prompt: "show undervalued" },
    { label: "What is a Bullish Market?", prompt: "show undervalued" },
    
  ]}
/> */}

    <TransactionHistory/>
    
    </LayoutWithNavbar>
    </div>
  );
};

export default HistoryPage;
