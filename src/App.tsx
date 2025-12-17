import { Alert } from '@openai/apps-sdk-ui/components/Alert'
import { Button } from '@openai/apps-sdk-ui/components/Button'

export function App() {
  console.log('JoAi ChatGPT App: ', (window as any)?.openai)
  return (
    <div>
      <h1>Hello World</h1>
      <Alert
        actions={
          <Button color="primary" pill variant="soft">
            Dismiss
          </Button>
        }
        title="Hello World"
        description="This app is in progress."
      />
    </div>
  )
}
