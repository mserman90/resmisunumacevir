import React from 'react'
import {
  PresentationProject,
  THEMES,
  ThemeId,
  LayoutMode,
  AspectRatio,
} from '../types/presentation'
import {
  X,
  Palette,
  LayoutTemplate,
  Monitor,
  Check,
  Type,
} from 'lucide-react'

interface DeckSettingsModalProps {
  project: PresentationProject
  isOpen: boolean
  onClose: () => void
  onUpdate: (updated: Partial<PresentationProject>) => void
}

export const DeckSettingsModal: React.FC<DeckSettingsModalProps> = ({
  project,
  isOpen,
  onClose,
  onUpdate,
}) => {
  if (!isOpen) return null

  const layoutOptions: { id: LayoutMode; label: string; desc: string }[] = [
    {
      id: 'contain',
      label: 'Contained & Centered',
      desc: 'Balanced margins, ideal for screenshots and product visuals',
    },
    {
      id: 'cover',
      label: 'Full Bleed (Edge-to-Edge)',
      desc: 'Images fill the entire slide canvas for high visual impact',
    },
    {
      id: 'split',
      label: 'Split (Image + Notes)',
      desc: '60% visual on left, title & key speaker notes on right',
    },
    {
      id: 'framed',
      label: 'Framed Presentation Card',
      desc: 'Elevated framed container with theme accent borders',
    },
  ]

  const aspectOptions: { id: AspectRatio; label: string; desc: string }[] = [
    { id: '16:9', label: '16:9 Widescreen', desc: 'Standard for modern TVs, laptops & monitors' },
    { id: '4:3', label: '4:3 Classic', desc: 'Traditional projector & printable deck format' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Deck Customization</h2>
              <p className="text-xs text-slate-500">Configure theme, slide layouts & typography</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* THEMES */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-500" />
              Color Palette & Theme
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(THEMES) as ThemeId[]).map((themeKey) => {
                const t = THEMES[themeKey]
                const isSelected = project.theme === themeKey
                return (
                  <button
                    key={themeKey}
                    onClick={() => onUpdate({ theme: themeKey })}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-7 h-7 rounded-lg border shadow-xs flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `#${t.bgHex}`, borderColor: `#${t.accentHex}` }}
                      >
                        <span className="text-[10px] font-bold" style={{ color: `#${t.textHex}` }}>
                          Aa
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{t.name}</p>
                        <p className="text-[10px] text-slate-500">#{t.bgHex}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* LAYOUT MODES */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block flex items-center gap-1.5">
              <LayoutTemplate className="w-3.5 h-3.5 text-indigo-500" />
              Slide Layout Structure
            </label>
            <div className="space-y-2">
              {layoutOptions.map((opt) => {
                const isSelected = project.layout === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => onUpdate({ layout: opt.id })}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{opt.label}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* ASPECT RATIO */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block flex items-center gap-1.5">
              <Monitor className="w-3.5 h-3.5 text-indigo-500" />
              Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-3">
              {aspectOptions.map((opt) => {
                const isSelected = project.aspectRatio === opt.id
                return (
                  <button
                    key={opt.id}
                    onClick={() => onUpdate({ aspectRatio: opt.id })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <p className="text-xs font-bold text-slate-800">{opt.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* SLIDE DECORATIONS & CONTROLS */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-indigo-500" />
              Header, Badges & Captions
            </label>

            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-slate-800 block">Top Header Bar</span>
                  <span className="text-[10px] text-slate-500">Shows project title across all slides</span>
                </div>
                <input
                  type="checkbox"
                  checked={project.showTitleHeader}
                  onChange={(e) => onUpdate({ showTitleHeader: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-slate-800 block">Slide Number Counters</span>
                  <span className="text-[10px] text-slate-500">Displays "1 / 10" in the header</span>
                </div>
                <input
                  type="checkbox"
                  checked={project.showSlideNumbers}
                  onChange={(e) => onUpdate({ showSlideNumbers: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-slate-800 block">Slide Captions</span>
                  <span className="text-[10px] text-slate-500">Shows captions below images or in split pane</span>
                </div>
                <input
                  type="checkbox"
                  checked={project.showCaptions}
                  onChange={(e) => onUpdate({ showCaptions: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* TITLE & CLOSING SLIDES */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Intro & Outro Slides
            </label>

            {/* Title Slide Toggle */}
            <div className="p-3 rounded-xl border border-slate-200 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-800">Include Title / Cover Slide</span>
                <input
                  type="checkbox"
                  checked={project.includeTitleSlide}
                  onChange={(e) => onUpdate({ includeTitleSlide: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>
              {project.includeTitleSlide && (
                <input
                  type="text"
                  placeholder="Cover slide subtitle / author"
                  value={project.titleSlideSubtitle || ''}
                  onChange={(e) => onUpdate({ titleSlideSubtitle: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 mt-1"
                />
              )}
            </div>

            {/* Closing Slide Toggle */}
            <div className="p-3 rounded-xl border border-slate-200 space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs font-bold text-slate-800">Include Closing / Thank You Slide</span>
                <input
                  type="checkbox"
                  checked={project.includeClosingSlide}
                  onChange={(e) => onUpdate({ includeClosingSlide: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                />
              </label>
              {project.includeClosingSlide && (
                <input
                  type="text"
                  placeholder="e.g. Thank You! • Q&A"
                  value={project.closingSlideText || ''}
                  onChange={(e) => onUpdate({ closingSlideText: e.target.value })}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 mt-1"
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
