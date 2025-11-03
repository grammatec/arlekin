import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
})

export async function sendInvoiceEmail(to: string, pdfBuffer: Buffer, invoiceId: string) {
  await transporter.sendMail({
    from: 'noreply@pi-factory.com',
    to,
    subject: `Invoice #${invoiceId.slice(0,8)}`,
    text: 'Your invoice is attached.',
    attachments: [
      { filename: `invoice-${invoiceId}.pdf`, content: pdfBuffer }
    ]
  })
}
