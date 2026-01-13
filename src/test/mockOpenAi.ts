import { OpenAiApi } from '../lib/hooks/types'

type ToolOutputPayload = OpenAiApi['toolOutput']
type ToolResponseMetadataPayload = OpenAiApi['toolResponseMetadata']

export function setToolOutput(payload: ToolOutputPayload) {
  const openai = (window.openai ?? {}) as OpenAiApi

  window.openai = {
    ...openai,
    toolOutput: payload,
    toolResponseMetadata: openai.toolResponseMetadata ?? undefined,
    setWidgetState: openai.setWidgetState ?? (async () => {}),
    callTool: openai.callTool ?? (async () => ({})),
    sendFollowUpMessage: openai.sendFollowUpMessage ?? (async () => {}),
    uploadFile: openai.uploadFile ?? (async () => ({ fileId: 'test-file' })),
    getFileDownloadUrl:
      openai.getFileDownloadUrl ?? (async () => ({ downloadUrl: '' })),
    requestDisplayMode: openai.requestDisplayMode ?? (async () => {}),
    requestModal: openai.requestModal ?? (async () => {}),
    notifyIntrinsicHeight: openai.notifyIntrinsicHeight ?? (() => {}),
    openExternal: openai.openExternal ?? (() => {}),
    setOpenInAppUrl: openai.setOpenInAppUrl ?? (() => {}),
    requestClose: openai.requestClose ?? (() => {}),
  }

  window.dispatchEvent(
    new CustomEvent('openai:set_globals', {
      detail: {
        globals: {
          toolOutput: payload,
        },
      },
    })
  )
}

export function setToolResponseMetadata(payload: ToolResponseMetadataPayload) {
  const openai = (window.openai ?? {}) as OpenAiApi

  window.openai = {
    ...openai,
    toolResponseMetadata: payload,
    setWidgetState: openai.setWidgetState ?? (async () => {}),
    callTool: openai.callTool ?? (async () => ({})),
    sendFollowUpMessage: openai.sendFollowUpMessage ?? (async () => {}),
    uploadFile: openai.uploadFile ?? (async () => ({ fileId: 'test-file' })),
    getFileDownloadUrl:
      openai.getFileDownloadUrl ?? (async () => ({ downloadUrl: '' })),
    requestDisplayMode: openai.requestDisplayMode ?? (async () => {}),
    requestModal: openai.requestModal ?? (async () => {}),
    notifyIntrinsicHeight: openai.notifyIntrinsicHeight ?? (() => {}),
    openExternal: openai.openExternal ?? (() => {}),
    setOpenInAppUrl: openai.setOpenInAppUrl ?? (() => {}),
    requestClose: openai.requestClose ?? (() => {}),
  }

  window.dispatchEvent(
    new CustomEvent('openai:set_globals', {
      detail: {
        globals: {
          toolResponseMetadata: payload,
        },
      },
    })
  )
}
