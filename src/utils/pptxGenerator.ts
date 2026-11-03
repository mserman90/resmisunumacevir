import pptxgen from 'pptxgenjs'
import { PresentationProject, THEMES } from '../types/presentation'

export interface GenerationProgress {
  status: 'preparing' | 'generating' | 'saving' | 'completed' | 'error'
  currentSlide: number
  totalSlides: number
  message: string
}

export async function exportToPowerPoint(
  project: PresentationProject,
  onProgress?: (progress: GenerationProgress) => void
): Promise<void> {
  const theme = THEMES[project.theme] || THEMES['modern-dark']
  const is16x9 = project.aspectRatio === '16:9'

  // Standard slide dimensions in inches
  const slideWidth = is16x9 ? 13.333 : 10.0
  const slideHeight = 7.5

  const pptx = new pptxgen()
  pptx.layout = is16x9 ? 'LAYOUT_16x9' : 'LAYOUT_4x3'
  pptx.title = project.title
  pptx.author = 'Image to PPT'
  pptx.company = 'Image to PPT Studio'
  pptx.subject = project.description || 'Converted from image collection'

  const totalSlides =
    project.images.length +
    (project.includeTitleSlide ? 1 : 0) +
    (project.includeClosingSlide ? 1 : 0)

  let currentCount = 0

  onProgress?.({
    status: 'preparing',
    currentSlide: 0,
    totalSlides,
    message: 'Initializing presentation layout...',
  })

  // 1. Title / Cover Slide
  if (project.includeTitleSlide) {
    currentCount++
    onProgress?.({
      status: 'generating',
      currentSlide: currentCount,
      totalSlides,
      message: 'Creating title slide...',
    })

    const titleSlide = pptx.addSlide()
    titleSlide.background = { color: theme.bgHex }

    // Decorative top accent bar
    titleSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: slideWidth,
      h: 0.15,
      fill: { color: theme.accentHex },
    })

    // Centered Title Box
    titleSlide.addText(project.title, {
      x: 1.0,
      y: 2.2,
      w: slideWidth - 2.0,
      h: 1.6,
      fontSize: 34,
      bold: true,
      color: theme.textHex,
      align: 'center',
      valign: 'middle',
    })

    // Subtitle
    const subtitle = project.titleSlideSubtitle || project.description || 'Image Collection Presentation'
    titleSlide.addText(subtitle, {
      x: 1.5,
      y: 3.9,
      w: slideWidth - 3.0,
      h: 0.9,
      fontSize: 16,
      color: theme.mutedHex,
      align: 'center',
      valign: 'top',
    })

    // Metadata footer
    const dateStr = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
    titleSlide.addText(`${dateStr} • ${project.images.length} Visual Slides`, {
      x: 1.5,
      y: 6.2,
      w: slideWidth - 3.0,
      h: 0.5,
      fontSize: 11,
      color: theme.mutedHex,
      align: 'center',
    })
  }

  // 2. Individual Image Slides
  for (let i = 0; i < project.images.length; i++) {
    const img = project.images[i]
    currentCount++
    onProgress?.({
      status: 'generating',
      currentSlide: currentCount,
      totalSlides,
      message: `Rendering slide ${i + 1} of ${project.images.length} (${img.name})...`,
    })

    const slide = pptx.addSlide()
    slide.background = { color: theme.bgHex }

    // Speaker notes if provided
    if (img.notes) {
      slide.addNotes(img.notes)
    }

    // Top Header bar if enabled
    const headerHeight = project.showTitleHeader ? 0.75 : 0
    if (project.showTitleHeader) {
      // Header background strip
      slide.addShape(pptx.ShapeType.rect, {
        x: 0,
        y: 0,
        w: slideWidth,
        h: headerHeight,
        fill: { color: theme.headerHex },
      })

      // Slide title / Project title
      const cleanImgName = img.name.replace(/\.[^/.]+$/, '').replace(/[_|-]/g, ' ')
      slide.addText(project.title, {
        x: 0.5,
        y: 0.15,
        w: slideWidth - 3.5,
        h: 0.45,
        fontSize: 13,
        bold: true,
        color: theme.textHex,
        valign: 'middle',
      })

      // Slide number
      if (project.showSlideNumbers) {
        slide.addText(`${i + 1} / ${project.images.length}`, {
          x: slideWidth - 2.5,
          y: 0.15,
          w: 2.0,
          h: 0.45,
          fontSize: 11,
          color: theme.mutedHex,
          align: 'right',
          valign: 'middle',
        })
      }
    }

    // Determine layout geometry
    const availableTop = headerHeight + 0.25
    const footerSpace = project.showCaptions && img.caption ? 0.75 : 0.25
    const availableHeight = slideHeight - availableTop - footerSpace

    if (project.layout === 'cover') {
      // Full bleed / maximum coverage
      slide.addImage({
        data: img.dataUrl,
        x: 0,
        y: project.showTitleHeader ? headerHeight : 0,
        w: slideWidth,
        h: project.showTitleHeader ? slideHeight - headerHeight : slideHeight,
        sizing: {
          type: 'contain',
          w: slideWidth,
          h: project.showTitleHeader ? slideHeight - headerHeight : slideHeight,
        },
      })
    } else if (project.layout === 'split') {
      // Left 62% image, Right 38% text & notes
      const imgWidth = (slideWidth - 1.2) * 0.62
      const textX = 0.6 + imgWidth + 0.4
      const textWidth = slideWidth - textX - 0.6

      // Image box
      slide.addImage({
        data: img.dataUrl,
        x: 0.6,
        y: availableTop,
        w: imgWidth,
        h: availableHeight,
        sizing: { type: 'contain', w: imgWidth, h: availableHeight },
      })

      // Right text details
      const cleanImgName = img.name.replace(/\.[^/.]+$/, '').replace(/[_|-]/g, ' ')
      slide.addText(cleanImgName, {
        x: textX,
        y: availableTop + 0.2,
        w: textWidth,
        h: 0.8,
        fontSize: 18,
        bold: true,
        color: theme.textHex,
        valign: 'top',
      })

      if (img.caption) {
        slide.addText(img.caption, {
          x: textX,
          y: availableTop + 1.1,
          w: textWidth,
          h: 1.5,
          fontSize: 12,
          color: theme.mutedHex,
          valign: 'top',
        })
      }

      if (img.notes) {
        slide.addShape(pptx.ShapeType.roundRect, {
          x: textX,
          y: availableTop + 2.8,
          w: textWidth,
          h: 2.0,
          fill: { color: theme.headerHex },
          line: { color: theme.accentHex, width: 1 },
        })

        slide.addText('Key Points:', {
          x: textX + 0.2,
          y: availableTop + 2.9,
          w: textWidth - 0.4,
          h: 0.35,
          fontSize: 10,
          bold: true,
          color: theme.accentHex,
        })

        slide.addText(img.notes, {
          x: textX + 0.2,
          y: availableTop + 3.25,
          w: textWidth - 0.4,
          h: 1.4,
          fontSize: 10,
          color: theme.textHex,
          valign: 'top',
        })
      }
    } else if (project.layout === 'framed') {
      // Framed elevated visual card
      const frameMarginX = 0.8
      const frameW = slideWidth - frameMarginX * 2
      const frameH = availableHeight

      slide.addShape(pptx.ShapeType.roundRect, {
        x: frameMarginX,
        y: availableTop,
        w: frameW,
        h: frameH,
        fill: { color: theme.headerHex },
        line: { color: theme.accentHex, width: 1.5 },
      })

      slide.addImage({
        data: img.dataUrl,
        x: frameMarginX + 0.25,
        y: availableTop + 0.25,
        w: frameW - 0.5,
        h: frameH - 0.5,
        sizing: { type: 'contain', w: frameW - 0.5, h: frameH - 0.5 },
      })
    } else {
      // Standard contain layout (centered with clean margin)
      const marginX = 0.75
      const availableW = slideWidth - marginX * 2

      slide.addImage({
        data: img.dataUrl,
        x: marginX,
        y: availableTop,
        w: availableW,
        h: availableHeight,
        sizing: { type: 'contain', w: availableW, h: availableHeight },
      })
    }

    // Bottom caption bar if enabled and present (for non-split mode)
    if (project.layout !== 'split' && project.showCaptions && img.caption) {
      slide.addText(img.caption, {
        x: 1.0,
        y: slideHeight - 0.65,
        w: slideWidth - 2.0,
        h: 0.45,
        fontSize: 11,
        color: theme.mutedHex,
        align: 'center',
        valign: 'middle',
      })
    }
  }

  // 3. Optional Closing Slide
  if (project.includeClosingSlide) {
    currentCount++
    onProgress?.({
      status: 'generating',
      currentSlide: currentCount,
      totalSlides,
      message: 'Creating closing slide...',
    })

    const closingSlide = pptx.addSlide()
    closingSlide.background = { color: theme.bgHex }

    // Decorative bottom accent bar
    closingSlide.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: slideHeight - 0.15,
      w: slideWidth,
      h: 0.15,
      fill: { color: theme.accentHex },
    })

    const closingText = project.closingSlideText || 'Thank You!'
    closingSlide.addText(closingText, {
      x: 1.0,
      y: 2.6,
      w: slideWidth - 2.0,
      h: 1.4,
      fontSize: 32,
      bold: true,
      color: theme.textHex,
      align: 'center',
      valign: 'middle',
    })

    closingSlide.addText(project.title, {
      x: 1.5,
      y: 4.1,
      w: slideWidth - 3.0,
      h: 0.6,
      fontSize: 14,
      color: theme.mutedHex,
      align: 'center',
    })
  }

  // 4. Save file
  onProgress?.({
    status: 'saving',
    currentSlide: totalSlides,
    totalSlides,
    message: 'Compiling PowerPoint file and generating download...',
  })

  const safeTitle = project.title.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim().replace(/\s+/g, '_') || 'Presentation'
  await pptx.writeFile({ fileName: `${safeTitle}.pptx` })

  onProgress?.({
    status: 'completed',
    currentSlide: totalSlides,
    totalSlides,
    message: 'Download ready!',
  })
}
