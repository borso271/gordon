import React, { createContext, useContext, useState } from "react";

type SidebarContextType = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const ChatNavigationSidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useChatNavigationSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useChatNavigationSidebar must be used within a ChatNavigationSidebarProvider");
  return context;
};
