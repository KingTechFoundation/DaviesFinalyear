import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sprout, Bot, Cloud, Bug, BarChart3, Globe, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LandingPageProps {
  onLogin: () => void;
  onRegister?: () => void;
}

export function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-green-900">AgriGuide AI</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher variant="light" />
            <Button variant="outline" onClick={onLogin} className="hidden sm:inline-flex">{t.landing.signIn}</Button>
            <Button onClick={onRegister || onLogin} className="bg-green-600 hover:bg-green-700 text-sm sm:text-base">{t.landing.getStarted}</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-10 sm:py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-700 rounded-full text-sm">
              {t.landing.tagline}
            </div>
            <h1 className="text-green-900">{t.landing.heroTitle}</h1>
            <p className="text-neutral-600">{t.landing.heroDesc}</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button onClick={onRegister || onLogin} size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">{t.landing.startTrial}</Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">{t.landing.watchDemo}</Button>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-4">
              <div><div className="text-green-900">50,000+</div><div className="text-neutral-600 text-sm">{t.landing.activeFarmers}</div></div>
              <div><div className="text-green-900">98%</div><div className="text-neutral-600 text-sm">{t.landing.satisfactionRate}</div></div>
              <div><div className="text-green-900">35%</div><div className="text-neutral-600 text-sm">{t.landing.yieldIncrease}</div></div>
            </div>
          </div>
          <div className="relative order-first md:order-last">
            <div className="absolute inset-0 bg-gradient-to-tr from-green-600/20 to-blue-600/20 rounded-2xl sm:rounded-3xl transform rotate-3"></div>
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1567497063796-7952e455a2a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZmFybWVyJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjI3OTMzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Farmer using technology"
              className="relative rounded-2xl sm:rounded-3xl w-full h-auto shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { icon: Bot, color: 'bg-green-100 text-green-600', title: t.landing.features.aiTitle, desc: t.landing.features.aiDesc },
              { icon: Cloud, color: 'bg-blue-100 text-blue-600', title: t.landing.features.weatherTitle, desc: t.landing.features.weatherDesc },
              { icon: Bug, color: 'bg-orange-100 text-orange-600', title: t.landing.features.pestTitle, desc: t.landing.features.pestDesc },
              { icon: BarChart3, color: 'bg-purple-100 text-purple-600', title: t.landing.features.analyticsTitle, desc: t.landing.features.analyticsDesc },
            ].map((f, i) => (
              <div key={i} className="p-4 sm:p-6 border rounded-xl sm:rounded-2xl hover:shadow-lg transition-shadow">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${f.color.split(' ')[0]} rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
                  <f.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${f.color.split(' ')[1]}`} />
                </div>
                <h3 className="text-green-900 mb-2">{f.title}</h3>
                <p className="text-neutral-600 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-green-900 mb-4">{t.landing.howItWorks}</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { num: 1, title: t.landing.step1Title, desc: t.landing.step1Desc },
              { num: 2, title: t.landing.step2Title, desc: t.landing.step2Desc },
              { num: 3, title: t.landing.step3Title, desc: t.landing.step3Desc },
            ].map((step, i) => (
              <div key={i} className={`text-center ${i === 2 ? 'sm:col-span-2 md:col-span-1' : ''}`}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">{step.num}</div>
                <h3 className="text-green-900 mb-2">{step.title}</h3>
                <p className="text-neutral-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-green-900 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="mb-4 sm:mb-6">{t.landing.readyTitle}</h2>
              <p className="mb-4 sm:mb-6 text-green-100">{t.landing.readyDesc}</p>
              <div className="space-y-3 sm:space-y-4">
                {[
                  t.landing.features.soilTitle, t.landing.features.weatherTitle,
                  t.landing.features.pestTitle, t.landing.features.multilangTitle,
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <div className="text-green-100">{item}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative order-first md:order-last">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1551357176-67341c5b414f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyd2FuZGElMjBmYXJtaW5nJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc2Mjc5MzM3Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Rwanda farming landscape"
                className="rounded-xl sm:rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 text-center text-white">
            <Globe className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6" />
            <h2 className="mb-3 sm:mb-4">{t.landing.readyTitle}</h2>
            <p className="max-w-2xl mx-auto mb-6 sm:mb-8 text-green-50">{t.landing.readyDesc}</p>
            <Button onClick={onRegister || onLogin} size="lg" className="bg-white text-green-600 hover:bg-green-50 w-full sm:w-auto">{t.landing.startFree}</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center"><Sprout className="w-5 h-5 text-green-600" /></div>
                <span>AgriGuide AI</span>
              </div>
              <p className="text-green-200 text-sm">{t.landing.footerDesc}</p>
            </div>
            <div>
              <div className="mb-3">{t.landing.product}</div>
              <div className="space-y-2 text-green-200 text-sm">
                <div>{t.landing.features.soilTitle}</div>
                <div>{t.landing.features.aiTitle}</div>
                <div>{t.landing.features.weatherTitle}</div>
                <div>{t.landing.features.analyticsTitle}</div>
              </div>
            </div>
            <div>
              <div className="mb-3">{t.landing.company}</div>
              <div className="space-y-2 text-green-200 text-sm">
                <div>{t.landing.aboutUs}</div>
                <div>{t.landing.careers}</div>
                <div>{t.landing.contact}</div>
              </div>
            </div>
            <div>
              <div className="mb-3">{t.landing.legal}</div>
              <div className="space-y-2 text-green-200 text-sm">
                <div>{t.landing.privacy}</div>
                <div>{t.landing.terms}</div>
              </div>
            </div>
          </div>
          <div className="border-t border-green-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-green-200 text-sm">
            {t.landing.copyright}
          </div>
        </div>
      </footer>
    </div>
  );
}
