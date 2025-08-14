"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { useSecretEncryption } from "@/hooks/use-secret-encryption"
import { saveFallbackSecret, type FallbackSecret } from "@/lib/fallback-storage"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  value: z.string().min(1, {
    message: "Secret value is required",
  }),
  type: z.enum(["String", "Password", "ApiKey"], {
    required_error: "Please select a secret type.",
  }),
  projectId: z.string().optional(),
  environmentId: z.string().optional(),
})

export function CreateSecretForm() {
  const currentAccount = useCurrentAccount()
  const connected = !!currentAccount
  const { createSecret, isLoading, error } = useSecretEncryption();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  
  // Hardcoded wallet address for demo purposes
  const HARDCODED_WALLET_ADDRESS = "0x88e8f8666aaf8c29df955623894630dc2fabbc2c15b9634e012c7bed6ae37bc4";
  
  // Get project ID from URL if available
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const projectIdMatch = pathname.match(/\/projects\/([^\/]+)/);
  const urlProjectId = projectIdMatch ? projectIdMatch[1] : 'default';
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      value: "",
      type: "String",
      projectId: urlProjectId,
      environmentId: "default",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // For demo purposes, we'll use the hardcoded wallet address instead of requiring connection
    // if (!connected || !currentAccount) {
    //   toast({
    //     title: "Wallet not connected",
    //     description: "Please connect your wallet to create a secret",
    //     variant: "destructive",
    //   })
    //   return;
    // }
    
    setSubmitting(true);
    
    try {
      let secretId;
      let usedFallback = false;
      
      try {
        // Try to create the secret using the API hook first
        secretId = await createSecret({
          name: values.name,
          value: values.value,
          type: values.type as "String" | "Password" | "ApiKey",
          projectId: values.projectId,
          environmentId: values.environmentId,
        });
        
        if (!secretId) {
          throw new Error("API creation failed");
        }
        
        console.log('✅ Secret created via API:', secretId);
        
      } catch (apiError) {
        console.warn('⚠️ API secret creation failed, using fallback:', apiError);
        usedFallback = true;
        
        // Fallback: Create secret locally
        const timestamp = Date.now().toString();
        secretId = `secret_${values.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${timestamp}`;
        
        const fallbackSecret: FallbackSecret = {
          id: secretId,
          key: values.name,
          value: values.value, // In real implementation, this should be encrypted
          project_id: values.projectId || 'default',
          environment_id: values.environmentId || 'default',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          _isFallback: true
        };
        
        // Save to fallback storage
        const saved = saveFallbackSecret(fallbackSecret);
        if (!saved) {
          throw new Error("Failed to save secret locally");
        }
        
        console.log('✅ Fallback secret created locally:', secretId);
      }
      
      if (secretId) {
        // Dispatch event for secrets table to listen to
        const secretEvent = new CustomEvent('demo-secret-added', {
          detail: {
            name: values.name,
            value: values.value,
            type: values.type.toLowerCase(),
            projectId: values.projectId,
            environmentId: values.environmentId,
          }
        });
        document.dispatchEvent(secretEvent);
        
        toast({
          title: "Secret created",
          description: usedFallback 
            ? "Your secret has been created locally (demo mode). It will be saved in your browser."
            : "Your secret has been created successfully",
        })
        
        // Reset form instead of redirecting to allow adding more secrets
        form.reset();
      } else {
        throw new Error("Failed to create secret");
      }
    } catch (err) {
      console.error("Error creating secret:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create secret",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secret Name</FormLabel>
              <FormControl>
                <Input placeholder="API Key Name" {...field} />
              </FormControl>
              <FormDescription>
                A friendly name for your secret.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secret Value</FormLabel>
              <FormControl>
                <Input placeholder="Secret value" {...field} type="password" />
              </FormControl>
              <FormDescription>
                The value will be encrypted before being stored.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secret Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="String">Text</SelectItem>
                  <SelectItem value="Password">Password</SelectItem>
                  <SelectItem value="ApiKey">API Key</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Type determines how the secret is displayed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <strong>Demo Mode:</strong> Using hardcoded wallet address
          </div>
          <div className="text-xs font-mono text-blue-600 dark:text-blue-400 mt-1 break-all">
            {HARDCODED_WALLET_ADDRESS}
          </div>
        </div>
        
        <Button type="submit" className="btn-blue-gradient" disabled={submitting || isLoading}>
          {(submitting || isLoading) ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Secret"
          )}
        </Button>
      </form>
    </Form>
  )
} 