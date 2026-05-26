const url = 'https://ep-twilight-silence-aoldtn59-pooler.c-2.ap-southeast-1.aws.neon.tech/sql';
const conn = 'postgresql://neondb_owner:npg_Efu38ChnpPbm@ep-twilight-silence-aoldtn59-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function run() {
  await fetch(url, { method: 'POST', headers: { 'Neon-Connection-String': conn }, body: JSON.stringify({ query: 'DROP TABLE IF EXISTS test_date' }) });
  await fetch(url, { method: 'POST', headers: { 'Neon-Connection-String': conn }, body: JSON.stringify({ query: 'CREATE TABLE test_date (date DATE PRIMARY KEY)' }) });
  let res = await fetch(url, { method: 'POST', headers: { 'Neon-Connection-String': conn }, body: JSON.stringify({ query: "INSERT INTO test_date (date) VALUES ('25 May 2026')" }) });
  console.log('Insert:', await res.text());
  res = await fetch(url, { method: 'POST', headers: { 'Neon-Connection-String': conn }, body: JSON.stringify({ query: "SELECT date FROM test_date" }) });
  console.log('Select:', await res.text());
}
run();
