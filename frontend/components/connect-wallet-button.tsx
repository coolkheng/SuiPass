"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Wallet, CheckCircle, LogOut, ChevronDown } from "lucide-react";
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

  const handleConnect = async (walletName?: string) => {
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

      // Find specific wallet or use the first available one
      const targetWallet = walletName 
        ? availableWallets.find(w => w.name === walletName)
        : availableWallets[0];

      if (!targetWallet) {
        toast.error(`${walletName || 'Wallet'} not found. Please install it first.`);
        return;
      }

      connect(
        { wallet: targetWallet },
        {
          onSuccess: () => {
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-700">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {truncatedAddress}
              </span>
              <ChevronDown className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleDisconnect} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect Wallet
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const availableWallets = wallets.filter(wallet => 
    wallet.features['standard:connect'] && 
    typeof window !== 'undefined'
  );

  if (availableWallets.length === 0) {
    return (
      <Button
        disabled
        className={`bg-gradient-to-r from-gray-400 to-gray-500 ${className || ''}`}
      >
        <Wallet className="w-4 h-4 mr-2" />
        No Wallets Found
      </Button>
    );
  }

  if (availableWallets.length === 1) {
    return (
      <Button
        onClick={() => handleConnect(availableWallets[0].name)}
        disabled={isConnecting}
        className={`bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg transition-all duration-300 hover:scale-105 ${className || ''}`}
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? 'Connecting...' : `Connect ${availableWallets[0].name}`}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={isConnecting}
          className={`bg-gradient-to-r from-blue-600 to-cyan-500 hover:shadow-lg transition-all duration-300 hover:scale-105 ${className || ''}`}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {availableWallets.map((wallet) => (
          <DropdownMenuItem 
            key={wallet.name}
            onClick={() => handleConnect(wallet.name)}
            className="flex items-center gap-2"
          >
            {wallet.icon && (
              <img 
                src={wallet.icon} 
                alt={wallet.name} 
                className="w-4 h-4"
              />
            )}
            Connect {wallet.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Also export as default for compatibility
export default ConnectWalletButton;
