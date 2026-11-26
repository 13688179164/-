const { Pool } = require('pg');
exports.main = async () => {
  const keys = Object.keys(process.env).filter(k => /^PG|POSTGRES|DATABASE/i.test(k));
  const out = { keys, env: {} };
  for (const k of keys) out.env[k] = k.includes('PASS') ? '***' : process.env[k];
  try {
    const pool = new Pool({
      host: process.env.PGHOST,
      port: Number(process.env.PGPORT || 5432),
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
      ssl: false,
      max: 1,
    });
    const r = await pool.query('select current_database() as db, current_user as usr');
    out.query = r.rows;
    await pool.end();
  } catch (e) { out.error = e.message; }
  return out;
};
