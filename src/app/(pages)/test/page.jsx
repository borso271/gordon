"use client"

import React from 'react';

import Markdown from 'react-markdown';
import SendButton from '../../../components/Buttons/SendButton';
//import Sc from '../../../components/Data_driven/Sc';
const TestCompPage = () => {
 
return (
  <>
{/* <Analysis symbol={"AAPL"}/> */}
<SendButton/>
<Markdown>{`Here's a list of important cryptocurrencies that are recognized for their market influence, adoption rates, and technological impact:\n\n1. **Bitcoin (BTC)**: The first cryptocurrency, often called digital gold due to its high market cap and limited supply.\n\n2. **Ethereum (ETH)**: Known for its smart contract functionality, driving many decentralized applications (DApps) and DeFi projects.\n\n3. **Binance Coin (BNB)**: Used for trading fee discounts on the Binance Exchange and powers the Binance Smart Chain.\n\n4. **Cardano (ADA)**: Aimed at creating a blockchain platform for change-makers and innovators with a strong focus on security and sustainability.\n\n5. **Solana (SOL)**: Known for its high throughput and low transaction costs, making it a popular choice for DApps and DeFi.\n\n6. **Ripple (XRP)**: Used for real-time international payments (money transfers) by financial institutions.\n\n7. **Polkadot (DOT)**: Facilitates cross-chain communication and interoperability between blockchains.\n\n8. **Dogecoin (DOGE)**: Originally started as a meme, now used for micropayments and tipping.\n\n9. **Chainlink (LINK)**: Provides tamper-proof data for complex smart contracts on any blockchain.\n\n10. **Litecoin (LTC)**: Often regarded as silver to Bitcoin's gold, known for faster transaction times.\n\nThese cryptocurrencies are chosen based on their market capitalization, utility, innovation, and adoption. If you need a detailed analysis of any of these, let me know."`}</Markdown>
{/* <UserQuery>{"Hey what is the best way to invest in Bitcoin."}</UserQuery> */}
{/* <Suggestion symbol={"AAPL"}/> */}
</>
)

     
  
};

export default TestCompPage;
