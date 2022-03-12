import { useLoaderData, json } from 'remix';
import supabase from '~/utils/supabase';

import styleUrl from '~/styles/new.css'

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: styleUrl
    }
  ]
}

export const action = async ({ request }) => {
  const body = await request.formData();
  const access_token = body.get('access_token');

  if (!access_token) throw new Error('No Auth!')

  const _sb = supabase.from('shadows');
  _sb.headers['Authorization'] = `Bearer ${access_token}`

  const id = body.get('id')
  const { error } = await _sb
    .update({ content: body.get('content') }, { returning: 'minimal' })
    .eq('id', id)

  if (error) throw new Error(`You can't edit this!`)
  return redirect('/')
}


export const loader = async ({ params }) => {
  let { data, error } = await supabase
    .from('shadows')
    .select('id,title,content,vid')
    .eq('id', params.slug);

  if (error) throw error.message;
  return data[0];
}

export default function Index() {
  const execise = useLoaderData();

  return (
    <form method="post" className="form">
      <textarea autoFocus name="content" className="editor" defaultValue={execise.content} />
      <div>
        <input name="id" defaultValue={execise.id} hidden />
        <input required name="title" type="text" placeholder="title" defaultValue={execise.title} disabled />
        <input required name="url" placeholder="youtube video link" type="text" defaultValue={`https://youtube.com/watch?v=${execise.vid}`} disabled />
        <input name="access_token" readOnly hidden defaultValue={supabase.auth.session()?.access_token} />
        <button className="button" type="submit">Save</button>
        <div className="video">
          <lite-youtube videoid={execise.vid} />
        </div>
      </div>
    </form>
  );
}
