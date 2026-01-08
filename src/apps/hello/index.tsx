import React from 'react'
import ReactDOM from 'react-dom/client'
import { Alert } from '@openai/apps-sdk-ui/components/Alert'
import { Button } from '@openai/apps-sdk-ui/components/Button'
import { Textarea } from '@openai/apps-sdk-ui/components/Textarea'

function App() {
  console.log('JoAi ChatGPT App: ', (window as any)?.openai)

  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Hello World</h1>
      <Alert
        actions={
          <Button color="primary" pill variant="soft">
            Dismiss
          </Button>
        }
        title="Hello World"
        description="This app is in progress."
      />
      <span>nice!</span>
      <p>some example text</p>
      <Textarea autoResize placeholder="Enter text..." rows={3} />
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
