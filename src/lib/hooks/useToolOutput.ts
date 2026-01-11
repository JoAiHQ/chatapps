import { useOpenAiGlobal } from './useOpenAiGlobal'

/**
 * Hook to access tool output data from window.openai
 *
 * Usage:
 * const data = useToolOutput<YourDataType>()
 *
 * The data comes from window.openai.toolOutput which is injected by ChatGPT.
 * This hook uses useOpenAiGlobal internally to reactively subscribe to updates.
 */
export function useToolOutput<T = any>(): T | undefined {
  const toolOutput = useOpenAiGlobal('toolOutput')
  if (!toolOutput) {
    return undefined
  }

  if (typeof toolOutput === 'object') {
    const structuredContent = (toolOutput as { structuredContent?: unknown })
      .structuredContent
    if (structuredContent !== undefined) {
      return structuredContent as T
    }
  }

  return toolOutput as T
}
