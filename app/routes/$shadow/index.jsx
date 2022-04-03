import { useLoaderData } from "remix";
import { format } from "~/utils/date";
import supabase from "~/utils/supabase";

function getMin(d) {
  return Math.floor(d / 1000 / 60)
}


export async function loader({ params }) {
  let { data, error } = await supabase
    .from('activities')
    .select('id,duration,created_at')
    .eq('shadow_id', params.shadow);

  if (error) throw error.message;
  return data;
}

export default function Test() {
  const data = useLoaderData();

  return (
    <ul>
      {
    data?.map(d => <li key={d.id}>{format(d.created_at)} - {getMin(d.duration)}min</li>)
  }</ul>
  )
}