'use client';

import { PermissionProgramTester } from '@/components/PermissionProgramTester';
// import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';

// Extend Window interface for Sui wallet
declare global {
  interface Window {
    suiWallet?: any;
    sui?: any;
    phantom?: any;
    martian?: any;
    slush?: any;
  }
}

export default function PermissionTestPage() {
  // const currentAccount = useCurrentAccount();
  const [isClient, setIsClient] = useState(false);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  // Handle hydration mismatch
  useEffect(() => {
    setIsClient(true);
    // Check if wallet is already connected
    checkWalletConnection();
  }, []);

  const debugWallets = () => {
    if (typeof window === 'undefined') {
      console.log('Window is undefined');
      return;
    }
    
    console.log('=== Wallet Debug Info ===');
    console.log('window.suiWallet:', !!window.suiWallet);
    console.log('window.sui:', !!window.sui);
    console.log('window.phantom:', !!window.phantom);
    console.log('window.phantom?.sui:', !!window.phantom?.sui);
    console.log('window.martian:', !!window.martian);
    console.log('window.slush:', !!window.slush);
    
    // Log all properties that might be wallets
    const walletKeys = Object.keys(window).filter(key => 
      key.toLowerCase().includes('sui') || 
      key.toLowerCase().includes('wallet') ||
      key.toLowerCase().includes('phantom') ||
      key.toLowerCase().includes('martian') ||
      key.toLowerCase().includes('slush')
    );
    console.log('Potential wallet properties:', walletKeys);
    
    alert(`Wallet Detection:\n- suiWallet: ${!!window.suiWallet}\n- sui: ${!!window.sui}\n- phantom: ${!!window.phantom}\n- phantom.sui: ${!!window.phantom?.sui}\n- martian: ${!!window.martian}\n- slush: ${!!window.slush}\n\nCheck console for more details.`);
  };

  const getWalletProvider = () => {
    if (typeof window === 'undefined') return null;
    
    // Check for different wallet providers in order of preference
    // Prioritize Phantom.sui since it's detected and working
    if (window.phantom?.sui) return window.phantom.sui;
    if (window.slush) return window.slush;
    if (window.suiWallet) return window.suiWallet;
    if (window.sui) return window.sui;
    if (window.martian) return window.martian;
    
    return null;
  };

  const checkWalletConnection = async () => {
    const wallet = getWalletProvider();
    if (wallet) {
      try {
        const accounts = await wallet.getAccounts();
        if (accounts && accounts.length > 0) {
          setConnected(true);
          setPublicKey(accounts[0]);
        }
      } catch (error) {
        console.log('Wallet not connected:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window === 'undefined') return;
    
    console.log('=== Connect Wallet Debug ===');
    setConnecting(true);
    try {
      const wallet = getWalletProvider();
      console.log('Wallet provider found:', !!wallet);
      console.log('Wallet provider type:', wallet === window.phantom?.sui ? 'Phantom Sui' : 'Other');
      
      if (!wallet) {
        console.log('No wallet provider found');
        alert('No Sui wallet found! Please install a Sui wallet extension like:\n- Phantom (with Sui support) ✓ Detected\n- Slush Wallet\n- Sui Wallet\n- Martian Wallet');
        setConnecting(false);
        return;
      }

      console.log('Available wallet methods:', Object.keys(wallet));

      // Request connection - different wallets may have different methods
      let result;
      try {
        console.log('Trying primary connection method...');
        // For Phantom Sui wallet, try connect first
        if (wallet === window.phantom?.sui) {
          console.log('Using Phantom Sui connect method');
          result = await wallet.connect();
          console.log('Phantom connect result:', result);
        } else {
          console.log('Using requestPermissions method');
          // Try the standard requestPermissions method first for other wallets
          result = await wallet.requestPermissions({
            permissions: ['viewAccount'],
          });
          console.log('RequestPermissions result:', result);
        }
      } catch (e) {
        console.log('First connection method failed, trying alternative:', e);
        // If that fails, try the opposite method
        try {
          if (wallet === window.phantom?.sui) {
            console.log('Trying Phantom requestPermissions fallback');
            result = await wallet.requestPermissions({
              permissions: ['viewAccount'],
            });
          } else {
            console.log('Trying connect fallback');
            result = await wallet.connect();
          }
          console.log('Fallback method result:', result);
        } catch (e2) {
          console.log('Both connection methods failed:', e2);
          throw new Error('Failed to connect with this wallet type');
        }
      }

      console.log('Connection successful, getting accounts...');
      if (result) {
        const accounts = await wallet.getAccounts();
        console.log('Accounts retrieved:', accounts);
        if (accounts && accounts.length > 0) {
          setConnected(true);
          setPublicKey(accounts[0]);
          console.log('Wallet connected successfully with address:', accounts[0]);
        } else {
          console.log('No accounts found');
          throw new Error('No accounts found');
        }
      } else {
        console.log('Connection result was falsy');
        throw new Error('Connection failed - no result');
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      alert(`Failed to connect wallet: ${error.message || error}\nCheck console for details.`);
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnected(false);
    setPublicKey(null);
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sui Permission Program Test</h1>
      
      <div className="mb-6">
        <div className="flex items-center gap-4">
          {!connected ? (
            <button 
              onClick={connectWallet}
              disabled={connecting}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {connecting ? 'Connecting...' : 'Connect Sui Wallet'}
            </button>
          ) : (
            <button 
              onClick={disconnectWallet}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Disconnect Wallet
            </button>
          )}
          <button 
            onClick={debugWallets}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Debug Wallets
          </button>
        </div>
        {connected && publicKey && (
          <p className="mt-2 text-sm text-green-500">
            Connected: {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
          </p>
        )}
      </div>
      
      {connected ? (
        <PermissionProgramTester />
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            Please connect your Sui wallet to use the permission program tester.
          </p>
        </div>
      )}
      
      <div className="mt-8 text-sm text-gray-600">
        <p>This page allows you to test the Sui permission program functionality:</p>
        <ul className="list-disc pl-6 mt-2">
          <li>Initialize a new project (creates a Sui object owned by your connected wallet)</li>
          <li>Add team members to your project by their wallet addresses</li>
          <li>Remove team members from your project</li>
          <li>Check if a wallet address is a member of a specific project</li>
        </ul>
      </div>
    </div>
  );
} 