import { redirect } from 'remix';
import { useState } from 'react';
import supabase from '~/utils/supabase.server';

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

  const { error } = await  await supabase
    .from('shadows')
    .insert([
      { title: body.get('title'), content: body.get('content'), vid: body.get('vid'), type: 1 },
    ], { returning: 'minimal' })
  
  if (error) throw error;

  return redirect('/');
}

export default function Index() {
  const [vid, setVid] = useState();

  const handleVidChange = e => {
    const url = new URL(e.target.value);
    setVid(url.searchParams.get('v'))
  }

  return (
    <form method="post" action="/new" className="root">
      <textarea name="content" className="editor" />
      <div>
        <input required name="title" type="text" placeholder="title" />
        <input required name="url" placeholder="youtube video link" type="text" onChange={handleVidChange} />
        <input name="vid" hidden value={vid} />
        <button type="submit">Save</button>
        <div className="video">
          {vid && <lite-youtube videoid={vid} />}
        </div>
      </div>
    </form>
  );
}
