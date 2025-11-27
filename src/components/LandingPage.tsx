import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Sprout, Bot, Cloud, Bug, BarChart3, Globe, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
}

export function LandingPage({ onLogin }: LandingPageProps) {
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
            <select className="px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg bg-white text-sm">
              <option>EN</option>
              <option>RW</option>
              <option>FR</option>
            </select>
            <Button variant="outline" onClick={onLogin} className="hidden sm:inline-flex">Sign In</Button>
            <Button onClick={onLogin} className="bg-green-600 hover:bg-green-700 text-sm sm:text-base">Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-10 sm:py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-green-100 text-green-700 rounded-full text-sm">
              AI-Powered Agricultural Innovation
            </div>
            <h1 className="text-green-900">
              Smart Farming for Rwanda's Future
            </h1>
            <p className="text-neutral-600">
              AgriGuide AI leverages artificial intelligence to help farmers improve productivity, reduce costs, and make data-driven decisions. Get personalized recommendations on soil, crops, pest control, and weather-based scheduling.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button onClick={onLogin} size="lg" className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">Watch Demo</Button>
            </div>
            <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-4">
              <div>
                <div className="text-green-900">50,000+</div>
                <div className="text-neutral-600 text-sm">Active Farmers</div>
              </div>
              <div>
                <div className="text-green-900">98%</div>
                <div className="text-neutral-600 text-sm">Satisfaction Rate</div>
              </div>
              <div>
                <div className="text-green-900">35%</div>
                <div className="text-neutral-600 text-sm">Yield Increase</div>
              </div>
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
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-green-900 mb-4">Comprehensive Agricultural Solutions</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              All the tools you need to modernize your farming operations and maximize productivity
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            <div className="p-4 sm:p-6 border rounded-xl sm:rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Bot className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <h3 className="text-green-900 mb-2">AI Advisory Engine</h3>
              <p className="text-neutral-600 text-sm">Get personalized recommendations based on your soil and crop data</p>
            </div>
            <div className="p-4 sm:p-6 border rounded-xl sm:rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <h3 className="text-green-900 mb-2">Weather Monitoring</h3>
              <p className="text-neutral-600 text-sm">Real-time weather forecasts to guide irrigation and harvesting</p>
            </div>
            <div className="p-4 sm:p-6 border rounded-xl sm:rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Bug className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <h3 className="text-green-900 mb-2">Pest Detection</h3>
              <p className="text-neutral-600 text-sm">AI-powered image recognition to identify and predict pest issues</p>
            </div>
            <div className="p-4 sm:p-6 border rounded-xl sm:rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <h3 className="text-green-900 mb-2">Analytics Dashboard</h3>
              <p className="text-neutral-600 text-sm">Data visualization to track trends and optimize performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-green-900 mb-4">How AgriGuide AI Works</h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Simple steps to transform your farming operations
            </p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                1
              </div>
              <h3 className="text-green-900 mb-2">Input Farm Data</h3>
              <p className="text-neutral-600 text-sm">Share information about your location, soil type, and crops</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                2
              </div>
              <h3 className="text-green-900 mb-2">Get AI Recommendations</h3>
              <p className="text-neutral-600 text-sm">Receive personalized advice from our AI advisory engine</p>
            </div>
            <div className="text-center sm:col-span-2 md:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                3
              </div>
              <h3 className="text-green-900 mb-2">Track & Optimize</h3>
              <p className="text-neutral-600 text-sm">Monitor progress and continuously improve your yields</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-green-900 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="mb-4 sm:mb-6">Supporting Rwanda's Agricultural Transformation</h2>
              <p className="mb-4 sm:mb-6 text-green-100">
                AgriGuide AI aligns with Rwanda's vision of becoming a regional leader in smart agriculture technology, enhancing food security and productivity through digital innovation.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="mb-1">Increase Crop Yields</div>
                    <p className="text-green-200 text-sm">Data-driven insights help optimize farming practices</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="mb-1">Reduce Costs</div>
                    <p className="text-green-200 text-sm">Efficient resource management and early pest detection</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="mb-1">Accessible Anywhere</div>
                    <p className="text-green-200 text-sm">Mobile and web platforms reach rural and urban farmers</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="mb-1">Multilingual Support</div>
                    <p className="text-green-200 text-sm">Available in Kinyarwanda, English, and French</p>
                  </div>
                </div>
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

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-12 text-center text-white">
            <Globe className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6" />
            <h2 className="mb-3 sm:mb-4">Ready to Transform Your Farm?</h2>
            <p className="max-w-2xl mx-auto mb-6 sm:mb-8 text-green-50">
              Join thousands of farmers across Rwanda who are already using AgriGuide AI to improve their productivity and profitability.
            </p>
            <Button onClick={onLogin} size="lg" className="bg-white text-green-600 hover:bg-green-50 w-full sm:w-auto">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-green-600" />
                </div>
                <span>AgriGuide AI</span>
              </div>
              <p className="text-green-200 text-sm">Empowering farmers through AI-driven agricultural solutions</p>
            </div>
            <div>
              <div className="mb-3">Product</div>
              <div className="space-y-2 text-green-200 text-sm">
                <div>Features</div>
                <div>Pricing</div>
                <div>Mobile App</div>
                <div>API Access</div>
              </div>
            </div>
            <div>
              <div className="mb-3">Resources</div>
              <div className="space-y-2 text-green-200 text-sm">
                <div>Documentation</div>
                <div>Tutorials</div>
                <div>Support</div>
                <div>Blog</div>
              </div>
            </div>
            <div>
              <div className="mb-3">Company</div>
              <div className="space-y-2 text-green-200 text-sm">
                <div>About Us</div>
                <div>Careers</div>
                <div>Contact</div>
                <div>Privacy Policy</div>
              </div>
            </div>
          </div>
          <div className="border-t border-green-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-green-200 text-sm">
            © 2025 AgriGuide AI. All rights reserved. Made with ❤️ in Rwanda
          </div>
        </div>
      </footer>
    </div>
  );
}
