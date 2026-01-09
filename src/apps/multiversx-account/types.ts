export type AccountData = {
  address: string
  balance: string
  nonce: number
  timestampMs: number
  timestamp: number
  shard: number
  rootHash: string
  developerReward: string
}

export type ToolData = {
  ACCOUNT_DATA: AccountData
  BALANCE: string
  BALANCE_EGLD: string
  BALANCE_FORMATTED: string
  NONCE: number
  USERNAME: string | null
}
