import fs from 'fs'
import path from 'path'
import { pool } from '../config/database'

const DATA_DIR = path.join(__dirname, '../../data')

interface HostRecord {
  hostid: string
  hostname: string
  owner: string
  model: string
  location1: string
  location2: string
}

interface ModRecord {
  mod: string
  type: string
  desc: string
  unit: string
  tag: string
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

const CREATE_TABLES_SQL = `
CREATE TABLE IF NOT EXISTS host_detail (
  hostid VARCHAR(64) PRIMARY KEY,
  hostname VARCHAR(128) NOT NULL,
  owner VARCHAR(64),
  model VARCHAR(64),
  location1 VARCHAR(32) NOT NULL,
  location2 VARCHAR(32),
  status TINYINT DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS mod_detail (
  mod VARCHAR(64) PRIMARY KEY,
  type VARCHAR(16) NOT NULL,
  \`desc\` VARCHAR(128),
  unit VARCHAR(16),
  tag VARCHAR(64),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tsar_detail (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  ts BIGINT NOT NULL,
  hostid VARCHAR(64) NOT NULL,
  type VARCHAR(16) NOT NULL,
  mod VARCHAR(64) NOT NULL,
  value DOUBLE NOT NULL,
  tag VARCHAR(64),
  FOREIGN KEY (hostid) REFERENCES host_detail(hostid),
  FOREIGN KEY (mod) REFERENCES mod_detail(mod),
  INDEX idx_host_ts (hostid, ts),
  INDEX idx_mod_ts (mod, ts)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

async function importHostDetail(): Promise<void> {
  const rows = await readDatFile('host_detail.dat')
  const records: HostRecord[] = []
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (row.length < 6) continue
    records.push({
      hostid: row[0].trim(),
      hostname: row[1].trim(),
      owner: row[2].trim(),
      model: row[3].trim(),
      location1: row[4].trim(),
      location2: row[5].trim(),
    })
  }
  
  const sql = 'INSERT INTO host_detail (hostid, hostname, owner, model, location1, location2) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE hostname = VALUES(hostname), owner = VALUES(owner), model = VALUES(model), location1 = VALUES(location1), location2 = VALUES(location2)'
  const values = records.map((r) => [r.hostid, r.hostname, r.owner, r.model, r.location1, r.location2])
  
  await pool.query(sql, values)
  console.log(`[ETL] Imported ${records.length} host records`)
}

async function importModDetail(): Promise<void> {
  const rows = await readDatFile('mod_detail.dat')
  const records: ModRecord[] = []
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (row.length < 5) continue
    records.push({
      mod: row[0].trim(),
      type: row[1].trim(),
      desc: row[2].trim(),
      unit: row[3].trim(),
      tag: row[4].trim(),
    })
  }
  
  const sql = 'INSERT INTO mod_detail (mod, type, `desc`, unit, tag) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE type = VALUES(type), `desc` = VALUES(`desc`), unit = VALUES(unit), tag = VALUES(tag)'
  const values = records.map((r) => [r.mod, r.type, r.desc, r.unit, r.tag])
  
  await pool.query(sql, values)
  console.log(`[ETL] Imported ${records.length} mod records`)
}

async function importDiskTsar(): Promise<void> {
  const rows = await readDatFile('disk_tsar.dat')
  const records: TsarRecord[] = []
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (row.length < 6) continue
    try {
      records.push({
        ts: parseInt(row[0].trim(), 10),
        hostid: row[1].trim(),
        type: row[2].trim(),
        mod: row[3].trim(),
        value: parseFloat(row[4].trim()),
        tag: row[5].trim(),
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
  
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (row.length < 6) continue
    try {
      records.push({
        ts: parseInt(row[0].trim(), 10),
        hostid: row[1].trim(),
        type: row[2].trim(),
        mod: row[3].trim(),
        value: parseFloat(row[4].trim()),
        tag: row[5].trim(),
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
