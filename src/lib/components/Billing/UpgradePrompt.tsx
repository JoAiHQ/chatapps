import { Alert } from '@openai/apps-sdk-ui/components/Alert'
import { Button } from '@openai/apps-sdk-ui/components/Button'

export type UpgradePromptData = {
  title?: string
  body?: string
  paymentUrl?: string
  ['_joai/upgrade']?: boolean
}

type UpgradePromptProps = {
  data?: UpgradePromptData
}

export function UpgradePrompt({ data }: UpgradePromptProps) {
  const paymentUrl = data?.paymentUrl
  const title = data?.title ?? 'Upgrade to unlock this feature'
  const message = data?.body ?? 'Upgrade to get premium features and higher limits in seconds.'

  const handlePaymentClick = () => {
    if (!paymentUrl) return
    if (window.openai?.openExternal) {
      window.openai.openExternal({ href: paymentUrl })
      return
    }
    window.open(paymentUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Alert
      variant="soft"
      color="discovery"
      title={title}
      description={message}
      actions={
        <Button color="primary" onClick={handlePaymentClick} disabled={!paymentUrl} variant="soft">
          Upgrade now
        </Button>
      }
    />
  )
}
