import React from 'react'
import {
  Presentation,
  FolderPlus,
  LayoutGrid,
  Sparkles,
  Github,
  Layers,
} from 'lucide-react'
import { PresentationProject } from '../types/presentation'

interface SidebarProps {
  projects: PresentationProject[]
  activeProjectId: string | null
  onSelectProject: (id: string | null) => void
  onNewProject: () => void
  isOpen: boolean
  onCloseMobile: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onNewProject,
  isOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-2xs"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-200 md:translate-x-0 md:static shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onSelectProject(null)
              onCloseMobile()
            }}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Presentation className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base text-white tracking-tight leading-none">
                Image to PPT
              </h1>
              <span className="text-[11px] text-slate-400 font-medium">PowerPoint Generator</span>
            </div>
          </button>
        </div>

        {/* Primary Navigation */}
        <div className="p-3 space-y-1">
          <button
            onClick={() => {
              onSelectProject(null)
              onCloseMobile()
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeProjectId === null
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="w-4 h-4" />
              <span>All Presentations</span>
            </div>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/30">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => {
              onNewProject()
              onCloseMobile()
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors"
          >
            <FolderPlus className="w-4 h-4 text-indigo-400" />
            <span>New Deck</span>
          </button>
        </div>

        {/* Quick Project Jump List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin">
          <div className="px-3 py-1.5 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
            <span>Recent Decks</span>
            <Layers className="w-3 h-3" />
          </div>

          {projects.map((proj) => {
            const isActive = activeProjectId === proj.id
            return (
              <button
                key={proj.id}
                onClick={() => {
                  onSelectProject(proj.id)
                  onCloseMobile()
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-left transition-colors truncate ${
                  isActive
                    ? 'bg-slate-800 text-indigo-300 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <span className="truncate max-w-[150px]">{proj.title}</span>
                <span className="text-[10px] font-mono opacity-50 shrink-0">
                  {proj.images.length}
                </span>
              </button>
            )
          })}
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs font-bold shrink-0">
              AR
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">Alex Rivera</p>
              <p className="text-[10px] text-slate-400 truncate">serdarerman@gmail.com</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500 font-medium">
            <span>Real PPTX Engine</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
        </div>
      </aside>
    </>
  )
}
