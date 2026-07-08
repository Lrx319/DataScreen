import fs from 'fs'
import path from 'path'
import { pool } from '../config/database'
import { CREATE_TABLES_SQL, INSERT_MOD_DETAIL_SQL } from '../config/schema'

const DATA_DIR = path.join(__dirname, '../../data')

interface HostRecord {
  hostid: string
  hostname: string
  owner: string
  model: string
  location1: string
  location2: string
}

interface TsarRecord {
  ts: number
  hostid: string
  type: string
  mod: string
  value: number
  tag: string
}

async function readDatFile(fileName: string): Promise<string[][]> {
  const filePath = path.join(DATA_DIR, fileName)
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.trim().split('\n')
  return lines.map((line) => line.split('\t'))
}

function getRoomName(roomCode: string): string {
  const roomMap: Record<string, string> = {
    A: 'A机房',
    B: 'B机房',
    C: 'C机房',
    D: 'D机房',
    E: 'E机房',
  }
  return roomMap[roomCode] || roomCode + '机房'
}

function getRackName(rackCode: string): string {
  if (rackCode.startsWith('Rack-')) {
    return '机柜' + rackCode.replace('Rack-', '')
  }
  return rackCode
}

async function importHostDetail(): Promise<void> {
  const rows = await readDatFile('host_detail.dat')
  const records: HostRecord[] = []
  
  for (const row of rows) {
    if (row.length < 5) continue
    records.push({
      hostid: row[0].trim().replace(/-/g, ''),
      hostname: row[1].trim() + '.hismartlab.cn',
      owner: '未知',
      model: 'Dell R750',
      location1: getRoomName(row[3].trim()),
      location2: getRackName(row[4].trim()),
    })
  }
  
  const sql = 'INSERT INTO host_detail (hostid, hostname, owner, model, location1, location2) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE hostname = VALUES(hostname), owner = VALUES(owner), model = VALUES(model), location1 = VALUES(location1), location2 = VALUES(location2)'
  const values = records.map((r) => [r.hostid, r.hostname, r.owner, r.model, r.location1, r.location2])
  
  await pool.query(sql, values)
  console.log(`[ETL] Imported ${records.length} host records`)
}

async function importModDetail(): Promise<void> {
  await pool.query(INSERT_MOD_DETAIL_SQL)
  console.log('[ETL] Imported mod detail records (55 items)')
}

function getModTag(mod: string): string {
  if (mod.includes('_util')) return 'disk_util_percent'
  if (mod.includes('_await') || mod.includes('_svctm')) return 'disk_latency_ms'
  if (mod.includes('_rqm')) return 'disk_rqm_per_sec'
  if (mod.includes('_read') || mod.includes('_write')) return 'disk_rw_sectors'
  if (mod.includes('_avgrq')) return 'disk_other_metric'
  if (mod.startsWith('cpu_')) return 'cpu_percent'
  if (mod.startsWith('mem_')) return 'mem_metric'
  if (mod.startsWith('net_')) return mod.includes('pkt') ? 'net_packets' : 'net_speed_mb'
  if (mod.startsWith('load')) return 'load_average'
  if (mod.startsWith('proc_')) return 'proc_count'
  return ''
}

async function importDiskTsar(): Promise<void> {
  const rows = await readDatFile('disk_tsar.dat')
  const records: TsarRecord[] = []
  
  for (const row of rows) {
    if (row.length < 4) continue
    try {
      const timeParts = row[2].trim().split(':')
      const hour = parseInt(timeParts[0], 10)
      const minute = parseInt(timeParts[1] || '0', 10)
      const ts = new Date('2026-07-01T' + String(hour).padStart(2, '0') + ':' + String(minute).padStart(2, '0') + ':00').getTime()
      
      records.push({
        ts,
        hostid: row[0].trim().replace(/-/g, ''),
        type: 'disk',
        mod: row[1].trim(),
        value: parseFloat(row[3].trim()),
        tag: getModTag(row[1].trim()),
      })
    } catch {
      continue
    }
  }
  
  const sql = 'INSERT INTO tsar_detail (ts, hostid, type, mod, value, tag) VALUES (?, ?, ?, ?, ?, ?)'
  const values = records.map((r) => [r.ts, r.hostid, r.type, r.mod, r.value, r.tag])
  
  await pool.query(sql, values)
  console.log(`[ETL] Imported ${records.length} disk tsar records`)
}

async function importPrefTsar(): Promise<void> {
  const rows = await readDatFile('pref_tsar.dat')
  const records: TsarRecord[] = []
  
  for (const row of rows) {
    if (row.length < 4) continue
    try {
      const timeParts = row[2].trim().split(':')
      const hour = parseInt(timeParts[0], 10)
      const ts = new Date('2026-07-01T' + String(hour).padStart(2, '0') + ':00:00').getTime()
      
      records.push({
        ts,
        hostid: row[0].trim().replace(/-/g, ''),
        type: 'pref',
        mod: row[1].trim(),
        value: parseFloat(row[3].trim()),
        tag: getModTag(row[1].trim()),
      })
    } catch {
      continue
    }
  }
  
  const sql = 'INSERT INTO tsar_detail (ts, hostid, type, mod, value, tag) VALUES (?, ?, ?, ?, ?, ?)'
  const values = records.map((r) => [r.ts, r.hostid, r.type, r.mod, r.value, r.tag])
  
  await pool.query(sql, values)
  console.log(`[ETL] Imported ${records.length} pref tsar records`)
}

async function main(): Promise<void> {
  try {
    console.log('[ETL] Starting data import...')
    
    await pool.query(CREATE_TABLES_SQL)
    console.log('[ETL] Tables created/verified')
    
    await importModDetail()
    await importHostDetail()
    await importDiskTsar()
    await importPrefTsar()
    
    console.log('[ETL] All data imported successfully!')
    process.exit(0)
  } catch (error) {
    console.error('[ETL] Import failed:', error)
    process.exit(1)
  }
}

main()
