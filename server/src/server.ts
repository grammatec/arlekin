import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import invoiceRouter from './routes/invoices'
import './services/scheduler' // Start cron

dotenv.config()
const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/invoices', invoiceRouter)

app.get('/api/health', (req, res) => res.json({ status: 'OK' }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
