import React, { useState, useRef, useEffect } from 'react'
import {
  EditableSlide,
  SlideLayer,
  SlidefulProject,
} from '../types/slideful'
import {
  Download,
  Plus,
  Trash2,
  Type,
  Square,
  Eye,
  EyeOff,
  Move,
  RotateCw,
  Sparkles,
  Layers,
  Check,
  Loader2,
  Maximize2,
  FileText,
  Sliders,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Undo2,
  Redo2,
  ImageIcon,
  Table as TableIcon,
  Palette,
  Printer,
  Copy,
} from 'lucide-react'
import { exportSlidefulToPptx } from '../utils/slidefulPptxExport'
import { separateImageIntoLayers } from '../utils/aiLayerExtractor'
import confetti from 'canvas-confetti'
import { useLanguage } from '../i18n/translations'

interface SlidefulWorkspaceProps {
  project: SlidefulProject
  onUpdateProject: (updated: SlidefulProject) => void
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void
  onBackToLanding: () => void
}

type ResizeHandleType = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w'

const THEMES = [
  {
    id: 'emerald',
    name: 'Modern Zümrüt (Varsayılan)',
    bgColor: '#F8FAFC',
    cardBg: '#FFFFFF',
    borderColor: '#E2E8F0',
    titleColor: '#0F172A',
    textColor: '#475569',
    accentColor: '#059669',
  },
  {
    id: 'dark',
    name: 'Gece Modu (Dark Tech)',
    bgColor: '#0F172A',
    cardBg: '#1E293B',
    borderColor: '#334155',
    titleColor: '#F8FAFC',
    textColor: '#94A3B8',
    accentColor: '#10B981',
  },
  {
    id: 'navy',
    name: 'Kurumsal Lacivert (Navy Pro)',
    bgColor: '#F1F5F9',
    cardBg: '#FFFFFF',
    borderColor: '#CBD5E1',
    titleColor: '#0A192F',
    textColor: '#334155',
    accentColor: '#1D4ED8',
  },
  {
    id: 'amber',
    name: 'Danışmanlık Sıcak Amber',
    bgColor: '#FFFBEB',
    cardBg: '#FFFFFF',
    borderColor: '#FDE68A',
    titleColor: '#78350F',
    textColor: '#92400E',
    accentColor: '#D97706',
  },
  {
    id: 'slate',
    name: 'Temiz Slate (Minimal Gri)',
    bgColor: '#F8FAFC',
    cardBg: '#FFFFFF',
    borderColor: '#E2E8F0',
    titleColor: '#1E293B',
    textColor: '#475569',
    accentColor: '#475569',
  },
]

export const SlidefulWorkspace: React.FC<SlidefulWorkspaceProps> = ({
  project,
  onUpdateProject,
  onToast,
  onBackToLanding,
}) => {
  const { language, t } = useLanguage()
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingPng, setIsExportingPng] = useState(false)
  const [editingTextId, setEditingTextId] = useState<string | null>(null)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)

  // Undo / Redo History Stack
  const [history, setHistory] = useState<SlidefulProject[]>([project])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Dragging State
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null)
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null)

  // Resizing State
  const [resizingHandle, setResizingHandle] = useState<ResizeHandleType | null>(null)
  const [resizeStartLayer, setResizeStartLayer] = useState<{ x: number; y: number; w: number; h: number } | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)
  const imageLayerInputRef = useRef<HTMLInputElement>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const activeSlide = project.slides[activeSlideIndex] || project.slides[0]
  const selectedLayer = activeSlide?.layers.find((l) => l.id === selectedLayerId) || null

  // Push to history helper
  const commitProject = (updated: SlidefulProject) => {
    const newHist = history.slice(0, historyIndex + 1)
    newHist.push(updated)
    if (newHist.length > 30) newHist.shift()
    setHistory(newHist)
    setHistoryIndex(newHist.length - 1)
    onUpdateProject(updated)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1
      setHistoryIndex(nextIdx)
      onUpdateProject(history[nextIdx])
      onToast(t.undo, 'info')
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1
      setHistoryIndex(nextIdx)
      onUpdateProject(history[nextIdx])
      onToast(t.redo, 'info')
    }
  }

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement
      const isTyping =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable)

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault()
          handleRedo()
        } else {
          e.preventDefault()
          handleUndo()
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault()
        handleRedo()
      } else if (!isTyping && (e.key === 'Delete' || e.key === 'Backspace')) {
        if (selectedLayerId) {
          e.preventDefault()
          handleDeleteLayer(selectedLayerId)
        }
      } else if (
        !isTyping &&
        selectedLayer &&
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)
      ) {
        e.preventDefault()
        const step = e.shiftKey ? 2 : 0.5
        let dx = 0
        let dy = 0
        if (e.key === 'ArrowLeft') dx = -step
        if (e.key === 'ArrowRight') dx = step
        if (e.key === 'ArrowUp') dy = -step
        if (e.key === 'ArrowDown') dy = step
        const newX = Math.max(0, Math.min(100 - selectedLayer.w, selectedLayer.x + dx))
        const newY = Math.max(0, Math.min(100 - selectedLayer.h, selectedLayer.y + dy))
        handleUpdateLayer(selectedLayer.id, {
          x: Math.round(newX * 10) / 10,
          y: Math.round(newY * 10) / 10,
        })
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [historyIndex, history, selectedLayerId, selectedLayer])

  const handleUpdateSlide = (updated: EditableSlide, pushToHistory = true) => {
    const newSlides = [...project.slides]
    newSlides[activeSlideIndex] = updated
    const updatedProject = { ...project, slides: newSlides }
    if (pushToHistory) {
      commitProject(updatedProject)
    } else {
      onUpdateProject(updatedProject)
    }
  }

  // Update specific layer
  const handleUpdateLayer = (layerId: string, patch: Partial<SlideLayer>, pushToHistory = false) => {
    if (!activeSlide) return
    const updatedLayers = activeSlide.layers.map((l) =>
      l.id === layerId ? { ...l, ...patch } : l
    )
    handleUpdateSlide({ ...activeSlide, layers: updatedLayers }, pushToHistory)
  }

  // Delete layer
  const handleDeleteLayer = (layerId: string) => {
    if (!activeSlide) return
    const updatedLayers = activeSlide.layers.filter((l) => l.id !== layerId)
    handleUpdateSlide({ ...activeSlide, layers: updatedLayers }, true)
    if (selectedLayerId === layerId) setSelectedLayerId(null)
    onToast(t.deleteLayer, 'info')
  }

  // Duplicate layer
  const handleDuplicateLayer = (layer: SlideLayer) => {
    if (!activeSlide) return
    const newLayer: SlideLayer = {
      ...layer,
      id: `${layer.type}-${Math.random().toString(36).substring(2, 7)}`,
      name: `${layer.name} (Kopya)`,
      x: Math.min(90, layer.x + 3),
      y: Math.min(90, layer.y + 3),
      zIndex: (activeSlide.layers.length || 0) + 1,
    }
    handleUpdateSlide({
      ...activeSlide,
      layers: [...activeSlide.layers, newLayer],
    }, true)
    setSelectedLayerId(newLayer.id)
    onToast(language === 'tr' ? 'Katman çoğaltıldı' : 'Layer duplicated', 'success')
  }

  // Add new native text box
  const handleAddTextBox = () => {
    if (!activeSlide) return
    const newLayer: SlideLayer = {
      id: 'text-' + Math.random().toString(36).substring(2, 7),
      name: language === 'tr' ? 'Metin Kutusu' : 'Text Box',
      type: 'text',
      x: 20,
      y: 40,
      w: 60,
      h: 12,
      zIndex: (activeSlide.layers.length || 0) + 1,
      text: language === 'tr' ? 'Metninizi yazmak için çift tıklayın...' : 'Click to type your text here...',
      fontSize: 14,
      fontWeight: 'normal',
      fontColor: '#0F172A',
      align: 'left',
    }
    handleUpdateSlide({
      ...activeSlide,
      layers: [...activeSlide.layers, newLayer],
    }, true)
    setSelectedLayerId(newLayer.id)
    setEditingTextId(newLayer.id)
    onToast(language === 'tr' ? 'Yeni metin kutusu eklendi' : 'New text box added', 'success')
  }

  // Add new container card
  const handleAddCard = () => {
    if (!activeSlide) return
    const newLayer: SlideLayer = {
      id: 'card-' + Math.random().toString(36).substring(2, 7),
      name: language === 'tr' ? 'Konteyner Kartı' : 'Container Card',
      type: 'card',
      x: 15,
      y: 25,
      w: 50,
      h: 40,
      zIndex: 1,
      bgColor: '#FFFFFF',
      borderColor: '#E2E8F0',
      borderWidth: 1.5,
      borderRadius: 16,
    }
    handleUpdateSlide({
      ...activeSlide,
      layers: [newLayer, ...activeSlide.layers],
    }, true)
    setSelectedLayerId(newLayer.id)
    onToast(language === 'tr' ? 'Hareketli kart eklendi' : 'Movable card added', 'success')
  }

  // Add native table
  const handleAddTable = () => {
    if (!activeSlide) return
    const newLayer: SlideLayer = {
      id: 'table-' + Math.random().toString(36).substring(2, 7),
      name: language === 'tr' ? 'Veri Tablosu' : 'Data Table',
      type: 'table',
      x: 10,
      y: 30,
      w: 80,
      h: 36,
      zIndex: (activeSlide.layers.length || 0) + 1,
      tableHeaders: language === 'tr' ? ['Bileşen / Metrik', 'Mevcut Durum', 'Hedef', 'Değişim'] : ['Component / Metric', 'Current', 'Target', 'Change'],
      tableData: language === 'tr' ? [
        ['Dönüşüm Oranı', '%3.2', '%5.8', '+%81'],
        ['İşlem Hızı', '45 sn', '2.5 sn', '-94%'],
        ['Müşteri Memnuniyeti', '4.2/5', '4.9/5', '+%16'],
      ] : [
        ['Conversion Rate', '3.2%', '5.8%', '+81%'],
        ['Processing Time', '45s', '2.5s', '-94%'],
        ['Satisfaction Score', '4.2/5', '4.9/5', '+16%'],
      ],
      bgColor: '#FFFFFF',
      borderColor: '#E2E8F0',
      borderWidth: 1,
      borderRadius: 8,
    }
    handleUpdateSlide({
      ...activeSlide,
      layers: [...activeSlide.layers, newLayer],
    }, true)
    setSelectedLayerId(newLayer.id)
    onToast(language === 'tr' ? 'Düzenlenebilir yerel tablo eklendi!' : 'Editable native table added!', 'success')
  }

  // Apply Quick Theme
  const handleApplyTheme = (theme: typeof THEMES[0]) => {
    if (!activeSlide) return
    const updatedLayers = activeSlide.layers.map((l) => {
      if (l.type === 'card') {
        return { ...l, bgColor: theme.cardBg, borderColor: theme.borderColor }
      }
      if (l.type === 'badge') {
        return { ...l, bgColor: theme.cardBg, fontColor: theme.accentColor, borderColor: theme.borderColor }
      }
      if (l.type === 'text') {
        const isHeader = (l.fontSize && l.fontSize >= 18) || l.fontWeight === 'bold'
        return { ...l, fontColor: isHeader ? theme.titleColor : theme.textColor }
      }
      return l
    })

    handleUpdateSlide({
      ...activeSlide,
      backgroundColor: theme.bgColor,
      layers: updatedLayers,
    }, true)
    setIsThemeMenuOpen(false)
    onToast(`${theme.name} uygulandı!`, 'success')
  }

  // Add an image/graphic as a movable layer on the slide
  const handleAddImageLayer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !activeSlide) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const newLayer: SlideLayer = {
        id: 'img-' + Math.random().toString(36).substring(2, 7),
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: 'image',
        x: 30,
        y: 30,
        w: 35,
        h: 30,
        zIndex: (activeSlide.layers.length || 0) + 1,
        imageUrl: dataUrl,
      }
      handleUpdateSlide({
        ...activeSlide,
        layers: [...activeSlide.layers, newLayer],
      }, true)
      setSelectedLayerId(newLayer.id)
      onToast(`"${file.name}" katman olarak eklendi!`, 'success')
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // Decompose a newly uploaded image file into layers
  const handleDecomposeUploadedImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsAnalyzing(true)
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const dataUrl = reader.result as string
        const decomposed = await separateImageIntoLayers(file, dataUrl)
        commitProject({
          ...project,
          slides: [...project.slides, decomposed],
        })
        setActiveSlideIndex(project.slides.length)
        onToast(`Görsel ${decomposed.layers.length} düzenlenebilir katmana ayrıştırıldı!`, 'success')
      } catch (err) {
        onToast('Görsel ayrıştırma başarısız oldu', 'error')
      } finally {
        setIsAnalyzing(false)
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // Export to native .pptx
  const handleExportPptx = async () => {
    if (!project.slides.length) return
    setIsExporting(true)
    setIsExportMenuOpen(false)
    try {
      await exportSlidefulToPptx(project.title, project.slides, project.aspectRatio)
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      })
      onToast(`"${project.title}.pptx" indirildi!`, 'success')
    } catch (e: any) {
      console.error(e)
      onToast(e.message || 'PowerPoint dışa aktarma hatası', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  // Export to High-Res PNG Snapshot
  const handleExportPng = () => {
    if (!activeSlide) return
    setIsExportingPng(true)
    setIsExportMenuOpen(false)

    try {
      const c = document.createElement('canvas')
      c.width = 1920
      c.height = 1080
      const ctx = c.getContext('2d')
      if (!ctx) throw new Error('Canvas context not available')

      // Draw background
      ctx.fillStyle = activeSlide.backgroundColor || '#F8FAFC'
      ctx.fillRect(0, 0, 1920, 1080)

      // Sort layers by zIndex
      const sortedLayers = activeSlide.layers.slice().sort((a, b) => a.zIndex - b.zIndex)

      sortedLayers.forEach((layer) => {
        if (layer.hidden) return
        const lx = (layer.x / 100) * 1920
        const ly = (layer.y / 100) * 1920 * (9 / 16)
        const lw = (layer.w / 100) * 1920
        const lh = (layer.h / 100) * 1080

        if (layer.type === 'card' || layer.type === 'badge') {
          ctx.fillStyle = layer.bgColor || '#FFFFFF'
          ctx.beginPath()
          ctx.roundRect(lx, ly, lw, lh, layer.borderRadius ? layer.borderRadius * 2 : 12)
          ctx.fill()
          if (layer.borderColor) {
            ctx.strokeStyle = layer.borderColor
            ctx.lineWidth = (layer.borderWidth || 1) * 2
            ctx.stroke()
          }
          if (layer.text) {
            ctx.fillStyle = layer.fontColor || '#059669'
            ctx.font = `${layer.fontWeight === 'bold' ? 'bold' : 'normal'} ${(layer.fontSize || 12) * 2}px sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(layer.text, lx + lw / 2, ly + lh / 2)
          }
        } else if (layer.type === 'text' && layer.text) {
          ctx.fillStyle = layer.fontColor || '#0F172A'
          const fontSize = (layer.fontSize || 14) * 2
          ctx.font = `${layer.fontWeight === 'bold' ? 'bold' : 'normal'} ${fontSize}px sans-serif`
          ctx.textAlign = (layer.align as CanvasTextAlign) || 'left'
          ctx.textBaseline = 'top'

          // Simple wrap text
          const words = layer.text.split(' ')
          let line = ''
          let currentY = ly + 4
          const textX = layer.align === 'center' ? lx + lw / 2 : lx + 4

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' '
            const metrics = ctx.measureText(testLine)
            if (metrics.width > lw && n > 0) {
              ctx.fillText(line, textX, currentY)
              line = words[n] + ' '
              currentY += fontSize * 1.3
            } else {
              line = testLine
            }
          }
          ctx.fillText(line, textX, currentY)
        }
      })

      const dataUrl = c.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${activeSlide.title || 'Slide'}_1080p.png`
      a.click()
      onToast(language === 'tr' ? 'Slayt PNG görseli indirildi!' : 'Slide PNG downloaded!', 'success')
    } catch (err: any) {
      console.error(err)
      onToast('PNG görseli oluşturulamadı', 'error')
    } finally {
      setIsExportingPng(false)
    }
  }

  // Print PDF Dialog
  const handlePrintPdf = () => {
    setIsExportMenuOpen(false)
    window.print()
  }

  // Canvas Mouse down for dragging layer
  const handleLayerMouseDown = (e: React.MouseEvent, layer: SlideLayer) => {
    if (layer.locked || resizingHandle) return
    e.stopPropagation()
    setSelectedLayerId(layer.id)
    setDraggingLayerId(layer.id)
    setDragStartPos({ x: e.clientX, y: e.clientY })
  }

  // Mouse down for Resizing
  const handleResizeMouseDown = (
    e: React.MouseEvent,
    layer: SlideLayer,
    handle: ResizeHandleType
  ) => {
    if (layer.locked) return
    e.stopPropagation()
    setResizingHandle(handle)
    setResizeStartLayer({ x: layer.x, y: layer.y, w: layer.w, h: layer.h })
    setDragStartPos({ x: e.clientX, y: e.clientY })
  }

  // Canvas Mouse move
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current || !activeSlide || !dragStartPos) return
    const rect = canvasRef.current.getBoundingClientRect()
    const dx = e.clientX - dragStartPos.x
    const dy = e.clientY - dragStartPos.y
    const dxPercent = (dx / rect.width) * 100
    const dyPercent = (dy / rect.height) * 100

    // Handling RESIZE
    if (resizingHandle && resizeStartLayer && selectedLayer) {
      let { x, y, w, h } = resizeStartLayer

      if (resizingHandle.includes('e')) {
        w = Math.max(5, Math.min(100 - x, w + dxPercent))
      }
      if (resizingHandle.includes('s')) {
        h = Math.max(4, Math.min(100 - y, h + dyPercent))
      }
      if (resizingHandle.includes('w')) {
        const potentialX = Math.max(0, Math.min(x + w - 5, x + dxPercent))
        w = w + (x - potentialX)
        x = potentialX
      }
      if (resizingHandle.includes('n')) {
        const potentialY = Math.max(0, Math.min(y + h - 4, y + dyPercent))
        h = h + (y - potentialY)
        y = potentialY
      }

      handleUpdateLayer(
        selectedLayer.id,
        {
          x: Math.round(x * 10) / 10,
          y: Math.round(y * 10) / 10,
          w: Math.round(w * 10) / 10,
          h: Math.round(h * 10) / 10,
        },
        false
      )
      return
    }

    // Handling DRAG
    if (draggingLayerId) {
      const targetLayer = activeSlide.layers.find((l) => l.id === draggingLayerId)
      if (!targetLayer) return

      const newX = Math.max(0, Math.min(100 - targetLayer.w, targetLayer.x + dxPercent))
      const newY = Math.max(0, Math.min(100 - targetLayer.h, targetLayer.y + dyPercent))

      handleUpdateLayer(
        draggingLayerId,
        { x: Math.round(newX * 10) / 10, y: Math.round(newY * 10) / 10 },
        false
      )
      setDragStartPos({ x: e.clientX, y: e.clientY })
    }
  }

  const handleCanvasMouseUp = () => {
    if (draggingLayerId || resizingHandle) {
      // Commit the final position to history
      commitProject(project)
    }
    setDraggingLayerId(null)
    setResizingHandle(null)
    setResizeStartLayer(null)
    setDragStartPos(null)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-100/90 overflow-hidden select-none">
      {/* Top Workspace Toolbar */}
      <div className="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 no-print">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLanding}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← {t.home}
          </button>
          <span className="text-slate-300">|</span>
          <span className="font-bold text-sm text-slate-900 truncate max-w-xs">
            {project.title}
          </span>
          <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {project.slides.length} {t.slides}
          </span>
        </div>

        {/* Toolbar Tools */}
        <div className="flex items-center gap-2">
          {/* Undo / Redo Buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 mr-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              title={`${t.undo} (Ctrl+Z)`}
              className="p-1.5 rounded-md hover:bg-white text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title={`${t.redo} (Ctrl+Y)`}
              className="p-1.5 rounded-md hover:bg-white text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <input
            ref={imageLayerInputRef}
            type="file"
            accept="image/*"
            onChange={handleAddImageLayer}
            className="hidden"
          />
          <input
            id="decompose-input"
            type="file"
            accept="image/*"
            onChange={handleDecomposeUploadedImage}
            className="hidden"
          />

          <button
            onClick={handleAddTextBox}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Add native PowerPoint text box"
          >
            <Type className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.addText}</span>
          </button>

          <button
            onClick={handleAddCard}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Add movable container card"
          >
            <Square className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.addCard}</span>
          </button>

          <button
            onClick={handleAddTable}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Add native PowerPoint table"
          >
            <TableIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.addTable}</span>
          </button>

          <button
            onClick={() => imageLayerInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Add independent image/graphic layer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.addImageLayer}</span>
          </button>

          <button
            onClick={() => document.getElementById('decompose-input')?.click()}
            disabled={isAnalyzing}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Upload any image to split into editable layers"
          >
            {isAnalyzing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-700" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>{t.decomposeImage}</span>
          </button>

          {/* Quick Theme Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Palette className="w-3.5 h-3.5 text-purple-600" />
              <span>{t.quickTheme}</span>
            </button>

            {isThemeMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs space-y-1">
                <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Hazır Slayt Temaları
                </p>
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleApplyTheme(theme)}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 flex items-center justify-between transition-colors"
                  >
                    <span className="font-medium text-slate-800">{theme.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full border" style={{ backgroundColor: theme.bgColor }} />
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.accentColor }} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Watermark Toggle */}
          <button
            onClick={() => {
              if (!activeSlide) return
              handleUpdateSlide({
                ...activeSlide,
                watermarkRemoved: !activeSlide.watermarkRemoved,
              })
              onToast(
                activeSlide.watermarkRemoved
                  ? t.watermarkDisabled
                  : t.watermarkEnabled,
                'success'
              )
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs ${
              activeSlide?.watermarkRemoved
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-slate-600 border-slate-200'
            }`}
            title="Toggle watermark inpainting"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Filigran Yok</span>
          </button>

          {/* Export Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              disabled={isExporting || isExportingPng}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>Dışa Aktar</span>
            </button>

            {isExportMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs space-y-1">
                <button
                  onClick={handleExportPptx}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 font-semibold flex items-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="font-bold">{t.exportPptx}</p>
                    <p className="text-[10px] text-slate-400 font-normal">Yerel Office OpenXML (.pptx)</p>
                  </div>
                </button>

                <button
                  onClick={handleExportPng}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-semibold flex items-center gap-2 transition-colors"
                >
                  <ImageIcon className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-bold">{t.exportPng}</p>
                    <p className="text-[10px] text-slate-400 font-normal">1920x1080 Yüksek Çözünürlük</p>
                  </div>
                </button>

                <button
                  onClick={handlePrintPdf}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-semibold flex items-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="font-bold">{t.exportPdf}</p>
                    <p className="text-[10px] text-slate-400 font-normal">Tarayıcı Yazdırma / PDF</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Studio Body: Filmstrip + Canvas + Inspector */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Slides Filmstrip */}
        <div className="w-56 bg-white border-r border-slate-200 p-3 overflow-y-auto shrink-0 flex flex-col justify-between no-print">
          <div className="space-y-2.5">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.slides} ({project.slides.length})
              </span>
            </div>

            {project.slides.map((s, idx) => {
              const isActive = idx === activeSlideIndex
              return (
                <div key={s.id} className="relative group">
                  <button
                    onClick={() => {
                      setActiveSlideIndex(idx)
                      setSelectedLayerId(null)
                    }}
                    className={`w-full p-2 rounded-xl border text-left transition-all ${
                      isActive
                        ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                    }`}
                  >
                    <div className="aspect-video w-full rounded-md bg-white border border-slate-200 mb-1.5 p-1 flex flex-col justify-center overflow-hidden">
                      <span className="text-[9px] font-bold text-slate-800 truncate">
                        {s.title}
                      </span>
                      <span className="text-[8px] text-slate-400">
                        {s.layers.length} katman
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-600 px-0.5">
                      <span className="font-mono font-bold">Slide {idx + 1}</span>
                      {s.watermarkRemoved && (
                        <span className="text-emerald-600 text-[8px] font-semibold">Temiz</span>
                      )}
                    </div>
                  </button>

                  {/* Duplicate / Delete Slide Controls on Hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/90 p-0.5 rounded shadow-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        const dupSlide: EditableSlide = {
                          ...s,
                          id: 'slide-' + Math.random().toString(36).substring(2, 7),
                          title: `${s.title} (Kopya)`,
                        }
                        commitProject({
                          ...project,
                          slides: [...project.slides.slice(0, idx + 1), dupSlide, ...project.slides.slice(idx + 1)],
                        })
                        onToast('Slayt çoğaltıldı', 'success')
                      }}
                      title="Slaytı Çoğalt"
                      className="p-1 hover:bg-slate-100 rounded text-slate-500"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    {project.slides.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const newSlides = project.slides.filter((_, i) => i !== idx)
                          commitProject({ ...project, slides: newSlides })
                          setActiveSlideIndex(Math.max(0, idx - 1))
                          onToast('Slayt silindi', 'info')
                        }}
                        title="Slaytı Sil"
                        className="p-1 hover:bg-rose-50 rounded text-rose-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={() => {
              const newSlide: EditableSlide = {
                id: 'slide-' + Math.random().toString(36).substring(2, 7),
                title: `Slide ${project.slides.length + 1}`,
                backgroundColor: '#F8FAFC',
                watermarkRemoved: true,
                hasWatermarkDetected: false,
                layers: [
                  {
                    id: 'card-init',
                    name: 'Slide Container',
                    type: 'card',
                    x: 6,
                    y: 8,
                    w: 88,
                    h: 84,
                    zIndex: 1,
                    bgColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    borderWidth: 1.5,
                    borderRadius: 16,
                  },
                  {
                    id: 'text-init-title',
                    name: 'Slide Title',
                    type: 'text',
                    x: 10,
                    y: 16,
                    w: 80,
                    h: 12,
                    zIndex: 2,
                    text: 'Yeni Slayt Başlığı',
                    fontSize: 24,
                    fontWeight: 'bold',
                    fontColor: '#0F172A',
                  },
                  {
                    id: 'text-init-body',
                    name: 'Slide Body Paragraph',
                    type: 'text',
                    x: 10,
                    y: 30,
                    w: 80,
                    h: 16,
                    zIndex: 2,
                    text: 'Bu paragrafı düzenlemek için tıklayın. Bu slayttaki her katman bağımsız bir nesnedir.',
                    fontSize: 13,
                    fontWeight: 'normal',
                    fontColor: '#475569',
                  },
                ],
              }
              commitProject({
                ...project,
                slides: [...project.slides, newSlide],
              })
              setActiveSlideIndex(project.slides.length)
              onToast('Yeni slayt eklendi', 'success')
            }}
            className="w-full py-2 rounded-xl border border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-600 hover:text-emerald-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors mt-4"
          >
            <Plus className="w-3.5 h-3.5" />
            Yeni Slayt Ekle
          </button>
        </div>

        {/* Center: Interactive Slide Canvas Stage */}
        <div
          className="flex-1 p-6 flex flex-col items-center justify-center overflow-auto"
          onClick={() => {
            setSelectedLayerId(null)
            setEditingTextId(null)
            setIsThemeMenuOpen(false)
            setIsExportMenuOpen(false)
          }}
        >
          {/* Canvas Frame */}
          <div
            ref={canvasRef}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            className="print-only-canvas relative w-full max-w-4xl aspect-video rounded-2xl shadow-xl overflow-hidden border border-slate-300/80 transition-all select-none"
            style={{ backgroundColor: activeSlide?.backgroundColor || '#F8FAFC' }}
          >
            {/* Watermark Clean Banner Indicator */}
            {activeSlide?.watermarkRemoved && (
              <div className="absolute top-2 right-2 z-30 pointer-events-none opacity-50 hover:opacity-100 transition-opacity no-print">
                <span className="text-[9px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-300 backdrop-blur-2xs flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Filigran Temizlendi
                </span>
              </div>
            )}

            {/* Render Layers */}
            {activeSlide?.layers
              .slice()
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((layer) => {
                if (layer.hidden) return null
                const isSelected = selectedLayerId === layer.id
                const isEditingText = editingTextId === layer.id

                return (
                  <div
                    key={layer.id}
                    onMouseDown={(e) => handleLayerMouseDown(e, layer)}
                    onDoubleClick={(e) => {
                      e.stopPropagation()
                      if (layer.type === 'text') setEditingTextId(layer.id)
                    }}
                    style={{
                      position: 'absolute',
                      left: `${layer.x}%`,
                      top: `${layer.y}%`,
                      width: `${layer.w}%`,
                      height: `${layer.h}%`,
                      zIndex: layer.zIndex,
                    }}
                    className={`transition-shadow ${
                      isSelected
                        ? 'ring-2 ring-emerald-500 shadow-md cursor-move'
                        : 'hover:ring-1 hover:ring-emerald-300/60 cursor-pointer'
                    }`}
                  >
                    {/* CARD / SHAPE */}
                    {(layer.type === 'card' || layer.type === 'badge') && (
                      <div
                        className="w-full h-full flex items-center justify-center text-center p-2"
                        style={{
                          backgroundColor: layer.bgColor || '#FFFFFF',
                          borderColor: layer.borderColor || 'transparent',
                          borderWidth: layer.borderWidth ? `${layer.borderWidth}px` : undefined,
                          borderStyle: layer.borderColor ? 'solid' : undefined,
                          borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : undefined,
                        }}
                      >
                        {layer.text && (
                          <span
                            style={{
                              fontSize: `${layer.fontSize || 10}px`,
                              fontWeight: layer.fontWeight === 'bold' ? 700 : 500,
                              color: layer.fontColor || '#059669',
                            }}
                          >
                            {layer.text}
                          </span>
                        )}
                      </div>
                    )}

                    {/* TEXT BOX */}
                    {layer.type === 'text' && (
                      <div className="w-full h-full p-1 overflow-hidden">
                        {isEditingText ? (
                          <textarea
                            autoFocus
                            value={layer.text || ''}
                            onChange={(e) => handleUpdateLayer(layer.id, { text: e.target.value })}
                            onBlur={() => setEditingTextId(null)}
                            className="w-full h-full resize-none bg-white/95 rounded border border-emerald-500 p-1 focus:outline-none"
                            style={{
                              fontSize: `${layer.fontSize || 14}px`,
                              fontWeight: layer.fontWeight === 'bold' ? 700 : 400,
                              color: layer.fontColor || '#0F172A',
                              textAlign: layer.align || 'left',
                            }}
                          />
                        ) : (
                          <p
                            style={{
                              fontSize: `${layer.fontSize || 14}px`,
                              fontWeight: layer.fontWeight === 'bold' ? 700 : 400,
                              color: layer.fontColor || '#0F172A',
                              textAlign: layer.align || 'left',
                            }}
                            className="leading-snug break-words"
                          >
                            {layer.text || 'Boş metin kutusu'}
                          </p>
                        )}
                      </div>
                    )}

                    {/* TABLE LAYER */}
                    {layer.type === 'table' && layer.tableData && (
                      <div className="w-full h-full p-2 bg-white rounded-lg border border-slate-200 overflow-auto shadow-2xs">
                        <table className="w-full text-left border-collapse text-[11px]">
                          {layer.tableHeaders && layer.tableHeaders.length > 0 && (
                            <thead>
                              <tr className="border-b border-slate-200 bg-slate-50 font-bold text-slate-800">
                                {layer.tableHeaders.map((header, hIdx) => (
                                  <th key={hIdx} className="p-1.5">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          )}
                          <tbody className="divide-y divide-slate-100">
                            {layer.tableData.map((row, rIdx) => (
                              <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-1.5 text-slate-600">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* IMAGE / GRAPHIC */}
                    {layer.type === 'image' && layer.imageUrl && (
                      <img
                        src={layer.imageUrl}
                        alt={layer.name}
                        className="w-full h-full object-contain pointer-events-none"
                      />
                    )}

                    {/* Quick Selection Tag */}
                    {isSelected && (
                      <div className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[9px] font-bold shadow-xs flex items-center gap-1 pointer-events-none z-40 no-print">
                        <span>{layer.name}</span>
                      </div>
                    )}

                    {/* 8-Point Direct Resize Handles on Canvas */}
                    {isSelected && !layer.locked && (
                      <div className="no-print">
                        {/* Corners */}
                        <div
                          onMouseDown={(e) => handleResizeMouseDown(e, layer, 'nw')}
                          className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-emerald-600 rounded-xs cursor-nwse-resize z-50 shadow-xs"
                          title="Resize NW"
                        />
                        <div
                          onMouseDown={(e) => handleResizeMouseDown(e, layer, 'ne')}
                          className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-emerald-600 rounded-xs cursor-nesw-resize z-50 shadow-xs"
                          title="Resize NE"
                        />
                        <div
                          onMouseDown={(e) => handleResizeMouseDown(e, layer, 'se')}
                          className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-emerald-600 rounded-xs cursor-nwse-resize z-50 shadow-xs"
                          title="Resize SE"
                        />
                        <div
                          onMouseDown={(e) => handleResizeMouseDown(e, layer, 'sw')}
                          className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-emerald-600 rounded-xs cursor-nesw-resize z-50 shadow-xs"
                          title="Resize SW"
                        />
                        {/* Edges */}
                        <div
                          onMouseDown={(e) => handleResizeMouseDown(e, layer, 'n')}
                          className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-emerald-600 rounded-xs cursor-ns-resize z-50 shadow-xs"
                          title="Resize N"
                        />
                        <div
                          onMouseDown={(e) => handleResizeMouseDown(e, layer, 's')}
                          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-2 border-emerald-600 rounded-xs cursor-ns-resize z-50 shadow-xs"
                          title="Resize S"
                        />
                        <div
                          onMouseDown={(e) => handleResizeMouseDown(e, layer, 'w')}
                          className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-emerald-600 rounded-xs cursor-ew-resize z-50 shadow-xs"
                          title="Resize W"
                        />
                        <div
                          onMouseDown={(e) => handleResizeMouseDown(e, layer, 'e')}
                          className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-2 border-emerald-600 rounded-xs cursor-ew-resize z-50 shadow-xs"
                          title="Resize E"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
          </div>

          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-3 no-print">
            <span>💡 <strong>Tuval İpuçları:</strong> Katmanı taşımak için sürükleyin • Kenarlardan boyutlandırın • Çift tıklayarak metni düzenleyin • Yön tuşlarıyla kaydırın • Delete ile silin</span>
          </p>
        </div>

        {/* Right: Layer Inspector Panel */}
        <div className="w-72 bg-white border-l border-slate-200 p-4 overflow-y-auto shrink-0 flex flex-col justify-between no-print">
          {selectedLayer ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-bold text-xs text-slate-900 truncate">
                  {selectedLayer.name}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDuplicateLayer(selectedLayer)}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500"
                    title="Katmanı Çoğalt"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteLayer(selectedLayer.id)}
                    className="p-1 rounded hover:bg-rose-50 text-rose-600"
                    title="Katmanı Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Position & Size */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {t.positionSize} (%)
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-500">X (Sol): {selectedLayer.x}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedLayer.x}
                      onChange={(e) =>
                        handleUpdateLayer(selectedLayer.id, { x: Number(e.target.value) }, true)
                      }
                      className="w-full accent-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Y (Üst): {selectedLayer.y}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={selectedLayer.y}
                      onChange={(e) =>
                        handleUpdateLayer(selectedLayer.id, { y: Number(e.target.value) }, true)
                      }
                      className="w-full accent-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Genişlik: {selectedLayer.w}%</label>
                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={selectedLayer.w}
                      onChange={(e) =>
                        handleUpdateLayer(selectedLayer.id, { w: Number(e.target.value) }, true)
                      }
                      className="w-full accent-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500">Yükseklik: {selectedLayer.h}%</label>
                    <input
                      type="range"
                      min="4"
                      max="100"
                      value={selectedLayer.h}
                      onChange={(e) =>
                        handleUpdateLayer(selectedLayer.id, { h: Number(e.target.value) }, true)
                      }
                      className="w-full accent-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Text Typography Properties */}
              {selectedLayer.type === 'text' && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t.typography}
                  </span>
                  <div>
                    <label className="text-[10px] text-slate-500">Metin İçeriği</label>
                    <textarea
                      rows={3}
                      value={selectedLayer.text || ''}
                      onChange={(e) =>
                        handleUpdateLayer(selectedLayer.id, { text: e.target.value }, true)
                      }
                      className="w-full mt-1 p-2 text-xs border border-slate-200 rounded-lg focus:outline-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-500">Yazı Boyutu: {selectedLayer.fontSize}pt</label>
                      <input
                        type="range"
                        min="8"
                        max="36"
                        value={selectedLayer.fontSize || 14}
                        onChange={(e) =>
                          handleUpdateLayer(selectedLayer.id, { fontSize: Number(e.target.value) }, true)
                        }
                        className="w-full accent-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Yazı Rengi</label>
                      <input
                        type="color"
                        value={selectedLayer.fontColor || '#0F172A'}
                        onChange={(e) =>
                          handleUpdateLayer(selectedLayer.id, { fontColor: e.target.value }, true)
                        }
                        className="w-full h-7 rounded border border-slate-200 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Card / Shape Styling Properties */}
              {(selectedLayer.type === 'card' || selectedLayer.type === 'badge') && (
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t.colorsStyling}
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-500">Arka Plan Rengi</label>
                      <input
                        type="color"
                        value={selectedLayer.bgColor || '#FFFFFF'}
                        onChange={(e) =>
                          handleUpdateLayer(selectedLayer.id, { bgColor: e.target.value }, true)
                        }
                        className="w-full h-7 rounded border border-slate-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500">Kenarlık Rengi</label>
                      <input
                        type="color"
                        value={selectedLayer.borderColor || '#E2E8F0'}
                        onChange={(e) =>
                          handleUpdateLayer(selectedLayer.id, { borderColor: e.target.value }, true)
                        }
                        className="w-full h-7 rounded border border-slate-200 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Layer Stacking Order */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Katman Sıralaması
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleUpdateLayer(selectedLayer.id, { zIndex: selectedLayer.zIndex + 1 }, true)
                    }
                    className="flex-1 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
                  >
                    {t.bringForward}
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateLayer(
                        selectedLayer.id,
                        { zIndex: Math.max(1, selectedLayer.zIndex - 1) },
                        true
                      )
                    }
                    className="flex-1 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700"
                  >
                    {t.sendBackward}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400 space-y-2">
              <Sliders className="w-8 h-8 text-slate-300 stroke-1" />
              <p className="text-xs font-semibold text-slate-600">{t.layerInspector}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {t.selectLayerHint}
              </p>
            </div>
          )}

          {/* Bottom Active Slide Background Color */}
          <div className="pt-4 border-t border-slate-200">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Slayt Arka Planı
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activeSlide?.backgroundColor || '#F8FAFC'}
                onChange={(e) =>
                  handleUpdateSlide({ ...activeSlide, backgroundColor: e.target.value }, true)
                }
                className="w-8 h-8 rounded border border-slate-200 cursor-pointer"
              />
              <span className="text-xs text-slate-600 font-mono">
                {activeSlide?.backgroundColor || '#F8FAFC'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
