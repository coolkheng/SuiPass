"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Copy,
  MoreHorizontal,
  Clock,
  Plus,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { useWalletEncryption } from "@/hooks/use-wallet-encryption";
import { useWallet } from "@solana/wallet-adapter-react";
import { EncryptedData } from "@/lib/crypto";
import { usePermissionProgram } from "@/hooks/usePermissionProgram";

type Secret = {
  id: string;
  name: string;
  value: string;
  type: "string" | "number" | "boolean" | "json" | "reference";
  iv: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  decryptedValue?: string;
};

export function SecretsTable({
  projectId,
  environment,
  searchQuery,
  projectOwner,
}: {
  projectId: string;
  environment: string;
  searchQuery: string;
  projectOwner: string;
}) {
  // Hardcoded wallet address for demo
  const HARDCODED_WALLET_ADDRESS = "0x88e8f8666aaf8c29df955623894630dc2fabbc2c15b9634e012c7bed6ae37bc4";
  
  // Mock hardcoded secrets data for demo
  const mockSecrets: Secret[] = [
    {
      id: "demo_secret_1",
      name: "API_KEY",
      value: "uu23LqLrABmXYKBa8TtMS72WryOehs9Kw2Cl+olyw6kwy9vM1x8Ek12LmYpQKhU=", // Realistic encrypted data
      type: "string",
      iv: "demo_iv_123456789",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "demo_user",
      updatedBy: "demo_user",
      decryptedValue: "sk-1234567890abcdef", // Pre-set decrypted value for demo
    },
    {
      id: "demo_secret_2", 
      name: "DATABASE_URL",
      value: "ds9LHW/i0pTWgI5VXfYE985WDDpLrId1OeGXp9E+8LvI6dA6GjTAOql6nlonWryG7iJxS9SfyUp+Yuw=",
      type: "string",
      iv: "demo_iv_987654321",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "demo_user",
      updatedBy: "demo_user",
      decryptedValue: "postgresql://user:pass@localhost:5432/mydb",
    },
    {
      id: "demo_secret_3",
      name: "JWT_SECRET",
      value: "HhXOuLj9AU6QXLKKq8dRkkPGvdng",
      type: "string", 
      iv: "demo_iv_abc123def",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "demo_user",
      updatedBy: "demo_user",
      decryptedValue: "super_secret_jwt_key_2024",
    }
  ];

  const [secrets, setSecrets] = useState<Secret[]>(mockSecrets);
  const [loading, setLoading] = useState(false); // Set to false since we're using mock data
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(true); // Always true for demo

  // State for visible secrets
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>(
    {}
  );
  const [decryptingSecrets, setDecryptingSecrets] = useState<
    Record<string, boolean>
  >({});

  // Wallet hooks for authentication and encryption (keeping for compatibility)
  const { publicKey, connected } = useWallet();
  const { isInitialized, handleSignMessage, decryptData } =
    useWalletEncryption();

  // Listen for new secrets added from CreateSecretForm
  useEffect(() => {
    const handleNewSecret = (event: CustomEvent) => {
      const newSecret = event.detail;
      if (newSecret && newSecret.name && newSecret.value) {
        const demoSecret: Secret = {
          id: `demo_secret_${Date.now()}`,
          name: newSecret.name,
          value: `encrypted_${newSecret.value}_demo`, // Mock encryption
          type: newSecret.type || "string",
          iv: `demo_iv_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: "demo_user",
          updatedBy: "demo_user",
          decryptedValue: newSecret.value, // Store original value as "decrypted"
        };
        
        setSecrets(prev => [...prev, demoSecret]);
        
        toast({
          title: "Secret Added Successfully",
          description: `Secret "${newSecret.name}" has been added to the demo environment.`,
        });
      }
    };

    // Listen for custom events from CreateSecretForm
    document.addEventListener('demo-secret-added', handleNewSecret as EventListener);
    
    return () => {
      document.removeEventListener('demo-secret-added', handleNewSecret as EventListener);
    };
  }, []);

  // Mock permission check - always allow for demo
  useEffect(() => {
    setHasPermission(true);
  }, []);

  // Filter secrets based on search query
  const filteredSecrets = secrets.filter((secret) =>
    secret.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simple demo toggle secret visibility - no actual decryption needed
  const toggleSecretVisibility = async (secret: Secret) => {
    // If already visible, just hide it
    if (visibleSecrets[secret.id]) {
      setVisibleSecrets((prev) => ({ ...prev, [secret.id]: false }));
      return;
    }

    // For demo purposes, simulate a brief loading state
    setDecryptingSecrets((prev) => ({ ...prev, [secret.id]: true }));
    
    // Simulate decryption delay
    setTimeout(() => {
      setVisibleSecrets((prev) => ({ ...prev, [secret.id]: true }));
      setDecryptingSecrets((prev) => ({ ...prev, [secret.id]: false }));
      
      toast({
        title: "Secret Revealed",
        description: `Successfully revealed ${secret.name} using demo wallet ${HARDCODED_WALLET_ADDRESS.substring(0, 8)}...`,
      });
    }, 500); // Half second delay for realism
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Secret value has been copied to clipboard.",
    });
  };

  return (
    <div className="rounded-md border">
      <div className="p-2 bg-muted/40 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="capitalize bg-background">
            {environment}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {filteredSecrets.length}{" "}
            {filteredSecrets.length === 1 ? "secret" : "secrets"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
          >
            <span className="flex items-center gap-1">Demo Mode</span>
          </Badge>
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
          >
            <span className="flex items-center gap-1">Access Granted</span>
          </Badge>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[30%]">Key</TableHead>
            <TableHead className="w-[40%]">Value</TableHead>
            <TableHead className="w-[15%]">Type</TableHead>
            <TableHead className="w-[15%]">Last Updated</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Loading secrets...
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : filteredSecrets.length > 0 ? (
            filteredSecrets.map((secret) => (
              <TableRow key={secret.id}>
                <TableCell className="font-medium">{secret.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-sm">
                      <span
                        className={
                          secret.type === "number"
                            ? "text-green-600 dark:text-green-400"
                            : secret.type === "boolean"
                            ? "text-amber-600 dark:text-amber-400"
                            : secret.type === "json"
                            ? "text-purple-600 dark:text-purple-400"
                            : secret.type === "reference"
                            ? "text-blue-600 dark:text-blue-400"
                            : ""
                        }
                      >
                        {visibleSecrets[secret.id]
                          ? secret.decryptedValue || "Decryption failed"
                          : secret.value || "******************"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleSecretVisibility(secret)}
                      disabled={decryptingSecrets[secret.id]}
                    >
                        {decryptingSecrets[secret.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : visibleSecrets[secret.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {visibleSecrets[secret.id] ? "Hide" : "Show"}{" "}
                          {secret.name}
                        </span>
                      </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        // Copy decrypted value if visible, otherwise copy encrypted value
                        const valueToCopy = visibleSecrets[secret.id] && secret.decryptedValue 
                          ? secret.decryptedValue 
                          : secret.value;
                        
                        const isDecrypted = visibleSecrets[secret.id] && secret.decryptedValue;

                        copyToClipboard(valueToCopy);

                        toast({
                          title: isDecrypted ? "Decrypted Value Copied" : "Encrypted Value Copied",
                          description: `The ${isDecrypted ? 'decrypted' : 'encrypted'} value for ${secret.name} has been copied to clipboard.`,
                        });
                      }}
                    >
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy {secret.name}</span>
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      secret.type === "string"
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                        : secret.type === "number"
                        ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                        : secret.type === "boolean"
                        ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                        : secret.type === "json"
                        ? "bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-400"
                        : "bg-gray-50 text-gray-700 dark:bg-gray-950/30 dark:text-gray-400"
                    }
                  >
                    {secret.type || "string"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(secret.updatedAt).toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    by {secret.updatedBy || "system"}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => copyToClipboard(secret.name)}
                      >
                        Copy name
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          const valueToCopy = visibleSecrets[secret.id] && secret.decryptedValue 
                            ? secret.decryptedValue 
                            : secret.value;
                          const isDecrypted = visibleSecrets[secret.id] && secret.decryptedValue;
                          
                          copyToClipboard(valueToCopy);
                          toast({
                            title: isDecrypted ? "Decrypted Value Copied" : "Encrypted Value Copied",
                            description: `The ${isDecrypted ? 'decrypted' : 'encrypted'} value for ${secret.name} has been copied to clipboard.`,
                          });
                        }}
                      >
                        Copy value
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          const valueToCopy = visibleSecrets[secret.id] && secret.decryptedValue 
                            ? secret.decryptedValue 
                            : secret.value;
                          const isDecrypted = visibleSecrets[secret.id] && secret.decryptedValue;
                          
                          copyToClipboard(`${secret.name}=${valueToCopy}`);
                          toast({
                            title: isDecrypted ? "Decrypted Value Copied" : "Encrypted Value Copied",
                            description: `The ${isDecrypted ? 'decrypted' : 'encrypted'} value for ${secret.name} has been copied to clipboard in .env format.`,
                          });
                        }}
                      >
                        Copy as .env
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Edit secret</DropdownMenuItem>
                      <DropdownMenuItem>View history</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Delete secret
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="text-center">
                  <h3 className="text-lg font-medium">
                    No secrets found in {environment}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? `No secrets matching "${searchQuery}"`
                      : "Get started by adding your first secret"}
                  </p>
                  {!searchQuery && (
                    <Button
                      className="mt-4"
                      onClick={() => {
                        document.dispatchEvent(
                          new CustomEvent("open-add-secret-dialog", {
                            detail: { environment },
                          })
                        );
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Secret
                    </Button>
                  )}
                  {error && (
                    <p className="mt-2 text-sm text-destructive">{error}</p>
                  )}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
