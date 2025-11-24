import { json } from '@sveltejs/kit';

export const GET = async({locals: {supabase}}) => {
    await supabase.from('users').select('id').limit(1).single();
    return json({ error: null, ok: true }, { status: 200 });
}