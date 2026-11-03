export type LayerType = 'text' | 'card' | 'badge' | 'image' | 'chart' | 'table'

export interface SlideLayer {
  id: string
  name: string
  type: LayerType
  x: number // percentage 0 - 100
  y: number // percentage 0 - 100
  w: number // percentage 0 - 100
  h: number // percentage 0 - 100
  zIndex: number
  // Text attributes
  text?: string
  fontSize?: number // pt
  fontWeight?: 'normal' | 'semibold' | 'bold'
  fontColor?: string // hex e.g. #0F172A
  align?: 'left' | 'center' | 'right'
  // Card / shape attributes
  bgColor?: string // hex e.g. #FFFFFF
  borderColor?: string // hex e.g. #E2E8F0
  borderWidth?: number // px
  borderRadius?: number // px
  // Graphic / image attributes
  imageUrl?: string
  // Table attributes
  tableData?: string[][]
  tableHeaders?: string[]
  // Controls
  locked?: boolean
  hidden?: boolean
}

export interface EditableSlide {
  id: string
  title: string
  originalImageUrl?: string
  backgroundColor: string // hex e.g. #F8FAFC
  cleanBackgroundUrl?: string // Inpainted background without text/watermark
  watermarkRemoved: boolean
  hasWatermarkDetected: boolean
  layers: SlideLayer[]
}

export interface SlidefulProject {
  id: string
  title: string
  description?: string
  aspectRatio: '16:9' | '4:3'
  slides: EditableSlide[]
  createdAt: string
  updatedAt: string
}
