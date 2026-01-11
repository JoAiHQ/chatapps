import { OpenAiApi } from '../lib/hooks/types'

type ToolOutputPayload = OpenAiApi['toolOutput']

export function setToolOutput(payload: ToolOutputPayload) {
  const openai = (window.openai ?? {}) as OpenAiApi

  window.openai = {
    ...openai,
    toolOutput: payload,
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

