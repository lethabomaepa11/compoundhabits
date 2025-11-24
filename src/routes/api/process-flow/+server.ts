// src/routes/api/process-flow/+server.ts
import { json, type RequestEvent } from '@sveltejs/kit';
import { User, HabitSystem, Habit, DBActivity } from '$lib/types/models';
import { callLLM } from '$lib/services/AIService/llm';
import { generateEmbedding } from '$lib/services/AIService/embed';
import { retrieveHistory } from '$lib/services/AIService/rag';





export const POST = async ({ request , locals: {supabase}}) => {
  const { text } = await request.json();

    const {data: user} = await supabase.auth.getUser();
    if (!user?.user) {
      return json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = user.user.id;

  try {
    // Step 1: RAG Retrieval
      const history = await retrieveHistory(userId, text, 5, supabase);
    const contextStr = history.length 
      ? `User history:\n${history.map(h => `${h.activity_text || ''} (Habit: ${h.habit_metadata}, System: ${h.system_name})`).join('\n')}\n`
          : 'No prior history.';
      
      console.log('RAG History:', history);

    // Step 2: AI Parse & Decide Type
    const parsePrompt = `
      ${contextStr},
      Only output JSON.
      Do not include any explanations.
      DO not GIVE Advice.
      Parse user input: "${text}"
      Decide type: "habit system", "habit", or "activity log".
      Check if matches existing (from context): Suggest ID if yes.
      Output JSON: { type: "...", suggested_system_id?: "...", suggested_habit_id?: "..." }
    `;
    const { output: parseResult } = await callLLM('llama-3.1-8b-instant', parsePrompt, { parseJSON: true });
    const { type, suggested_system_id, suggested_habit_id } = parseResult as { type: string; suggested_system_id?: string; suggested_habit_id?: string };

      console.log('Parse Result:', parseResult);
    // Step 3: DB Checks & Conditional Creation/Logging
    let createdItem = null;
    if (type.includes('activity log')) {
      const habitId = suggested_habit_id || (await promptForMatch(history, text, 'habit'));
      const systemId = await getSystemForHabit(habitId, supabase);

      const activity = new DBActivity(crypto.randomUUID(), habitId, new Date().toISOString(), text);
      const { data } = await supabase.from('activities').insert({
        id: activity.id, habit_id: habitId, created_at: activity.createdAt, text: activity.text,
        user_id: userId, embedding: await generateEmbedding(text),
      }).select().single();

      createdItem = { type: 'activity', data, linked_system: systemId };
    } else {
      const genPrompt = `
        ${contextStr},
        Only output JSON.
      Do not include any explanations.
      DO not GIVE Advice.
        Type: ${type}. Input: "${text}"
        Generate either habit system or habit.
        If habit, link to system ID: "${suggested_system_id || 'N/A'}"
        Generate JSON:
        - habit system: {name, description, category}
        - habit: {name, description, keywords, system_id?: "${suggested_system_id}"}
        Make SMART (Specific, Measurable, etc.).
      `;
        const { output: generated } = await callLLM('llama-3.3-70b-versatile', genPrompt, { parseJSON: true });
        
        console.log('Generated Item:', generated);

      if (type === 'habit system') {
       
          console.log('Creating new habit system');
          const sys = new HabitSystem(crypto.randomUUID(), generated.name, userId, generated.category, generated.description);
          const embeddingArray = await generateEmbedding(generated.description || generated.name);

          const { data, error: systemError } = await supabase.from('habit_systems')
              .insert({
          ...sys, embedding: embeddingArray,
              }).select().single();

          console.log('Habit System Insert Result:', { data, systemError });
          
          if (systemError) throw new Error(`System creation failed: ${systemError.message}`);
          
          createdItem = { type: 'system', data };
          
      } else {  // new habit
          
          const sysId = suggested_system_id || crypto.randomUUID();
          
          if (!suggested_system_id) await createSystemIfNeeded(sysId, userId, text, supabase);
          
          const habit = new Habit(crypto.randomUUID(), sysId, JSON.stringify(generated), generated.keywords);
          
          const { data, error: habitError } = await supabase.from('habits')
              .insert({
          ...habit, user_id: userId, embedding: await generateEmbedding(generated.description),
        }).select().single();
        if (habitError) throw new Error(`Habit creation failed: ${habitError.message}`);
        createdItem = { type: 'habit', data };
      }
    }

    // Step 4: Generate Metrics
    //const metrics = await generateMetrics(userId, type, createdItem, supabase);

    return json({ success: true, createdItem, history });
  } catch (error) {
    return json({ error: (error as Error).message }, { status: 500 });
  }
};

// Helpers (same as before)
async function getSystemForHabit(habitId: string, supabase): Promise<string | null> {
  const { data } = await supabase.from('habits').select('system_id').eq('id', habitId).single();
  if (data) {
    const { data: sys } = await supabase.from('habit_systems').select('id').eq('id', data.system_id).single();
    return sys?.id || null;
  }
  return null;
}

async function promptForMatch(history: any[], text: string, entity: 'habit' | 'system'): Promise<string> {
  return history[0]?.[entity === 'habit' ? 'habit_id' : 'system_id'] || null;
}

async function createSystemIfNeeded(sysId: string, userId: string, text: string, supabase) {
  const { data: exists } = await supabase.from('habit_systems').select('id').eq('id', sysId).maybeSingle();
  if (!exists) {
    const { output: gen } = await callLLM('llama-3.1-8b-instant', `Quick system for "${text}": {name, category}`, { parseJSON: true });
    const sys = new HabitSystem(sysId, gen.name, userId, gen.category);
    await supabase.from('habit_systems').insert({ ...sys });
  }
}

async function generateMetrics(userId: string, type: string, item: any, supabase) {
  const { data: activities } = await supabase
    .from('activities')
    .select('created_at, text')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(30);

  const dates = activities.map(a => new Date(a.created_at).toDateString());
  const uniqueDays = new Set(dates).size;
  const streak = dates.length > 0 ? 1 + dates.slice().reverse().findIndex((d, i) => i === 0 || d !== dates[dates.length - 1 - i]) : 0;

  return {
    type: `${type} metrics`,
    data: { totalActions: activities.length, uniqueDays, streak, avgPerDay: uniqueDays ? (activities.length / uniqueDays).toFixed(1) : 0 },
    chartData: activities.map(a => ({ date: new Date(a.created_at).toLocaleDateString(), count: 1 }))
  };
}