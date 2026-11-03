import React from 'react'
import {
  PresentationProject,
  THEMES,
  SlideImage,
} from '../types/presentation'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileText,
} from 'lucide-react'

interface SlidePreviewCanvasProps {
  project: PresentationProject
  currentIndex: number
  onIndexChange: (index: number) => void
  onOpenPresenter: () => void
  onEditImage?: (image: SlideImage) => void
}

export const SlidePreviewCanvas: React.FC<SlidePreviewCanvasProps> = ({
  project,
  currentIndex,
  onIndexChange,
  onOpenPresenter,
  onEditImage,
}) => {
  const theme = THEMES[project.theme] || THEMES['modern-dark']
  const is16x9 = project.aspectRatio === '16:9'

  // Calculate slide list including optional title & closing slides
  const slides: {
    type: 'title' | 'image' | 'closing'
    imageIndex?: number
    image?: SlideImage
  }[] = []

  if (project.includeTitleSlide) {
    slides.push({ type: 'title' })
  }

  project.images.forEach((img, idx) => {
    slides.push({ type: 'image', imageIndex: idx, image: img })
  })

  if (project.includeClosingSlide) {
    slides.push({ type: 'closing' })
  }

  const safeIndex = Math.max(0, Math.min(currentIndex, slides.length - 1))
  const currentSlide = slides[safeIndex] || slides[0]

  const handlePrev = () => {
    if (safeIndex > 0) onIndexChange(safeIndex - 1)
  }

  const handleNext = () => {
    if (safeIndex < slides.length - 1) onIndexChange(safeIndex + 1)
  }

  if (slides.length === 0) {
    return (
      <div className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-8 text-center text-slate-500">
        <p className="font-medium text-slate-700">No slides to display</p>
        <p className="text-sm mt-1">Upload images above to build your PowerPoint deck.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Slide Canvas Wrapper */}
      <div className="relative group w-full flex justify-center bg-slate-950/20 p-2 sm:p-4 rounded-2xl border border-slate-200/80 shadow-inner">
        <div
          className={`relative w-full max-w-4xl overflow-hidden rounded-xl shadow-2xl transition-all duration-300 ${
            is16x9 ? 'aspect-video' : 'aspect-[4/3]'
          }`}
          style={{ backgroundColor: `#${theme.bgHex}` }}
        >
          {/* TITLE SLIDE */}
          {currentSlide.type === 'title' && (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 sm:p-12 text-center relative select-none">
              {/* Top Accent Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-2"
                style={{ backgroundColor: `#${theme.accentHex}` }}
              />

              <span
                className="text-xs font-semibold uppercase tracking-widest mb-3 opacity-75"
                style={{ color: `#${theme.accentHex}` }}
              >
                Presentation Deck
              </span>

              <h1
                className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl leading-tight"
                style={{ color: `#${theme.textHex}` }}
              >
                {project.title}
              </h1>

              <p
                className="mt-4 text-sm sm:text-lg max-w-xl font-normal leading-relaxed opacity-85"
                style={{ color: `#${theme.mutedHex}` }}
              >
                {project.titleSlideSubtitle || project.description || 'Image Collection Presentation'}
              </p>

              <div
                className="mt-8 text-xs font-medium tracking-wide flex items-center gap-3 opacity-60"
                style={{ color: `#${theme.mutedHex}` }}
              >
                <span>{project.images.length} Visual Slides</span>
                <span>•</span>
                <span>16:9 Widescreen</span>
              </div>
            </div>
          )}

          {/* CLOSING SLIDE */}
          {currentSlide.type === 'closing' && (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 sm:p-12 text-center relative select-none">
              <div
                className="absolute bottom-0 left-0 right-0 h-2"
                style={{ backgroundColor: `#${theme.accentHex}` }}
              />

              <h2
                className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
                style={{ color: `#${theme.textHex}` }}
              >
                {project.closingSlideText || 'Thank You!'}
              </h2>

              <p
                className="mt-4 text-base sm:text-lg font-medium opacity-80"
                style={{ color: `#${theme.mutedHex}` }}
              >
                {project.title}
              </p>
            </div>
          )}

          {/* IMAGE SLIDE */}
          {currentSlide.type === 'image' && currentSlide.image && (
            <div className="w-full h-full flex flex-col relative select-none overflow-hidden">
              {/* Header Bar */}
              {project.showTitleHeader && (
                <div
                  className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between border-b border-black/10 shrink-0 z-10"
                  style={{ backgroundColor: `#${theme.headerHex}` }}
                >
                  <span
                    className="text-xs sm:text-sm font-semibold truncate max-w-[70%]"
                    style={{ color: `#${theme.textHex}` }}
                  >
                    {project.title}
                  </span>

                  {project.showSlideNumbers && (
                    <span
                      className="text-xs font-mono font-medium"
                      style={{ color: `#${theme.mutedHex}` }}
                    >
                      {(currentSlide.imageIndex ?? 0) + 1} / {project.images.length}
                    </span>
                  )}
                </div>
              )}

              {/* Main Content Area */}
              <div className="flex-1 w-full relative flex items-center justify-center p-3 sm:p-6 overflow-hidden">
                {/* LAYOUT: SPLIT */}
                {project.layout === 'split' ? (
                  <div className="w-full h-full grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-7 h-full flex items-center justify-center">
                      <img
                        src={currentSlide.image.dataUrl}
                        alt={currentSlide.image.name}
                        className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                      />
                    </div>
                    <div className="col-span-5 h-full flex flex-col justify-center pr-4">
                      <h3
                        className="text-base sm:text-lg font-bold leading-snug line-clamp-2"
                        style={{ color: `#${theme.textHex}` }}
                      >
                        {currentSlide.image.name.replace(/\.[^/.]+$/, '').replace(/[_|-]/g, ' ')}
                      </h3>

                      {currentSlide.image.caption && (
                        <p
                          className="mt-2 text-xs sm:text-sm leading-relaxed opacity-90"
                          style={{ color: `#${theme.mutedHex}` }}
                        >
                          {currentSlide.image.caption}
                        </p>
                      )}

                      {currentSlide.image.notes && (
                        <div
                          className="mt-3 p-3 rounded-lg border text-xs"
                          style={{
                            backgroundColor: `#${theme.headerHex}`,
                            borderColor: `#${theme.accentHex}40`,
                            color: `#${theme.textHex}`,
                          }}
                        >
                          <div
                            className="font-semibold text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1.5"
                            style={{ color: `#${theme.accentHex}` }}
                          >
                            <FileText className="w-3 h-3" />
                            Key Talking Points
                          </div>
                          <p className="line-clamp-3 leading-relaxed">{currentSlide.image.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : project.layout === 'cover' ? (
                  /* LAYOUT: COVER */
                  <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                    <img
                      src={currentSlide.image.dataUrl}
                      alt={currentSlide.image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : project.layout === 'framed' ? (
                  /* LAYOUT: FRAMED */
                  <div
                    className="w-full h-full rounded-xl p-3 sm:p-5 flex items-center justify-center border shadow-xl"
                    style={{
                      backgroundColor: `#${theme.headerHex}`,
                      borderColor: `#${theme.accentHex}60`,
                    }}
                  >
                    <img
                      src={currentSlide.image.dataUrl}
                      alt={currentSlide.image.name}
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  /* LAYOUT: CONTAIN */
                  <div className="w-full h-full flex items-center justify-center">
                    <img
                      src={currentSlide.image.dataUrl}
                      alt={currentSlide.image.name}
                      className="max-h-full max-w-full object-contain drop-shadow-md rounded-md"
                    />
                  </div>
                )}
              </div>

              {/* Bottom Caption Bar */}
              {project.layout !== 'split' && project.showCaptions && currentSlide.image.caption && (
                <div className="w-full px-6 py-2 text-center text-xs font-medium truncate opacity-85 shrink-0 z-10"
                     style={{ color: `#${theme.mutedHex}` }}>
                  {currentSlide.image.caption}
                </div>
              )}
            </div>
          )}

          {/* Interactive Navigation Overlay Controls */}
          <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
            <button
              onClick={handlePrev}
              disabled={safeIndex === 0}
              aria-label="Previous slide"
              className="pointer-events-auto p-2 rounded-full bg-black/40 hover:bg-black/70 text-white disabled:opacity-0 disabled:pointer-events-none transition-all shadow-md backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <button
              onClick={handleNext}
              disabled={safeIndex === slides.length - 1}
              aria-label="Next slide"
              className="pointer-events-auto p-2 rounded-full bg-black/40 hover:bg-black/70 text-white disabled:opacity-0 disabled:pointer-events-none transition-all shadow-md backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Fullscreen Present Button */}
          <button
            onClick={onOpenPresenter}
            aria-label="Present full screen"
            className="absolute top-3 right-3 p-2 rounded-lg bg-black/40 hover:bg-black/80 text-white opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-md"
            title="Present full screen (F)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filmstrip Slides Thumbnail Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin">
        {slides.map((s, idx) => {
          const isActive = idx === safeIndex
          return (
            <button
              key={idx}
              onClick={() => onIndexChange(idx)}
              className={`relative shrink-0 w-24 h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer text-left ${
                isActive
                  ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-105 shadow-md'
                  : 'border-slate-200 hover:border-slate-400 opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: `#${theme.bgHex}` }}
            >
              {s.type === 'title' ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-1 text-[9px] font-bold text-center leading-tight truncate px-1"
                     style={{ color: `#${theme.textHex}` }}>
                  <span className="text-[7px] uppercase tracking-wider text-indigo-400">Title</span>
                  <span className="truncate w-full">{project.title}</span>
                </div>
              ) : s.type === 'closing' ? (
                <div className="w-full h-full flex items-center justify-center p-1 text-[9px] font-bold text-center"
                     style={{ color: `#${theme.textHex}` }}>
                  Thank You
                </div>
              ) : (
                <img
                  src={s.image?.dataUrl}
                  alt={s.image?.name}
                  className="w-full h-full object-cover"
                />
              )}

              <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-mono px-1 py-0.2 rounded">
                {idx + 1}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
