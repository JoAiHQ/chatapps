import { Alert } from '@openai/apps-sdk-ui/components/Alert'
import { Button } from '@openai/apps-sdk-ui/components/Button'

export type UpgradePromptData = {
  paymentUrl?: string
  feature?: string
  message?: string
  buttonLabel?: string
  ['_joai/upgrade']?: boolean
}

type UpgradePromptProps = {
  data?: UpgradePromptData
}

export function UpgradePrompt({ data }: UpgradePromptProps) {
  const paymentUrl = data?.paymentUrl
  const title = `Upgrade to unlock ${data?.feature || 'this feature'}`
  const message = data?.message ?? 'Upgrade to get premium features and higher limits in seconds.'
  const buttonLabel = data?.buttonLabel ?? 'Upgrade now'

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
          {buttonLabel}
        </Button>
      }
    />
  )
}
