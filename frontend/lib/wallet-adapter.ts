import { createNetworkConfig } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient } from '@tanstack/react-query';

// Configure supported networks
const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl('localnet') },
  devnet: { url: getFullnodeUrl('devnet') },
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
});

// Centralized wallet configuration for Sui
export const SUI_WALLET_CONFIG = {
  networks: networkConfig,
  defaultNetwork: 'testnet' as const,
  queryClient: new QueryClient({
    defaultOptions: {
      queries: {
        retry: 3,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  }),
  signatureMessage: 'SuiPass-Auth-Message',
  persistenceKey: 'sui_encryption_data'
} as const;

export const SUI_CONFIG = {
  network: 'testnet' as const,
  endpoint: getFullnodeUrl('testnet'),
  autoConnect: true,
  preferredWallets: ['Sui Wallet', 'Phantom']
} as const;

// Helper function to detect available wallets
export function getAvailableWallets() {
  const wallets = [];
  
  // Check for Sui Wallet
  if (typeof window !== 'undefined' && (window as any).suiWallet) {
    wallets.push('Sui Wallet');
  }
  
  // Check for Phantom with Sui support
  if (typeof window !== 'undefined' && (window as any).phantom?.sui) {
    wallets.push('Phantom');
  }
  
  // Check for other potential Sui wallets
  if (typeof window !== 'undefined') {
    // Add more wallet detection logic here as needed
    const possibleWallets = ['Suiet', 'Ethos', 'Nightly'];
    possibleWallets.forEach(walletName => {
      const walletKey = walletName.toLowerCase();
      if ((window as any)[walletKey]) {
        wallets.push(walletName);
      }
    });
  }
  
  return wallets;
}
