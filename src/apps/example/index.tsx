import { Button } from '@openai/apps-sdk-ui/components/Button'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { useOpenAiGlobal, useToolOutput, useWidgetState } from '../../lib/hooks'

interface ToolData {
  message?: string
  items?: string[]
}

function App() {
  // Test useToolOutput hook
  const data = useToolOutput<ToolData>()

  // Test useOpenAiGlobal hook - get various properties
  const theme = useOpenAiGlobal('theme')
  const locale = useOpenAiGlobal('locale')
  const displayMode = useOpenAiGlobal('displayMode')
  const view = useOpenAiGlobal('view')
  const maxHeight = useOpenAiGlobal('maxHeight')

  // Test useWidgetState hook - counter that persists
  const [widgetState, setWidgetState] = useWidgetState<{
    count: number
    clicks: number
  }>({ count: 0, clicks: 0 })

  const incrementCount = () => {
    setWidgetState((prev) => ({
      count: (prev?.count || 0) + 1,
      clicks: (prev?.clicks || 0) + 1,
    }))
  }

  const resetCount = () => {
    setWidgetState({ count: 0, clicks: widgetState?.clicks || 0 })
  }

  const testCallTool = async () => {
    if (window.openai?.callTool) {
      try {
        const result = await window.openai.callTool('test_tool', { test: true })
        alert(`Tool called! Result: ${JSON.stringify(result)}`)
      } catch (error) {
        alert(`Error calling tool: ${error}`)
      }
    } else {
      alert('window.openai.callTool is not available')
    }
  }

  const testSendFollowUp = async () => {
    if (window.openai?.sendFollowUpMessage) {
      try {
        await window.openai.sendFollowUpMessage({
          prompt: 'Show me the current widget state',
        })
      } catch (error) {
        alert(`Error sending follow-up: ${error}`)
      }
    } else {
      alert('window.openai.sendFollowUpMessage is not available')
    }
  }

  const testRequestDisplayMode = async () => {
    if (window.openai?.requestDisplayMode) {
      try {
        await window.openai.requestDisplayMode({ mode: 'fullscreen' })
      } catch (error) {
        alert(`Error requesting display mode: ${error}`)
      }
    } else {
      alert('window.openai.requestDisplayMode is not available')
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Hook Testing App</h1>

      {/* Test useToolOutput */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="font-semibold mb-2 text-blue-900">
          useToolOutput Hook:
        </h2>
        {data ? (
          <div className="text-sm">
            <p className="mb-2">{data.message || 'No message'}</p>
            {data.items && (
              <ul className="list-disc list-inside">
                {data.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <p className="text-gray-500 italic text-sm">
            No tool output data available
          </p>
        )}
      </div>

      {/* Test useOpenAiGlobal */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="font-semibold mb-2 text-green-900">
          useOpenAiGlobal Hook:
        </h2>
        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Theme:</span>{' '}
            {typeof theme === 'object'
              ? JSON.stringify(theme)
              : String(theme ?? 'undefined')}
          </p>
          <p>
            <span className="font-medium">Locale:</span>{' '}
            {typeof locale === 'object'
              ? JSON.stringify(locale)
              : String(locale ?? 'undefined')}
          </p>
          <p>
            <span className="font-medium">Display Mode:</span>{' '}
            {typeof displayMode === 'object'
              ? JSON.stringify(displayMode)
              : String(displayMode ?? 'undefined')}
          </p>
          <p>
            <span className="font-medium">View:</span>{' '}
            {typeof view === 'object'
              ? JSON.stringify(view)
              : String(view ?? 'undefined')}
          </p>
          <p>
            <span className="font-medium">Max Height:</span>{' '}
            {typeof maxHeight === 'object'
              ? JSON.stringify(maxHeight)
              : String(maxHeight ?? 'undefined')}
          </p>
        </div>
      </div>

      {/* Test useWidgetState */}
      <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h2 className="font-semibold mb-2 text-purple-900">
          useWidgetState Hook:
        </h2>
        <div className="space-y-3">
          <div className="text-sm">
            <p>
              <span className="font-medium">Count:</span>{' '}
              {String(widgetState?.count ?? 0)}
            </p>
            <p>
              <span className="font-medium">Total Clicks:</span>{' '}
              {String(widgetState?.clicks ?? 0)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button color="primary" onClick={incrementCount} size="sm">
              Increment (+1)
            </Button>
            <Button color="secondary" onClick={resetCount} size="sm">
              Reset Count
            </Button>
          </div>
          <p className="text-xs text-gray-600 italic">
            State persists between renders via window.openai.setWidgetState
          </p>
        </div>
      </div>

      {/* Test window.openai API methods */}
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
        <h2 className="font-semibold mb-2 text-orange-900">
          window.openai API Tests:
        </h2>
        <div className="space-y-2">
          <Button
            color="primary"
            onClick={testCallTool}
            size="sm"
            variant="soft"
          >
            Test callTool
          </Button>
          <Button
            color="primary"
            onClick={testSendFollowUp}
            size="sm"
            variant="soft"
          >
            Test sendFollowUpMessage
          </Button>
          <Button
            color="primary"
            onClick={testRequestDisplayMode}
            size="sm"
            variant="soft"
          >
            Request Fullscreen
          </Button>
        </div>
        <p className="text-xs text-gray-600 italic mt-2">
          These buttons test various window.openai methods
        </p>
      </div>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
