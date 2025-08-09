"use client";

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface BillingPaymentProps {
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: Error) => void;
  amount?: number;
  currency?: "usdc" | "sui";     

  
}

export function BillingPayment({
  onClose,
  onSuccess,
  onError,
  amount = 6.50,
  currency = "sui",
}: BillingPaymentProps) {
  const { connected, currentAccount, signAndExecuteTransactionBlock } = useWallet();
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [txSignature, setTxSignature] = useState<string | null>(null);
  
  // Fixed recipient address (Sui address format)
  const recipientAddress = "0x742d35cc6e3c98b916efce2e82d7b4b5c7b3e2c4d8f1a6b9c8e7f0d5a4b3c2e1";
  
  // Sui connection - using testnet for testing
  const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });

  // Format addresses for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  const handlePayment = async () => {
    if (!connected || !currentAccount) {
      toast.error("Wallet not connected");
      return;
    }

    try {
      setStatus("processing");
      
      if (currency === "sui") {
        // Create a transaction block for SUI transfer
        const txb = new TransactionBlock();
        
        // Convert SUI to MIST (1 SUI = 10^9 MIST)
        const amountInMist = BigInt(Math.floor(amount * 1_000_000_000));
        
        // Add a transfer coins instruction
        const [coin] = txb.splitCoins(txb.gas, [amountInMist]);
        txb.transferObjects([coin], recipientAddress);
        
        try {
          console.log("Sending SUI transaction...");
          // Sign and execute the transaction
          const result = await signAndExecuteTransactionBlock({
            transactionBlock: txb,
            options: {
              showEffects: true,
              showObjectChanges: true,
            },
          });
          
          console.log("Transaction result:", result);
          setTxSignature(result.digest);
          
          if (result.effects?.status?.status === "success") {
            // Set success status
            console.log("Setting status to success");
            setStatus("success");
            toast.success("SUI payment successful!");
            
            // Delay onSuccess call to allow UI to update
            setTimeout(() => {
              onSuccess();
            }, 3000);
          } else {
            throw new Error("Transaction failed");
          }
        } catch (txError) {
          console.error("Transaction error:", txError);
          throw txError;
        }
      } else {
        // USDC payment would require a different implementation for Sui
        toast.error("USDC payments not yet implemented for Sui");
        throw new Error("USDC payments not supported");
      }
      
    } catch (error) {
      console.error("Payment error:", error);
      setStatus("error");
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast.error(`Payment failed: ${errorMessage}`);
      onError(error as Error);
    }
  }; // Missing closing bracket for handlePayment function

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        className="bg-background border rounded-lg shadow-lg max-w-md w-full p-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.4 }}
      >
        <h3 className="text-xl font-bold mb-4">Complete Your Payment</h3>
        
        <div className="space-y-4">
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">From</span>
              <span className="font-medium">{currentAccount?.address ? formatAddress(currentAccount.address) : "Your wallet"}</span>
            </div>
            
            <div className="flex justify-center my-2">
              <ArrowRight className="text-muted-foreground" />
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-muted-foreground">To</span>
              <span className="font-medium">{formatAddress(recipientAddress)}</span>
            </div>
          </div>
          
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Amount</span>
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full flex items-center justify-center">
                  {currency === "usdc" ? (
                    <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                      $
                    </div>
                  ) : (
                    <img src="/images/sui_logo.jpg" alt="SUI" className="h-4 w-4" />
                  )}
                </div>
                <span className="font-bold text-lg">{amount} {currency === "usdc" ? "USDC" : "SUI"}</span>
              </div>
            </div>
          </div>
          
          {status === "success" && (
            <div className="rounded-lg border bg-green-500/10 border-green-500/20 p-4">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span className="font-medium">Payment successful!</span>
              </div>
              <a 
                href={`https://suiexplorer.com/txblock/${txSignature}?network=testnet`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-500 hover:underline mt-2 inline-block"
              >
                View transaction
              </a>
            </div>
          )}
          
          {status === "error" && (
            <div className="rounded-lg border bg-red-500/10 border-red-500/20 p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="font-medium">Payment failed. Please try again.</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end space-x-2">
          {status === "idle" && (
            <Button 
              variant="default" 
              onClick={handlePayment}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
                Pay {amount} {currency === "usdc" ? "USDC" : "SUI"}
            </Button>
          )}
          
          {status === "processing" && (
            <Button variant="default" disabled className="gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </Button>
          )}
          
          {status === "success" ? (
            <Button variant="default" onClick={onClose}>
              Done
            </Button>
          ) : (
            <Button variant="ghost" onClick={onClose} disabled={status === "processing"}>
              Cancel
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
} 