export type UndelegatedItem = {
  amount: string
  seconds: number
}

export type Delegation = {
  address: string
  contract: string
  userUnBondable: string
  userActiveStake: string
  claimableRewards: string
  userUndelegatedList: UndelegatedItem[]
}

export type DelegationData = {
  DELEGATIONS: Delegation[]
  TOTAL_STAKED: string
  TOTAL_STAKED_EGLD: number
  TOTAL_REWARDS: string
  TOTAL_REWARDS_EGLD: number
  PROVIDER_COUNT: number
}
