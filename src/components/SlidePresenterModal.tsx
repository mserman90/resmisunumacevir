import React, { useEffect, useState } from 'react'
import { PresentationProject, THEMES, SlideImage } from '../types/presentation'
import {
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  FileText,
} from 'lucide-react'

interface SlidePresenterModalProps {
  project: PresentationProject
  initialIndex: number
  onClose: () => void
}

export const SlidePresenterModal: React.FC<SlidePresenterModalProps> = ({
  project,
  initialIndex,
  onClose,
}) => {
  const theme = THEMES[project.theme] || THEMES['modern-dark']
  const is16x9 = project.aspectRatio === '16:9'

  const slides: {
    type: 'title' | 'image' | 'closing'
    imageIndex?: number
    image?: SlideImage
  }[] = []

  if (project.includeTitleSlide) slides.push({ type: 'title' })
  project.images.forEach((img, idx) => slides.push({ type: 'image', imageIndex: idx, image: img }))
  if (project.includeClosingSlide) slides.push({ type: 'closing' })

  const [currentIndex, setCurrentIndex] = useState(
    Math.max(0, Math.min(initialIndex, slides.length - 1))
  )
  const [seconds, setSeconds] = useState(0)
  const [showNotes, setShowNotes] = useState(false)

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        setCurrentIndex((i) => Math.min(slides.length - 1, i + 1))
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        setCurrentIndex((i) => Math.max(0, i - 1))
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'n' || e.key === 'N') {
        setShowNotes((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [slides.length, onClose])

  const currentSlide = slides[currentIndex] || slides[0]

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none">
      {/* Top Floating Control Bar */}
      <div className="w-full px-6 py-3 flex items-center justify-between text-white/80 bg-gradient-to-b from-black/80 to-transparent z-20">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-sm tracking-wide text-white">
            {project.title}
          </span>
          <span className="text-white/40">•</span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-white/70">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{formatTime(seconds)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentSlide?.image?.notes && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 ${
                showNotes
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white/90'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Notes (N)
            </button>
          )}

          <span className="text-xs font-mono font-medium text-white/80 px-2 py-1 bg-white/10 rounded">
            {currentIndex + 1} / {slides.length}
          </span>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Exit Presenter (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Stage */}
      <div className="flex-1 w-full flex items-center justify-center p-4 sm:p-8 overflow-hidden relative">
        <div
          className={`relative max-w-7xl max-h-[85vh] w-full shadow-2xl rounded-xl overflow-hidden flex flex-col justify-between transition-all ${
            is16x9 ? 'aspect-video' : 'aspect-[4/3]'
          }`}
          style={{ backgroundColor: `#${theme.bgHex}` }}
        >
          {/* TITLE SLIDE */}
          {currentSlide.type === 'title' && (
            <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center relative">
              <div
                className="absolute top-0 left-0 right-0 h-3"
                style={{ backgroundColor: `#${theme.accentHex}` }}
              />
              <span
                className="text-sm font-semibold uppercase tracking-widest mb-4"
                style={{ color: `#${theme.accentHex}` }}
              >
                Presentation Deck
              </span>
              <h1
                className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight"
                style={{ color: `#${theme.textHex}` }}
              >
                {project.title}
              </h1>
              <p
                className="mt-6 text-lg sm:text-2xl max-w-2xl font-normal opacity-80"
                style={{ color: `#${theme.mutedHex}` }}
              >
                {project.titleSlideSubtitle || project.description || 'Image Collection Presentation'}
              </p>
            </div>
          )}

          {/* CLOSING SLIDE */}
          {currentSlide.type === 'closing' && (
            <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center relative">
              <div
                className="absolute bottom-0 left-0 right-0 h-3"
                style={{ backgroundColor: `#${theme.accentHex}` }}
              />
              <h2
                className="text-4xl sm:text-6xl font-black tracking-tight leading-tight"
                style={{ color: `#${theme.textHex}` }}
              >
                {project.closingSlideText || 'Thank You!'}
              </h2>
              <p
                className="mt-6 text-xl font-medium opacity-80"
                style={{ color: `#${theme.mutedHex}` }}
              >
                {project.title}
              </p>
            </div>
          )}

          {/* IMAGE SLIDE */}
          {currentSlide.type === 'image' && currentSlide.image && (
            <div className="w-full h-full flex flex-col relative overflow-hidden">
              {project.showTitleHeader && (
                <div
                  className="w-full px-8 py-4 flex items-center justify-between border-b border-black/10 shrink-0"
                  style={{ backgroundColor: `#${theme.headerHex}` }}
                >
                  <span
                    className="text-base font-bold truncate max-w-[70%]"
                    style={{ color: `#${theme.textHex}` }}
                  >
                    {project.title}
                  </span>
                  {project.showSlideNumbers && (
                    <span
                      className="text-sm font-mono font-medium"
                      style={{ color: `#${theme.mutedHex}` }}
                    >
                      {(currentSlide.imageIndex ?? 0) + 1} / {project.images.length}
                    </span>
                  )}
                </div>
              )}

              <div className="flex-1 w-full flex items-center justify-center p-6 overflow-hidden">
                {project.layout === 'split' ? (
                  <div className="w-full h-full grid grid-cols-12 gap-8 items-center">
                    <div className="col-span-7 h-full flex items-center justify-center">
                      <img
                        src={currentSlide.image.dataUrl}
                        alt={currentSlide.image.name}
                        className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
                      />
                    </div>
                    <div className="col-span-5 h-full flex flex-col justify-center pr-6">
                      <h3
                        className="text-2xl font-extrabold leading-tight"
                        style={{ color: `#${theme.textHex}` }}
                      >
                        {currentSlide.image.name.replace(/\.[^/.]+$/, '').replace(/[_|-]/g, ' ')}
                      </h3>
                      {currentSlide.image.caption && (
                        <p
                          className="mt-3 text-base leading-relaxed opacity-90"
                          style={{ color: `#${theme.mutedHex}` }}
                        >
                          {currentSlide.image.caption}
                        </p>
                      )}
                      {currentSlide.image.notes && (
                        <div
                          className="mt-5 p-4 rounded-xl border text-sm"
                          style={{
                            backgroundColor: `#${theme.headerHex}`,
                            borderColor: `#${theme.accentHex}40`,
                            color: `#${theme.textHex}`,
                          }}
                        >
                          <div
                            className="font-semibold text-xs uppercase tracking-wider mb-1.5"
                            style={{ color: `#${theme.accentHex}` }}
                          >
                            Presenter Insights
                          </div>
                          <p className="leading-relaxed">{currentSlide.image.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : project.layout === 'cover' ? (
                  <img
                    src={currentSlide.image.dataUrl}
                    alt={currentSlide.image.name}
                    className="w-full h-full object-cover"
                  />
                ) : project.layout === 'framed' ? (
                  <div
                    className="w-full h-full rounded-2xl p-6 flex items-center justify-center border-2 shadow-2xl"
                    style={{
                      backgroundColor: `#${theme.headerHex}`,
                      borderColor: `#${theme.accentHex}60`,
                    }}
                  >
                    <img
                      src={currentSlide.image.dataUrl}
                      alt={currentSlide.image.name}
                      className="max-h-full max-w-full object-contain rounded-xl"
                    />
                  </div>
                ) : (
                  <img
                    src={currentSlide.image.dataUrl}
                    alt={currentSlide.image.name}
                    className="max-h-full max-w-full object-contain drop-shadow-xl rounded-lg"
                  />
                )}
              </div>

              {project.layout !== 'split' && project.showCaptions && currentSlide.image.caption && (
                <div
                  className="w-full px-8 py-3 text-center text-sm font-medium opacity-85 shrink-0"
                  style={{ color: `#${theme.mutedHex}` }}
                >
                  {currentSlide.image.caption}
                </div>
              )}
            </div>
          )}

          {/* Notes Overlay Drawer if active */}
          {showNotes && currentSlide?.image?.notes && (
            <div className="absolute bottom-4 right-4 max-w-md p-4 rounded-xl bg-black/90 text-white backdrop-blur-md border border-white/20 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Presenter Notes
                </span>
                <button
                  onClick={() => setShowNotes(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-white/90 leading-relaxed">
                {currentSlide.image.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Navigation Toolbar */}
      <div className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent z-20">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:pointer-events-none text-white text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-md px-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-6 bg-indigo-500'
                  : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentIndex((i) => Math.min(slides.length - 1, i + 1))}
          disabled={currentIndex === slides.length - 1}
          className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-20 disabled:pointer-events-none text-white text-sm font-medium flex items-center gap-2 transition-colors"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
