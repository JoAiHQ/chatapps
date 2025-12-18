import { Alert } from '@openai/apps-sdk-ui/components/Alert'
import { Button } from '@openai/apps-sdk-ui/components/Button'

export function App() {
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
    </div>
  )
}
