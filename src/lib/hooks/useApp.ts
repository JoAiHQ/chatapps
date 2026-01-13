import { useCallback, useMemo } from 'react'
import { Config } from '../config'
import { useOpenAiGlobal } from './useOpenAiGlobal'

export type AppExecute = (toolName: string, args?: Record<string, unknown>) => Promise<unknown>

export type UseAppResult<T> = {
  data?: T
  paymentRequired: boolean
  executeTool: AppExecute
  executePrompt: (prompt: string) => Promise<void>
  meta?: unknown
}

type ToolOutputEnvelope = {
  structuredContent?: unknown
}

function unwrapStructuredContent(output: unknown): unknown {
  const envelope = output && typeof output === 'object' ? (output as ToolOutputEnvelope) : undefined
  return envelope?.structuredContent ?? output
}

function toRecord(value: unknown): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined
  return value as Record<string, unknown>
}

function extractMeta(value: unknown): unknown | undefined {
  const record = toRecord(value)
  if (!record || !Object.prototype.hasOwnProperty.call(record, '_meta')) {
    return undefined
  }
  return record['_meta']
}

function findUpgradeRecord(values: unknown[]): Record<string, unknown> | undefined {
  for (const value of values) {
    const record = toRecord(value)
    if (record && record[Config.ToolMeta.BillingUpgrade] === true) {
      return record
    }
  }
  return undefined
}

export function useApp<T = any>(): UseAppResult<T> {
  const rawToolOutput = useOpenAiGlobal('toolOutput')
  const rawMetadata = useOpenAiGlobal('toolResponseMetadata')
  const structuredData = useMemo(() => unwrapStructuredContent(rawToolOutput), [rawToolOutput])
  const data = useMemo(() => structuredData as T | undefined, [structuredData])

  const upgradeRecord = useMemo(
    () => findUpgradeRecord([structuredData, rawToolOutput, rawMetadata]),
    [rawMetadata, rawToolOutput, structuredData]
  )
  const meta = useMemo(
    () => extractMeta(structuredData) ?? extractMeta(rawToolOutput) ?? rawMetadata ?? upgradeRecord,
    [structuredData, rawToolOutput, rawMetadata, upgradeRecord]
  )

  const execute = useCallback<AppExecute>(async (toolName, args = {}) => {
    if (!window.openai?.callTool) {
      throw new Error('OpenAI callTool is not available.')
    }
    return window.openai.callTool(toolName, args)
  }, [])

  const sendFollowUp = useCallback(async (prompt: string) => {
    if (!window.openai?.sendFollowUpMessage) {
      throw new Error('OpenAI sendFollowUpMessage is not available.')
    }
    return window.openai.sendFollowUpMessage({ prompt })
  }, [])

  return {
    data,
    paymentRequired: Boolean(upgradeRecord),
    executeTool: execute,
    executePrompt: sendFollowUp,
    meta: meta,
  }
}
