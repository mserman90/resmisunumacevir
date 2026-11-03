import React, { useState } from 'react'
import { PresentationProject, THEMES } from '../types/presentation'
import {
  Download,
  FolderOpen,
  Trash2,
  Copy,
  ImageIcon,
  Loader2,
} from 'lucide-react'
import { exportToPowerPoint } from '../utils/pptxGenerator'
import confetti from 'canvas-confetti'

interface ProjectCardProps {
  project: PresentationProject
  onOpen: () => void
  onDelete: () => void
  onDuplicate: () => void
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpen,
  onDelete,
  onDuplicate,
  onToast,
}) => {
  const [isExporting, setIsExporting] = useState(false)
  const theme = THEMES[project.theme] || THEMES['modern-dark']

  const handleDownloadPptx = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (project.images.length === 0) {
      onToast('Upload at least one image before exporting', 'error')
      return
    }

    setIsExporting(true)
    try {
      await exportToPowerPoint(project)
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      })
      onToast(`Downloaded "${project.title}.pptx"!`, 'success')
    } catch (err: any) {
      console.error(err)
      onToast(err.message || 'Failed to export presentation', 'error')
    } finally {
      setIsExporting(false)
    }
  }

  const updatedDateStr = new Date(project.updatedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      onClick={onOpen}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-200 overflow-hidden cursor-pointer"
    >
      {/* Thumbnail Header Area */}
      <div
        className="h-44 w-full relative overflow-hidden flex items-center justify-center transition-colors"
        style={{ backgroundColor: `#${theme.bgHex}` }}
      >
        {project.images.length > 0 ? (
          <div className="w-full h-full p-2.5 flex items-center justify-center">
            {project.images.length === 1 ? (
              <img
                src={project.images[0].dataUrl}
                alt={project.images[0].name}
                className="max-h-full max-w-full object-contain rounded-lg shadow-sm group-hover:scale-102 transition-transform duration-300"
              />
            ) : project.images.length === 2 ? (
              <div className="grid grid-cols-2 gap-2 w-full h-full">
                {project.images.slice(0, 2).map((img) => (
                  <div key={img.id} className="relative rounded-lg overflow-hidden bg-black/10">
                    <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1.5 w-full h-full">
                {project.images.slice(0, 4).map((img) => (
                  <div key={img.id} className="relative rounded-md overflow-hidden bg-black/10">
                    <img src={img.dataUrl} alt={img.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5">
            <ImageIcon className="w-8 h-8 opacity-40" />
            <span className="text-xs font-medium">Ready for images</span>
          </div>
        )}

        {/* Floating Top Badges */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <span className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-full shadow-xs">
            {project.images.length} slide{project.images.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="absolute top-2.5 left-2.5">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs border"
            style={{
              backgroundColor: `#${theme.bgHex}`,
              color: `#${theme.textHex}`,
              borderColor: `#${theme.accentHex}40`,
            }}
          >
            {theme.name}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
            {project.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
            {project.description || 'No description provided'}
          </p>
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium">
            Updated {updatedDateStr}
          </span>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={handleDownloadPptx}
              disabled={isExporting || project.images.length === 0}
              className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white disabled:opacity-40 disabled:hover:bg-indigo-50 disabled:hover:text-indigo-600 transition-all shadow-2xs"
              title="Download PowerPoint presentation (.pptx)"
            >
              {isExporting ? (
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onDuplicate}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Duplicate presentation deck"
            >
              <Copy className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (confirm(`Delete "${project.title}"?`)) onDelete()
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete deck"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onOpen}
              className="p-2 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Open Deck Editor"
            >
              <FolderOpen className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
