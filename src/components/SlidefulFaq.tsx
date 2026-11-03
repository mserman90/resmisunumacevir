import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

interface FaqItem {
  q: string
  a: string
}

const FAQS: FaqItem[] = [
  {
    q: 'Does Image to PPT create real PowerPoint objects or just background images?',
    a: 'Image to PPT generates 100% object-level native presentations. Rather than pasting an uneditable picture onto a slide, our engine separates images, titles, paragraphs, container cards, and background plates into native PowerPoint objects. Double-click text to edit, freely move cards, and enjoy clean slide backgrounds.',
  },
  {
    q: 'What formats are supported, and does it decompose regular image files?',
    a: 'Yes! Image to PPT is purpose-built to decompose standard image files (PNG, JPG, WebP, screenshots, infographics) as well as multi-page PDF slide decks from NotebookLM, Canva, and Gamma into independent editable layers. The output is a standard 16:9 or 4:3 widescreen PowerPoint (.pptx) file compatible with Microsoft PowerPoint, Google Slides, Keynote, and Canva.',
  },
  {
    q: 'Do I need Microsoft Office installed on my computer?',
    a: 'No. Image to PPT includes an interactive web canvas editor built directly into your browser. You can upload your image or deck, preview every editable layer, make quick text adjustments, and verify layout accuracy entirely online before downloading your final .pptx file.',
  },
  {
    q: 'Is this application completely free to use?',
    a: 'Yes! The app is 100% free with unlimited image decomposition, multi-page batch deck exports, full layer separation, and automatic watermark removal. There are no subscriptions, no credit limits, and no paywalls.',
  },
  {
    q: 'Will moving cards or editing text leave white cutout holes or ghost marks?',
    a: 'No. When you move or delete cards, our occlusion inpainting engine automatically reconstructs the continuous textures and colors hidden underneath, while eliminating official watermarks for a clean slide canvas.',
  },
  {
    q: 'Are my uploaded internal decks, business reports, and image screenshots secure?',
    a: 'Completely secure. All processing happens in your browser with TLS encryption. We never train public AI models on your files or generated slides, and we never share or store your data. You retain 100% ownership and copyright.',
  },
  {
    q: 'Will fonts break on other computers or risk copyright issues? Does text wrap naturally?',
    a: 'No. To avoid commercial licensing risks and missing-font errors from obscure typefaces, Image to PPT preserves typography hierarchy while mapping to universal, 100% commercially safe standard fonts (like PingFang, YaHei, Arial, and Calibri). Text is organized into native continuous paragraphs that wrap naturally when edited.',
  },
]

export const SlidefulFaq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h2 className="text-center text-2xl sm:text-3xl font-serif font-normal text-slate-900 tracking-tight mb-10">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={idx}
              className="border-b border-slate-200 pb-4 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full py-3 flex items-center justify-between text-left font-serif text-base sm:text-lg text-slate-900 hover:text-emerald-700 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 shrink-0 ml-4">
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div className="pt-1 pb-3 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
