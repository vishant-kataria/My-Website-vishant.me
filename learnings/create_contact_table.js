const url = 'https://ep-twilight-silence-aoldtn59-pooler.c-2.ap-southeast-1.aws.neon.tech/sql';
const conn = 'postgresql://neondb_owner:npg_Efu38ChnpPbm@ep-twilight-silence-aoldtn59-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

async function run() {
  const query = `
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      phone_number VARCHAR(20),
      favorite_decade INT,
      country VARCHAR(255),
      food VARCHAR(255),
      pets JSONB,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  try {
    let res = await fetch(url, {
      method: 'POST',
      headers: { 'Neon-Connection-String': conn },
      body: JSON.stringify({ query })
    });
    console.log('Create table status:', res.status, await res.text());
  } catch(e) {
    console.error(e);
  }
}
run();
