import React, { useState } from 'react'
import { SlideImage } from '../types/presentation'
import {
  X,
  RotateCw,
  Trash2,
  FileText,
  Type,
  Check,
} from 'lucide-react'
import { rotateImageDataUrl } from '../utils/imageUtils'

interface ImageDetailModalProps {
  image: SlideImage
  isOpen: boolean
  onClose: () => void
  onSave: (updated: SlideImage) => void
  onDelete: (id: string) => void
}

export const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
  image,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen) return null

  const [name, setName] = useState(image.name)
  const [caption, setCaption] = useState(image.caption || '')
  const [notes, setNotes] = useState(image.notes || '')
  const [currentDataUrl, setCurrentDataUrl] = useState(image.dataUrl)
  const [isRotating, setIsRotating] = useState(false)

  const handleRotate = async () => {
    setIsRotating(true)
    try {
      const res = await rotateImageDataUrl(currentDataUrl, 90)
      setCurrentDataUrl(res.dataUrl)
    } catch (e) {
      console.error('Failed to rotate:', e)
    } finally {
      setIsRotating(false)
    }
  }

  const handleSave = () => {
    onSave({
      ...image,
      name: name.trim() || image.name,
      caption: caption.trim() || undefined,
      notes: notes.trim() || undefined,
      dataUrl: currentDataUrl,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 truncate max-w-sm">
              Edit Slide Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Image Preview & Actions */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950/5 flex items-center justify-center p-4 min-h-[220px] max-h-[300px]">
            <img
              src={currentDataUrl}
              alt={name}
              className="max-h-[260px] max-w-full object-contain rounded-lg shadow-sm"
            />
            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={handleRotate}
                disabled={isRotating}
                className="px-3 py-1.5 rounded-lg bg-black/75 hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-colors"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRotating ? 'animate-spin' : ''}`} />
                Rotate 90°
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-500" />
                Image Title / Filename
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                placeholder="e.g. Hero Architecture Visual"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-500" />
                Slide Caption / Description
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                placeholder="Brief 1-sentence caption shown at the bottom of the slide"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500" />
                Presenter Speaking Notes (Embedded in PPTX)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                placeholder="Key bullets and speaking prompts to remember during your presentation..."
              />
              <p className="text-[11px] text-slate-400 mt-1">
                These notes will be embedded into the PowerPoint speaker notes pane for this slide.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Delete this image from the deck?')) {
                onDelete(image.id)
                onClose()
              }
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            Delete Slide
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
