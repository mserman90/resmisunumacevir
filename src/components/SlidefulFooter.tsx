import React from 'react'
import { Layers, ImageIcon } from 'lucide-react'

interface SlidefulFooterProps {
  onNavigate: (view: 'landing' | 'workspace' | 'blog') => void
}

export const SlidefulFooter: React.FC<SlidefulFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
            <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <span>Image to PPT</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Decompose image files, screenshots, and PDF decks into native editable presentation layers. 100% free and open.
          </p>
        </div>

        {/* Resources */}
        <div className="space-y-2">
          <p className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Resources</p>
          <ul className="space-y-1.5">
            <li>
              <button onClick={() => onNavigate('landing')} className="hover:text-slate-900">
                Features
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('landing')} className="hover:text-slate-900">
                FAQ
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  onNavigate('landing')
                  setTimeout(() => {
                    document.getElementById('benchmark')?.scrollIntoView({ behavior: 'smooth' })
                  }, 100)
                }}
                className="hover:text-slate-900"
              >
                Benchmark Analizi
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('blog')} className="hover:text-slate-900">
                Decomposition Guide
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('workspace')} className="hover:text-slate-900 text-emerald-600 font-semibold">
                Web Canvas Editor
              </button>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div className="space-y-2">
          <p className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Capabilities</p>
          <ul className="space-y-1.5">
            <li>
              <span className="text-slate-500">Image Layer Decomposer</span>
            </li>
            <li>
              <span className="text-slate-500">NotebookLM to PPT</span>
            </li>
            <li>
              <span className="text-slate-500">Clean Inpainting</span>
            </li>
            <li>
              <span className="text-slate-500">Native OpenXML PPTX</span>
            </li>
          </ul>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <p className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Engine</p>
          <p className="text-xs text-slate-500">
            Vision layer splitting & watermark inpainting running locally with 100% data privacy and unlimited free exports.
          </p>
          <div className="pt-2 text-emerald-600 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Operational & 100% Free</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
        <span>© 2026 Image to PPT. Free & Open Engine.</span>
        <div className="flex items-center gap-4">
          <span>✓ Zero Watermarks</span>
          <span>•</span>
          <span>🌐 EN / TR</span>
        </div>
      </div>
    </footer>
  )
}
