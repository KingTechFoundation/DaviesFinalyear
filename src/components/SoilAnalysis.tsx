import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Leaf, TrendingUp, AlertCircle, CheckCircle2, Droplets, Zap, Beaker } from 'lucide-react';
import type { Screen } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SoilAnalysisProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function SoilAnalysis({ onNavigate, onLogout }: SoilAnalysisProps) {
  const soilMetrics = [
    { label: 'pH Level', value: 6.5, optimal: '6.0-7.0', status: 'good', progress: 75 },
    { label: 'Nitrogen (N)', value: 45, optimal: '40-60 mg/kg', status: 'good', progress: 70 },
    { label: 'Phosphorus (P)', value: 28, optimal: '25-50 mg/kg', status: 'good', progress: 56 },
    { label: 'Potassium (K)', value: 180, optimal: '150-250 mg/kg', status: 'good', progress: 65 },
    { label: 'Organic Matter', value: 3.2, optimal: '3-5%', status: 'good', progress: 64 },
    { label: 'Moisture', value: 22, optimal: '20-30%', status: 'good', progress: 73 },
  ];

  const recommendedCrops = [
    {
      name: 'Maize (Corn)',
      suitability: 95,
      yield: '4.5-6 tons/hectare',
      season: 'Season A & B',
      color: 'bg-green-500',
    },
    {
      name: 'Common Beans',
      suitability: 90,
      yield: '1.2-1.8 tons/hectare',
      season: 'Season A & B',
      color: 'bg-green-400',
    },
    {
      name: 'Irish Potatoes',
      suitability: 88,
      yield: '15-25 tons/hectare',
      season: 'Season A',
      color: 'bg-blue-500',
    },
    {
      name: 'Wheat',
      suitability: 85,
      yield: '2.5-3.5 tons/hectare',
      season: 'Season B',
      color: 'bg-orange-500',
    },
  ];

  const recommendations = [
    {
      title: 'Maintain Current pH',
      description: 'Your soil pH is optimal. Continue current management practices.',
      priority: 'low',
      icon: CheckCircle2,
    },
    {
      title: 'Boost Phosphorus',
      description: 'Consider adding rock phosphate or compost to increase P levels.',
      priority: 'medium',
      icon: AlertCircle,
    },
    {
      title: 'Organic Matter Enhancement',
      description: 'Add 2-3 tons of compost per hectare to improve soil structure.',
      priority: 'high',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="soil" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-green-900 mb-2">Soil & Crop Analysis</h1>
            <p className="text-neutral-600">Comprehensive soil health assessment and crop recommendations</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Beaker className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
        </div>

        {/* Overview Banner */}
        <Card className="mb-8 bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-green-100 mb-1">Overall Health</div>
                <div className="flex items-center gap-2">
                  <div>Excellent</div>
                  <Badge className="bg-green-400 text-green-900">87%</Badge>
                </div>
              </div>
              <div>
                <div className="text-green-100 mb-1">Soil Type</div>
                <div>Clay Loam</div>
              </div>
              <div>
                <div className="text-green-100 mb-1">Location</div>
                <div>Musanze, Northern Province</div>
              </div>
              <div>
                <div className="text-green-100 mb-1">Last Analysis</div>
                <div>November 5, 2025</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Soil Metrics */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Soil Composition Analysis
                </CardTitle>
                <CardDescription>Detailed breakdown of soil nutrients and properties</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {soilMetrics.map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="text-neutral-900">{metric.label}</div>
                        <div className="text-neutral-500">
                          {metric.value} • Optimal: {metric.optimal}
                        </div>
                      </div>
                      <Badge variant={metric.status === 'good' ? 'default' : 'secondary'} 
                             className={metric.status === 'good' ? 'bg-green-100 text-green-700' : ''}>
                        {metric.status === 'good' ? 'Optimal' : 'Needs Attention'}
                      </Badge>
                    </div>
                    <Progress value={metric.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommended Crops */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Crops</CardTitle>
                <CardDescription>AI-powered crop suggestions based on your soil profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedCrops.map((crop) => (
                    <div key={crop.name} className="p-4 border rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="text-neutral-900 mb-1">{crop.name}</div>
                          <div className="text-neutral-600">Expected Yield: {crop.yield}</div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          {crop.suitability}% Match
                        </Badge>
                      </div>
                      <div className="mb-2">
                        <Progress value={crop.suitability} className="h-2" />
                      </div>
                      <div className="text-neutral-600">Planting Season: {crop.season}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Visual Reference */}
            <Card>
              <CardHeader>
                <CardTitle>Soil Sample</CardTitle>
              </CardHeader>
              <CardContent>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1599320092708-8a9dde49fc2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2lsJTIwYWdyaWN1bHR1cmUlMjBoYW5kc3xlbnwxfHx8fDE3NjI3OTMzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Soil sample"
                  className="w-full rounded-lg mb-4"
                />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Texture</span>
                    <span className="text-neutral-900">Clay Loam</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Color</span>
                    <span className="text-neutral-900">Dark Brown</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Drainage</span>
                    <span className="text-neutral-900">Good</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec, index) => {
                  const Icon = rec.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        rec.priority === 'high' ? 'bg-orange-100' :
                        rec.priority === 'medium' ? 'bg-blue-100' :
                        'bg-green-100'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          rec.priority === 'high' ? 'text-orange-600' :
                          rec.priority === 'medium' ? 'text-blue-600' :
                          'text-green-600'
                        }`} />
                      </div>
                      <div>
                        <div className="text-neutral-900 mb-1">{rec.title}</div>
                        <div className="text-neutral-600">{rec.description}</div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Droplets className="w-4 h-4 mr-2" />
                  View Fertilizer Plan
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Zap className="w-4 h-4 mr-2" />
                  Get Crop Calendar
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('assistant')}>
                  <Leaf className="w-4 h-4 mr-2" />
                  Ask AI Assistant
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
