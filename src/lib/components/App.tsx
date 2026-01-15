import React, { useContext } from 'react'
import { useApp, UseAppResult } from '../hooks/useApp'
import { UpgradePrompt } from './Billing/UpgradePrompt'

const AppContext = React.createContext<UseAppResult<any> | null>(null)

type Props = {
  children: React.ReactNode
}

export function App(props: Props) {
  const app = useApp()

  if (app.paymentRequired) {
    const meta = app.meta as { title: string; description: string; paymentUrl: string }
    return <UpgradePrompt title={meta.title} description={meta.description} paymentUrl={meta.paymentUrl} />
  }

  return <AppContext.Provider value={app}>{props.children}</AppContext.Provider>
}

export function useAppContext<T = any>(): UseAppResult<T> {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppContext must be used within AppRoot.')
  return context as UseAppResult<T>
}
