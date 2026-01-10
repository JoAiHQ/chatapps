export type ProviderClaim = {
  provider: string
  txHash: string
  rewardsClaimed: string
  rewardsClaimedEgld: number
}

export type ClaimAllRewardsData = {
  CLAIMS: ProviderClaim[]
  TOTAL_REWARDS_CLAIMED: string
  TOTAL_REWARDS_CLAIMED_EGLD: number
  PROVIDER_COUNT: number
}
