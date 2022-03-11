import { useLoaderData, Link } from 'remix';
import supabase from '~/utils/supabase.server';

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

  if (error) throw error;
  return data;
}

export default function Index() {
  const execises = useLoaderData();

  return (
    <div className="root">
      <Link className="new-button" to="/new">New Execise</Link>
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
      <p>{created_at}</p>
    </article>
  )
}
