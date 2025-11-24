// src/lib/rag.ts
import { generateEmbedding } from './embed';  // Assuming this returns number[] (fixed from prior)

export async function retrieveHistory(
  userId: string, 
  queryText: string, 
  k = 3, 
  supabaseClient  // Pass the client (e.g., from API route)
): Promise<any[]> {
  if (!queryText.trim()) {
    return [];  // Guard for empty queries
  }

  try {
    // Step 1: Embed query text
    const queryEmbeddingArray = await generateEmbedding(queryText);  // number[] (384 dims)

    // Step 2: Serialize to pgvector string format (key fix!)
    if (!Array.isArray(queryEmbeddingArray) || queryEmbeddingArray.length !== 384) {
      throw new Error(`Invalid embedding: Expected 384-dim array, got ${queryEmbeddingArray?.length || 'non-array'}`);
    }
    const queryEmbeddingString = `[${queryEmbeddingArray.join(',')}]`;  // e.g., '[-0.0198,0.1234,...]'

    console.log('Query embedding sample:', queryEmbeddingString.substring(0, 50) + '...');  // Debug: First few vals

    // Step 3: RPC with serialized param
    const { data: matches, error } = await supabaseClient.rpc('match_user_history', {
      query_embedding: queryEmbeddingString,  // Now a string pgvector can parse!
      match_threshold: 0.78,
      match_count: k,
      user_id: userId,
    });

    if (error) {
      console.error('RPC Error:', error);  // e.g., Logs 'invalid vector syntax' if still off
      return [];
    }

    console.log(`Retrieved ${matches?.length || 0} matches (threshold 0.78)`);  // Debug
    return matches || [];
  } catch (err: any) {
    console.error('Retrieval Failed:', err.message);
    return [];  // Fallback: No context (AI uses base prompt)
  }
}