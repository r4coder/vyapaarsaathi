import pg from 'pg';import {readdir,readFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
if(!process.env.MIGRATION_DATABASE_URL)throw new Error('MIGRATION_DATABASE_URL required');
const c=new pg.Client({connectionString:process.env.MIGRATION_DATABASE_URL});await c.connect();
try{await c.query('SELECT pg_advisory_lock(827193)');await c.query('CREATE TABLE IF NOT EXISTS schema_migrations(name text PRIMARY KEY,checksum text NOT NULL)');
for(const name of (await readdir('database/migrations')).filter(n=>n.endsWith('.sql')).sort()){
const sql=await readFile('database/migrations/'+name,'utf8');const sum=createHash('sha256').update(sql).digest('hex');const r=await c.query('SELECT checksum FROM schema_migrations WHERE name=$1',[name]);if(r.rows.length){if(r.rows[0].checksum!==sum)throw new Error('Applied migration changed: '+name);continue;}
await c.query('BEGIN');try{await c.query(sql);await c.query('INSERT INTO schema_migrations VALUES($1,$2)',[name,sum]);await c.query('COMMIT');}catch(e){await c.query('ROLLBACK');throw e;}}
const role=process.env.RUNTIME_ROLE;if(role){if(!/^[a-z_][a-z0-9_]*$/.test(role))throw new Error('Invalid runtime role');
await c.query('GRANT USAGE ON SCHEMA public TO "'+role+'"');
for(const [priv,tables] of [['SELECT,INSERT','users,audit_logs'],['SELECT,INSERT,DELETE','sessions'],['SELECT,INSERT,UPDATE','merchants'],['SELECT','schema_migrations']])await c.query('GRANT '+priv+' ON '+tables+' TO "'+role+'"');}
console.log('Migrations complete');}finally{await c.end();}