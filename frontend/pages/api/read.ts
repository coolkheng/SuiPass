// src/pages/api/read.ts - API route to fetch an encrypted secret blob for the client
import type { NextApiRequest, NextApiResponse } from 'next';
import { walrusReadBlob } from '@/lib/walrus.client';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const secretId = req.query.secretId as string;
    const walletAddress = req.query.walletAddress as string;
    if (!secretId || !walletAddress) {
      return res.status(400).json({ error: 'Missing secretId or walletAddress' });
    }
    // Verify that the requesting user has access to this secret via project membership
    if (supabaseAdmin) {
      const { data: secret, error } = await supabaseAdmin.from('secrets')
        .select('project_id')
        .eq('id', secretId)
        .single();
      if (error || !secret) {
        return res.status(404).json({ error: 'Secret not found' });
      }
      // Check if user is a member of the project (exists in project_members with matching wallet_address)
      const { data: membership } = await supabaseAdmin.from('project_members')
        .select('id')
        .eq('project_id', secret.project_id)
        .eq('wallet_address', walletAddress);
      if (!membership || membership.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }
    // Lookup blobId in DB
    let blobId: string | null = null;
    if (supabaseAdmin) {
      const { data: secretRec } = await supabaseAdmin.from('secrets')
        .select('blob_id')
        .eq('id', secretId)
        .maybeSingle();
      blobId = secretRec?.blob_id || null;
    }
    if (!blobId) {
      return res.status(404).json({ error: 'Encrypted data not found' });
    }
    // Fetch encrypted data from Walrus storage
    const encryptedBytes = await walrusReadBlob(blobId);
    // Return as base64 to avoid binary issues in JSON
    const encryptedBase64 = Buffer.from(encryptedBytes).toString('base64');
    return res.status(200).json({ encryptedData: encryptedBase64 });
  } catch (error: any) {
    console.error('Read error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch secret' });
  }
}
