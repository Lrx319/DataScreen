import { Router } from 'express'
import { pool } from '../config/database'

const router = Router()

router.get('/summary', async (req, res) => {
  try {
    const [hostCount] = await pool.query<{ count: number }[]>(
      'SELECT COUNT(*) as count FROM host_detail',
    )
    
    const [cpuAvg] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'cpu_usage'`,
    )
    
    const [diskIoAvg] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`tag\` = 'disk_latency_ms'`,
    )
    
    const [memUsed] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'mem_used'`,
    )
    const [memFree] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'mem_free'`,
    )
    const [memBuff] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'mem_buff'`,
    )
    const [memCache] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'mem_cache'`,
    )
    
    const used = memUsed[0].avg || 0
    const free = memFree[0].avg || 0
    const buff = memBuff[0].avg || 0
    const cache = memCache[0].avg || 0
    const total = used + free + buff + cache
    const memPercent = total > 0 ? (used / total * 100) : 0
    
    res.json({
      serverCount: hostCount[0].count,
      avgCpuUsage: cpuAvg[0].avg ? parseFloat(cpuAvg[0].avg.toFixed(2)) : 0,
      avgDiskIoWait: diskIoAvg[0].avg ? parseFloat(diskIoAvg[0].avg.toFixed(2)) : 0,
      avgMemUsage: parseFloat(memPercent.toFixed(2)),
    })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

router.get('/room-stats', async (req, res) => {
  try {
    const [rows] = await pool.query<{ location1: string; count: number }[]>(
      `SELECT location1, COUNT(*) as count FROM host_detail GROUP BY location1 ORDER BY location1`,
    )
    res.json(rows.map(r => ({ room: r.location1, count: r.count })))
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

router.get('/trend', async (req, res) => {
  try {
    const [cpuTrend] = await pool.query<{ hour: string; avg_cpu: number }[]>(
      `SELECT DATE_FORMAT(FROM_UNIXTIME(ts/1000), '%H:00') as hour, AVG(value) as avg_cpu 
       FROM tsar_detail WHERE \`mod\` = 'cpu_usage' 
       GROUP BY DATE_FORMAT(FROM_UNIXTIME(ts/1000), '%H:00') ORDER BY hour`,
    )
    
    const [memTrendRaw] = await pool.query<{ hour: string; avg_used: number; avg_free: number; avg_buff: number; avg_cache: number }[]>(
      `SELECT DATE_FORMAT(FROM_UNIXTIME(ts/1000), '%H:00') as hour, 
              AVG(CASE WHEN \`mod\` = 'mem_used' THEN value ELSE 0 END) as avg_used,
              AVG(CASE WHEN \`mod\` = 'mem_free' THEN value ELSE 0 END) as avg_free,
              AVG(CASE WHEN \`mod\` = 'mem_buff' THEN value ELSE 0 END) as avg_buff,
              AVG(CASE WHEN \`mod\` = 'mem_cache' THEN value ELSE 0 END) as avg_cache
       FROM tsar_detail 
       WHERE \`mod\` IN ('mem_used', 'mem_free', 'mem_buff', 'mem_cache')
       GROUP BY DATE_FORMAT(FROM_UNIXTIME(ts/1000), '%H:00') ORDER BY hour`,
    )
    const memTrend = memTrendRaw.map(r => {
      const total = r.avg_used + r.avg_free + r.avg_buff + r.avg_cache
      return { hour: r.hour, avg_mem: total > 0 ? parseFloat((r.avg_used / total * 100).toFixed(2)) : 0 }
    })
    
    res.json({ cpu: cpuTrend, mem: memTrend })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

router.get('/host-rank', async (req, res) => {
  try {
    const [rows] = await pool.query<{ hostname: string; location1: string; avg_cpu: number }[]>(
      `SELECT h.hostname, h.location1, AVG(t.value) as avg_cpu 
       FROM tsar_detail t JOIN host_detail h ON t.hostid = h.hostid 
       WHERE t.\`mod\` = 'cpu_usage' 
       GROUP BY h.hostname, h.location1 
       ORDER BY avg_cpu DESC`,
    )
    res.json(rows.map(r => ({ host_name: r.hostname, room: r.location1.replace('机房', ''), avg_cpu: parseFloat(r.avg_cpu.toFixed(2)) })))
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

router.get('/radar', async (req, res) => {
  try {
    const [cpu] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'cpu_usage'`,
    )
    const [mem] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'mem_used'`,
    )
    const [netIn] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'net_in'`,
    )
    const [diskIo] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`tag\` = 'disk_latency_ms'`,
    )
    
    res.json([
      { dimension: 'CPU使用率', value: cpu[0].avg ? parseFloat(cpu[0].avg.toFixed(2)) : 0, max: 100 },
      { dimension: '内存使用率', value: mem[0].avg ? parseFloat(mem[0].avg.toFixed(2)) : 0, max: 100 },
      { dimension: '网络入流量', value: netIn[0].avg ? parseFloat(netIn[0].avg.toFixed(2)) : 0, max: 1000 },
      { dimension: '磁盘IO等待', value: diskIo[0].avg ? parseFloat(diskIo[0].avg.toFixed(2)) : 0, max: 100 },
    ])
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

router.get('/alerts', async (req, res) => {
  try {
    const [rows] = await pool.query<{
      hostname: string
      location1: string
      desc: string
      value: number
      unit: string
      ts: number
    }[]>(
      `SELECT h.hostname, h.location1, m.\`desc\`, t.value, m.\`unit\`, t.ts 
       FROM tsar_detail t 
       JOIN host_detail h ON t.hostid = h.hostid 
       JOIN mod_detail m ON t.\`mod\` = m.\`mod\` 
       WHERE (m.\`tag\` = 'disk_util_percent' AND t.value > 90) 
          OR (m.\`tag\` = 'cpu_percent' AND t.value > 85) 
          OR (m.\`tag\` = 'disk_latency_ms' AND t.value > 20) 
       ORDER BY t.ts DESC LIMIT 20`,
    )
    res.json(rows.map(r => ({
      host_name: r.hostname,
      room: r.location1.replace('机房', ''),
      mod_name: r.desc,
      value: parseFloat(r.value.toFixed(2)),
      unit: r.unit,
      collect_time: new Date(r.ts).toISOString().replace('T', ' ').substring(0, 19),
    })))
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

router.get('/map', async (req, res) => {
  try {
    const [rows] = await pool.query<{ location1: string; count: number }[]>(
      `SELECT location1, COUNT(*) as count FROM host_detail GROUP BY location1`,
    )
    const roomMap: Record<string, string> = {
      'A机房': '北京市',
      'B机房': '上海市',
      'C机房': '广东省',
      'D机房': '广东省',
      'E机房': '浙江省',
    }
    const provinceMap: Record<string, number> = {}
    rows.forEach((r) => {
      const province = roomMap[r.location1] || r.location1
      provinceMap[province] = (provinceMap[province] || 0) + r.count
    })
    res.json(Object.entries(provinceMap).map(([name, value]) => ({ name, value })))
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

router.get('/', async (req, res) => {
  try {
    const [hostCount] = await pool.query<{ count: number }[]>(
      'SELECT COUNT(*) as count FROM host_detail',
    )
    
    const [cpuAvg] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'cpu_usage'`,
    )
    
    const [diskIoAvg] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`tag\` = 'disk_latency_ms'`,
    )
    
    const [memUsed] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'mem_used'`,
    )
    const [memFree] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'mem_free'`,
    )
    const [memBuff] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'mem_buff'`,
    )
    const [memCache] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'mem_cache'`,
    )
    
    const used = memUsed[0].avg || 0
    const free = memFree[0].avg || 0
    const buff = memBuff[0].avg || 0
    const cache = memCache[0].avg || 0
    const total = used + free + buff + cache
    const memPercent = total > 0 ? (used / total * 100) : 0
    
    const [roomRows] = await pool.query<{ location1: string; count: number }[]>(
      `SELECT location1, COUNT(*) as count FROM host_detail GROUP BY location1 ORDER BY location1`,
    )
    
    const [cpuTrend] = await pool.query<{ hour: string; avg_cpu: number }[]>(
      `SELECT DATE_FORMAT(FROM_UNIXTIME(ts/1000), '%H:00') as hour, AVG(value) as avg_cpu 
       FROM tsar_detail WHERE \`mod\` = 'cpu_usage' 
       GROUP BY DATE_FORMAT(FROM_UNIXTIME(ts/1000), '%H:00') ORDER BY hour`,
    )
    
    const [memTrendRaw] = await pool.query<{ hour: string; avg_used: number; avg_free: number; avg_buff: number; avg_cache: number }[]>(
      `SELECT DATE_FORMAT(FROM_UNIXTIME(ts/1000), '%H:00') as hour, 
              AVG(CASE WHEN \`mod\` = 'mem_used' THEN value ELSE 0 END) as avg_used,
              AVG(CASE WHEN \`mod\` = 'mem_free' THEN value ELSE 0 END) as avg_free,
              AVG(CASE WHEN \`mod\` = 'mem_buff' THEN value ELSE 0 END) as avg_buff,
              AVG(CASE WHEN \`mod\` = 'mem_cache' THEN value ELSE 0 END) as avg_cache
       FROM tsar_detail 
       WHERE \`mod\` IN ('mem_used', 'mem_free', 'mem_buff', 'mem_cache')
       GROUP BY DATE_FORMAT(FROM_UNIXTIME(ts/1000), '%H:00') ORDER BY hour`,
    )
    const memTrend = memTrendRaw.map(r => {
      const total = r.avg_used + r.avg_free + r.avg_buff + r.avg_cache
      return { hour: r.hour, avg_mem: total > 0 ? parseFloat((r.avg_used / total * 100).toFixed(2)) : 0 }
    })
    
    const [hostRank] = await pool.query<{ hostname: string; location1: string; avg_cpu: number }[]>(
      `SELECT h.hostname, h.location1, AVG(t.value) as avg_cpu 
       FROM tsar_detail t JOIN host_detail h ON t.hostid = h.hostid 
       WHERE t.\`mod\` = 'cpu_usage' 
       GROUP BY h.hostname, h.location1 
       ORDER BY h.location1, avg_cpu DESC`,
    )
    
    const [radarCpu] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'cpu_usage'`,
    )
    const [radarMem] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'mem_used'`,
    )
    const [radarNet] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`mod\` = 'net_in'`,
    )
    const [radarDisk] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE \`tag\` = 'disk_latency_ms'`,
    )
    
    const [alerts] = await pool.query<{
      hostname: string
      location1: string
      desc: string
      value: number
      unit: string
      ts: number
    }[]>(
      `SELECT h.hostname, h.location1, m.\`desc\`, t.value, m.\`unit\`, t.ts 
       FROM tsar_detail t 
       JOIN host_detail h ON t.hostid = h.hostid 
       JOIN mod_detail m ON t.\`mod\` = m.\`mod\` 
       WHERE (m.\`tag\` = 'disk_util_percent' AND t.value > 90) 
          OR (m.\`tag\` = 'cpu_percent' AND t.value > 85) 
          OR (m.\`tag\` = 'disk_latency_ms' AND t.value > 20) 
       ORDER BY t.ts DESC LIMIT 20`,
    )
    
    const [mapRows] = await pool.query<{ location1: string; count: number }[]>(
      `SELECT location1, COUNT(*) as count FROM host_detail GROUP BY location1`,
    )
    
    const roomMap: Record<string, string> = {
      'A机房': '北京市',
      'B机房': '上海市',
      'C机房': '广东省',
      'D机房': '广东省',
      'E机房': '浙江省',
    }
    
    const provinceMap: Record<string, number> = {}
    mapRows.forEach((r) => {
      const province = roomMap[r.location1] || r.location1
      provinceMap[province] = (provinceMap[province] || 0) + r.count
    })
    const mapData = Object.entries(provinceMap).map(([name, value]) => ({ name, value }))
    
    res.json({
      summary: {
        serverCount: hostCount[0].count,
        avgCpuUsage: cpuAvg[0].avg ? parseFloat(cpuAvg[0].avg.toFixed(2)) : 0,
        avgDiskIoWait: diskIoAvg[0].avg ? parseFloat(diskIoAvg[0].avg.toFixed(2)) : 0,
        avgMemUsage: parseFloat(memPercent.toFixed(2)),
      },
      roomStats: roomRows.map(r => ({ room: r.location1, count: r.count })),
      trend: { cpu: cpuTrend, mem: memTrend },
      hostRank: hostRank.map(r => ({ host_name: r.hostname, room: r.location1.replace('机房', ''), avg_cpu: parseFloat(r.avg_cpu.toFixed(2)) })),
      radar: [
        { dimension: 'CPU使用率', value: radarCpu[0].avg ? parseFloat(radarCpu[0].avg.toFixed(2)) : 0, max: 100 },
        { dimension: '内存使用率', value: parseFloat(memPercent.toFixed(2)), max: 100 },
        { dimension: '网络入流量', value: radarNet[0].avg ? parseFloat(radarNet[0].avg.toFixed(2)) : 0, max: 1000 },
        { dimension: '磁盘IO等待', value: radarDisk[0].avg ? parseFloat(radarDisk[0].avg.toFixed(2)) : 0, max: 100 },
      ],
      alerts: alerts.map(r => ({
        host_name: r.hostname,
        room: r.location1.replace('机房', ''),
        mod_name: r.desc,
        value: parseFloat(r.value.toFixed(2)),
        unit: r.unit,
        collect_time: new Date(r.ts).toISOString().replace('T', ' ').substring(0, 19),
      })),
      map: mapData,
    })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

export default router
