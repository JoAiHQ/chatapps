import { useCallback, useEffect, useState, SetStateAction } from 'react';
import { useOpenAiGlobal } from './useOpenAiGlobal';
import type { WidgetState } from './types';

/**
 * Hook to manage widget state that persists between renders
 *
 * This hook keeps host-persisted widget state aligned with your local React state.
 * State is automatically synced with window.openai.setWidgetState.
 *
 * @example
 * const [state, setState] = useWidgetState({ count: 0 })
 *
 * // Update state
 * setState({ count: state.count + 1 })
 *
 * // Or with a function
 * setState(prev => ({ ...prev, count: prev.count + 1 }))
 */
export function useWidgetState<T extends WidgetState>(
  defaultState: T | (() => T)
): readonly [T, (state: SetStateAction<T>) => void];
export function useWidgetState<T extends WidgetState>(
  defaultState?: T | (() => T | null) | null
): readonly [T | null, (state: SetStateAction<T | null>) => void];
export function useWidgetState<T extends WidgetState>(
  defaultState?: T | (() => T | null) | null
): readonly [T | null, (state: SetStateAction<T | null>) => void] {
  const widgetStateFromWindow = useOpenAiGlobal('widgetState') as T;

  const [widgetState, _setWidgetState] = useState<T | null>(() => {
    if (widgetStateFromWindow != null) {
      return widgetStateFromWindow;
    }

    return typeof defaultState === 'function'
      ? (defaultState as () => T)()
      : (defaultState ?? null);
  });

  useEffect(() => {
    // Only sync from window.openai if it has a value (not null/undefined)
    // This allows local state to persist when window.openai is not available
    if (widgetStateFromWindow != null) {
      _setWidgetState(widgetStateFromWindow);
    }
  }, [widgetStateFromWindow]);

  const setWidgetState = useCallback(
    (state: SetStateAction<T | null>) => {
      _setWidgetState((prevState) => {
        const newState = typeof state === 'function' ? (state as (prev: T | null) => T | null)(prevState) : state;

        if (newState != null && window.openai?.setWidgetState) {
          window.openai.setWidgetState(newState);
        }

        return newState;
      });
    },
    []
  );

  return [widgetState, setWidgetState] as const;
}
