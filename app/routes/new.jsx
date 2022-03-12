import { redirect } from 'remix';
import { useState } from 'react';
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
  const title = body.get('title');
  const content = body.get('content')
  const vid = body.get('vid')
  const author = body.get('email')

  if (!access_token) throw new Error('No Auth')

  const _sb = supabase.from('shadows');
  _sb.headers['Authorization'] = `Bearer ${access_token}`

  const { error } = await _sb
    .insert([
      { title, content, vid, type: 1, author },
    ], { returning: 'minimal' })
  
  if (error) throw new Error(error.message || 'Someting went wrong!');

  return redirect('/');
}

export default function Index() {
  const [vid, setVid] = useState();

  const handleVidChange = e => {
    const url = new URL(e.target.value);
    setVid(url.searchParams.get('v'))
  }

  const session = supabase.auth.session();

  return (
    <form method="post" className="form">
      <textarea name="content" className="editor" />
      <div>
        <input required name="title" type="text" placeholder="title" />
        <input autoFocus required name="url" placeholder="youtube video link" type="text" onChange={handleVidChange} />
        <input name="vid" hidden value={vid} />
        <input name="email" hidden readOnly value={session?.user?.email} />
        <input name="access_token" readOnly hidden defaultValue={session?.access_token} />
        <button className="button" type="submit">Save</button>
        <div className="video">
          {vid && <lite-youtube videoid={vid} />}
        </div>
      </div>
    </form>
  );
}
