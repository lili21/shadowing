import { useLoaderData } from 'remix';
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

export const loader = async ({ params }) => {
  let { data, error } = await supabase
    .from('shadows')
    .select('id,title,content,vid')
    .eq('id', params.slug);

  if (error) throw error;
  return data[0];
}

export default function Index() {
  const execise = useLoaderData();

  return (
    <form method="post" action="/update" className="root">
      <textarea name="content" className="editor" defaultValue={execise.content} />
      <div>
        <input name="id" defaultValue={execise.id} hidden />
        <input required name="title" type="text" placeholder="title" defaultValue={execise.title} disabled />
        <input required name="url" placeholder="youtube video link" type="text" defaultValue={`https://youtube.com/watch?v=${execise.vid}`} disabled />
        <button type="submit">Save</button>
        <div className="video">
          <lite-youtube videoid={execise.vid} />
        </div>
      </div>
    </form>
  );
}
