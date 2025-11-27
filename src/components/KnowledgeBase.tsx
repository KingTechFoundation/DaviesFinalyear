import { useState } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BookOpen, Video, Search, FileText, TrendingUp, DollarSign, Download, Play, ExternalLink, Star } from 'lucide-react';
import type { Screen } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface KnowledgeBaseProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function KnowledgeBase({ onNavigate, onLogout }: KnowledgeBaseProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const cropGuides = [
    {
      id: 1,
      title: 'Complete Guide to Maize Cultivation',
      description: 'Best practices for growing maize in Rwanda\'s climate zones',
      crops: ['Maize'],
      duration: '15 min read',
      downloads: 2340,
      rating: 4.8,
      offline: true,
    },
    {
      id: 2,
      title: 'Bean Farming for Maximum Yield',
      description: 'Comprehensive guide covering planting to harvest',
      crops: ['Beans'],
      duration: '12 min read',
      downloads: 1890,
      rating: 4.7,
      offline: true,
    },
    {
      id: 3,
      title: 'Irish Potato Production Manual',
      description: 'Highland potato farming techniques and disease management',
      crops: ['Potatoes'],
      duration: '18 min read',
      downloads: 1567,
      rating: 4.9,
      offline: false,
    },
    {
      id: 4,
      title: 'Organic Farming Methods',
      description: 'Natural pest control and soil enrichment strategies',
      crops: ['All Crops'],
      duration: '20 min read',
      downloads: 3201,
      rating: 4.6,
      offline: false,
    },
  ];

  const videoTutorials = [
    {
      id: 1,
      title: 'How to Perform Soil Testing',
      description: 'Step-by-step guide to testing your soil pH and nutrients',
      duration: '8:45',
      language: 'Kinyarwanda',
      views: 12450,
      thumbnail: 'https://images.unsplash.com/photo-1643474004250-05d73e1473e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBsZWFybmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjI3OTQ0MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 2,
      title: 'Drip Irrigation Installation',
      description: 'Setting up an efficient drip irrigation system',
      duration: '12:30',
      language: 'English',
      views: 8930,
      thumbnail: 'https://images.unsplash.com/photo-1651390216709-1efea22814ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMHZpZGVvJTIwdHV0b3JpYWx8ZW58MXx8fHwxNzYyNzk0NDE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 3,
      title: 'Identifying Pest Damage',
      description: 'Visual guide to common pest symptoms and treatments',
      duration: '10:15',
      language: 'French',
      views: 6720,
      thumbnail: 'https://images.unsplash.com/photo-1643474004250-05d73e1473e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXIlMjBsZWFybmluZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NjI3OTQ0MTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 4,
      title: 'Composting Techniques',
      description: 'Making high-quality organic compost for your farm',
      duration: '15:20',
      language: 'Kinyarwanda',
      views: 15230,
      thumbnail: 'https://images.unsplash.com/photo-1651390216709-1efea22814ad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyZSUyMHZpZGVvJTIwdHV0b3JpYWx8ZW58MXx8fHwxNzYyNzk0NDE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  const governmentSchemes = [
    {
      id: 1,
      title: 'Crop Intensification Program (CIP)',
      description: 'Government support for increased agricultural productivity',
      eligibility: 'All registered farmers',
      benefits: 'Subsidized fertilizers, seeds, and extension services',
      deadline: 'Rolling applications',
      type: 'Subsidy',
    },
    {
      id: 2,
      title: 'Rural Feeder Roads Development',
      description: 'Infrastructure improvement for market access',
      eligibility: 'Farmer cooperatives',
      benefits: 'Improved road access to farms and markets',
      deadline: 'December 31, 2025',
      type: 'Infrastructure',
    },
    {
      id: 3,
      title: 'Agricultural Insurance Scheme',
      description: 'Protect your crops against climate risks',
      eligibility: 'Farmers with >0.5 hectares',
      benefits: 'Compensation for weather-related losses',
      deadline: 'Before planting season',
      type: 'Insurance',
    },
    {
      id: 4,
      title: 'Mechanization Support Program',
      description: 'Access to modern farming equipment',
      eligibility: 'Cooperatives and large-scale farmers',
      benefits: 'Subsidized tractors and equipment rental',
      deadline: 'March 15, 2026',
      type: 'Equipment',
    },
  ];

  const marketPrices = [
    { crop: 'Maize', currentPrice: 350, change: '+5%', trend: 'up', unit: 'RWF/kg' },
    { crop: 'Beans', currentPrice: 800, change: '-2%', trend: 'down', unit: 'RWF/kg' },
    { crop: 'Irish Potatoes', currentPrice: 280, change: '+8%', trend: 'up', unit: 'RWF/kg' },
    { crop: 'Wheat', currentPrice: 420, change: '+3%', trend: 'up', unit: 'RWF/kg' },
    { crop: 'Rice', currentPrice: 950, change: '0%', trend: 'neutral', unit: 'RWF/kg' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="knowledge" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-green-900 mb-2">Knowledge Base & Resources</h1>
          <p className="text-neutral-600">Learn best practices and access agricultural information</p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for crop guides, videos, government schemes..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="guides" className="space-y-6">
          <TabsList>
            <TabsTrigger value="guides">Crop Guides</TabsTrigger>
            <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
            <TabsTrigger value="schemes">Government Schemes</TabsTrigger>
            <TabsTrigger value="market">Market Prices</TabsTrigger>
          </TabsList>

          {/* Crop Guides */}
          <TabsContent value="guides" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {cropGuides.map((guide) => (
                <Card key={guide.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-green-600" />
                          {guide.title}
                        </CardTitle>
                        <CardDescription className="mt-2">{guide.description}</CardDescription>
                      </div>
                      {guide.offline && (
                        <Badge className="bg-green-100 text-green-700">
                          <Download className="w-3 h-3 mr-1" />
                          Offline
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {guide.crops.map((crop, index) => (
                        <Badge key={index} variant="outline">{crop}</Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-neutral-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{guide.rating}</span>
                        </div>
                        <div>{guide.duration}</div>
                      </div>
                      <div>{guide.downloads} downloads</div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1 bg-green-600 hover:bg-green-700">
                        <FileText className="w-4 h-4 mr-2" />
                        Read Guide
                      </Button>
                      {!guide.offline && (
                        <Button variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Video Tutorials */}
          <TabsContent value="videos" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {videoTutorials.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="relative">
                    <ImageWithFallback
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-green-600 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="w-5 h-5 text-green-600" />
                      {video.title}
                    </CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-neutral-600">
                      <Badge variant="outline">{video.language}</Badge>
                      <div>{video.views.toLocaleString()} views</div>
                    </div>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Play className="w-4 h-4 mr-2" />
                      Watch Video
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Government Schemes */}
          <TabsContent value="schemes" className="space-y-6">
            <div className="space-y-4">
              {governmentSchemes.map((scheme) => (
                <Card key={scheme.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{scheme.title}</CardTitle>
                        <CardDescription className="mt-1">{scheme.description}</CardDescription>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">{scheme.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-neutral-600 mb-1">Eligibility</div>
                        <div className="text-neutral-900">{scheme.eligibility}</div>
                      </div>
                      <div>
                        <div className="text-neutral-600 mb-1">Benefits</div>
                        <div className="text-neutral-900">{scheme.benefits}</div>
                      </div>
                      <div>
                        <div className="text-neutral-600 mb-1">Application Deadline</div>
                        <div className="text-neutral-900">{scheme.deadline}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button className="bg-green-600 hover:bg-green-700">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                      <Button variant="outline">Learn More</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-neutral-900 mb-1">Need Help with Applications?</div>
                    <p className="text-neutral-700 mb-3">
                      Our AI assistant can help you understand eligibility requirements and guide you through the application process.
                    </p>
                    <Button onClick={() => onNavigate('assistant')} variant="outline" className="bg-white">
                      Ask AI Assistant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Prices */}
          <TabsContent value="market" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Current Market Prices - Kigali Wholesale Market
                </CardTitle>
                <CardDescription>Updated today at 10:00 AM • Prices in Rwandan Francs (RWF)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketPrices.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <span className="text-green-700">{item.crop.charAt(0)}</span>
                        </div>
                        <div>
                          <div className="text-neutral-900 mb-1">{item.crop}</div>
                          <div className="text-neutral-600">{item.unit}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-neutral-900">
                            {item.currentPrice} RWF
                          </div>
                          <div className={`flex items-center gap-1 ${
                            item.trend === 'up' ? 'text-green-600' :
                            item.trend === 'down' ? 'text-red-600' :
                            'text-neutral-600'
                          }`}>
                            {item.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                            {item.trend === 'down' && <TrendingUp className="w-4 h-4 transform rotate-180" />}
                            <span>{item.change}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-600 mb-2">Highest Price Today</div>
                  <div className="text-neutral-900 mb-1">Rice - 950 RWF/kg</div>
                  <p className="text-neutral-600">Stable pricing</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-600 mb-2">Best Performer</div>
                  <div className="text-neutral-900 mb-1">Irish Potatoes</div>
                  <p className="text-green-600">+8% this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-600 mb-2">Market Trend</div>
                  <div className="text-neutral-900 mb-1">Generally Positive</div>
                  <p className="text-neutral-600">4 of 5 crops rising</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <div className="text-neutral-900 mb-1">Price Alert Recommendations</div>
                    <p className="text-neutral-700">
                      Irish potato prices are rising (+8%). Consider harvesting earlier if your crop is ready. Maize prices are stable - good time to sell stored produce.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
