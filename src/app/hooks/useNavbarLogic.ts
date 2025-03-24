import { useEffect, useState } from "react";
import { useConversation } from "../context/conversationContext";
import i18n from "../../i18n";

export function useNavbarLogic() {

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentLang, setCurrentLang] = useState<string>(i18n.language);
  const defaultIndex = currentLang === "ar" ? 1 : 0;
  const [selectedIndex, setSelectedIndex] = useState<number>(defaultIndex);
  const { conversationPairs, currentIndex } = useConversation();

  const faqItems = [
    {
        label: "About Gordon AI",
        content: "Gordon AI is your intelligent financial assistant, utilizing cutting-edge AI to provide insightful analysis of stocks and cryptocurrencies.\n\nWe leverage comprehensive data from leading providers like Eodhd and Polygon.io to deliver accurate and timely financial intelligence, empowering you to make informed investment decisions.\n\nGordon AI's mission is to democratize access to sophisticated financial analysis, helping individuals navigate the complexities of the market.\n\nLearn more about our dedicated team and the technology behind Gordon AI on our website.",
    },
    {
        label: "Gordon's Services",
        content: "Gordon AI offers a suite of powerful services designed to simplify your financial journey. We provide in-depth reports and real-time data analysis on thousands of stocks and cryptocurrencies, enabling informed decisions.\n\nOur portfolio optimization service delivers recommendations to improve your portfolio's performance based on your individual risk tolerance and investment goals.\n\nStay ahead of market trends with our predictive models, which forecast potential market movements. Gordon AI also offers personalized financial assistance, answering your specific financial questions with tailored insights. You can set up customizable alerts to receive notifications about price changes, news, and other important market events.\n\nWe are continually expanding our services to adapt to the evolving financial landscape.",
    },
    {
        label: "Contact Gordon's Team",
        content: "We'd love to hear from you! For questions, feedback, or assistance, please contact us via email at gordon.ai.support@example.com.\n\nWe aim to respond to all inquiries within 24-48 hours.\n\nPlease remember that while Gordon AI provides financial analysis, it does not offer personalized financial advice. It is essential to consult with a qualified financial advisor before making any investment decisions.",
    },
]
  // Close dropdown on conversation index change
  useEffect(() => {
    setOpenDropdown(null);
  }, [currentIndex]);

  // Close dropdowns when clicking outside
  

  const handleToggleDropdown = (dropdownName: string) => {
    setOpenDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLang(lng);
    setOpenDropdown(null);
  };

  return {

    openDropdown,
    setOpenDropdown,
    currentLang,
    selectedIndex,
    setSelectedIndex,
    handleToggleDropdown,
    changeLanguage,
 
    conversationPairs,
    faqItems,
  };
}
