import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from '@wagmi/chains'

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: '2d93d6df5128ff9d918e9b86ae7a3999',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    // ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia] : []),
  ],
  ssr: true,
});