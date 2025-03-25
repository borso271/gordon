import React, { createContext, useContext } from "react";
// import { functionCallHandler } from "../../app/utils/functionCallHandler";
import { useManualFunctionCall } from "../hooks/useHandleManualFunctionCall";
import {useRouter} from 'next/navigation'
import { useFunctionCallHandler } from "../hooks/useFunctionCallHandler";

interface FunctionExecutionContextType {
  onManualFunctionCall: (functionName: string, args: any, isFirstPrompt?: boolean) => Promise<void>;
}

// Create context
const FunctionExecutionContext = createContext<FunctionExecutionContextType | undefined>(undefined);

// Provider component
export const FunctionExecutionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const {functionCallHandler} = useFunctionCallHandler()
  const { handleManualFunctionCall } = useManualFunctionCall();


  const onManualFunctionCall = async (functionName: string, args: any, isFirstPrompt?: boolean) => {
    if (isFirstPrompt) {
      router.push("/chat"); // ✅ Redirect to /chat
    }

    // ✅ Always execute function call, whether isFirstPrompt is true or not
    await handleManualFunctionCall(functionName, args, functionCallHandler);
  };

  return (
    <FunctionExecutionContext.Provider value={{ onManualFunctionCall }}>
      {children}
    </FunctionExecutionContext.Provider>
  );
};

// Hook to use the context
export const useFunctionExecution = () => {
  const context = useContext(FunctionExecutionContext);
  if (!context) {
    throw new Error("useFunctionExecution must be used within a FunctionExecutionProvider");
  }
  return context;
};
