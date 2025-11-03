import cron from 'node-cron'
import { PrismaClient } from '@prisma/client'
import { generateInvoicePDF } from './pdfGenerator'
import { sendInvoiceEmail } from './emailService'

const prisma = new PrismaClient()

// Run every 1st of month at 9 AM
cron.schedule('0 9 1 * *', async () => {
  console.log('Running monthly invoice job...')
  const clients = await prisma.client.findMany({ where: { billingCycle: 'monthly' } })

  for (const client of clients) {
    const items = client.defaultItems as any[]
    const total = items.reduce((s, i) => s + i.qty * i.price, 0)

    const invoice = await prisma.invoice.create({
      data: { clientId: client.id, items, total, status: 'SENT' }
    })

    const pdf = await generateInvoicePDF(invoice, client)
    await sendInvoiceEmail(client.email, pdf, invoice.id)
  }
})
