import express from 'express'
import { PrismaClient } from '@prisma/client'
import { generateInvoicePDF } from '../services/pdfGenerator'
import { sendInvoiceEmail } from '../services/emailService'

const router = express.Router()
const prisma = new PrismaClient()

router.post('/generate', async (req, res) => {
  try {
    const { clientId, items } = req.body
    const client = await prisma.client.findUnique({ where: { id: clientId } })
    if (!client) return res.status(404).json({ error: 'Client not found' })

    const total = items.reduce((sum: number, i: any) => sum + i.qty * i.price, 0)

    const invoice = await prisma.invoice.create({
      data: { clientId, items, total, status: 'SENT' }
    })

    const pdfBuffer = await generateInvoicePDF(invoice, client)
    await sendInvoiceEmail(client.email, pdfBuffer, invoice.id)

    res.json({ success: true, invoiceId: invoice.id })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router
