// src/lib/llm.ts
import { GROQ_API_KEY } from '$env/static/private';
import Groq from 'groq-sdk'; 

const groq = new Groq({ apiKey: GROQ_API_KEY! });

export async function callLLM(model: string, prompt: string, options: { parseJSON?: boolean } = {}) {
  const completion = await groq.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt + '\n Only output JSON, DO NOT USE ANY PROGRAMMING LANGUAGE' }],
    max_tokens: 500,
    temperature: 0.7,
  });

  let output = completion.choices[0]?.message?.content || '';
  
  if (options.parseJSON) {
    try {
      //console.log('Raw LLM Output:', output);
      // Clean up the output to ensure it's valid JSON
      const jsonIndex = output.indexOf('{');
      if (jsonIndex !== -1) {
        output = output.substring(jsonIndex, output.lastIndexOf('}') + 1);
      }
      console.log('Cleaned LLM Output:', output);
      output = output.trim();
      output = output.replace(/```json|```/g, ''); // Remove code block markers
      output = output.replace(/```/g, '');
      output = output.trim();
      output = JSON.parse(output);
    } catch (e) {
      console.error('JSON Parse Error:', e);
    }
  }
  
  return { output };
}