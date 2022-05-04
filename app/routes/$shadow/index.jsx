import { useLoaderData } from "@remix-run/react";
import { format } from "~/utils/date";
import supabase from "~/utils/supabase";

function getMin(d) {
  return Math.floor(d / 1000 / 60)
}


export async function loader({ params }) {
  console.log('index route loader')
  let { data, error } = await supabase
    .from('activities')
    .select('id,duration,created_at')
    .eq('shadow_id', params.shadow);

  if (error) throw error.message;
  return data;
}

export default function Test() {
  const data = useLoaderData();
  console.log('---data---', data);

  return (
    <ul>
      {
        data?.map(d => <li key={d.id}>{format(d.created_at)} - {getMin(d.duration)}min</li>)
      }
    </ul>
  )
}