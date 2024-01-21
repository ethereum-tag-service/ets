import { http, createConfig, Config, fallback } from 'wagmi'
import { polygonMumbai } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

export const wagmiConfig: Config = createConfig({
  chains: [polygonMumbai],
  connectors: [metaMask()],
  transports: {
    [polygonMumbai.id]: fallback([
      http('https://lb.nodies.app/v1/6f8058fa231b4cde97f84a438dec6876'),
    ]),
  },
})