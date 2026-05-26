const url = 'https://ep-twilight-silence-aoldtn59-pooler.c-2.ap-southeast-1.aws.neon.tech/sql';
const conn = 'postgresql://neondb_owner:npg_Efu38ChnpPbm@ep-twilight-silence-aoldtn59-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function run() {
  let res = await fetch(url, {
    method: 'POST',
    headers: { 'Neon-Connection-String': conn },
    body: JSON.stringify({ query: "DELETE FROM daycount_entries WHERE drinks = '[]'::jsonb AND weights = '[]'::jsonb" })
  });
  console.log('Delete:', await res.text());
}
run();
