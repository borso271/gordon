
import React from "react";
import { usePathname } from "next/navigation";
import MainNavSidebar from "../MainNavSidebar";
import ChatNavigationSidebar from "../ChatNavigationSidebar";


const NavigationSidebar: React.FC = () => {
  const pathname = usePathname();

  const isChatRoute = pathname.startsWith("/chat");

  return isChatRoute ? <ChatNavigationSidebar /> : <MainNavSidebar />;
};

export default NavigationSidebar;
