// src/pages/api/upload.ts - API route to handle secure content upload (encryption + storage)
import type { NextApiRequest, NextApiResponse } from 'next';
import { secureStoreContent } from '@/lib/secure-store.service';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for database operations (using service role key for privileged access)
const supabaseAdmin = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)
  : null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { projectId, environmentId, name, plaintext } = req.body;
    const walletAddress = req.body.walletAddress;
    if (!walletAddress) {
      return res.status(400).json({ error: 'Missing walletAddress' });
    }
    if (!projectId || !name || !plaintext) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    // Fetch the policy (allowlist) object ID associated with this project
    let { data: projectData, error: projErr } = await supabaseAdmin!.from('projects')
      .select('allowlist_id')
      .eq('id', projectId)
      .maybeSingle();
    if (projErr || !projectData?.allowlist_id) {
      console.error('Project allowlist_id not found or query error:', projErr);
      return res.status(500).json({ error: 'Project policy not found' });
    }
    const policyObjectId: string = projectData.allowlist_id;
    // The Move package ID for the policy module is expected to be configured in environment
    const policyPackageId = process.env.POLICY_PACKAGE_ID || process.env.NEXT_PUBLIC_POLICY_PACKAGE_ID;
    if (!policyPackageId) {
      return res.status(500).json({ error: 'Policy package ID not configured' });
    }
    // Encrypt and store the content
    const plaintextBytes = new TextEncoder().encode(plaintext);
    const { secretId, blobId } = await secureStoreContent(policyPackageId, policyObjectId, plaintextBytes);
    // Store metadata in database (name, associations, but not plaintext or key)
    if (supabaseAdmin) {
      await supabaseAdmin.from('secrets').insert({
        id: secretId,
        project_id: projectId,
        environment_id: environmentId || null,
        name: name,
        blob_id: blobId,
        // type can be derived from plaintext or specified; default to 'String'
        type: 'String'
      });
    }
    return res.status(200).json({ secretId, blobId });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: error.message || 'Failed to store secret' });
  }
}
