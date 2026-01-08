import { useSyncExternalStore, useEffect, useRef } from 'react';
import { OpenAiGlobals, SET_GLOBALS_EVENT_TYPE, SetGlobalsEvent } from './types';

/**
 * Hook to subscribe to a single global value from window.openai
 *
 * This hook listens for 'openai:set_globals' events and provides reactive
 * access to window.openai properties.
 *
 * @example
 * const toolOutput = useOpenAiGlobal('toolOutput')
 * const theme = useOpenAiGlobal('theme')
 */
export function useOpenAiGlobal<K extends keyof OpenAiGlobals>(
  key: K
): OpenAiGlobals[K] {
  const onChangeRef = useRef<(() => void) | null>(null);

  const value = useSyncExternalStore(
    (onChange) => {
      onChangeRef.current = onChange;

      const handleSetGlobal = (event: SetGlobalsEvent) => {
        const value = event.detail.globals[key];
        if (value === undefined) {
          return;
        }
        onChange();
      };

      window.addEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal as EventListener, {
        passive: true,
      });

      return () => {
        window.removeEventListener(SET_GLOBALS_EVENT_TYPE, handleSetGlobal as EventListener);
        onChangeRef.current = null;
      };
    },
    () => {
      // Snapshot function - return current value
      try {
        return (window.openai?.[key] ?? undefined) as OpenAiGlobals[K];
      } catch (error) {
        console.error('Error accessing window.openai:', error);
        return undefined as OpenAiGlobals[K];
      }
    },
    () => {
      // Server snapshot (for SSR compatibility)
      return undefined as OpenAiGlobals[K];
    }
  );

  // Poll for window.openai initialization (only in development/test scenarios)
  // In ChatGPT, this is set synchronously, but for local testing we need to check
  useEffect(() => {
    // Also listen for postMessage events (fallback for cross-origin scenarios)
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'openai:set_globals' && event.data.globals) {
        const value = event.data.globals[key];
        if (value !== undefined && onChangeRef.current) {
          onChangeRef.current();
        }
      }
    };

    window.addEventListener('message', handleMessage);

    if (!window.openai) {
      let checkCount = 0;
      const maxChecks = 100; // Check for 5 seconds (50ms * 100)
      const checkTimer = setInterval(() => {
        checkCount++;
        if (window.openai && onChangeRef.current) {
          onChangeRef.current();
          clearInterval(checkTimer);
        } else if (checkCount >= maxChecks) {
          clearInterval(checkTimer);
        }
      }, 50);
      return () => {
        clearInterval(checkTimer);
        window.removeEventListener('message', handleMessage);
      };
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [key]);

  return value;
}
