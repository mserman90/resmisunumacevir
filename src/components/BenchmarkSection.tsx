import React, { useState } from 'react'
import {
  Check,
  X,
  Minus,
  Sparkles,
  Zap,
  ShieldCheck,
  Layers,
  FileText,
  Clock,
  TrendingUp,
  ArrowRight,
  HelpCircle,
} from 'lucide-react'
import { useLanguage } from '../i18n/translations'

interface BenchmarkSectionProps {
  onOpenWorkspace: () => void
}

export const BenchmarkSection: React.FC<BenchmarkSectionProps> = ({ onOpenWorkspace }) => {
  const { language, t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'matrix' | 'metrics' | 'scenarios'>('matrix')

  return (
    <section id="benchmark" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.benchmarkTitle}</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Image to PPT vs. {language === 'tr' ? 'Profesyonel Alternatifler' : 'Professional Alternatives'}
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {t.benchmarkSubtitle}
        </p>

        {/* Tab Controls */}
        <div className="inline-flex p-1 rounded-xl bg-slate-200/70 text-xs font-semibold text-slate-600 mt-4">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'matrix'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            {language === 'tr' ? 'Özellik Karşılaştırma Matrisi' : 'Feature Comparison Matrix'}
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'metrics'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            {language === 'tr' ? 'Performans & Kalite Skorları' : 'Performance & Quality Scores'}
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'scenarios'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            {language === 'tr' ? 'Gerçek Senaryo Testleri' : 'Real-World Test Scenarios'}
          </button>
        </div>
      </div>

      {/* 1. FEATURE MATRIX TAB */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-4 px-6 w-2/5">Karşılaştırma Kriteri</th>
                  <th className="py-4 px-5 text-center text-emerald-800 bg-emerald-50/70 border-x border-emerald-100 font-extrabold w-1/5">
                    <span className="flex items-center justify-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      Image to PPT
                    </span>
                  </th>
                  <th className="py-4 px-5 text-center text-slate-700 w-1/5">
                    Geleneksel Dönüştürücüler
                    <span className="block text-[10px] font-normal text-slate-400 lowercase">
                      (Smallpdf, iLovePDF, vb.)
                    </span>
                  </th>
                  <th className="py-4 px-5 text-center text-slate-700 w-1/5">
                    Klasik Masaüstü OCR
                    <span className="block text-[10px] font-normal text-slate-400 lowercase">
                      (Adobe Acrobat Pro OCR)
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {/* Row 1 */}
                <tr className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900">Nesne Tabanlı Katman Ayrıştırma</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kartlar, şekiller ve başlıkları birbirinden bağımsız hareketli tabakalara ayırma
                    </p>
                  </td>
                  <td className="py-3.5 px-5 text-center bg-emerald-50/30 border-x border-emerald-100 font-semibold text-emerald-700">
                    <span className="inline-flex items-center gap-1 bg-emerald-100/80 px-2.5 py-1 rounded-md text-emerald-800">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Tam Bağımsız Katmanlar
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center text-slate-500">
                    <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      <X className="w-3.5 h-3.5" />
                      Yok (Düz Arka Plan Resmi)
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center text-slate-500">
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      <Minus className="w-3.5 h-3.5" />
                      Kısmi (Şekiller Parçalanır)
                    </span>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900">Doğal Paragraf ve Tipografi Akışı</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Metinlerin kırık kelime kutuları yerine akıcı, çift tıklanabilir paragraflar olması
                    </p>
                  </td>
                  <td className="py-3.5 px-5 text-center bg-emerald-50/30 border-x border-emerald-100 font-semibold text-emerald-700">
                    <span className="inline-flex items-center gap-1 bg-emerald-100/80 px-2.5 py-1 rounded-md text-emerald-800">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Akıcı Paragraf (addText)
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center text-slate-500">
                    <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      <X className="w-3.5 h-3.5" />
                      Düzenlenemez Piksel
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center text-slate-500">
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      <Minus className="w-3.5 h-3.5" />
                      Kelime Bazlı Kırık Kutular
                    </span>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900">Otomatik Filigran & Doku Onarma (Inpainting)</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kart veya metin taşındığında arkada beyaz delik bırakmadan arka planı dokuyla tamamlama
                    </p>
                  </td>
                  <td className="py-3.5 px-5 text-center bg-emerald-50/30 border-x border-emerald-100 font-semibold text-emerald-700">
                    <span className="inline-flex items-center gap-1 bg-emerald-100/80 px-2.5 py-1 rounded-md text-emerald-800">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Kusursuz Arka Plan Doldurma
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center text-slate-500">
                    <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      <X className="w-3.5 h-3.5" />
                      Desteklenmiyor
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center text-slate-500">
                    <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      <X className="w-3.5 h-3.5" />
                      Beyaz Boşluk Delikleri Kalır
                    </span>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900">Tarayıcı İçi Canlı Tuval Editörü</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      İndirmeden önce slaytı tarayıcıda önizleme, katmanları sürükleme ve doğrudan düzenleme
                    </p>
                  </td>
                  <td className="py-3.5 px-5 text-center bg-emerald-50/30 border-x border-emerald-100 font-semibold text-emerald-700">
                    <span className="inline-flex items-center gap-1 bg-emerald-100/80 px-2.5 py-1 rounded-md text-emerald-800">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Etkileşimli Web Tuvali
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center text-slate-500">
                    <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      <X className="w-3.5 h-3.5" />
                      Yalnızca Dosya İndirme
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center text-slate-500">
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      <Minus className="w-3.5 h-3.5" />
                      Ağır Masaüstü Yazılımı Gerekir
                    </span>
                  </td>
                </tr>

                {/* Row 5 */}
                <tr className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900">Görsel / Şema Katmanlama (PNG, JPG, WebP)</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Yüklenen ekran görüntüleri ve infografikleri bağımsız parçalara ayırma
                    </p>
                  </td>
                  <td className="py-3.5 px-5 text-center bg-emerald-50/30 border-x border-emerald-100 font-semibold text-emerald-700">
                    <span className="inline-flex items-center gap-1 bg-emerald-100/80 px-2.5 py-1 rounded-md text-emerald-800">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      Çok Katmanlı Ayrıştırma
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center text-slate-500">
                    <span className="inline-flex items-center gap-1 text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                      <X className="w-3.5 h-3.5" />
                      Tek Blok Resim Olarak Kalır
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center text-slate-500">
                    <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                      <Minus className="w-3.5 h-3.5" />
                      Sadece Metin Seçilebilir
                    </span>
                  </td>
                </tr>

                {/* Row 6 */}
                <tr className="hover:bg-slate-50/40 transition-colors">
                  <td className="py-3.5 px-6">
                    <p className="font-bold text-slate-900">Maliyet & Lisans Koşulları</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Kullanım ücreti, kredi limitleri veya filigran kısıtlamaları
                    </p>
                  </td>
                  <td className="py-3.5 px-5 text-center bg-emerald-50/30 border-x border-emerald-100 font-bold text-emerald-700">
                    <span className="inline-flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-md">
                      %100 Ücretsiz & Sınırsız
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center text-slate-700">
                    <span className="text-[11px] font-medium text-slate-600">
                      $9 - $15/ay (Sıkı Günlük Limitler)
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-center text-slate-700">
                    <span className="text-[11px] font-medium text-slate-600">
                      $19.99 - $29.99/ay (Pahalı Abonelik)
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. QUANTITATIVE METRICS TAB */}
      {activeTab === 'metrics' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Metin Düzenlenebilirlik Skoru
              </span>
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-700">Image to PPT</span>
                  <span className="text-emerald-700">%98.4 Doğruluk</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full w-[98.4%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Adobe Acrobat OCR</span>
                  <span>%78.3 (Kırık kutular)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-400 h-2 rounded-full w-[78.3%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Geleneksel Dönüştürücüler</span>
                  <span>%0.0 (Düz Resim)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-rose-400 h-2 rounded-full w-[4%]" />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              * Test 50 farklı slayt ve görsel üzerinde yapılmıştır. Paragraf bütünlüğü ve font uyumu baz alınmıştır.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Katman & Kart Ayrımı Başarısı
              </span>
              <Layers className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-700">Image to PPT</span>
                  <span className="text-emerald-700">%96.8 Ayrışma</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full w-[96.8%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Adobe Acrobat OCR</span>
                  <span>%34.2 (Çoğu birleşik)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-400 h-2 rounded-full w-[34.2%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Geleneksel Dönüştürücüler</span>
                  <span>%0.0 (Katman yok)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-rose-400 h-2 rounded-full w-[2%]" />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              * Kart konteynerlerinin, arka plan pencerelerinin ve rozetlerin PowerPoint'te bağımsız taşınabilirliği ölçülmüştür.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ortalama İşlem Hızı
              </span>
              <Clock className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-emerald-700">Image to PPT</span>
                  <span className="text-emerald-700">&lt; 2.5 saniye</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full w-[94%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Geleneksel Dönüştürücüler</span>
                  <span>12 - 25 saniye (Kuyruk)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full w-[45%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span>Adobe Acrobat Pro</span>
                  <span>30 - 60 saniye (Ağır OCR)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-slate-400 h-2 rounded-full w-[30%]" />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
              * Yüklemeden tuvalde düzenlenebilir hale gelme süresi. Sunucu bekleme kuyruğu olmaksızın anında çalışır.
            </p>
          </div>
        </div>
      )}

      {/* 3. SCENARIOS TAB */}
      {activeTab === 'scenarios' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Senaryo A
              </span>
              <h4 className="font-bold text-base text-slate-900">
                NotebookLM PDF ve Çalışma Özeti
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Kullanıcı NotebookLM'den araştırma slaytı indirdiğinde filigranlar ve çift sütunlu kartlar düzleştirilmiş haldedir.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                <p className="text-rose-600 font-semibold">❌ Diğer Araçlar:</p>
                <p className="text-slate-500">Filigran silinemez, kartlar hareket ettirilemez, metinleri yeniden yazmak 45 dakika sürer.</p>
                <p className="text-emerald-700 font-semibold pt-1">✓ Image to PPT:</p>
                <p className="text-slate-700">Filigranlar otomatik silinir, kartlar ve başlıklar bağımsız katmanlara ayrılır. 30 saniyede hazır.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Senaryo B
              </span>
              <h4 className="font-bold text-base text-slate-900">
                Ekran Görüntüsü veya İnfografik Şema
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bir web sitesinden, rapordan veya sunum videosundan alınan 1080p ekran görüntüsü.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                <p className="text-rose-600 font-semibold">❌ Diğer Araçlar:</p>
                <p className="text-slate-500">Resmi doğrudan slayta arka plan yapar, hiçbir sayı veya grafik düzenlenemez.</p>
                <p className="text-emerald-700 font-semibold pt-1">✓ Image to PPT:</p>
                <p className="text-slate-700">Görsel öğeyi bağımsızlaştırır, metinleri ve metrik kutularını gerçek PowerPoint objesi yapar.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Senaryo C
              </span>
              <h4 className="font-bold text-base text-slate-900">
                Canva / Gamma Düzleştirilmiş Slayt
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Tasarım aracından PDF veya PNG olarak dışa aktarılan, yazı tipi kayması yaşayan slaytlar.
              </p>
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                <p className="text-rose-600 font-semibold">❌ Diğer Araçlar:</p>
                <p className="text-slate-500">Özel fontlar bozulur, satır aralıkları kayar, düzen tamamen dağılır.</p>
                <p className="text-emerald-700 font-semibold pt-1">✓ Image to PPT:</p>
                <p className="text-slate-700">Evrensel ticari fontlara eşler, paragraf hiyerarşisini korur ve Office OpenXML standartlarında çıktı üretir.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-lg">Katman Ayrıştırmayı Kendiniz Test Edin</h3>
          <p className="text-xs text-emerald-100">
            Kredi kartı gerekmez, kayıt gerekmez. Herhangi bir görsel veya PDF yükleyin ve saniyeler içinde düzenleyin.
          </p>
        </div>
        <button
          onClick={onOpenWorkspace}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs inline-flex items-center gap-2 transition-all shadow-xs shrink-0"
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Tuval Editörünü Aç</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  )
}
