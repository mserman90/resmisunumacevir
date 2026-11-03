import React from 'react'
import { ArrowLeft, Check, Sparkles, BookOpen, Layers } from 'lucide-react'

interface SlidefulBlogModalProps {
  onBack: () => void
  onOpenWorkspace: () => void
}

export const SlidefulBlogModal: React.FC<SlidefulBlogModalProps> = ({
  onBack,
  onOpenWorkspace,
}) => {
  return (
    <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Back link */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        All posts & guides
      </button>

      {/* Meta tags */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
        <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">GUIDES</span>
        <span>·</span>
        <span>2026/09/17</span>
        <span>·</span>
        <span>3 min read</span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-serif font-normal text-slate-900 tracking-tight leading-tight mb-4">
        Convert Images & NotebookLM PDFs into Editable PowerPoint
      </h1>

      <p className="text-base text-slate-600 leading-relaxed mb-6 font-serif italic">
        Need to edit flat images or a NotebookLM PDF? Follow this 3-step guide to split pages and images into editable PowerPoint slides with click-to-edit text.
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 py-4 border-y border-slate-100 mb-8">
        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
          IP
        </div>
        <div>
          <p className="text-xs font-bold text-slate-900">Image to PPT Team</p>
          <p className="text-[11px] text-slate-500">Vision Decomposition Team</p>
        </div>
      </div>

      {/* Body Content */}
      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <p>
          Whether working with AI tools like Google NotebookLM, Canva exports, or screenshot images of presentation slides, anyone trying to edit them runs into the same roadblock: <strong>the exported image or PDF is flattened into uneditable pictures</strong>.
        </p>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <span>💡 Looking for instant layer decomposition?</span>
          </p>
          <p className="italic">
            If you just need to edit text, swap data, and get your slides presentation-ready in 3
            minutes, follow the 3 steps below:
          </p>
        </div>

        <h2 className="text-2xl font-serif font-normal text-slate-900 pt-4">
          3 Simple Steps to Convert Images & Slides into Editable PPT
        </h2>

        <p className="text-slate-600">
          No complex image editing software required. Everything happens directly inside your web browser:
        </p>

        <div className="space-y-6 pt-2">
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <h3 className="font-bold text-base text-slate-900">
              Step 1: Upload Your Image or PDF File
            </h3>
            <p className="text-xs text-slate-600">
              Upload any image file (PNG, JPG, WebP), diagram, screenshot, or NotebookLM PDF brief.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <h3 className="font-bold text-base text-slate-900">
              Step 2: AI Intelligent Layer Splitting
            </h3>
            <p className="text-xs text-slate-600">
              The engine automatically splits the image:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-600 pl-4 list-disc pt-1">
              <li>
                <strong>Text becomes native text boxes:</strong> Headlines, body paragraphs, and
                metric notes are isolated into standard text boxes. Double-click to type changes or
                update numbers.
              </li>
              <li>
                <strong>Cards become movable layers:</strong> Container boxes and summary callouts
                can be repositioned, restyled, or deleted freely.
              </li>
              <li>
                <strong>Background fills in automatically:</strong> When you move or delete a card,
                underlying textures and gradients are restored without leaving blank white holes.
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <h3 className="font-bold text-base text-slate-900">
              Step 3: Download Native .pptx and Edit Freely
            </h3>
            <p className="text-xs text-slate-600">
              Once you are satisfied with the preview, click download to export a standard 16:9
              .pptx presentation. Open the file in PowerPoint, WPS Office, Google Slides, or Keynote.
            </p>
          </div>
        </div>

        {/* CTA banner */}
        <div className="p-6 rounded-2xl bg-slate-900 text-white mt-8 space-y-3 text-center">
          <h3 className="font-serif text-xl font-normal">Try It for Free</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Stop wasting hours retyping text from static screenshots or rebuilding card layouts from
            scratch.
          </p>
          <button
            onClick={onOpenWorkspace}
            className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 transition-colors"
          >
            <Layers className="w-4 h-4" />
            Launch Canvas Editor
          </button>
        </div>
      </div>
    </article>
  )
}
