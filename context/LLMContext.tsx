import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useLLM, QWEN3_0_6B_QUANTIZED } from 'react-native-executorch';

// --- Derive types from useLLM's return type ---
type LLMState = Pick<
  ReturnType<typeof useLLM>,
  'isReady' | 'response' | 'isGenerating' | 'downloadProgress'
>;

type LLMActions = Pick<
  ReturnType<typeof useLLM>,
  'generate' | 'interrupt' | 'configure'
>;

// --- Typed split contexts ---
const LLMStateContext = createContext<LLMState | null>(null);
const LLMActionsContext = createContext<LLMActions | null>(null);

// --- Provider ---
interface LLMProviderProps {
  children: React.ReactNode;
}

export function LLMProvider({ children }: LLMProviderProps) {
  const llm = useLLM({ model: QWEN3_0_6B_QUANTIZED });

  // Configure once when model is ready
  useEffect(() => {
    if (llm.isReady) {
      llm.configure({
        generationConfig: {
          outputTokenBatchSize: 10,
          batchTimeInterval: 150,
        },
      });
    }
  }, [llm.isReady, llm.configure]);

  // Stable function refs — never cause re-renders
  const actions = useMemo<LLMActions>(() => ({
    generate: llm.generate,
    interrupt: llm.interrupt,
    configure: llm.configure,
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  // Changes every token
  const state = useMemo<LLMState>(() => ({
    isReady: llm.isReady,
    response: llm.response,
    isGenerating: llm.isGenerating,
    downloadProgress: llm.downloadProgress,
  }), [llm.isReady, llm.response, llm.isGenerating, llm.downloadProgress]);

  return (
    <LLMActionsContext.Provider value={actions}>
      <LLMStateContext.Provider value={state}>
        {children}
      </LLMStateContext.Provider>
    </LLMActionsContext.Provider>
  );
}

// --- Typed custom hooks with null guards ---
export const useLLMState = (): LLMState => {
  const ctx = useContext(LLMStateContext);
  if (!ctx) throw new Error('useLLMState must be used within <LLMProvider>');
  return ctx;
};

export const useLLMActions = (): LLMActions => {
  const ctx = useContext(LLMActionsContext);
  if (!ctx) throw new Error('useLLMActions must be used within <LLMProvider>');
  return ctx;
};