/*

This should be in a json, but for simplicity, js object is also ok.


*/

export const knowledgeTopics = [
    {
      iconName: "book",
      title: "Understanding Stocks",
      subtext: "Learn what stocks are and how they work in the market.",
      onClick: () => console.log("Opened: Understanding Stocks"),
    },
    {
      iconName: "book",
      title: "Risk vs Reward",
      subtext: "Explore how to balance risk and return in investing.",
      onClick: () => console.log("Opened: Risk vs Reward"),
    },
    {
      iconName: "book",
      title: "Diversification",
      subtext: "Why spreading your investments is key to stability.",
      onClick: () => console.log("Opened: Diversification"),
    },
    {
      iconName: "book",
      title: "Compound Interest",
      subtext: "Understand the power of compounding over time.",
      onClick: () => console.log("Opened: Compound Interest"),
    },
    {
      iconName: "book",
      title: "ETFs & Mutual Funds",
      subtext: "Intro to pooled investment options and their benefits.",
      onClick: () => console.log("Opened: ETFs & Mutual Funds"),
    },
    {
      iconName: "book",
      title: "Financial Goals & Planning",
      subtext: "Setting and achieving short and long-term financial goals.",
      onClick: () => console.log("Opened: Financial Goals & Planning"),
    },
  ];
  
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