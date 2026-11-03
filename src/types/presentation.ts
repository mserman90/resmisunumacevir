export type ThemeId =
  | 'modern-dark'
  | 'studio-white'
  | 'midnight-navy'
  | 'warm-editorial'
  | 'emerald-minimal'

export interface ThemeConfig {
  id: ThemeId
  name: string
  bgHex: string // 6 hex digits without # for pptxgenjs
  bgCss: string
  cardBgCss: string
  textHex: string
  textCss: string
  mutedHex: string
  mutedCss: string
  accentHex: string
  accentCss: string
  headerHex: string
}

export type LayoutMode = 'contain' | 'cover' | 'split' | 'framed'
export type AspectRatio = '16:9' | '4:3'

export interface SlideImage {
  id: string
  name: string
  dataUrl: string
  caption?: string
  notes?: string
  width?: number
  height?: number
  aspectRatio?: number
  rotation?: number // 0, 90, 180, 270
  createdAt: number
}

export interface PresentationProject {
  id: string
  title: string
  description?: string
  images: SlideImage[]
  theme: ThemeId
  layout: LayoutMode
  aspectRatio: AspectRatio
  showTitleHeader: boolean
  showSlideNumbers: boolean
  showCaptions: boolean
  includeTitleSlide: boolean
  titleSlideSubtitle?: string
  includeClosingSlide: boolean
  closingSlideText?: string
  createdAt: string
  updatedAt: string
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  'modern-dark': {
    id: 'modern-dark',
    name: 'Modern Obsidian',
    bgHex: '0F172A',
    bgCss: 'bg-slate-900',
    cardBgCss: 'bg-slate-800/80',
    textHex: 'F8FAFC',
    textCss: 'text-slate-50',
    mutedHex: '94A3B8',
    mutedCss: 'text-slate-400',
    accentHex: '6366F1',
    accentCss: 'text-indigo-400',
    headerHex: '1E293B',
  },
  'studio-white': {
    id: 'studio-white',
    name: 'Studio Clean White',
    bgHex: 'FFFFFF',
    bgCss: 'bg-white',
    cardBgCss: 'bg-slate-50',
    textHex: '0F172A',
    textCss: 'text-slate-900',
    mutedHex: '64748B',
    mutedCss: 'text-slate-500',
    accentHex: '4F46E5',
    accentCss: 'text-indigo-600',
    headerHex: 'F1F5F9',
  },
  'midnight-navy': {
    id: 'midnight-navy',
    name: 'Midnight Navy',
    bgHex: '091E3A',
    bgCss: 'bg-[#091e3a]',
    cardBgCss: 'bg-[#102a4e]',
    textHex: 'FFFFFF',
    textCss: 'text-white',
    mutedHex: '93C5FD',
    mutedCss: 'text-blue-200',
    accentHex: '38BDF8',
    accentCss: 'text-sky-400',
    headerHex: '0F2B52',
  },
  'warm-editorial': {
    id: 'warm-editorial',
    name: 'Warm Editorial',
    bgHex: 'F9F6F0',
    bgCss: 'bg-[#f9f6f0]',
    cardBgCss: 'bg-[#efebe4]',
    textHex: '292524',
    textCss: 'text-stone-800',
    mutedHex: '78716C',
    mutedCss: 'text-stone-500',
    accentHex: 'B45309',
    accentCss: 'text-amber-700',
    headerHex: 'E7E2D9',
  },
  'emerald-minimal': {
    id: 'emerald-minimal',
    name: 'Forest Emerald',
    bgHex: '06241B',
    bgCss: 'bg-[#06241b]',
    cardBgCss: 'bg-[#0c382b]',
    textHex: 'ECFDF5',
    textCss: 'text-emerald-50',
    mutedHex: '6EE7B7',
    mutedCss: 'text-emerald-300',
    accentHex: '10B981',
    accentCss: 'text-emerald-400',
    headerHex: '093326',
  },
}
