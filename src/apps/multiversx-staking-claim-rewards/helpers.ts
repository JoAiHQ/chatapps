export function shortenHash(hash: string): string {
  if (hash.length <= 16) return hash
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}

export function shortenAddress(address: string): string {
  if (address.length <= 16) return address
  return `${address.slice(0, 8)}...${address.slice(-6)}`
}
