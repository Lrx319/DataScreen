import { Router } from 'express'
import { pool } from '../config/database'

const router = Router()

router.get('/summary', async (req, res) => {
  try {
    const [hostCount] = await pool.query<{ count: number }[]>(
      'SELECT COUNT(*) as count FROM host_detail',
    )
    
    const [cpuAvg] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE mod_id = 'cpu'`,
    )
    
    const [diskIoAvg] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE mod_id = 'disk_io_wait'`,
    )
    
    const [memAvg] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE mod_id = 'mem'`,
    )
    
    res.json({
      serverCount: hostCount[0].count,
      avgCpuUsage: cpuAvg[0].avg ? parseFloat(cpuAvg[0].avg.toFixed(2)) : 0,
      avgDiskIoWait: diskIoAvg[0].avg ? parseFloat(diskIoAvg[0].avg.toFixed(2)) : 0,
      avgMemUsage: memAvg[0].avg ? parseFloat(memAvg[0].avg.toFixed(2)) : 0,
    })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

router.get('/room-stats', async (req, res) => {
  try {
    const [rows] = await pool.query<{ room: string; count: number }[]>(
      `SELECT room, COUNT(*) as count FROM host_detail GROUP BY room ORDER BY room`,
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

router.get('/trend', async (req, res) => {
  try {
    const [cpuTrend] = await pool.query<{ hour: string; avg_cpu: number }[]>(
      `SELECT DATE_FORMAT(collect_time, '%H:00') as hour, AVG(value) as avg_cpu 
       FROM tsar_detail WHERE mod_id = 'cpu' 
       GROUP BY DATE_FORMAT(collect_time, '%H:00') ORDER BY hour`,
    )
    
    const [memTrend] = await pool.query<{ hour: string; avg_mem: number }[]>(
      `SELECT DATE_FORMAT(collect_time, '%H:00') as hour, AVG(value) as avg_mem 
       FROM tsar_detail WHERE mod_id = 'mem' 
       GROUP BY DATE_FORMAT(collect_time, '%H:00') ORDER BY hour`,
    )
    
    res.json({ cpu: cpuTrend, mem: memTrend })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

router.get('/host-rank', async (req, res) => {
  try {
    const [rows] = await pool.query<{ host_name: string; room: string; avg_cpu: number }[]>(
      `SELECT h.host_name, h.room, AVG(t.value) as avg_cpu 
       FROM tsar_detail t JOIN host_detail h ON t.host_id = h.host_id 
       WHERE t.mod_id = 'cpu' 
       GROUP BY h.host_name, h.room 
       ORDER BY avg_cpu DESC LIMIT 10`,
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

router.get('/radar', async (req, res) => {
  try {
    const [cpu] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE mod_id = 'cpu'`,
    )
    const [mem] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE mod_id = 'mem'`,
    )
    const [netIn] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE mod_id = 'net_in'`,
    )
    const [diskIo] = await pool.query<{ avg: number }[]>(
      `SELECT AVG(value) as avg FROM tsar_detail WHERE mod_id = 'disk_io_wait'`,
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
      host_name: string
      room: string
      mod_name: string
      value: number
      unit: string
      collect_time: Date
    }[]>(
      `SELECT h.host_name, h.room, m.mod_name, t.value, m.unit, t.collect_time 
       FROM tsar_detail t 
       JOIN host_detail h ON t.host_id = h.host_id 
       JOIN mod_detail m ON t.mod_id = m.mod_id 
       WHERE (m.mod_id = 'disk_util' AND t.value > 90) 
          OR (m.mod_id = 'cpu' AND t.value > 85) 
          OR (m.mod_id = 'disk_io_wait' AND t.value > 20) 
       ORDER BY t.collect_time DESC LIMIT 20`,
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

router.get('/map', async (req, res) => {
  try {
    const [rows] = await pool.query<{ room: string; count: number }[]>(
      `SELECT room, COUNT(*) as count FROM host_detail GROUP BY room`,
    )
    const roomMap: Record<string, string> = {
      'A': '北京',
      'B': '上海',
      'C': '广州',
      'D': '深圳',
      'E': '杭州',
    }
    res.json(rows.map((r) => ({ name: roomMap[r.room] || r.room, value: r.count })))
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

export default router
