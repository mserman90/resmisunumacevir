import { PresentationProject } from '../types/presentation'

// Helper to generate SVG data URLs with crisp gradient artwork and graphics
function createSvgDataUrl(title: string, subtitle: string, gradientStart: string, gradientEnd: string, iconType: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${gradientStart}" />
        <stop offset="100%" stop-color="${gradientEnd}" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="1280" height="720" fill="url(#g)" />
    <rect width="1280" height="720" fill="url(#grid)" />
    
    <!-- Central visual frame -->
    <rect x="140" y="100" width="1000" height="520" rx="24" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" stroke-width="2"/>
    
    <circle cx="640" cy="280" r="70" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" stroke-width="2"/>
    
    <!-- Icon representation -->
    ${
      iconType === 'rocket'
        ? `<polygon points="640,230 670,300 640,290 610,300" fill="#ffffff" opacity="0.9"/>
           <circle cx="640" cy="265" r="8" fill="${gradientEnd}"/>`
        : iconType === 'chart'
        ? `<rect x="615" y="270" width="12" height="30" rx="3" fill="#ffffff" opacity="0.9"/>
           <rect x="635" y="250" width="12" height="50" rx="3" fill="#ffffff" opacity="0.9"/>
           <rect x="655" y="235" width="12" height="65" rx="3" fill="#ffffff" opacity="0.9"/>`
        : iconType === 'camera'
        ? `<rect x="615" y="260" width="50" height="35" rx="6" fill="#ffffff" opacity="0.9"/>
           <circle cx="640" cy="277" r="10" fill="${gradientStart}"/>
           <rect x="625" y="252" width="16" height="8" rx="2" fill="#ffffff" opacity="0.9"/>`
        : iconType === 'mountain'
        ? `<polygon points="640,235 680,310 600,310" fill="#ffffff" opacity="0.85"/>
           <polygon points="665,265 695,310 635,310" fill="#ffffff" opacity="0.5"/>`
        : `<rect x="615" y="255" width="50" height="40" rx="8" fill="#ffffff" opacity="0.9"/>
           <line x1="625" y1="270" x2="655" y2="270" stroke="${gradientStart}" stroke-width="4" stroke-linecap="round"/>
           <line x1="625" y1="282" x2="645" y2="282" stroke="${gradientStart}" stroke-width="4" stroke-linecap="round"/>`
    }
    
    <text x="640" y="420" font-family="system-ui, -apple-system, sans-serif" font-size="38" font-weight="700" fill="#ffffff" text-anchor="middle" letter-spacing="-0.5">${title}</text>
    <text x="640" y="465" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="rgba(255,255,255,0.75)" text-anchor="middle">${subtitle}</text>
    
    <text x="640" y="550" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="rgba(255,255,255,0.4)" text-anchor="middle" letter-spacing="2">PRESENTATION VISUAL SLIDE</text>
  </svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export const INITIAL_PROJECTS: PresentationProject[] = [
  {
    id: 'proj-product-launch',
    title: 'Product Launch Deck Q4',
    description: 'High-impact key visuals and product screenshots for executive & investor presentation',
    theme: 'modern-dark',
    layout: 'contain',
    aspectRatio: '16:9',
    showTitleHeader: true,
    showSlideNumbers: true,
    showCaptions: true,
    includeTitleSlide: true,
    titleSlideSubtitle: 'Next-Generation Workflow Platform • Global Launch',
    includeClosingSlide: true,
    closingSlideText: 'Thank you! Questions & Discussion',
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    images: [
      {
        id: 'img-101',
        name: '01_Hero_Product_Architecture.png',
        dataUrl: createSvgDataUrl('Product Architecture', 'Unified cloud platform connecting teams and real-time data flows', '#4338ca', '#312e81', 'rocket'),
        caption: 'Central architecture diagram highlighting distributed streaming pipelines',
        notes: 'Emphasize the 99.99% uptime SLA and instant multi-region failover capabilities.',
        aspectRatio: 16 / 9,
        rotation: 0,
        createdAt: Date.now() - 3600000 * 20,
      },
      {
        id: 'img-102',
        name: '02_Executive_Analytics_Dashboard.png',
        dataUrl: createSvgDataUrl('Executive Analytics', 'Real-time cohort performance and key engagement metrics', '#0f766e', '#134e4a', 'chart'),
        caption: 'Q3 traction and growth velocity overview across enterprise tiers',
        notes: 'Point out the 184% net retention metric and reduced payback period to 7 months.',
        aspectRatio: 16 / 9,
        rotation: 0,
        createdAt: Date.now() - 3600000 * 18,
      },
      {
        id: 'img-103',
        name: '03_Mobile_Native_Experience.png',
        dataUrl: createSvgDataUrl('Mobile Native Experience', 'Frictionless collaboration on iOS and Android devices', '#b45309', '#78350f', 'camera'),
        caption: 'Intuitive touch-first interface designed for executives on the move',
        notes: 'Highlight biometric passkey sign-in and offline review mode.',
        aspectRatio: 16 / 9,
        rotation: 0,
        createdAt: Date.now() - 3600000 * 15,
      },
      {
        id: 'img-104',
        name: '04_Global_Infrastructure_Map.png',
        dataUrl: createSvgDataUrl('Global Edge Presence', 'Sub-20ms latency delivered through 45+ global edge nodes', '#1e293b', '#0f172a', 'mountain'),
        caption: 'Distributed edge data replication map across America, EMEA, and APAC',
        notes: 'Ready for enterprise multi-tenant deployments starting next month.',
        aspectRatio: 16 / 9,
        rotation: 0,
        createdAt: Date.now() - 3600000 * 10,
      },
    ],
  },
  {
    id: 'proj-travel-portfolio',
    title: 'Japan Travel & Cultural Portfolio',
    description: 'Curated photography collection showcasing temples, landscapes, and Tokyo night scenes',
    theme: 'warm-editorial',
    layout: 'framed',
    aspectRatio: '16:9',
    showTitleHeader: true,
    showSlideNumbers: true,
    showCaptions: true,
    includeTitleSlide: true,
    titleSlideSubtitle: 'Photographic Journey through Honshu • Fall 2025',
    includeClosingSlide: true,
    closingSlideText: 'Arigato Gozaimasu • All photos © 2025',
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    images: [
      {
        id: 'img-201',
        name: 'Mount_Fuji_Sunrise.jpg',
        dataUrl: createSvgDataUrl('Mount Fuji at Dawn', 'Morning mist rising over Lake Kawaguchiko with autumn foliage', '#c2410c', '#7c2d12', 'mountain'),
        caption: 'Captured at 5:45 AM during the peak autumn foliage festival',
        notes: 'Exposure 1/250s at f/8, ISO 100 on 35mm prime lens.',
        aspectRatio: 16 / 9,
        rotation: 0,
        createdAt: Date.now() - 3600000 * 40,
      },
      {
        id: 'img-202',
        name: 'Kyoto_Bamboo_Path.jpg',
        dataUrl: createSvgDataUrl('Arashiyama Bamboo Grove', 'Quiet morning walk along the sacred Sagano bamboo path', '#15803d', '#14532d', 'mountain'),
        caption: 'Sunlight filtering through hundred-foot bamboo stalks at golden hour',
        notes: 'Natural audio captured in surround sound for exhibition installation.',
        aspectRatio: 16 / 9,
        rotation: 0,
        createdAt: Date.now() - 3600000 * 35,
      },
      {
        id: 'img-203',
        name: 'Shinjuku_Rainy_Streets.jpg',
        dataUrl: createSvgDataUrl('Tokyo Neon in Rain', 'Reflections across the narrow alleyways of Omoide Yokocho', '#7e22ce', '#581c87', 'camera'),
        caption: 'Lanterns, steam, and vibrant street reflections in evening rain',
        notes: 'Featured in Tokyo Urban Stories gallery series.',
        aspectRatio: 16 / 9,
        rotation: 0,
        createdAt: Date.now() - 3600000 * 30,
      },
    ],
  },
  {
    id: 'proj-design-system',
    title: 'Brand Identity & Design System',
    description: 'Visual tokens, typography scale, component library cards, and marketing collateral',
    theme: 'studio-white',
    layout: 'split',
    aspectRatio: '16:9',
    showTitleHeader: true,
    showSlideNumbers: true,
    showCaptions: true,
    includeTitleSlide: true,
    titleSlideSubtitle: 'Design Language Guidelines & Guidelines Book',
    includeClosingSlide: false,
    createdAt: new Date(Date.now() - 3600000 * 24 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    images: [
      {
        id: 'img-301',
        name: 'Design_Tokens_Palette.png',
        dataUrl: createSvgDataUrl('Color Harmony & Tokens', 'Accessible palette adhering to WCAG 2.1 AAA contrast', '#2563eb', '#1d4ed8', 'chart'),
        caption: 'Semantic color system covering background, surface, border, and text tokens',
        notes: 'Both dark and light elevation tokens defined with mathematical luminance steps.',
        aspectRatio: 16 / 9,
        rotation: 0,
        createdAt: Date.now() - 3600000 * 60,
      },
      {
        id: 'img-302',
        name: 'Typography_Hierarchy.png',
        dataUrl: createSvgDataUrl('Typographic Scale', 'Fluid type scale engineered for crisp readability across viewports', '#475569', '#334155', 'camera'),
        caption: 'Display, headline, title, body, and micro-label pairings',
        notes: 'Includes optical sizing and tabular lining numerals for data displays.',
        aspectRatio: 16 / 9,
        rotation: 0,
        createdAt: Date.now() - 3600000 * 50,
      },
    ],
  },
]
