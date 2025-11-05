import { createClient } from '@supabase/supabase-js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  try {
    const { token, q_index, answer } = await req.json();

    if (!token) return new Response('No token', { status: 400 });

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE
    );

    const { error } = await supabase
      .from('answers')
      .upsert({
        user_token: token,
        question_index: q_index,
        answer
      });

    if (error) throw error;

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false });
  }
}
