import React, { useRef, useState } from 'react'
import {
  UploadCloud,
  Check,
  Loader2,
} from 'lucide-react'
import { SAMPLE_SLIDEFUL_DECKS } from '../utils/aiLayerExtractor'
import { useLanguage } from '../i18n/translations'

interface SlidefulHeroProps {
  onUploadFiles: (files: FileList | File[]) => void
  onSelectSample: (sampleId: string) => void
  isProcessing: boolean
}

export const SlidefulHero: React.FC<SlidefulHeroProps> = ({
  onUploadFiles,
  onSelectSample,
  isProcessing,
}) => {
  const { t } = useLanguage()
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files?.length) {
      onUploadFiles(e.dataTransfer.files)
    }
  }

  return (
    <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
      {/* Hero Headline */}
      <div className="space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          {t.heroTitle1}
          <span className="text-emerald-600 block sm:inline">{t.heroTitleHighlight}</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {t.heroDesc}
        </p>
      </div>

      {/* Main Dropzone Box */}
      <div className="mt-8 max-w-2xl mx-auto">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onUploadFiles(e.target.files)}
        />

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 cursor-pointer transition-all duration-200 bg-white shadow-sm ${
            isDragOver
              ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
              : 'border-slate-200 hover:border-emerald-400 hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              {isProcessing ? (
                <Loader2 className="w-7 h-7 animate-spin" />
              ) : (
                <UploadCloud className="w-7 h-7" />
              )}
            </div>

            <div>
              <p className="font-bold text-base text-slate-900">
                {isProcessing
                  ? t.dropzoneAnalyzing
                  : t.dropzoneTitle}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {t.dropzoneSubtitle}
              </p>
            </div>

            <button
              type="button"
              disabled={isProcessing}
              className="mt-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              {t.dropzoneButton}
            </button>

            {/* Try a Sample Previews */}
            <div className="mt-6 pt-5 border-t border-slate-100 w-full" onClick={(e) => e.stopPropagation()}>
              <p className="text-[11px] font-medium text-slate-400 mb-3">
                {t.trySample}
              </p>
              <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto">
                {SAMPLE_SLIDEFUL_DECKS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => onSelectSample(sample.id)}
                    className="group p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/60 hover:border-emerald-300 transition-all text-left flex flex-col items-center gap-1.5 shadow-2xs"
                  >
                    <div className="w-full aspect-video rounded-md overflow-hidden bg-white border border-slate-200 shadow-2xs group-hover:scale-102 transition-transform">
                      <img
                        src={sample.thumbnailUrl}
                        alt={sample.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 group-hover:text-emerald-700 truncate w-full text-center">
                      {sample.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Value Prop Checkmarks */}
        <div className="flex items-center justify-center flex-wrap gap-6 mt-4 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            {t.valProp1}
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            {t.valProp2}
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            {t.valProp3}
          </span>
        </div>
      </div>
    </section>
  )
}
