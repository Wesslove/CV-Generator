/**
 * exportPdf
 * Exporte l'aperçu CV en PDF via html2canvas + jsPDF.
 */

export async function exportPdf(element, fileName = "cv.pdf") {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ])

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
  })

  const pdf = new jsPDF("p", "mm", "a4")
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgData = canvas.toDataURL("image/png")
  const imgHeight = (canvas.height * pageWidth) / canvas.width

  let positionY = 0
  while (positionY < imgHeight) {
    pdf.addImage(imgData, "PNG", 0, -positionY, pageWidth, imgHeight)
    positionY += pageHeight
    if (positionY < imgHeight) pdf.addPage()
  }

  pdf.save(fileName)
}
