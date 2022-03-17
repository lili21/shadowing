import { Form, redirect, useTransition, useActionData, json } from 'remix';
import { useState, useEffect } from 'react';
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

  if (!access_token) return json(`Are you a girl have no name?`, {
    status: 401
  })

  supabase.auth.setAuth(access_token);

  const { data, error } = await supabase.from('shadows')
    .insert([
      { title, content, vid, type: 1, author },
    ])
  
  if (error)  return json(error.message || `Something went wrong!`, {
    status: 500
  })

  return redirect(`/${data[0].id}`);
}

export default function Index() {
  const [vid, setVid] = useState();
  const transition = useTransition();
  const error = useActionData();

  // console.log('new transition', transition)

  // useEffect(() => {
  //   const listener = () => {
  //     if (document.visibilityState === 'hidden') {
  //       // store the draft
  //       localStorage.setItem('new-content', document.querySelector('.editor').value);
  //     }
  //   }
  //   document.addEventListener('visibilitychange', listener)
  //   return () => {
  //     document.removeEventListener('visibilitychange', listener)
  //   }
  // }, [])

  const handleVidChange = e => {
    const url = new URL(e.target.value);
    setVid(url.searchParams.get('v'))
  }

  const session = supabase.auth.session();

  return (
    <Form method="post" className="form">
      <textarea name="content" className="editor" />
      <div>
        <input required name="title" type="text" placeholder="title" />
        <input autoFocus required name="url" placeholder="youtube video link" type="text" onChange={handleVidChange} />
        <input name="vid" hidden value={vid} />
        <input name="email" hidden readOnly value={session?.user?.email} />
        <input name="access_token" readOnly hidden defaultValue={session?.access_token} />
        <button className="button" disabled={transition.submission} type="submit">
          { transition.submission ? 'Saving...' : 'Save' }
        </button>
        <div className="video">
          {vid && <lite-youtube videoid={vid} />}
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </Form>
  );
}
