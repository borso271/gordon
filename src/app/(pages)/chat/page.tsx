"use client"

import React, {useState} from 'react';

import styles from './page.module.css'

import { useTranslation } from 'react-i18next';

import I18nProvider from "../../../components/I18nProvider.jsx";

import BotChat from "../../../components/Chat";

export async function functionCallHandler(toolCall) {

  // Parse the arguments for any function call
  const { name, arguments: functionArgs } = toolCall.function;
  const args = JSON.parse(functionArgs);
  args.language = "en";

  // Decide which endpoint to call based on the function name
  if (name === "analyze_security") {
    // Example: args = { symbol: "AAPL", asset_type: "stock" }
    
    try {
      const response = await fetch("api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(args)
      });
      // The server should respond with JSON
      const data = await response.json();
      return JSON.stringify(data);
    } catch (error) {
      console.error("Error calling /api/analysis:", error);
      return JSON.stringify({ error: "Failed to analyze security" });
    }

  } else if (name === "suggest_securities") {
   
    try {
      const response = await fetch("api/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(args) // ✅ Send asset_type in the body
      });
  
      const data = await response.json();
   
      return JSON.stringify(data);
    } catch (error) {
      console.error("Error calling /api/suggest:", error);
      return JSON.stringify({ error: "Failed to suggest securities" });
    }
  }

  return "";
}

const TestChatPage = () => {
 
  return (
    <div className={styles.main}>
      <BotChat functionCallHandler={functionCallHandler} />
      </div>
  
  );
};

export default TestChatPage;
