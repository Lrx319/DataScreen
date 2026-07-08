import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import dashboardRouter from './routes/dashboard'

const app = express()
const port = parseInt(process.env.PORT || '3000')

app.use(cors())
app.use(express.json())
app.use('/api/dashboard', dashboardRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
