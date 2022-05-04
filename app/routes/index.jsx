import { useLoaderData, Link } from '@remix-run/react';
import supabase from '~/utils/supabase';
import { format } from '~/utils/date';

import styleUrl from '~/styles/index.css';

export const links = () => {
  return [
    {
      rel: 'stylesheet',
      href: styleUrl
    }
  ]
}

export const loader = async () => {
  const { data, error } = await supabase
    .from('shadows')
    .select('id,title,created_at')
    .order('created_at', { ascending: false })

  if (error) throw error.message;
  return data
}

export default function Index() {
  const execises = useLoaderData();

  return (
    <div className="root">
      {
        execises.map(item => <Item key={item.id} {...item} />)
      }
    </div>
  );
}

function Item({ id, title, created_at }) {
  return (
    <article className="item">
      <Link className="item-title" to={`/${id}`}>{title}</Link>
      <p>{format(created_at)}</p>
    </article>
  )
}
