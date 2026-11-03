export interface ProcessedImage {
  name: string
  dataUrl: string
  width: number
  height: number
  aspectRatio: number
}

/**
 * Resizes and compresses image to max dimensions to prevent localStorage overflow
 * while maintaining 1080p full presentation clarity.
 */
export async function processImageFile(
  file: File,
  maxDimension = 1920
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Failed to parse image'))
      img.onload = () => {
        let width = img.naturalWidth || img.width
        let height = img.naturalHeight || img.height
        const aspectRatio = width / height

        // If SVG, return directly
        if (file.type === 'image/svg+xml') {
          resolve({
            name: file.name,
            dataUrl: reader.result as string,
            width,
            height,
            aspectRatio,
          })
          return
        }

        // Scale down if larger than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          resolve({
            name: file.name,
            dataUrl: reader.result as string,
            width,
            height,
            aspectRatio,
          })
          return
        }

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to web-friendly JPEG/PNG
        const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        const quality = mime === 'image/jpeg' ? 0.88 : undefined
        const dataUrl = canvas.toDataURL(mime, quality)

        resolve({
          name: file.name,
          dataUrl,
          width,
          height,
          aspectRatio,
        })
      }
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

/**
 * Rotates an image data URL by 90 degrees clockwise
 */
export async function rotateImageDataUrl(
  dataUrl: string,
  angleDegrees: number = 90
): Promise<{ dataUrl: string; width: number; height: number; aspectRatio: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onerror = () => reject(new Error('Failed to load image for rotation'))
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('No canvas context'))

      if (angleDegrees === 90 || angleDegrees === 270) {
        canvas.width = img.height
        canvas.height = img.width
      } else {
        canvas.width = img.width
        canvas.height = img.height
      }

      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((angleDegrees * Math.PI) / 180)
      ctx.drawImage(img, -img.width / 2, -img.height / 2)

      const rotatedData = canvas.toDataURL('image/jpeg', 0.9)
      resolve({
        dataUrl: rotatedData,
        width: canvas.width,
        height: canvas.height,
        aspectRatio: canvas.width / canvas.height,
      })
    }
    img.src = dataUrl
  })
}
