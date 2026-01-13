import { Button } from '@openai/apps-sdk-ui/components/Button'
import { Card } from '@openai/apps-sdk-ui/components/Icon'

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
    <div className="min-h-screen bg-surface-secondary text-primary flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-default bg-surface p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-warning/10 text-warning">
            <Card className="size-6" />
          </div>
          <div>
            <h1 className="heading-lg">{title}</h1>
            <p className="text-sm text-secondary">Premium features, unlocked.</p>
          </div>
        </div>
        <div className="mt-4 rounded-2xl border border-warning/30 bg-warning/10 p-4 text-sm text-warning">{message}</div>
        <div className="mt-6">
          <Button color="primary" block onClick={handlePaymentClick} disabled={!paymentUrl}>
            {buttonLabel}
          </Button>
        </div>
        <p className="mt-3 text-xs text-secondary">Secure checkout. Instant unlock.</p>
        {paymentUrl && (
          <div className="mt-2 break-all rounded-xl border border-subtle bg-surface-secondary px-3 py-2 text-xs text-secondary">
            {paymentUrl}
          </div>
        )}
      </div>
    </div>
  )
}
