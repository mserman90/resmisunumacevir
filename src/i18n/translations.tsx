import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'tr'

export interface Translations {
  appName: string
  freeBadge: string
  navFeatures: string
  navBenchmark: string
  navGuide: string
  navLaunchCanvas: string
  heroTitle1: string
  heroTitleHighlight: string
  heroDesc: string
  dropzoneTitle: string
  dropzoneAnalyzing: string
  dropzoneSubtitle: string
  dropzoneButton: string
  trySample: string
  valProp1: string
  valProp2: string
  valProp3: string
  home: string
  slides: string
  addText: string
  addCard: string
  addImageLayer: string
  addTable: string
  decomposeImage: string
  watermarkFilter: string
  watermarkEnabled: string
  watermarkDisabled: string
  undo: string
  redo: string
  quickTheme: string
  exportPptx: string
  exportPdf: string
  exportPng: string
  layerInspector: string
  selectLayerHint: string
  layerProps: string
  positionSize: string
  typography: string
  colorsStyling: string
  deleteLayer: string
  bringForward: string
  sendBackward: string
  benchmarkTitle: string
  benchmarkSubtitle: string
}

const TRANSLATIONS: Record<Language, Translations> = {
  tr: {
    appName: 'Image to PPT',
    freeBadge: 'Ücretsiz • AI Katman Ayrıştırıcı',
    navFeatures: 'Özellikler & Yetenekler',
    navBenchmark: 'Benchmark Analizi',
    navGuide: 'Rehber & İş Akışı',
    navLaunchCanvas: 'Tuval Editörünü Aç',
    heroTitle1: 'Görselleri, Ekran Görüntülerini & PDF Slaytlarını ',
    heroTitleHighlight: 'Düzenlenebilir PowerPoint Katmanlarına Dönüştürün',
    heroDesc:
      'Herhangi bir görsel dosyası (PNG, JPG, WebP), diyagram veya NotebookLM PDF yükleyin. Otomatik olarak bağımsız hareketli kartlara, yerel metin kutularına ve temiz arka plan dokularına ayrıştırın.',
    dropzoneTitle: 'Görselleri veya PDF slaytları sürükleyin veya seçin',
    dropzoneAnalyzing: 'AI Görsel Katman Ayrıştırma Motoru Çalışıyor...',
    dropzoneSubtitle:
      'PNG, JPG, WebP, ekran görüntüleri, infografikler ve NotebookLM PDF formatlarını destekler',
    dropzoneButton: 'Görsel veya PDF Dosyası Seç',
    trySample: 'Katman ayrıştırmayı görmek için hazır örnekleri deneyin',
    valProp1: 'Görsel & PDF katman ayrıştırma',
    valProp2: 'Otomatik filigran ve doku onarma',
    valProp3: '%100 Ücretsiz & Sınırsız',
    home: 'Ana Sayfa',
    slides: 'Slayt',
    addText: '+ Metin',
    addCard: '+ Kart',
    addImageLayer: '+ Görsel Katmanı',
    addTable: '+ Tablo',
    decomposeImage: 'Yeni Görsel Ayrıştır',
    watermarkFilter: 'Filigran Temizleme',
    watermarkEnabled: 'Filigran temizleme aktif',
    watermarkDisabled: 'Filigran temizleme kapalı',
    undo: 'Geri Al',
    redo: 'İleri Al',
    quickTheme: 'Hızlı Tema',
    exportPptx: 'PowerPoint (.pptx) İndir',
    exportPdf: 'PDF Olarak Yazdır',
    exportPng: 'Slayt Görseli (.png)',
    layerInspector: 'Katman Özellikleri',
    selectLayerHint: 'Düzenlemek için tuvalden bir katmana tıklayın veya çift tıklayarak metni değiştirin.',
    layerProps: 'Seçili Katman Ayarları',
    positionSize: 'Konum ve Boyut',
    typography: 'Tipografi ve Metin',
    colorsStyling: 'Renk ve Kenarlıklar',
    deleteLayer: 'Katmanı Sil',
    bringForward: 'Öne Getir',
    sendBackward: 'Arkaya Gönder',
    benchmarkTitle: 'Sektörel Benchmark Analizi',
    benchmarkSubtitle: 'Geleneksel çevrimiçi PDF dönüştürücüler, pahalı masaüstü OCR yazılımları ve üretimsel yapay zeka araçları ile nesne tabanlı katman ayırma teknolojimizin detaylı teknik karşılaştırması.',
  },
  en: {
    appName: 'Image to PPT',
    freeBadge: 'Free • AI Layer Decomposer',
    navFeatures: 'Features & Capabilities',
    navBenchmark: 'Benchmark Analysis',
    navGuide: 'Guide & Workflow',
    navLaunchCanvas: 'Launch Canvas Editor',
    heroTitle1: 'Turn Images, NotebookLM & PDF Decks into ',
    heroTitleHighlight: 'Editable PowerPoint Layers',
    heroDesc:
      'Upload any image file, screenshot, diagram, or NotebookLM PDF. Automatically decompose it into independent movable cards, native text boxes, isolated graphics, and inpaint clean backgrounds.',
    dropzoneTitle: 'Click or drag to upload Images & PDF slides',
    dropzoneAnalyzing: 'AI Vision Engine Decomposing Image into Layers...',
    dropzoneSubtitle:
      'Supports PNG, JPG, WebP, screenshots, infographics, and NotebookLM generated PDFs',
    dropzoneButton: 'Select Images or PDF',
    trySample: 'Try a decomposed sample to see how it works',
    valProp1: 'Image & PDF layer splitting',
    valProp2: 'Automatic watermark removal',
    valProp3: '100% Free & Unlimited',
    home: 'Home',
    slides: 'Slide',
    addText: '+ Text',
    addCard: '+ Card',
    addImageLayer: '+ Image Layer',
    addTable: '+ Table',
    decomposeImage: 'Decompose New Image',
    watermarkFilter: 'Watermark Filter',
    watermarkEnabled: 'Watermark filter enabled',
    watermarkDisabled: 'Watermark filter disabled',
    undo: 'Undo',
    redo: 'Redo',
    quickTheme: 'Quick Theme',
    exportPptx: 'Download PowerPoint (.pptx)',
    exportPdf: 'Print to PDF',
    exportPng: 'Slide Snapshot (.png)',
    layerInspector: 'Layer Inspector',
    selectLayerHint: 'Click a layer on the canvas to inspect, or double-click to edit text.',
    layerProps: 'Selected Layer Properties',
    positionSize: 'Position & Size',
    typography: 'Typography & Text',
    colorsStyling: 'Colors & Borders',
    deleteLayer: 'Delete Layer',
    bringForward: 'Bring Forward',
    sendBackward: 'Send Backward',
    benchmarkTitle: 'Industry Benchmark Analysis',
    benchmarkSubtitle: 'Detailed technical comparison of our object-level layer decomposition against traditional online PDF converters, desktop OCR suites, and generative presentation tools.',
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'tr',
  setLanguage: () => {},
  t: TRANSLATIONS.tr,
})

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('image_to_ppt_lang')
      if (saved === 'en' || saved === 'tr') return saved
    } catch {}
    return 'tr' // Default to Turkish as requested in context
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('image_to_ppt_lang', lang)
    } catch {}
  }

  const value = {
    language,
    setLanguage,
    t: TRANSLATIONS[language],
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
