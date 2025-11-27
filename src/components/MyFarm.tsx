import { useState } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Plus, Edit2, Trash2, Calendar, Sprout, TrendingUp, Activity } from 'lucide-react';
import type { Screen } from '../App';

interface MyFarmProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function MyFarm({ onNavigate, onLogout }: MyFarmProps) {
  const [farms, setFarms] = useState([
    {
      id: 1,
      name: 'Main Farm',
      location: 'Musanze District, Northern Province',
      size: 2.0,
      unit: 'hectares',
      coordinates: '-1.5008, 29.6346',
      soilType: 'Clay Loam',
      plots: 3,
    },
    {
      id: 2,
      name: 'Valley Plot',
      location: 'Musanze District, Northern Province',
      size: 0.5,
      unit: 'hectares',
      coordinates: '-1.5012, 29.6350',
      soilType: 'Sandy Loam',
      plots: 1,
    },
  ]);

  const currentCrops = [
    {
      id: 1,
      crop: 'Maize',
      variety: 'Hybrid ZM521',
      plot: 'Main Farm - Plot A',
      area: 1.2,
      plantingDate: '2025-10-20',
      expectedHarvest: '2026-01-10',
      growthStage: 'Vegetative',
      health: 'Excellent',
      progress: 65,
    },
    {
      id: 2,
      crop: 'Common Beans',
      variety: 'RWR 2245',
      plot: 'Main Farm - Plot B',
      area: 0.5,
      plantingDate: '2025-11-03',
      expectedHarvest: '2026-01-25',
      growthStage: 'Germination',
      health: 'Good',
      progress: 25,
    },
    {
      id: 3,
      crop: 'Irish Potatoes',
      variety: 'Kinigi',
      plot: 'Valley Plot',
      area: 0.3,
      plantingDate: '2025-10-25',
      expectedHarvest: '2026-01-20',
      growthStage: 'Tuber Formation',
      health: 'Excellent',
      progress: 55,
    },
  ];

  const inputHistory = [
    {
      date: '2025-11-08',
      crop: 'Maize',
      input: 'Neem Oil (Organic Pesticide)',
      quantity: '500ml',
      purpose: 'Aphid treatment',
    },
    {
      date: '2025-11-05',
      crop: 'Maize',
      input: 'NPK 17-17-17',
      quantity: '25kg',
      purpose: 'Top dressing',
    },
    {
      date: '2025-11-03',
      crop: 'Beans',
      input: 'DAP Fertilizer',
      quantity: '10kg',
      purpose: 'Basal application',
    },
    {
      date: '2025-10-25',
      crop: 'Potatoes',
      input: 'Compost',
      quantity: '200kg',
      purpose: 'Soil amendment',
    },
  ];

  const cropCalendar = [
    { month: 'Nov', activity: 'Fertilization', crops: ['Maize', 'Beans'] },
    { month: 'Nov', activity: 'Weeding', crops: ['All Crops'] },
    { month: 'Dec', activity: 'Pest Monitoring', crops: ['All Crops'] },
    { month: 'Dec', activity: 'Flowering Stage', crops: ['Maize'] },
    { month: 'Jan', activity: 'Harvesting', crops: ['Maize', 'Beans', 'Potatoes'] },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="farm" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-green-900 mb-2">My Farm & Crops</h1>
            <p className="text-neutral-600">Manage your farms, plots, and track all crop activities</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            Add New Farm
          </Button>
        </div>

        <Tabs defaultValue="farms" className="space-y-6">
          <TabsList>
            <TabsTrigger value="farms">Farm Profile</TabsTrigger>
            <TabsTrigger value="crops">Current Crops</TabsTrigger>
            <TabsTrigger value="calendar">Crop Calendar</TabsTrigger>
            <TabsTrigger value="inputs">Input Tracking</TabsTrigger>
          </TabsList>

          {/* Farm Profile */}
          <TabsContent value="farms" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {farms.map((farm) => (
                <Card key={farm.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{farm.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {farm.location}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-neutral-600 mb-1">Total Area</div>
                        <div className="text-neutral-900">{farm.size} {farm.unit}</div>
                      </div>
                      <div>
                        <div className="text-neutral-600 mb-1">Active Plots</div>
                        <div className="text-neutral-900">{farm.plots} plots</div>
                      </div>
                      <div>
                        <div className="text-neutral-600 mb-1">Soil Type</div>
                        <div className="text-neutral-900">{farm.soilType}</div>
                      </div>
                      <div>
                        <div className="text-neutral-600 mb-1">Coordinates</div>
                        <div className="text-neutral-900">{farm.coordinates}</div>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <MapPin className="w-4 h-4 mr-2" />
                      View on Map
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Add New Farm Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Farm/Plot</CardTitle>
                <CardDescription>Expand your farming portfolio by adding another location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farm-name">Farm Name</Label>
                    <Input id="farm-name" placeholder="e.g., Highland Plot" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="District, Province" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Farm Size</Label>
                    <Input id="size" type="number" placeholder="2.0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <select id="unit" className="w-full px-3 py-2 border rounded-lg bg-white">
                      <option>Hectares</option>
                      <option>Acres</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soil-type">Soil Type</Label>
                    <select id="soil-type" className="w-full px-3 py-2 border rounded-lg bg-white">
                      <option>Clay Loam</option>
                      <option>Sandy Loam</option>
                      <option>Silt Loam</option>
                      <option>Clay</option>
                      <option>Sandy</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coordinates">GPS Coordinates (Optional)</Label>
                    <Input id="coordinates" placeholder="-1.5008, 29.6346" />
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button className="bg-green-600 hover:bg-green-700">Save Farm</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Current Crops */}
          <TabsContent value="crops" className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Crop
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {currentCrops.map((crop) => (
                <Card key={crop.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Sprout className="w-5 h-5 text-green-600" />
                          {crop.crop}
                        </CardTitle>
                        <CardDescription className="mt-1">{crop.variety}</CardDescription>
                      </div>
                      <Badge className={
                        crop.health === 'Excellent' ? 'bg-green-100 text-green-700' :
                        crop.health === 'Good' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }>
                        {crop.health}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-neutral-600">
                      <div>
                        <div className="mb-1">Plot Location</div>
                        <div className="text-neutral-900">{crop.plot}</div>
                      </div>
                      <div>
                        <div className="mb-1">Cultivated Area</div>
                        <div className="text-neutral-900">{crop.area} ha</div>
                      </div>
                      <div>
                        <div className="mb-1">Planted</div>
                        <div className="text-neutral-900">{crop.plantingDate}</div>
                      </div>
                      <div>
                        <div className="mb-1">Expected Harvest</div>
                        <div className="text-neutral-900">{crop.expectedHarvest}</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-neutral-600">Growth Stage: {crop.growthStage}</span>
                        <span className="text-neutral-900">{crop.progress}%</span>
                      </div>
                      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600 rounded-full transition-all"
                          style={{ width: `${crop.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Activity className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit2 className="w-4 h-4 mr-1" />
                        Update
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Crop Calendar */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Visual Crop Calendar
                </CardTitle>
                <CardDescription>Timeline for planting, fertilizing, and harvesting activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cropCalendar.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-xl">
                      <div className="w-16 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-1">
                          <span className="text-green-700">{item.month}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-neutral-900 mb-2">{item.activity}</div>
                        <div className="flex flex-wrap gap-2">
                          {item.crops.map((crop, cropIndex) => (
                            <Badge key={cropIndex} variant="outline">
                              {crop}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Season Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-600 mb-2">Current Season</div>
                  <div className="text-neutral-900 mb-1">Season A 2025/2026</div>
                  <p className="text-neutral-600">Oct 2025 - Jan 2026</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-600 mb-2">Active Crops</div>
                  <div className="text-neutral-900 mb-1">3 Crops</div>
                  <p className="text-neutral-600">Across 2.0 hectares</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-600 mb-2">Next Activity</div>
                  <div className="text-neutral-900 mb-1">Fertilization</div>
                  <p className="text-neutral-600">In 2 days</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Input Tracking */}
          <TabsContent value="inputs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Input Application History</CardTitle>
                    <CardDescription>Track fertilizers, pesticides, and amendments used</CardDescription>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Log New Input
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inputHistory.map((entry, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 border rounded-xl hover:shadow-md transition-shadow">
                      <div className="w-20 text-center">
                        <div className="text-neutral-600">Date</div>
                        <div className="text-neutral-900">{entry.date}</div>
                      </div>
                      <div className="flex-1 grid md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-neutral-600 mb-1">Crop</div>
                          <div className="text-neutral-900">{entry.crop}</div>
                        </div>
                        <div>
                          <div className="text-neutral-600 mb-1">Input Used</div>
                          <div className="text-neutral-900">{entry.input}</div>
                        </div>
                        <div>
                          <div className="text-neutral-600 mb-1">Quantity</div>
                          <div className="text-neutral-900">{entry.quantity}</div>
                        </div>
                        <div>
                          <div className="text-neutral-600 mb-1">Purpose</div>
                          <div className="text-neutral-900">{entry.purpose}</div>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Input Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Input Summary - Season A</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-green-700 mb-2">Total Fertilizer Used</div>
                    <div className="text-neutral-900">35 kg</div>
                    <p className="text-neutral-600">NPK, DAP</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-blue-700 mb-2">Organic Amendments</div>
                    <div className="text-neutral-900">200 kg</div>
                    <p className="text-neutral-600">Compost</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <div className="text-orange-700 mb-2">Pesticides Applied</div>
                    <div className="text-neutral-900">500 ml</div>
                    <p className="text-neutral-600">Neem Oil</p>
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
