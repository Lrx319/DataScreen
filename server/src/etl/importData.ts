import fs from 'fs'
import path from 'path'
import { pool } from '../config/database'
import { CREATE_TABLES_SQL, INSERT_MOD_DETAIL_SQL } from '../config/schema'

const DATA_DIR = path.join(__dirname, '../../data')

interface HostRecord {
  host_id: string
  host_name: string
  ip_addr: string
  room: string
  rack: string
}

interface TsarRecord {
  host_id: string
  mod_id: string
  collect_time: Date
  value: number
}

async function readDatFile(fileName: string): Promise<string[][]> {
  const filePath = path.join(DATA_DIR, fileName)
  const content = fs.readFileSync(filePath, 'utf-8')
  const lines = content.trim().split('\n')
  return lines.map((line) => line.split('\t'))
}

function parseDateTime(dateStr: string, timeStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  const [hour, minute, second] = timeStr.split(':').map(Number)
  return new Date(year, month - 1, day, hour, minute, second)
}

async function importHostDetail(): Promise<void> {
  const rows = await readDatFile('host_detail.dat')
  const records: HostRecord[] = []
  
  for (const row of rows) {
    if (row.length < 5) continue
    records.push({
      host_id: row[0].trim(),
      host_name: row[1].trim(),
      ip_addr: row[2].trim(),
      room: row[3].trim(),
      rack: row[4].trim(),
    })
  }
  
  const sql = 'INSERT INTO host_detail (host_id, host_name, ip_addr, room, rack) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE host_name = VALUES(host_name), ip_addr = VALUES(ip_addr), room = VALUES(room), rack = VALUES(rack)'
  const values = records.map((r) => [r.host_id, r.host_name, r.ip_addr, r.room, r.rack])
  
  await pool.query(sql, values)
  console.log(`[ETL] Imported ${records.length} host records`)
}

async function importModDetail(): Promise<void> {
  await pool.query(INSERT_MOD_DETAIL_SQL)
  console.log('[ETL] Imported mod detail records')
}

async function importDiskTsar(): Promise<void> {
  const rows = await readDatFile('disk_tsar.dat')
  const records: TsarRecord[] = []
  
  for (const row of rows) {
    if (row.length < 4) continue
    try {
      records.push({
        host_id: row[0].trim(),
        mod_id: row[1].trim(),
        collect_time: parseDateTime('2026-07-01', row[2].trim()),
        value: parseFloat(row[3].trim()),
      })
    } catch {
      continue
    }
  }
  
  const sql = 'INSERT INTO tsar_detail (host_id, mod_id, collect_time, value) VALUES (?, ?, ?, ?)'
  const values = records.map((r) => [r.host_id, r.mod_id, r.collect_time, r.value])
  
  await pool.query(sql, values)
  console.log(`[ETL] Imported ${records.length} disk tsar records`)
}

async function importPrefTsar(): Promise<void> {
  const rows = await readDatFile('pref_tsar.dat')
  const records: TsarRecord[] = []
  
  for (const row of rows) {
    if (row.length < 4) continue
    try {
      records.push({
        host_id: row[0].trim(),
        mod_id: row[1].trim(),
        collect_time: parseDateTime('2026-07-01', row[2].trim()),
        value: parseFloat(row[3].trim()),
      })
    } catch {
      continue
    }
  }
  
  const sql = 'INSERT INTO tsar_detail (host_id, mod_id, collect_time, value) VALUES (?, ?, ?, ?)'
  const values = records.map((r) => [r.host_id, r.mod_id, r.collect_time, r.value])
  
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
