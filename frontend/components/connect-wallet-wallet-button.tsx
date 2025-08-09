"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, CheckCircle, LogOut } from "lucide-react";
import { 
  useCurrentAccount, 
  useConnectWallet, 
  useDisconnectWallet,
  useWallets 
} from '@mysten/dapp-kit';
import { formatAddress } from '@mysten/sui.js/utils';
import { toast } from 'sonner';

interface ConnectWalletButtonProps {
  className?: string;
}

export function ConnectWalletButton({ className }: ConnectWalletButtonProps) {
  const currentAccount = useCurrentAccount();
  const { mutate: connect } = useConnectWallet();
  const { mutate: disconnect } = useDisconnectWallet();
  const wallets = useWallets();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    
    try {
      // Get available wallets that support connection
      const availableWallets = wallets.filter(wallet => 
        wallet.features['standard:connect'] && 
        typeof window !== 'undefined'
      );

      if (availableWallets.length === 0) {
        toast.error('No compatible wallets found. Please install a Sui wallet.');
        return;
      }

      // Try to connect to the first available wallet
      const targetWallet = availableWallets[0];

      connect(
        { wallet: targetWallet },
        {
          onSuccess: () => {
            console.log(`Connected to ${targetWallet.name} successfully`);
            toast.success(`Connected to ${targetWallet.name}`);
          },
          onError: (error: any) => {
            console.error('Failed to connect wallet:', error);
            toast.error(`Failed to connect to ${targetWallet.name}. Please try again.`);
          },
        }
      );
    } catch (error) {
      console.error('Connection error:', error);
      toast.error('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    toast.success('Wallet disconnected');
  };

  // Show disconnect button if connected
  if (currentAccount) {
    const truncatedAddress = formatAddress(currentAccount.address);
    
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-700">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            {truncatedAddress}
          </span>
        </div>
        <Button
          onClick={handleDisconnect}
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      className={`bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg transition-all duration-300 hover:scale-105 ${className || ''}`}
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
}

// Also export as default for compatibility
export default ConnectWalletButton;
