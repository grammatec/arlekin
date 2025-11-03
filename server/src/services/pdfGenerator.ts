import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
pdfMake.vfs = pdfFonts.pdfMake.vfs

export async function generateInvoicePDF(invoice: any, client: any): Promise<Buffer> {
  const docDefinition = {
    content: [
      { text: 'INVOICE', style: 'header' },
      { text: `Invoice #${invoice.id.slice(0,8)}`, margin: [0, 10] },
      { text: `Date: ${new Date().toLocaleDateString()}` },
      { text: client.name, style: 'subheader', margin: [0, 20] },
      { text: client.email },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto'],
          body: [
            ['Item', 'Qty', 'Price', 'Total'],
            ...invoice.items.map((i: any) => [
              i.name,
              i.qty,
              `$${i.price}`,
              `$${(i.qty * i.price).toFixed(2)}`
            ])
          ]
        },
        layout: 'lightHorizontalLines'
      },
      { text: `Total: $${invoice.total.toFixed(2)}`, style: 'total', margin: [0, 20] }
    ],
    styles: {
      header: { fontSize: 22, bold: true },
      subheader: { fontSize: 14, bold: true },
      total: { fontSize: 16, bold: true, alignment: 'right' }
    }
  }

  return new Promise((resolve) => {
    const pdf = pdfMake.createPdf(docDefinition)
    const chunks: Buffer[] = []
    pdf.getBuffer((buffer: Buffer) => {
      chunks.push(buffer)
      resolve(Buffer.concat(chunks))
    })
  })
}
