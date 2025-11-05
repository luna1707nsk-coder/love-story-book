import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  try {
    const { token } = await req.json();
    if (!token) return new Response('No token', { status: 400 });

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE
    );

    const { data, error } = await supabase
      .from('answers')
      .select('question_index, answer')
      .eq('user_token', token);

    if (error) throw error;

    const answersMap = {};
    data.forEach(a => {
      answersMap[a.question_index] = a.answer;
    });

    return Response.json({ answers: answersMap });
  } catch (e) {
    return Response.json({ answers: {} });
  }
}
