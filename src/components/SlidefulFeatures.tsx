import React from 'react'
import {
  UploadCloud,
  Layers,
  FileText,
  Sparkles,
  ArrowRight,
  Check,
  Move,
  Type,
  Eraser,
  ImageIcon,
} from 'lucide-react'

interface SlidefulFeaturesProps {
  onOpenWorkspace: () => void
}

export const SlidefulFeatures: React.FC<SlidefulFeaturesProps> = ({
  onOpenWorkspace,
}) => {
  return (
    <div className="space-y-24 py-12">
      {/* 1. HOW IT WORKS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-xl sm:text-2xl font-serif font-normal text-slate-800 tracking-tight mb-10">
          How Image to PPT Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xs relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <span className="font-serif text-2xl text-slate-300 font-bold">01</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug">
                Upload Any Image, Slide, or PDF
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drag and drop your images (PNG, JPG, WebP), screenshots, diagrams, or exported
                NotebookLM PDF study briefs directly into the dropzone.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xs relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="font-serif text-2xl text-slate-300 font-bold">02</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug">
                AI Separates Layers & Extracts Text
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our vision model separates container cards, shapes, images, and text paragraphs into
                independent editable layers while restoring clean background textures and removing
                watermarks.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xs relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-serif text-2xl text-slate-300 font-bold">03</span>
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2 leading-snug">
                Export Native Editable .pptx
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Download your clean, native presentation file ready for Microsoft PowerPoint, Google
                Slides, Keynote, or Canva with 100% editable typography.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE FEATURE SHOWCASES */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-normal text-slate-900 tracking-tight">
            From Static Images to Multi-Layer Editable PowerPoint
          </h2>
        </div>

        {/* FEATURE 1: SPLIT INTO LAYERS */}
        <div className="bg-gradient-to-br from-rose-50/50 via-white to-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              <Move className="w-3.5 h-3.5" />
              Split Into Layers
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              Split Images into Editable Layers: Separate Cards, Shapes & Content
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 pt-1">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Splits flat images into draggable, editable layers and container cards</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Rearrange cards, adjust stacking order, and resize components without layout breakage</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Save hours of manual Figma/Photoshop cropping and recreation from scratch</span>
              </li>
            </ul>
            <button
              onClick={onOpenWorkspace}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-emerald-600 pt-2 transition-colors"
            >
              <span>Try It Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-lg relative overflow-hidden group">
            <div className="aspect-[4/3] rounded-xl bg-slate-900 p-6 flex flex-col justify-between text-white relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400">LAYER SEPARATION</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Fully editable
                </span>
              </div>

              <div className="space-y-3">
                <h4 className="text-2xl font-black">Move it. Edit it. Your PPT.</h4>
                <div className="p-3 bg-white/10 rounded-lg backdrop-blur-xs border border-white/20">
                  <p className="text-xs font-semibold text-emerald-300">Marketing Strategy</p>
                  <p className="text-[11px] text-slate-300 mt-1">Independent cards & container boxes</p>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 font-mono">
                Isolated Layers • 100% Vector Cards
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE 2: NATIVE POWERPOINT TEXT */}
        <div className="bg-gradient-to-br from-blue-50/50 via-white to-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-lg order-2 md:order-1">
            <div className="aspect-[4/3] rounded-xl bg-white p-6 border-2 border-indigo-200 flex flex-col justify-between shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-800">Edit the words. Keep the slide.</span>
                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  Native PowerPoint text
                </span>
              </div>

              <div className="space-y-2 py-4">
                <div className="p-2.5 rounded-lg border border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-500/20">
                  <p className="text-lg font-bold text-slate-900 leading-tight">
                    Ideas drive <span className="underline decoration-indigo-500">change</span>.
                  </p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Turning complex ideas into clear, compelling presentations. Continuous paragraphs rather than single broken words.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span>Font: Arial / Calibri / Helvetica</span>
                <span>•</span>
                <span>Native Office OpenXML</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-6 space-y-4 order-1 md:order-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              <Type className="w-3.5 h-3.5" />
              Native PowerPoint Text
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              Native PowerPoint Text Boxes: Continuous Paragraphs & Preserved Typography
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 pt-1">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Extracts text into native PowerPoint paragraph text boxes with preserved font hierarchy</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Built-in lightweight web canvas to fix typos, replace data, and reorder layers online</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>One-click export to native .pptx, 100% compatible with PowerPoint, Google Slides, and Keynote</span>
              </li>
            </ul>
            <button
              onClick={onOpenWorkspace}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-emerald-600 pt-2 transition-colors"
            >
              <span>Try It Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* FEATURE 3: CLEAN INPAINTING */}
        <div className="bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-6 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              <Eraser className="w-3.5 h-3.5" />
              Clean Inpainting
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              Clean Background Inpainting: Automatic Watermark Removal & Occlusion Fill
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 pt-1">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Repairs seamless background textures and smooth gradients beneath moved elements</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Automatically detects and removes NotebookLM and platform watermarks with zero trace</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Eliminates manual clone-stamping or messy patch cover-ups forever</span>
              </li>
            </ul>
            <button
              onClick={onOpenWorkspace}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-emerald-600 pt-2 transition-colors"
            >
              <span>Try It Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
            <div className="aspect-[4/3] rounded-xl bg-slate-900 p-6 flex flex-col justify-between text-white relative">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-emerald-400">INPAINTING & WATERMARK REMOVAL</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Background restored
                </span>
              </div>

              <div className="space-y-2 py-4">
                <h4 className="text-2xl font-black">Move it. Nothing missing.</h4>
                <p className="text-xs text-slate-300">
                  Seamlessly fills background textures and gradients beneath moved cards.
                </p>
              </div>

              <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                <span>Watermarks removed</span>
                <span className="text-emerald-400 font-bold">100% Clean Canvas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SUPPORTED WORKFLOWS */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 bg-emerald-50/40 rounded-3xl p-8 sm:p-12 border border-emerald-100">
        <h2 className="text-center text-xl sm:text-2xl font-serif font-normal text-slate-900 tracking-tight mb-8">
          Supported Workflows: Images, PDFs, Canva & NotebookLM
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Image to Editable Layers: Separate Photos, Graphics & Text
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload any image file or screenshot; decompose it into independent editable text
              boxes, shapes, and isolated graphics.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              NotebookLM to PPT: Erase Watermarks & Unlock Layers
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Erase platform watermarks and separate text boxes and container cards into clean, native
              .pptx slides.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Consulting PDFs to PPT: Extract Draggable Cards & Metrics
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Turn matrices, system diagrams, and KPI dashboards into draggable cards ready for
              executive decks.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Canva & Gamma to PPT: Fix Locked Layers & Font Drift
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Fix flattened exports and missing fonts by restoring editable layers and text boxes in
              PowerPoint.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
