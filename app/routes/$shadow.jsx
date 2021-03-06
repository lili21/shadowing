import { useRef, useState, useEffect } from 'react';
import { Form, useLoaderData, useTransition, useActionData, useBeforeUnload, Outlet, useSubmit } from '@remix-run/react';
import { json } from '@remix-run/node'
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

  if (!access_token) return json(`Are you a girl have no name?`, {
    status: 401
  })

  console.log('duration', body.get('duration'))

  supabase.auth.setAuth(access_token);

  const id = body.get('id')
  const [{ error }, { error: err}] = await Promise.all([
    supabase.from('shadows')
      .update({ content: body.get('content'), updated_at: new Date() }, { returning: 'minimal' })
      .eq('id', id),

    supabase.from('activities').insert([{ duration: body.get('duration'), shadow_id: id }])
  ]);

  console.log(err)

  if (error) return json(error.message || `You can't edit it, it's not yours`, {
    status: 403
  })
  return null;
}


export const loader = async ({ params }) => {
  let { data, error } = await supabase
    .from('shadows')
    .select('id,title,content,vid')
    .eq('id', params.shadow);

  if (error) throw error.message;
  return data[0];
}

export default function Index() {
  const ref = useRef();
  // const execise = useLoaderData();
  const [execise, setExecise] = useState(useLoaderData())
  const transition = useTransition();
  const error = useActionData();
  const submit = useSubmit();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append('duration', Date.now() - window.startTime);
    submit(formData, { method: 'post' })
  }


  useBeforeUnload(() => {
    // store the draft
    localStorage.setItem(execise.id, document.querySelector('.editor').value);
  })

  useEffect(() => {
    const draft = localStorage.getItem(execise.id);

    if (draft) {
      setExecise({
        ...execise,
        content: draft
      })
    }
  }, [])

  if (transition.type === 'actionReload') {
    localStorage.removeItem(execise.id);
    ref.current?.show();
    setTimeout(() => {
      ref.current?.close();
    }, 500)
  }

  return (
    <>
      <Form method="post" className="form" onSubmit={handleSubmit}>
        <textarea autoFocus name="content" className="editor" defaultValue={execise.content} />
        <div>
          <input name="id" defaultValue={execise.id} hidden />
          <input required name="title" type="text" placeholder="title" defaultValue={execise.title} disabled />
          <input required name="url" placeholder="youtube video link" type="text" defaultValue={`https://youtube.com/watch?v=${execise.vid}`} disabled />
          <input name="access_token" readOnly hidden defaultValue={supabase.auth.session()?.access_token} />
          <button className="button" disabled={transition.submission} type="submit">
            {transition.submission ? 'Saving...' : 'Save'}
          </button>
          <div className="video">
            <lite-youtube videoid={execise.vid} />
          </div>
          <Outlet />
          {error && <p className="error">{error}</p>}
        </div>
      </Form>
      <dialog ref={ref}>
        Congrats, You made it!
      </dialog>
    </>
  );
}
