import pptxgen from 'pptxgenjs'
import { EditableSlide, SlidefulProject } from '../types/slideful'

export async function exportSlidefulToPptx(
  projectTitle: string,
  slides: EditableSlide[],
  aspectRatio: '16:9' | '4:3' = '16:9'
): Promise<void> {
  const pptx = new pptxgen()
  pptx.layout = aspectRatio === '16:9' ? 'LAYOUT_16x9' : 'LAYOUT_4x3'
  pptx.title = projectTitle
  pptx.company = 'Image to PPT'
  pptx.author = 'AI Image & Slide Layer Engine'

  const slideW = aspectRatio === '16:9' ? 13.333 : 10.0
  const slideH = 7.5

  for (let sIdx = 0; sIdx < slides.length; sIdx++) {
    const s = slides[sIdx]
    const slide = pptx.addSlide()

    // 1. Background Fill
    const cleanBg = s.backgroundColor?.replace('#', '') || 'F8FAFC'
    slide.background = { color: cleanBg }

    // If there is an inpainted clean background image
    if (s.cleanBackgroundUrl && !s.watermarkRemoved) {
      slide.addImage({
        data: s.cleanBackgroundUrl,
        x: 0,
        y: 0,
        w: slideW,
        h: slideH,
      })
    }

    // 2. Sort layers by z-index
    const sortedLayers = [...s.layers].sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))

    for (const layer of sortedLayers) {
      if (layer.hidden) continue

      // Compute coordinate in inches from percentage
      const x = (layer.x / 100) * slideW
      const y = (layer.y / 100) * slideH
      const w = (layer.w / 100) * slideW
      const h = (layer.h / 100) * slideH

      if (layer.type === 'card' || layer.type === 'badge') {
        const fillColor = layer.bgColor?.replace('#', '') || 'FFFFFF'
        const line = layer.borderColor
          ? {
              color: layer.borderColor.replace('#', ''),
              width: layer.borderWidth || 1,
            }
          : undefined

        slide.addShape(pptx.ShapeType.roundRect, {
          x,
          y,
          w,
          h,
          fill: { color: fillColor },
          line,
          rectRadius: (layer.borderRadius || 12) / 100,
        })

        // If badge has text inside it
        if (layer.text) {
          slide.addText(layer.text, {
            x,
            y,
            w,
            h,
            fontSize: layer.fontSize || 10,
            bold: layer.fontWeight === 'bold',
            color: layer.fontColor?.replace('#', '') || '059669',
            align: layer.align || 'center',
            valign: 'middle',
          })
        }
      } else if (layer.type === 'text') {
        slide.addText(layer.text || '', {
          x,
          y,
          w,
          h,
          fontSize: layer.fontSize || 14,
          bold: layer.fontWeight === 'bold',
          color: layer.fontColor?.replace('#', '') || '0F172A',
          align: layer.align || 'left',
          valign: 'top',
          wrap: true,
        })
      } else if (layer.type === 'image' && layer.imageUrl) {
        slide.addImage({
          data: layer.imageUrl,
          x,
          y,
          w,
          h,
          sizing: { type: 'contain', w, h },
        })
      } else if (layer.type === 'table' && layer.tableData) {
        const tableRows: any[][] = []
        if (layer.tableHeaders && layer.tableHeaders.length > 0) {
          tableRows.push(
            layer.tableHeaders.map((headerText) => ({
              text: headerText,
              options: {
                bold: true,
                fill: { color: 'F1F5F9' },
                color: '0F172A',
                fontSize: 10,
                align: 'left',
              },
            }))
          )
        }
        layer.tableData.forEach((row) => {
          tableRows.push(
            row.map((cellText) => ({
              text: cellText,
              options: {
                fontSize: 9,
                color: '334155',
                align: 'left',
              },
            }))
          )
        })
        if (tableRows.length > 0) {
          slide.addTable(tableRows, {
            x,
            y,
            w,
            h,
            border: { pt: 0.75, color: 'CBD5E1' },
            fill: { color: 'FFFFFF' },
          })
        }
      }
    }
  }

  const safeName = projectTitle.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_') || 'Presentation'
  await pptx.writeFile({ fileName: `${safeName}.pptx` })
}
