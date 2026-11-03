import React, { useState, useRef } from 'react'
import { PresentationProject, SlideImage } from '../types/presentation'
import { ProjectCard } from './ProjectCard'
import {
  Plus,
  Search,
  Upload,
  Sparkles,
  RotateCcw,
  Presentation,
  Loader2,
} from 'lucide-react'
import { processImageFile } from '../utils/imageUtils'

interface ProjectListViewProps {
  projects: PresentationProject[]
  onOpenProject: (id: string) => void
  onNewProject: () => void
  onDeleteProject: (id: string) => void
  onDuplicateProject: (id: string) => void
  onResetDemo: () => void
  onCreateProjectWithImages: (title: string, images: SlideImage[]) => void
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export const ProjectListView: React.FC<ProjectListViewProps> = ({
  projects,
  onOpenProject,
  onNewProject,
  onDeleteProject,
  onDuplicateProject,
  onResetDemo,
  onCreateProjectWithImages,
  onToast,
}) => {
  const [search, setSearch] = useState('')
  const [isQuickUploading, setIsQuickUploading] = useState(false)
  const quickInputRef = useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase()))
  )

  const handleQuickUpload = async (files: FileList | File[]) => {
    const list = Array.from(files).filter(
      (f) => f.type.startsWith('image/') || f.name.match(/\.(jpg|jpeg|png|webp|svg|gif)$/i)
    )

    if (list.length === 0) {
      onToast('Please select valid image files', 'error')
      return
    }

    setIsQuickUploading(true)
    onToast(`Creating deck from ${list.length} images...`, 'info')

    try {
      const images: SlideImage[] = []
      for (const file of list) {
        const proc = await processImageFile(file)
        images.push({
          id: 'img-' + Math.random().toString(36).substring(2, 9),
          name: proc.name,
          dataUrl: proc.dataUrl,
          width: proc.width,
          height: proc.height,
          aspectRatio: proc.aspectRatio,
          rotation: 0,
          createdAt: Date.now(),
        })
      }

      const generatedTitle = `New Deck (${new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })})`
      onCreateProjectWithImages(generatedTitle, images)
      onToast(`Deck created with ${images.length} slides!`, 'success')
    } catch (e: any) {
      console.error(e)
      onToast('Failed to create deck from images', 'error')
    } finally {
      setIsQuickUploading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Hero Quick Dropzone Banner */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setIsDragOver(false)
          if (e.dataTransfer.files?.length) handleQuickUpload(e.dataTransfer.files)
        }}
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 transition-all ${
          isDragOver
            ? 'bg-indigo-600/90 ring-4 ring-indigo-300'
            : 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 shadow-xl'
        }`}
      >
        <input
          ref={quickInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleQuickUpload(e.target.files)}
        />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl text-white space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Instant Image to PowerPoint Converter</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Turn any image collection into presentation slides in seconds
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Drop images directly here to generate an editable PowerPoint (.pptx) deck with custom
              layouts, speaker notes, titles, and professional typography.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <button
              onClick={() => quickInputRef.current?.click()}
              disabled={isQuickUploading}
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-900 text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-98"
            >
              {isQuickUploading ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              ) : (
                <Upload className="w-4 h-4 text-indigo-600" />
              )}
              <span>Upload Images & Convert</span>
            </button>

            <button
              onClick={onNewProject}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Empty Deck</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Your Presentations</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your presentations, rearrange slide order, and download PPTX
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search presentations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <button
            onClick={() => {
              if (confirm('Reset to initial sample presentations? (This will restore the 3 demo decks)')) {
                onResetDemo()
              }
            }}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
            title="Restore sample decks"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Presentation className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {search ? 'No decks match your search' : 'No presentations yet'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search
                ? 'Try a different search keyword or clear the search filter.'
                : 'Create your first presentation or upload images above to get started immediately.'}
            </p>
          </div>
          <button
            onClick={onNewProject}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold inline-flex items-center gap-2 hover:bg-indigo-700 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Create Presentation Deck
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <ProjectCard
              key={proj.id}
              project={proj}
              onOpen={() => onOpenProject(proj.id)}
              onDelete={() => onDeleteProject(proj.id)}
              onDuplicate={() => onDuplicateProject(proj.id)}
              onToast={onToast}
            />
          ))}
        </div>
      )}
    </div>
  )
}
