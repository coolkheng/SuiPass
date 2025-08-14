"use client";

import { useState, useEffect } from "react";
import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";
import { useRouter } from "next/navigation";
import { useWalletAuthSkip } from "@/hooks/use-wallet-auth-skip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Shield, Check, Wallet, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface WalletAuthGateProps {
  children: React.ReactNode;
}

export function WalletAuthGate({ children }: WalletAuthGateProps) {
  const currentAccount = useCurrentAccount();
  const { hasSkipped, skip } = useWalletAuthSkip();
  const [initializationError, setInitializationError] = useState<string | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(true); // Track first visit
  const router = useRouter();

  // Store wallet address in localStorage when connected
  useEffect(() => {
    if (currentAccount?.address) {
      // Use the hardcoded wallet address for demo consistency
      const HARDCODED_WALLET_ADDRESS = "0x88e8f8666aaf8c29df955623894630dc2fabbc2c15b9634e012c7bed6ae37bc4";
      localStorage.setItem("solkey:walletAddress", HARDCODED_WALLET_ADDRESS);
      setInitializationError(null);
    } else if (!currentAccount) {
      // Clear wallet address when disconnected
      localStorage.removeItem("solkey:walletAddress");
    }
  }, [currentAccount]);

  // Check if this is the user's first visit
  useEffect(() => {
    const firstVisit = localStorage.getItem("solkey:firstVisit");
    if (firstVisit === "false") {
      setIsFirstVisit(false);
    }
  }, []);

  const handleFirstVisitComplete = () => {
    localStorage.setItem("solkey:firstVisit", "false");
    setIsFirstVisit(false);
  };

  const skipAuthentication = () => {
    skip(); // Use the `skip` function from `useWalletAuthSkip`
    handleFirstVisitComplete();
    router.push("/dashboard");
  };

  // If already initialized, user has skipped, or it's not the first visit, show children
  if (currentAccount || hasSkipped || !isFirstVisit) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/80 p-4 md:p-8">
      <div className="mb-8 flex flex-col items-center">
        <Image
          src="/images/sui_logo.jpg"
          alt="Sui Logo"
          width={64}
          height={64}
          className="h-16 w-16 mb-4 rounded-full overflow-hidden"
        />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 animate-gradient-shift bg-[size:200%_auto]">
          SuiPass
        </h1>
      </div>

      <Card className="w-full max-w-md border-blue-200/50 dark:border-blue-800/30 shadow-lg shadow-blue-500/10">
        <CardHeader className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-t-lg border-b border-blue-100 dark:border-blue-800/20">
          <CardTitle className="text-2xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 animate-gradient-shift bg-[size:200%_auto]">
            Wallet Authentication
          </CardTitle>
          <CardDescription>
            Connect your Sui wallet to securely access your encrypted secrets or skip to preview the app.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Alert className="bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50 shadow-sm">
            <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle>End-to-End Encryption</AlertTitle>
            <AlertDescription>
              Your encryption key is derived from your wallet signature and never leaves your device. This ensures only
              you can access your secrets.
            </AlertDescription>
          </Alert>

          {(initializationError) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{initializationError}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border border-blue-100 dark:border-blue-800/30 p-4 bg-white/50 dark:bg-blue-950/20 shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700/40">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-inner shadow-white/20">
                <Wallet className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Step 1: Connect Wallet</h3>
                <p className="text-sm text-muted-foreground">Connect your Sui wallet to continue</p>
              </div>
              {currentAccount ? (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full border border-green-100 dark:border-green-800/30">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Connected</span>
                </div>
              ) : (
                <ConnectButton />
              )}
            </div>
          </div>

          <div className="rounded-lg border border-blue-100 dark:border-blue-800/30 p-4 bg-white/50 dark:bg-blue-950/20 shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700/40">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-inner shadow-white/20">
                <Shield className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Step 2: Sign Message</h3>
                <p className="text-sm text-muted-foreground">
                  Signing a message is required when encrypting and decrypting your secrets.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 border-t border-blue-100 dark:border-blue-800/20 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-b-lg pt-4">
          <p className="text-center text-sm text-muted-foreground">
            Your wallet is used to securely encrypt and decrypt your secrets. We never have access to your unencrypted
            data.
          </p>

          <div className="w-full flex flex-col items-center">
            <Button
              variant="outline"
              onClick={skipAuthentication}
              className="w-full max-w-xs border-dashed border-blue-200 dark:border-blue-800/40 text-muted-foreground hover:bg-blue-50 dark:hover:bg-blue-900/20 group"
            >
              <Eye className="h-4 w-4 mr-2 text-blue-400 group-hover:text-blue-600 dark:text-blue-500 dark:group-hover:text-blue-400" />
              Skip and preview app
            </Button>
            <p className="mt-2 text-xs text-center text-muted-foreground px-6">
              Some features will be limited without wallet authentication
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}