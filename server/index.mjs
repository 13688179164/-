import express from 'express'
import pg from 'pg'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const { Pool } = pg
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 8787)
const DATABASE_URL = process.env.DATABASE_URL || ''

if (!DATABASE_URL) {
  console.error('[server] DATABASE_URL is required')
  process.exit(1)
}

const needsSsl = /sslmode=(require|verify-ca|verify-full)/i.test(DATABASE_URL)
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  max: 8,
})

const json = (v) => JSON.parse(JSON.stringify(v ?? null))

const SCHEMA = `
CREATE TABLE IF NOT EXISTS people (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  org TEXT NOT NULL,
  tone TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS meetings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  participant_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  content TEXT NOT NULL DEFAULT '',
  organizer_id TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS minutes (
  id TEXT PRIMARY KEY,
  meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT '',
  created_at BIGINT NOT NULL,
  duration_sec INTEGER NOT NULL DEFAULT 0,
  transcript TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  topics JSONB NOT NULL DEFAULT '[]'::jsonb,
  decisions JSONB NOT NULL DEFAULT '[]'::jsonb,
  actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  risks JSONB NOT NULL DEFAULT '[]'::jsonb,
  attendees JSONB NOT NULL DEFAULT '[]'::jsonb,
  saved_to_cloud BOOLEAN NOT NULL DEFAULT FALSE,
  saved_at BIGINT,
  version INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS supervisions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  owner_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  start_date TEXT NOT NULL,
  due_date TEXT NOT NULL,
  goals JSONB NOT NULL DEFAULT '[]'::jsonb,
  reminder BOOLEAN NOT NULL DEFAULT FALSE,
  reminded BOOLEAN NOT NULL DEFAULT FALSE,
  reminded_at BIGINT,
  status TEXT NOT NULL DEFAULT 'active',
  priority TEXT NOT NULL DEFAULT 'normal',
  created_at BIGINT NOT NULL,
  completed_at BIGINT
);

CREATE INDEX IF NOT EXISTS meetings_date_idx ON meetings(date);
CREATE INDEX IF NOT EXISTS minutes_meeting_idx ON minutes(meeting_id);
`

async function ensureSchema() {
  await pool.query(SCHEMA)
}

const meetingSelect = `
SELECT id, title, type, date, start_time, end_time, location, participant_ids,
       content, organizer_id, priority, created_at
FROM meetings`

const minutesSelect = `
SELECT id, meeting_id, title, created_at, duration_sec, transcript, summary,
       topics, decisions, actions, risks, attendees, saved_to_cloud, saved_at, version
FROM minutes`

const supervisionSelect = `
SELECT id, title, note, owner_ids, start_date, due_date, goals, reminder, reminded,
       reminded_at, status, priority, created_at, completed_at
FROM supervisions`

const mapMeeting = (r) => ({
  id: r.id,
  title: r.title,
  type: r.type,
  date: r.date,
  start: r.start_time,
  end: r.end_time,
  location: r.location,
  participantIds: r.participant_ids || [],
  content: r.content,
  organizerId: r.organizer_id,
  priority: r.priority,
  createdAt: Number(r.created_at),
})

const mapMinutes = (r) => ({
  id: r.id,
  meetingId: r.meeting_id,
  title: r.title,
  createdAt: Number(r.created_at),
  durationSec: r.duration_sec,
  transcript: r.transcript,
  summary: r.summary,
  topics: r.topics || [],
  decisions: r.decisions || [],
  actions: r.actions || [],
  risks: r.risks || [],
  attendees: r.attendees || [],
  savedToCloud: r.saved_to_cloud,
  savedAt: r.saved_at == null ? undefined : Number(r.saved_at),
  version: r.version,
})

const mapSupervision = (r) => ({
  id: r.id,
  title: r.title,
  note: r.note,
  ownerIds: r.owner_ids || [],
  startDate: r.start_date,
  dueDate: r.due_date,
  goals: r.goals || [],
  reminder: r.reminder,
  reminded: r.reminded,
  remindedAt: r.reminded_at == null ? undefined : Number(r.reminded_at),
  status: r.status,
  priority: r.priority,
  createdAt: Number(r.created_at),
  completedAt: r.completed_at == null ? undefined : Number(r.completed_at),
})

const meetingColumns = {
  title: 'title',
  type: 'type',
  date: 'date',
  start: 'start_time',
  end: 'end_time',
  location: 'location',
  participantIds: 'participant_ids',
  content: 'content',
  organizerId: 'organizer_id',
  priority: 'priority',
  createdAt: 'created_at',
}

const minutesColumns = {
  meetingId: 'meeting_id',
  title: 'title',
  createdAt: 'created_at',
  durationSec: 'duration_sec',
  transcript: 'transcript',
  summary: 'summary',
  topics: 'topics',
  decisions: 'decisions',
  actions: 'actions',
  risks: 'risks',
  attendees: 'attendees',
  savedToCloud: 'saved_to_cloud',
  savedAt: 'saved_at',
  version: 'version',
}

const supervisionColumns = {
  title: 'title',
  note: 'note',
  ownerIds: 'owner_ids',
  startDate: 'start_date',
  dueDate: 'due_date',
  goals: 'goals',
  reminder: 'reminder',
  reminded: 'reminded',
  remindedAt: 'reminded_at',
  status: 'status',
  priority: 'priority',
  createdAt: 'created_at',
  completedAt: 'completed_at',
}

const JSON_FIELDS = new Set([
  'participant_ids',
  'topics',
  'decisions',
  'actions',
  'risks',
  'attendees',
  'owner_ids',
  'goals',
])

function buildPatch(patch, columnMap) {
  const sets = []
  const values = []
  for (const [key, column] of Object.entries(columnMap)) {
    if (!Object.prototype.hasOwnProperty.call(patch, key)) continue
    let value = patch[key]
    if (value === undefined) value = null
    if (JSON_FIELDS.has(column) && value !== null) value = JSON.stringify(value)
    values.push(value)
    sets.push(`"${column}" = $${values.length}`)
  }
  return { sets, values }
}

async function insertMeeting(client, m) {
  const { rows } = await client.query(
    `INSERT INTO meetings (id, title, type, date, start_time, end_time, location,
       participant_ids, content, organizer_id, priority, created_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title, type = EXCLUDED.type, date = EXCLUDED.date,
       start_time = EXCLUDED.start_time, end_time = EXCLUDED.end_time, location = EXCLUDED.location,
       participant_ids = EXCLUDED.participant_ids, content = EXCLUDED.content,
       organizer_id = EXCLUDED.organizer_id, priority = EXCLUDED.priority
     RETURNING *`,
    [
      m.id,
      m.title,
      m.type,
      m.date,
      m.start,
      m.end,
      m.location ?? '',
      JSON.stringify(m.participantIds ?? []),
      m.content ?? '',
      m.organizerId ?? '',
      m.priority ?? 'normal',
      m.createdAt ?? Date.now(),
    ],
  )
  return mapMeeting(rows[0])
}

async function insertMinutes(client, m) {
  const { rows } = await client.query(
    `INSERT INTO minutes (id, meeting_id, title, created_at, duration_sec, transcript, summary,
       topics, decisions, actions, risks, attendees, saved_to_cloud, saved_at, version)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,$10::jsonb,$11::jsonb,$12::jsonb,$13,$14,$15)
     ON CONFLICT (id) DO UPDATE SET
       meeting_id = EXCLUDED.meeting_id, title = EXCLUDED.title, created_at = EXCLUDED.created_at,
       duration_sec = EXCLUDED.duration_sec, transcript = EXCLUDED.transcript, summary = EXCLUDED.summary,
       topics = EXCLUDED.topics, decisions = EXCLUDED.decisions, actions = EXCLUDED.actions,
       risks = EXCLUDED.risks, attendees = EXCLUDED.attendees,
       saved_to_cloud = EXCLUDED.saved_to_cloud, saved_at = EXCLUDED.saved_at, version = EXCLUDED.version
     RETURNING *`,
    [
      m.id,
      m.meetingId,
      m.title ?? '',
      m.createdAt ?? Date.now(),
      m.durationSec ?? 0,
      m.transcript ?? '',
      m.summary ?? '',
      JSON.stringify(m.topics ?? []),
      JSON.stringify(m.decisions ?? []),
      JSON.stringify(m.actions ?? []),
      JSON.stringify(m.risks ?? []),
      JSON.stringify(m.attendees ?? []),
      Boolean(m.savedToCloud),
      m.savedAt ?? null,
      m.version ?? 1,
    ],
  )
  return mapMinutes(rows[0])
}

async function insertSupervision(client, s) {
  const { rows } = await client.query(
    `INSERT INTO supervisions (id, title, note, owner_ids, start_date, due_date, goals,
       reminder, reminded, reminded_at, status, priority, created_at, completed_at)
     VALUES ($1,$2,$3,$4::jsonb,$5,$6,$7::jsonb,$8,$9,$10,$11,$12,$13,$14)
     ON CONFLICT (id) DO UPDATE SET
       title = EXCLUDED.title, note = EXCLUDED.note, owner_ids = EXCLUDED.owner_ids,
       start_date = EXCLUDED.start_date, due_date = EXCLUDED.due_date, goals = EXCLUDED.goals,
       reminder = EXCLUDED.reminder, reminded = EXCLUDED.reminded, reminded_at = EXCLUDED.reminded_at,
       status = EXCLUDED.status, priority = EXCLUDED.priority, completed_at = EXCLUDED.completed_at
     RETURNING *`,
    [
      s.id,
      s.title,
      s.note ?? '',
      JSON.stringify(s.ownerIds ?? []),
      s.startDate,
      s.dueDate,
      JSON.stringify(s.goals ?? []),
      Boolean(s.reminder),
      Boolean(s.reminded),
      s.remindedAt ?? null,
      s.status ?? 'active',
      s.priority ?? 'normal',
      s.createdAt ?? Date.now(),
      s.completedAt ?? null,
    ],
  )
  return mapSupervision(rows[0])
}

async function readState() {
  const [people, meetings, minutes, supervisions] = await Promise.all([
    pool.query('SELECT id, name, role, org, tone FROM people ORDER BY sort_order ASC, id ASC'),
    pool.query(`${meetingSelect} ORDER BY created_at DESC`),
    pool.query(`${minutesSelect} ORDER BY created_at DESC`),
    pool.query(`${supervisionSelect} ORDER BY created_at DESC`),
  ])
  return {
    people: people.rows.map((r) => ({ id: r.id, name: r.name, role: r.role, org: r.org, tone: r.tone })),
    meetings: meetings.rows.map(mapMeeting),
    minutes: minutes.rows.map(mapMinutes),
    supervisions: supervisions.rows.map(mapSupervision),
  }
}

const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '8mb' }))

const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

app.get('/api/health', asyncRoute(async (_req, res) => {
  await pool.query('SELECT 1')
  res.json({ ok: true })
}))

app.get('/api/state', asyncRoute(async (_req, res) => {
  res.json(await readState())
}))

app.post('/api/bootstrap', asyncRoute(async (req, res) => {
  const snapshot = req.body
  if (!snapshot || !Array.isArray(snapshot.people) || !Array.isArray(snapshot.meetings)) {
    return res.status(400).json({ error: 'invalid bootstrap payload' })
  }
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows } = await client.query('SELECT COUNT(*)::int AS n FROM people')
    const hasPeople = rows[0].n > 0
    if (!hasPeople) {
      for (let i = 0; i < snapshot.people.length; i += 1) {
        const p = snapshot.people[i]
        await client.query(
          'INSERT INTO people (id, name, role, org, tone, sort_order) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING',
          [p.id, p.name, p.role, p.org, p.tone, i],
        )
      }
      for (const m of snapshot.meetings || []) await insertMeeting(client, m)
      for (const m of snapshot.minutes || []) await insertMinutes(client, m)
      for (const s of snapshot.supervisions || []) await insertSupervision(client, s)
    }
    await client.query('COMMIT')
    res.status(hasPeople ? 200 : 201).json({ seeded: !hasPeople })
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {})
    throw err
  } finally {
    client.release()
  }
}))

app.post('/api/meetings', asyncRoute(async (req, res) => {
  const m = req.body
  if (!m?.id || !m.title || !m.date) return res.status(400).json({ error: 'missing meeting fields' })
  const client = await pool.connect()
  try {
    res.status(201).json(await insertMeeting(client, m))
  } finally {
    client.release()
  }
}))

app.patch('/api/meetings/:id', asyncRoute(async (req, res) => {
  const { sets, values } = buildPatch(req.body || {}, meetingColumns)
  if (!sets.length) return res.status(400).json({ error: 'empty patch' })
  const { rows } = await pool.query(
    `UPDATE meetings SET ${sets.join(', ')} WHERE id = $${values.length + 1} RETURNING *`,
    [...values, req.params.id],
  )
  if (!rows.length) return res.status(404).json({ error: 'meeting not found' })
  res.json(mapMeeting(rows[0]))
}))

app.delete('/api/meetings/:id', asyncRoute(async (req, res) => {
  await pool.query('DELETE FROM meetings WHERE id = $1', [req.params.id])
  res.status(204).end()
}))

app.put('/api/minutes/:id', asyncRoute(async (req, res) => {
  const m = { ...req.body, id: req.params.id }
  if (!m.meetingId) return res.status(400).json({ error: 'missing meetingId' })
  const client = await pool.connect()
  try {
    res.json(await insertMinutes(client, m))
  } finally {
    client.release()
  }
}))

app.patch('/api/minutes/:id', asyncRoute(async (req, res) => {
  const { sets, values } = buildPatch(req.body || {}, minutesColumns)
  if (!sets.length) return res.status(400).json({ error: 'empty patch' })
  const { rows } = await pool.query(
    `UPDATE minutes SET ${sets.join(', ')} WHERE id = $${values.length + 1} RETURNING *`,
    [...values, req.params.id],
  )
  if (!rows.length) return res.status(404).json({ error: 'minutes not found' })
  res.json(mapMinutes(rows[0]))
}))

app.delete('/api/minutes/:id', asyncRoute(async (req, res) => {
  await pool.query('DELETE FROM minutes WHERE id = $1', [req.params.id])
  res.status(204).end()
}))

app.post('/api/supervisions', asyncRoute(async (req, res) => {
  const s = req.body
  if (!s?.id || !s.title) return res.status(400).json({ error: 'missing supervision fields' })
  const client = await pool.connect()
  try {
    res.status(201).json(await insertSupervision(client, s))
  } finally {
    client.release()
  }
}))

app.patch('/api/supervisions/:id', asyncRoute(async (req, res) => {
  const { sets, values } = buildPatch(req.body || {}, supervisionColumns)
  if (!sets.length) return res.status(400).json({ error: 'empty patch' })
  const { rows } = await pool.query(
    `UPDATE supervisions SET ${sets.join(', ')} WHERE id = $${values.length + 1} RETURNING *`,
    [...values, req.params.id],
  )
  if (!rows.length) return res.status(404).json({ error: 'supervision not found' })
  res.json(mapSupervision(rows[0]))
}))

app.delete('/api/supervisions/:id', asyncRoute(async (req, res) => {
  await pool.query('DELETE FROM supervisions WHERE id = $1', [req.params.id])
  res.status(204).end()
}))

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'not found' })
})

const distDir = [
  path.join(__dirname, '..', 'dist'),
  path.join(__dirname, '..'),
  __dirname,
].find((dir) => existsSync(path.join(dir, 'index.html'))) || path.join(__dirname, '..', 'dist')
app.use(express.static(distDir, { index: 'index.html', maxAge: '1h' }))
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return next()
  res.sendFile(path.join(distDir, 'index.html'))
})

app.use((err, _req, res, _next) => {
  console.error('[server]', err)
  res.status(500).json({ error: 'internal error' })
})

async function start() {
  await ensureSchema()
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[server] listening on 0.0.0.0:${PORT}`)
  })
}

start().catch((err) => {
  console.error('[server] startup failed', err)
  process.exit(1)
})
