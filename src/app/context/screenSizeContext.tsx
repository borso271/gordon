import React, { createContext, useState, useEffect, useContext } from "react";

// Define context type
type ScreenSizeContextType = {
  isMobile: boolean;
};

// Create context with default value
const ScreenSizeContext = createContext<ScreenSizeContextType | undefined>(undefined);

// Provider component
export const ScreenSizeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ScreenSizeContext.Provider value={{ isMobile }}>
      {children}
    </ScreenSizeContext.Provider>
  );
};

// Custom hook to use the context
export const useScreenSize = (): ScreenSizeContextType => {
  const context = useContext(ScreenSizeContext);
  if (!context) {
    throw new Error("useScreenSize must be used within a ScreenSizeProvider");
  }
  return context;
};
