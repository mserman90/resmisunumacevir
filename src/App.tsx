import React, { useState, useEffect } from 'react'
import { SlidefulProject, EditableSlide } from './types/slideful'
import {
  SAMPLE_SLIDEFUL_DECKS,
  separateImageIntoLayers,
} from './utils/aiLayerExtractor'
import { SlidefulNavbar } from './components/SlidefulNavbar'
import { SlidefulHero } from './components/SlidefulHero'
import { SlidefulFeatures } from './components/SlidefulFeatures'
import { BenchmarkSection } from './components/BenchmarkSection'
import { SlidefulFaq } from './components/SlidefulFaq'
import { SlidefulFooter } from './components/SlidefulFooter'
import { SlidefulWorkspace } from './components/SlidefulWorkspace'
import { SlidefulBlogModal } from './components/SlidefulBlogModal'
import { ToastProvider, useToast } from './components/Toast'
import { LanguageProvider } from './i18n/translations'
import { processImageFile } from './utils/imageUtils'

const DEFAULT_PROJECT: SlidefulProject = {
  id: 'proj-deck-default',
  title: 'Research & Strategy Deck',
  description: 'Multi-layer editable presentation converted with native text and shape layers',
  aspectRatio: '16:9',
  slides: SAMPLE_SLIDEFUL_DECKS[0].slides,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

function ImageToPptApp() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace' | 'blog'>('landing')
  const [currentProject, setCurrentProject] = useState<SlidefulProject>(() => {
    try {
      const saved = localStorage.getItem('image_to_ppt_project')
      if (saved) return JSON.parse(saved)
    } catch {}
    return DEFAULT_PROJECT
  })
  const [isProcessingUpload, setIsProcessingUpload] = useState(false)
  const { showToast } = useToast()

  // Save to local storage on update
  useEffect(() => {
    try {
      localStorage.setItem('image_to_ppt_project', JSON.stringify(currentProject))
    } catch {}
  }, [currentProject])

  // Handle uploading files (images / PDF screenshots)
  const handleUploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files)
    if (list.length === 0) return

    setIsProcessingUpload(true)
    showToast(`AI Vision: Separating layers & inpainting watermarks for ${list.length} file(s)...`, 'info')

    try {
      const newSlides: EditableSlide[] = []
      for (const file of list) {
        const processed = await processImageFile(file)
        const slide = await separateImageIntoLayers(file, processed.dataUrl)
        newSlides.push(slide)
      }

      const updatedProject: SlidefulProject = {
        ...currentProject,
        title: list[0]?.name.replace(/\.[^/.]+$/, '').replace(/[_|-]/g, ' ') || 'Converted Presentation',
        slides: newSlides,
        updatedAt: new Date().toISOString(),
      }

      setCurrentProject(updatedProject)
      setCurrentView('workspace')
      showToast('Slide layers separated! Click text to edit or move cards.', 'success')
    } catch (err: any) {
      console.error(err)
      showToast('Failed to process image layers', 'error')
    } finally {
      setIsProcessingUpload(false)
    }
  }

  // Handle selecting a pre-loaded sample
  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_SLIDEFUL_DECKS.find((s) => s.id === sampleId)
    if (!sample) return

    const updatedProject: SlidefulProject = {
      ...currentProject,
      title: sample.name,
      slides: sample.slides,
      updatedAt: new Date().toISOString(),
    }

    setCurrentProject(updatedProject)
    setCurrentView('workspace')
    showToast(`Loaded "${sample.name}" with editable native layers!`, 'success')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* Navigation Bar */}
      <SlidefulNavbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
      />

      {/* Main Content Area based on currentView */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <div className="space-y-12">
            <SlidefulHero
              onUploadFiles={handleUploadFiles}
              onSelectSample={handleSelectSample}
              isProcessing={isProcessingUpload}
            />

            <SlidefulFeatures
              onOpenWorkspace={() => setCurrentView('workspace')}
            />

            <BenchmarkSection
              onOpenWorkspace={() => setCurrentView('workspace')}
            />

            <SlidefulFaq />

            {/* Bottom CTA Banner */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 mb-16">
              <div className="bg-slate-950 text-white rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xl">
                <h3 className="text-2xl sm:text-3xl font-serif font-normal">
                  Get Your Editable PowerPoint in Seconds
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  Transform NotebookLM, PDF decks, and slide images into native presentation layers. Free and unlimited.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setCurrentView('workspace')}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
                  >
                    Rebuild Slides Free ↗
                  </button>
                </div>
                <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 pt-2">
                  <span>✓ 100% Free & Unlimited</span>
                  <span>✓ Auto watermark removal</span>
                  <span>✓ Native text boxes & in-browser editor</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentView === 'workspace' && (
          <SlidefulWorkspace
            project={currentProject}
            onUpdateProject={setCurrentProject}
            onToast={showToast}
            onBackToLanding={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'blog' && (
          <SlidefulBlogModal
            onBack={() => setCurrentView('landing')}
            onOpenWorkspace={() => setCurrentView('workspace')}
          />
        )}
      </main>

      {/* Footer (on landing and blog views) */}
      {currentView !== 'workspace' && (
        <SlidefulFooter onNavigate={(view) => setCurrentView(view)} />
      )}
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <LanguageProvider>
        <ImageToPptApp />
      </LanguageProvider>
    </ToastProvider>
  )
}
