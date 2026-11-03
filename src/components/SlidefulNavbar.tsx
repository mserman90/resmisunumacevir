import React from 'react'
import {
  Layers,
  Globe,
  ImageIcon,
} from 'lucide-react'
import { useLanguage } from '../i18n/translations'

interface SlidefulNavbarProps {
  currentView: 'landing' | 'workspace' | 'blog'
  onNavigate: (view: 'landing' | 'workspace' | 'blog') => void
}

export const SlidefulNavbar: React.FC<SlidefulNavbarProps> = ({
  currentView,
  onNavigate,
}) => {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'tr' ? 'en' : 'tr')
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">
              {t.appName}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {t.freeBadge}
            </span>
          </div>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => onNavigate('landing')}
            className={`transition-colors hover:text-slate-900 ${
              currentView === 'landing' ? 'text-emerald-600 font-semibold' : ''
            }`}
          >
            {t.navFeatures}
          </button>
          <button
            onClick={() => {
              if (currentView !== 'landing') onNavigate('landing')
              setTimeout(() => {
                document.getElementById('benchmark')?.scrollIntoView({ behavior: 'smooth' })
              }, 100)
            }}
            className="transition-colors hover:text-slate-900 flex items-center gap-1"
          >
            <span>{t.navBenchmark}</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              VS
            </span>
          </button>
          <button
            onClick={() => onNavigate('blog')}
            className={`transition-colors hover:text-slate-900 ${
              currentView === 'blog' ? 'text-emerald-600 font-semibold' : ''
            }`}
          >
            {t.navGuide}
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Working Language Toggle */}
          <button
            onClick={toggleLanguage}
            title={language === 'tr' ? 'Switch to English' : 'Türkçe Dil Seç'}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-200 shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language.toUpperCase()}</span>
            <span className="text-[10px] text-slate-400 font-normal">
              ({language === 'tr' ? 'Türkçe' : 'English'})
            </span>
          </button>

          <button
            onClick={() => onNavigate('workspace')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-xs transition-all ${
              currentView === 'workspace'
                ? 'bg-slate-900 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.navLaunchCanvas}</span>
            <div className="w-5 h-5 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center justify-center ml-0.5">
              PPT
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
