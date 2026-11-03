import React, { useState } from 'react'
import {
  PresentationProject,
  THEMES,
  ThemeId,
  LayoutMode,
} from '../types/presentation'
import {
  X,
  Presentation,
  Check,
} from 'lucide-react'

interface NewProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (project: PresentationProject) => void
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  if (!isOpen) return null

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [theme, setTheme] = useState<ThemeId>('modern-dark')
  const [layout, setLayout] = useState<LayoutMode>('contain')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newProject: PresentationProject = {
      id: 'proj-' + Math.random().toString(36).substring(2, 9),
      title: title.trim(),
      description: description.trim() || undefined,
      theme,
      layout,
      aspectRatio: '16:9',
      showTitleHeader: true,
      showSlideNumbers: true,
      showCaptions: true,
      includeTitleSlide: true,
      titleSlideSubtitle: description.trim() || undefined,
      includeClosingSlide: true,
      closingSlideText: 'Thank You! • Q&A',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: [],
    }

    onCreate(newProject)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Create New Deck</h2>
              <p className="text-xs text-slate-500">Set deck name and initial visual theme</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 block">
              Presentation Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Annual Executive Review 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 block">
              Description / Subtitle
            </label>
            <textarea
              rows={2}
              placeholder="Optional overview or subtitle for the title slide..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
            />
          </div>

          {/* Theme Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 block">
              Initial Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(THEMES) as ThemeId[]).slice(0, 4).map((tId) => {
                const t = THEMES[tId]
                const isSelected = theme === tId
                return (
                  <button
                    key={tId}
                    type="button"
                    onClick={() => setTheme(tId)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-md border shrink-0"
                      style={{ backgroundColor: `#${t.bgHex}`, borderColor: `#${t.accentHex}` }}
                    />
                    <span className="text-xs font-semibold text-slate-800 truncate">{t.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 ml-auto shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Create & Upload Images
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
