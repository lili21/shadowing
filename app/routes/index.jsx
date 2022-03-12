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
  const noLogin = !supabase.auth.session();

  const login = () => {
    supabase.auth.signIn({
      provider: 'github'
    }, {
      redirectTo: window.location.href
    })
  }

  return (
    <div className="root">
      <div className="action">
        <Link className="button" to="/new">New Execise</Link>
        {noLogin && <button className="button" onClick={login}>Login With Github</button>}
      </div>
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
