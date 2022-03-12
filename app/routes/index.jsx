import { useLoaderData, Link } from 'remix';
import supabase from '~/utils/supabase';

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


const dateTimeFormater = new Intl.DateTimeFormat('default', {
  year: 'numeric', month: 'numeric', day: 'numeric',
  weekday: 'long',
  dayPeriod: 'short'
})

function format(dateString) {
  const date = new Date(dateString);
  return dateTimeFormater.format(date);
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
