"use client"

import TickerList from '../../../components/TickerList';
import React, {useEffect, FormEvent} from 'react';

export const mockStocks = [
    {
      name: "Apple Inc.",
      ticker: "AAPL",
      country: "USA",
      ytd_return: "12.5%",
      ytd_range: "145.32 - 197.46",
      price: "$189.25",
    },
    {
      name: "Toyota Motor Corp.",
      ticker: "TM",
      country: "Japan",
      ytd_return: "8.2%",
      ytd_range: "130.50 - 165.75",
      price: "$162.10",
    },
    {
      name: "Nestlé S.A.",
      ticker: "NSRGY",
      country: "Switzerland",
      ytd_return: "3.9%",
      ytd_range: "114.00 - 125.90",
      price: "$120.50",
    },
    {
      name: "Samsung Electronics",
      ticker: "005930.KS",
      country: "South Korea",
      ytd_return: "18.4%",
      ytd_range: "54,300 - 71,800",
      price: "69,400₩",
    },
    {
      name: "Alibaba Group",
      ticker: "BABA",
      country: "China",
      ytd_return: "-4.7%",
      ytd_range: "65.00 - 102.30",
      price: "$72.15",
    },
    {
      name: "LVMH Moët Hennessy",
      ticker: "MC.PA",
      country: "France",
      ytd_return: "9.1%",
      ytd_range: "694.10 - 824.50",
      price: "€802.30",
    },
    {
      name: "Roche Holding AG",
      ticker: "ROG.SW",
      country: "Switzerland",
      ytd_return: "1.6%",
      ytd_range: "230.00 - 256.80",
      price: "CHF 243.70",
    },
    {
      name: "Infosys Ltd.",
      ticker: "INFY",
      country: "India",
      ytd_return: "6.3%",
      ytd_range: "15.20 - 19.80",
      price: "$18.45",
    },
    {
      name: "Banco Santander",
      ticker: "SAN",
      country: "Spain",
      ytd_return: "11.0%",
      ytd_range: "3.10 - 4.35",
      price: "$4.20",
    },
    {
      name: "BHP Group Limited",
      ticker: "BHP",
      country: "Australia",
      ytd_return: "7.7%",
      ytd_range: "55.60 - 67.90",
      price: "$66.25",
    },
  ];

  export const columnLabels = {
    name: "Name",
    ticker: "Symbol",
    country: "Country",
    ytd_return: "YTD Return",
    ytd_range: "52-W Range",
    price: "Price",
  };

  
const TestChatPage = () => {



  return (
    <TickerList data={mockStocks} language={"en"} />
   

  );
};

export default TestChatPage;