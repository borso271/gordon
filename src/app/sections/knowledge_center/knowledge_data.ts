/*

This should be in a json, but for simplicity, js object is also ok.


*/

// types/knowledge.ts
export interface KnowledgeItem {
    iconName?: string;
    textKey: string;      // translation key
    onClick?: () => void;
  }
// src/data/knowledgeTopics.ts
export interface KnowledgeTopic {
    id: string;               
    iconName: string;
    titleKey: string;        
    subtextKey: string;       
    onClick: () => void;
    items: KnowledgeItem[];
  }

  export const knowledgeTopics: KnowledgeTopic[] = [
    {
      id: "understanding_stocks",
      iconName: "book",
      titleKey: "knowledge.understandingStocks.title",
      subtextKey: "knowledge.understandingStocks.subtext",
      onClick: () => console.log("Opened: understanding_stocks"),
      items: [
        {  textKey: "knowledge.understandingStocks.item1" },
        {  textKey: "knowledge.understandingStocks.item2" },
        {  textKey: "knowledge.understandingStocks.item3" },
        {  textKey: "knowledge.understandingStocks.item4" },
        {  textKey: "knowledge.understandingStocks.item5" },
        {  textKey: "knowledge.understandingStocks.item6" },
        {  textKey: "knowledge.understandingStocks.item7" },
        {  textKey: "knowledge.understandingStocks.item8" },
        { textKey: "knowledge.understandingStocks.item9" },
        { textKey: "knowledge.understandingStocks.item10" }
      ]
    },

    {
        id: "risk_vs_reward",
        iconName: "book",
        titleKey: "knowledge.riskVsReward.title",
        subtextKey: "knowledge.riskVsReward.subtext",
        onClick: () => console.log("Opened: risk_vs_reward"),
        items: [
          { iconName: "lamp", textKey: "knowledge.riskVsReward.item1" },
          { iconName: "lamp", textKey: "knowledge.riskVsReward.item2" },
          { iconName: "lamp", textKey: "knowledge.riskVsReward.item3" },
          { iconName: "lamp", textKey: "knowledge.riskVsReward.item4" },
          { iconName: "lamp", textKey: "knowledge.riskVsReward.item5" },
          { iconName: "lamp", textKey: "knowledge.riskVsReward.item6" },
        ],
      },
      {
        id: "diversification",
        iconName: "book",
        titleKey: "knowledge.diversification.title",
        subtextKey: "knowledge.diversification.subtext",
        onClick: () => console.log("Opened: diversification"),
        items: [
          { iconName: "lamp", textKey: "knowledge.diversification.item1" },
          { iconName: "lamp", textKey: "knowledge.diversification.item2" },
          { iconName: "lamp", textKey: "knowledge.diversification.item3" },
          { iconName: "lamp", textKey: "knowledge.diversification.item4" },
          { iconName: "lamp", textKey: "knowledge.diversification.item5" },
          { iconName: "lamp", textKey: "knowledge.diversification.item6" },
          { iconName: "lamp", textKey: "knowledge.diversification.item7" },
          { iconName: "lamp", textKey: "knowledge.diversification.item8" },
          { iconName: "lamp", textKey: "knowledge.diversification.item9" },
          { iconName: "lamp", textKey: "knowledge.diversification.item10" },
        ],
      },
      {
        id: "etfs_mutual_funds",
        iconName: "book",
        titleKey: "knowledge.etfsMutualFunds.title",
        subtextKey: "knowledge.etfsMutualFunds.subtext",
        onClick: () => console.log("Opened: etfs_mutual_funds"),
        items: [
          { iconName: "lamp", textKey: "knowledge.etfsMutualFunds.item1" },
          { iconName: "lamp", textKey: "knowledge.etfsMutualFunds.item2" },
          { iconName: "lamp", textKey: "knowledge.etfsMutualFunds.item3" },
          { iconName: "lamp", textKey: "knowledge.etfsMutualFunds.item4" },
          { iconName: "lamp", textKey: "knowledge.etfsMutualFunds.item5" },
          { iconName: "lamp", textKey: "knowledge.etfsMutualFunds.item6" },
          { iconName: "lamp", textKey: "knowledge.etfsMutualFunds.item7" },
          { iconName: "lamp", textKey: "knowledge.etfsMutualFunds.item8" },
          { iconName: "lamp", textKey: "knowledge.etfsMutualFunds.item9" },
          { iconName: "lamp", textKey: "knowledge.etfsMutualFunds.item10" },
        ],
      }
    //   {
    //     id: "financial_goals_planning",
    //     iconName: "book",
    //     titleKey: "knowledge.financialGoalsPlanning.title",
    //     subtextKey: "knowledge.financialGoalsPlanning.subtext",
    //     onClick: () => console.log("Opened: financial_goals_planning"),
    //     items: [
    //       { iconName: "lamp", textKey: "knowledge.financialGoalsPlanning.item1" },
    //       { iconName: "lamp", textKey: "knowledge.financialGoalsPlanning.item2" },
    //       { iconName: "lamp", textKey: "knowledge.financialGoalsPlanning.item3" },
    //       { iconName: "lamp", textKey: "knowledge.financialGoalsPlanning.item4" },
    //       { iconName: "lamp", textKey: "knowledge.financialGoalsPlanning.item5" },
    //       { iconName: "lamp", textKey: "knowledge.financialGoalsPlanning.item6" },
    //       { iconName: "lamp", textKey: "knowledge.financialGoalsPlanning.item7" },
    //       { iconName: "lamp", textKey: "knowledge.financialGoalsPlanning.item8" },
    //       { iconName: "lamp", textKey: "knowledge.financialGoalsPlanning.item9" },
    //       { iconName: "lamp", textKey: "knowledge.financialGoalsPlanning.item10" },
    //     ],
    //   }
  ];
  



//   {
//     id: "risk_vs_reward",
//     iconName: "book",
//     titleKey: "knowledge.riskReward.title",
//     subtextKey: "knowledge.riskReward.subtext",
//     onClick: () => console.log("Opened: risk_vs_reward"),
//   },
//   {
//     id: "diversification",
//     iconName: "book",
//     titleKey: "knowledge.diversification.title",
//     subtextKey: "knowledge.diversification.subtext",
//     onClick: () => console.log("Opened: diversification"),
//   },
//   {
//     id: "compound_interest",
//     iconName: "book",
//     titleKey: "knowledge.compoundInterest.title",
//     subtextKey: "knowledge.compoundInterest.subtext",
//     onClick: () => console.log("Opened: compound_interest"),
//   },
//   {
//     id: "etfs_mutual_funds",
//     iconName: "book",
//     titleKey: "knowledge.etfsMutualFunds.title",
//     subtextKey: "knowledge.etfsMutualFunds.subtext",
//     onClick: () => console.log("Opened: etfs_mutual_funds"),
//   },
//   {
//     id: "financial_goals_planning",
//     iconName: "book",
//     titleKey: "knowledge.finGoalsPlanning.title",
//     subtextKey: "knowledge.finGoalsPlanning.subtext",
//     onClick: () => console.log("Opened: financial_goals_planning"),
//   },
  
  export const knowledgeSubtopics = {
    "Understanding Stocks": [
      { iconName: "lamp", query: "What is a stock share?" },
      { iconName: "lamp", query: "How do stock prices change?" },
      { iconName: "lamp", query: "What are dividends?" },
      { iconName: "lamp", query: "Difference between common and preferred stock?" },
      { iconName: "lamp", query: "What is a stock exchange (e.g., Tadawul)?" },
      { iconName: "lamp", query: "How can I buy stocks?" },
      { iconName: "lamp", query: "What does 'market capitalization' mean?" },
      { iconName: "lamp", query: "What are stock splits and reverse splits?" },
      { iconName: "lamp", query: "Explain IPO (Initial Public Offering)." },
      { iconName: "lamp", query: "What are stock market indices?" },
    ],

    "Risk vs Reward": [
      { iconName: "lamp", query: "What is investment risk?" },
      { iconName: "lamp", query: "How is investment risk measured?" },
      { iconName: "lamp", query: "Explain the risk-return tradeoff." },
      { iconName: "lamp", query: "What are different types of investment risk?" },
      { iconName: "lamp", query: "How does time horizon affect risk tolerance?" },
      { iconName: "lamp", query: "What is volatility in stocks?" },
      { iconName: "lamp", query: "What does 'beta' mean for a stock?" },
      { iconName: "lamp", query: "How can I manage investment risk?" },
      { iconName: "lamp", query: "Examples of high-risk investments?" },
      { iconName: "lamp", query: "Examples of low-risk investments?" },
    ],
    "Diversification": [
      { iconName: "lamp", query: "Why is diversification important for investors?" },
      { iconName: "lamp", query: "How does diversification reduce portfolio risk?" },
      { iconName: "lamp", query: "What are different asset classes for diversification?" },
      { iconName: "lamp", query: "How many different stocks should I own?" },
      { iconName: "lamp", query: "What is asset allocation?" },
      { iconName: "lamp", query: "Should I diversify across different industries?" },
      { iconName: "lamp", query: "What about diversifying geographically?" },
      { iconName: "lamp", query: "What is investment correlation?" },
      { iconName: "lamp", query: "Is it possible to be too diversified?" },
      { iconName: "lamp", query: "How do ETFs help with diversification?" },
    ],
    "Compound Interest": [
      { iconName: "lamp", query: "Explain how compound interest works." },
      { iconName: "lamp", query: "What is the formula for compound interest?" },
      { iconName: "lamp", query: "Why is starting early crucial for compounding?" },
      { iconName: "lamp", query: "Difference between compound and simple interest?" },
      { iconName: "lamp", query: "What is the Rule of 72?" },
      { iconName: "lamp", query: "How does compounding frequency impact growth?" },
      { iconName: "lamp", query: "Where can I see compound interest in action?" },
      { iconName: "lamp", query: "Can compound interest apply to debt?" },
      { iconName: "lamp", query: "How does inflation affect compound returns?" },
      { iconName: "lamp", query: "Show me a compound interest calculation example." },
    ],
    "ETFs & Mutual Funds": [
      { iconName: "lamp", query: "What is an ETF (Exchange-Traded Fund)?" },
      { iconName: "lamp", query: "What is a Mutual Fund?" },
      { iconName: "lamp", query: "What are the main differences between ETFs and Mutual Funds?" },
      { iconName: "lamp", query: "How are ETFs bought and sold?" },
      { iconName: "lamp", query: "What is an expense ratio in funds?" },
      { iconName: "lamp", query: "What is an index fund (ETF or Mutual Fund)?" },
      { iconName: "lamp", query: "What are the advantages of using funds?" },
      { iconName: "lamp", query: "What are the disadvantages or risks of funds?" },
      { iconName: "lamp", query: "Actively managed vs passively managed funds?" },
      { iconName: "lamp", query: "How do I choose an ETF or Mutual Fund?" },
    ],
    "Financial Goals & Planning": [
      { iconName: "lamp", query: "Why is setting financial goals important?" },
      { iconName: "lamp", query: "Short-term vs long-term financial goals?" },
      { iconName: "lamp", query: "What makes a financial goal 'SMART'?" },
      { iconName: "lamp", query: "How do I create a personal budget?" },
      { iconName: "lamp", query: "Why do I need an emergency fund?" },
      { iconName: "lamp", query: "Basic steps for retirement planning?" },
      { iconName: "lamp", query: "What does a comprehensive financial plan include?" },
      { iconName: "lamp", query: "How often should I review my financial goals?" },
      { iconName: "lamp", query: "How can investing help achieve financial goals?" },
      { iconName: "lamp", query: "Common mistakes in financial planning?" },
    ],
  };
  
  // You can access the subtopics like this:
  // const stockSubtopics = knowledgeSubtopics["Understanding Stocks"];
  // console.log(stockSubtopics);