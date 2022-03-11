import { redirect, json } from 'remix';
import supabase from '~/utils/supabase.server';

export const action = async ({ request }) => {
  const body = await request.formData();
  const id = body.get('id')
  const { error } = await supabase
    .from('shadows')
    .update({ content: body.get('content') }, { returning: 'minimal' })
    .eq('id', id)

  if (error) {
    return json({ message: error.message }, 500);
  };
  return redirect('/')
}
