import React, { useState } from "react";

import MainSidebarHeading from "../../../../components/Headings/MainSidebarHeading";
import ComparisonList from "../components/ComparisonList";
import { SimpleTicker } from "../../../../interfaces";
import ComparisonPicker from "../components/ComparisonPicker";
import styles from './PickerPair.module.css'
import { useConversation } from "../../../context/conversationContext";

const sampleTickers: SimpleTicker[] = [
    {
      symbol_id: 1,
      ticker: "AAPL",
      name: "Apple Inc.",
      asset_type: "stock",
    },
    {
      symbol_id: 2,
      ticker: "GOOGL",
      name: "Alphabet Inc.",
      asset_type: "stock",
    },
    {
      symbol_id: 3,
      ticker: "MSFT",
      name: "Microsoft Corp.",
      asset_type: "stock",
    },
   
  ];

  const comparisonPairs: [SimpleTicker, SimpleTicker][] = [
    [
      { symbol_id: 1, ticker: 'AAPL', name: 'Apple Inc.', asset_type: 'stock' },
      { symbol_id: 2, ticker: 'TSLA', name: 'Tesla', asset_type: 'stock' },
    ],
    [
      { symbol_id: 3, ticker: 'MSFT', name: 'Microsoft', asset_type: 'stock' },
      { symbol_id: 4, ticker: 'AMZN', name: 'Amazon', asset_type: 'stock' },
    ],
    [
        { symbol_id: 1, ticker: 'AAPL', name: 'Apple Inc.', asset_type: 'stock' },
        { symbol_id: 4, ticker: 'AMZN', name: 'Amazon', asset_type: 'stock' },
      ],
      [
        { symbol_id: 2, ticker: 'TSLA', name: 'Tesla', asset_type: 'stock' },
        { symbol_id: 3, ticker: 'MSFT', name: 'Microsoft', asset_type: 'stock' },
      ]
  ];
  

const PickPair = () => {
  
    const {threadId} = useConversation()
  return (
    <div className={styles.container}>
      <MainSidebarHeading text="Compare Tickers" />

      <ComparisonPicker threadId={threadId}tickers={sampleTickers} title={"Pick Your Own"}  />

     <div className={styles.listWrapper}>
        <ComparisonList   comparisonPairs={comparisonPairs} threadId={threadId} />
        </div>
    </div>
  
  );
};

export default PickPair;
