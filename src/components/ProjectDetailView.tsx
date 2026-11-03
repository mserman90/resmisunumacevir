import React, { useState, useRef } from 'react'
import {
  PresentationProject,
  SlideImage,
  THEMES,
} from '../types/presentation'
import {
  ArrowLeft,
  Upload,
  Download,
  Play,
  SlidersHorizontal,
  Plus,
  Trash2,
  RotateCw,
  Edit3,
  MoveLeft,
  MoveRight,
  Loader2,
  FileText,
  Palette,
  Sparkles,
} from 'lucide-react'
import { SlidePreviewCanvas } from './SlidePreviewCanvas'
import { DeckSettingsModal } from './DeckSettingsModal'
import { SlidePresenterModal } from './SlidePresenterModal'
import { ImageDetailModal } from './ImageDetailModal'
import { processImageFile, rotateImageDataUrl } from '../utils/imageUtils'
import { exportToPowerPoint, GenerationProgress } from '../utils/pptxGenerator'
import confetti from 'canvas-confetti'

interface ProjectDetailViewProps {
  project: PresentationProject
  onBack: () => void
  onUpdateProject: (updated: PresentationProject) => void
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export const ProjectDetailView: React.FC<ProjectDetailViewProps> = ({
  project,
  onBack,
  onUpdateProject,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'organize'>('preview')
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState<GenerationProgress | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isPresenterOpen, setIsPresenterOpen] = useState(false)
  const [editingImage, setEditingImage] = useState<SlideImage | null>(null)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState(project.title)
  const [descInput, setDescInput] = useState(project.description || '')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const theme = THEMES[project.theme] || THEMES['modern-dark']

  // Handle uploading files
  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files).filter(
      (f) => f.type.startsWith('image/') || f.name.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i)
    )

    if (list.length === 0) {
      onToast('Please drop valid image files (PNG, JPG, WebP, SVG)', 'error')
      return
    }

    setIsUploading(true)
    onToast(`Processing ${list.length} image${list.length > 1 ? 's' : ''}...`, 'info')

    try {
      const newImages: SlideImage[] = []
      for (const file of list) {
        const processed = await processImageFile(file)
        newImages.push({
          id: 'img-' + Math.random().toString(36).substring(2, 9),
          name: processed.name,
          dataUrl: processed.dataUrl,
          width: processed.width,
          height: processed.height,
          aspectRatio: processed.aspectRatio,
          rotation: 0,
          createdAt: Date.now(),
        })
      }

      const updatedImages = [...project.images, ...newImages]
      onUpdateProject({
        ...project,
        images: updatedImages,
      })

      onToast(`Added ${newImages.length} slide${newImages.length > 1 ? 's' : ''}!`, 'success')
      // Jump to newly added image in preview
      if (project.images.length === 0) {
        setCurrentSlideIndex(project.includeTitleSlide ? 1 : 0)
      }
    } catch (err: any) {
      console.error(err)
      onToast('Failed to upload some images', 'error')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle image reorder
  const moveImage = (index: number, direction: 'left' | 'right') => {
    const target = direction === 'left' ? index - 1 : index + 1
    if (target < 0 || target >= project.images.length) return

    const reordered = [...project.images]
    const temp = reordered[index]
    reordered[index] = reordered[target]
    reordered[target] = temp

    onUpdateProject({ ...project, images: reordered })
  }

  // Handle single image rotate
  const handleRotateSingle = async (imgId: string) => {
    const target = project.images.find((i) => i.id === imgId)
    if (!target) return

    try {
      const rotated = await rotateImageDataUrl(target.dataUrl, 90)
      const updatedImages = project.images.map((i) =>
        i.id === imgId
          ? {
              ...i,
              dataUrl: rotated.dataUrl,
              width: rotated.width,
              height: rotated.height,
              aspectRatio: rotated.aspectRatio,
            }
          : i
      )
      onUpdateProject({ ...project, images: updatedImages })
      onToast('Image rotated 90°', 'success')
    } catch (e) {
      console.error(e)
    }
  }

  // Handle delete image
  const handleDeleteImage = (imgId: string) => {
    const updatedImages = project.images.filter((i) => i.id !== imgId)
    onUpdateProject({ ...project, images: updatedImages })
    onToast('Slide removed', 'info')
  }

  // Handle PPTX export
  const handleExport = async () => {
    if (project.images.length === 0) {
      onToast('Add at least one image to export PowerPoint presentation', 'error')
      return
    }

    setIsExporting(true)
    try {
      await exportToPowerPoint(project, (prog) => {
        setExportProgress(prog)
      })

      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.7 },
      })
      onToast('PowerPoint presentation (.pptx) downloaded successfully!', 'success')
    } catch (err: any) {
      console.error('Export failed:', err)
      onToast(err.message || 'Failed to generate presentation', 'error')
    } finally {
      setIsExporting(false)
      setExportProgress(null)
    }
  }

  // Save title edit
  const handleSaveTitle = () => {
    if (!titleInput.trim()) return
    onUpdateProject({
      ...project,
      title: titleInput.trim(),
      description: descInput.trim() || undefined,
    })
    setIsEditingTitle(false)
    onToast('Project title updated', 'success')
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="space-y-1.5 flex-1 min-w-0">
          <button
            onClick={onBack}
            className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-1 gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to All Projects
          </button>

          {isEditingTitle ? (
            <div className="space-y-2 max-w-lg mt-2">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full text-lg font-bold px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <textarea
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
                placeholder="Description or subtitle..."
                rows={2}
                className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveTitle}
                  className="px-3 py-1 rounded-md bg-indigo-600 text-white text-xs font-semibold"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingTitle(false)}
                  className="px-3 py-1 rounded-md text-slate-600 text-xs font-medium hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                  {project.title}
                </h1>
                <button
                  onClick={() => setIsEditingTitle(true)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Rename presentation"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>

              {project.description && (
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5 line-clamp-1">
                  {project.description}
                </p>
              )}

              {/* Theme & Layout Info Tags (Zero-Pill clean typography) */}
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-2 font-medium">
                <span className="text-indigo-600 font-semibold">{theme.name}</span>
                <span>·</span>
                <span className="capitalize">{project.layout} layout</span>
                <span>·</span>
                <span>{project.aspectRatio}</span>
                <span>·</span>
                <span>{project.images.length} visual slide{project.images.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5 shrink-0">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-slate-500" />
            Deck Settings
          </button>

          <button
            onClick={() => setIsPresenterOpen(true)}
            disabled={project.images.length === 0}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Play className="w-4 h-4 text-indigo-600" />
            Present Fullscreen
          </button>

          <button
            onClick={handleExport}
            disabled={isExporting || project.images.length === 0}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Export to PPTX</span>
          </button>
        </div>
      </div>

      {/* Export progress banner if active */}
      {isExporting && exportProgress && (
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
            <div>
              <p className="text-xs font-bold text-indigo-900">{exportProgress.message}</p>
              <p className="text-[11px] text-indigo-600">
                Generating PowerPoint presentation slides and formatting...
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-700">
            {exportProgress.currentSlide} / {exportProgress.totalSlides}
          </span>
        </div>
      )}

      {/* Main Workspace: Segmented Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-xl">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Interactive Slide Deck Preview
          </button>
          <button
            onClick={() => setActiveTab('organize')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'organize'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Organize & Manage Slides ({project.images.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            Add Images
          </button>
        </div>
      </div>

      {/* TAB 1: INTERACTIVE SLIDE DECK PREVIEW */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          <SlidePreviewCanvas
            project={project}
            currentIndex={currentSlideIndex}
            onIndexChange={setCurrentSlideIndex}
            onOpenPresenter={() => setIsPresenterOpen(true)}
            onEditImage={(img) => setEditingImage(img)}
          />

          {/* Quick theme shortcut buttons underneath */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200/80 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-500" />
              <span className="font-semibold text-slate-700">Quick Themes:</span>
              <div className="flex items-center gap-1.5">
                {(['modern-dark', 'studio-white', 'midnight-navy', 'warm-editorial'] as const).map(
                  (tKey) => {
                    const t = THEMES[tKey]
                    const isActive = project.theme === tKey
                    return (
                      <button
                        key={tKey}
                        onClick={() => onUpdateProject({ ...project, theme: tKey })}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                          isActive
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                            : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                        }`}
                      >
                        {t.name}
                      </button>
                    )
                  }
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700">Layout:</span>
              <div className="flex items-center gap-1">
                {(['contain', 'cover', 'split', 'framed'] as const).map((lKey) => {
                  const isActive = project.layout === lKey
                  return (
                    <button
                      key={lKey}
                      onClick={() => onUpdateProject({ ...project, layout: lKey })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium border capitalize transition-colors ${
                        isActive
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {lKey}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORGANIZE & MANAGE SLIDES (GRID OF CARDS) */}
      {activeTab === 'organize' && (
        <div className="space-y-6">
          {/* Dropzone Area */}
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragOver(true)
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault()
              setIsDragOver(false)
              if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files)
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01]'
                : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                {isUploading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <p className="font-bold text-sm text-slate-800">
                {isUploading ? 'Uploading & Optimizing Slides...' : 'Drop image files here or click to browse'}
              </p>
              <p className="text-xs text-slate-400">
                Supports PNG, JPG, WebP, SVG, GIF (no size limits, high-definition 1080p slide generation)
              </p>
            </div>
          </div>

          {/* Image Slide Cards Grid */}
          {project.images.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No slides yet</h3>
              <p className="text-xs text-slate-400 mt-1">Upload images to populate your presentation.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {project.images.map((img, idx) => (
                <div
                  key={img.id}
                  className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
                >
                  {/* Thumbnail */}
                  <div
                    className="relative aspect-video flex items-center justify-center p-2 cursor-pointer"
                    style={{ backgroundColor: `#${theme.bgHex}` }}
                    onClick={() => setEditingImage(img)}
                  >
                    <img
                      src={img.dataUrl}
                      alt={img.name}
                      className="max-h-full max-w-full object-contain rounded-md"
                    />

                    {/* Slide index badge */}
                    <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {idx + 1}
                    </div>
                  </div>

                  {/* Body & Controls */}
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 truncate" title={img.name}>
                        {img.name}
                      </p>
                      {img.caption ? (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          {img.caption}
                        </p>
                      ) : (
                        <p className="text-[11px] text-slate-400 italic mt-1">
                          No caption
                        </p>
                      )}
                    </div>

                    {/* Actions Toolbar */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      {/* Move left / right */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveImage(idx, 'left')}
                          disabled={idx === 0}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20"
                          title="Move earlier"
                        >
                          <MoveLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveImage(idx, 'right')}
                          disabled={idx === project.images.length - 1}
                          className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-20"
                          title="Move later"
                        >
                          <MoveRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Rotate, Edit, Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleRotateSingle(img.id)}
                          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Rotate 90°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingImage(img)}
                          className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Edit details & speaker notes"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <DeckSettingsModal
        project={project}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onUpdate={(updated) => onUpdateProject({ ...project, ...updated })}
      />

      {isPresenterOpen && (
        <SlidePresenterModal
          project={project}
          initialIndex={currentSlideIndex}
          onClose={() => setIsPresenterOpen(false)}
        />
      )}

      {editingImage && (
        <ImageDetailModal
          image={editingImage}
          isOpen={true}
          onClose={() => setEditingImage(null)}
          onSave={(updatedImg) => {
            const updatedImages = project.images.map((i) =>
              i.id === updatedImg.id ? updatedImg : i
            )
            onUpdateProject({ ...project, images: updatedImages })
            onToast('Slide details saved', 'success')
          }}
          onDelete={(id) => {
            handleDeleteImage(id)
            setEditingImage(null)
          }}
        />
      )}
    </div>
  )
}
