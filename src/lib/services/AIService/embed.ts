// src/lib/utils/embed.ts
import { HF_TOKEN } from '$env/static/private';
import { InferenceClient } from '@huggingface/inference';

const client = new InferenceClient(HF_TOKEN!);

export async function generateEmbedding(text: string, retries = 3): Promise<number[]> {
  if (!HF_TOKEN) {
    throw new Error('HF_TOKEN environment variable is missing. Set it in .env for embeddings.');
  }

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await client.featureExtraction({
        inputs: text.substring(0, 512),  // Truncate to avoid overflow (MiniLM handles ~512 tokens)
        model: 'sentence-transformers/all-MiniLM-L6-v2',
      });

      // result is FeatureExtractionOutput: number[][]; for single input, return first vector
      return result as number[];  // 384-dim float array
    } catch (error: any) {
      console.error(`HF Embed Attempt ${attempt} failed:`, {
        message: error.message,
        status: error.status || 'Unknown',  // e.g., 429 for rate limit
        textLength: text.length,
      });

      if (attempt === retries) {
        throw new Error(`Feature extraction failed after ${retries} attempts: ${error.message}`);
      }
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  throw new Error('Unreachable fallback error');  // Safety
}