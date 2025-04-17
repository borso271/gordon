// context/OverlayContext.tsx
import { createContext, useContext, useState } from "react";

const OverlayContext = createContext(null);

export const OverlayProvider = ({ children }) => {
  const [overlay, setOverlay] = useState<"chat" | null>(null);
  return (
    <OverlayContext.Provider value={{ overlay, setOverlay }}>
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => useContext(OverlayContext);
