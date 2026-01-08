import { Button } from '@openai/apps-sdk-ui/components/Button'
import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Counter App</h1>
      <div className="text-6xl font-bold text-center">{count}</div>
      <div className="flex gap-2">
        <Button
          color="info"
          onClick={() => setCount(count - 1)}
          variant="outline"
        >
          Decrement
        </Button>
        <Button onClick={() => setCount(count + 1)} color="primary">
          Increment
        </Button>
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
