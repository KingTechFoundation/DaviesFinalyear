import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart3, TrendingUp, Users, MapPin, Sprout, DollarSign, Calendar } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ExportButton } from './ExportButton';
import type { Screen } from '../App';

interface AnalyticsProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function Analytics({ onNavigate, onLogout }: AnalyticsProps) {
  const yieldData = [
    { month: 'Jun', maize: 4.2, beans: 1.5, potatoes: 18 },
    { month: 'Jul', maize: 4.5, beans: 1.6, potatoes: 20 },
    { month: 'Aug', maize: 5.1, beans: 1.7, potatoes: 22 },
    { month: 'Sep', maize: 5.3, beans: 1.8, potatoes: 23 },
    { month: 'Oct', maize: 5.8, beans: 1.9, potatoes: 24 },
    { month: 'Nov', maize: 6.0, beans: 2.0, potatoes: 25 },
  ];

  const cropDistribution = [
    { name: 'Maize', value: 40, color: '#16a34a' },
    { name: 'Beans', value: 25, color: '#2563eb' },
    { name: 'Potatoes', value: 20, color: '#f59e0b' },
    { name: 'Wheat', value: 15, color: '#8b5cf6' },
  ];

  const adoptionRate = [
    { month: 'Jan', users: 1200 },
    { month: 'Feb', users: 1850 },
    { month: 'Mar', users: 2400 },
    { month: 'Apr', users: 3200 },
    { month: 'May', users: 4100 },
    { month: 'Jun', users: 5300 },
  ];

  const regionData = [
    { region: 'Northern Province', farmers: 15234, yield: '+28%' },
    { region: 'Southern Province', farmers: 12456, yield: '+24%' },
    { region: 'Eastern Province', farmers: 11890, yield: '+21%' },
    { region: 'Western Province', farmers: 10123, yield: '+26%' },
    { region: 'Kigali City', farmers: 3456, yield: '+18%' },
  ];

  const kpis = [
    {
      title: 'Total Farmers',
      value: '53,159',
      change: '+12.5%',
      icon: Users,
      trend: 'up',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Avg Yield Increase',
      value: '35%',
      change: '+8% from last year',
      icon: TrendingUp,
      trend: 'up',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Regions',
      value: '30',
      change: 'All districts covered',
      icon: MapPin,
      trend: 'neutral',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Economic Impact',
      value: 'RWF 2.4B',
      change: '+18% this quarter',
      icon: DollarSign,
      trend: 'up',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const topPerformers = [
    { name: 'Jean-Claude Mugabo', district: 'Musanze', yield: '+45%', crops: 'Maize, Potatoes' },
    { name: 'Marie Uwera', district: 'Huye', yield: '+42%', crops: 'Beans, Wheat' },
    { name: 'Emmanuel Habimana', district: 'Nyagatare', yield: '+40%', crops: 'Maize, Beans' },
    { name: 'Chantal Mukeshimana', district: 'Rubavu', yield: '+38%', crops: 'Potatoes, Wheat' },
    { name: 'Patrick Nkusi', district: 'Rwamagana', yield: '+37%', crops: 'Maize, Beans' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="analytics" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-green-900 mb-2">Analytics Dashboard</h1>
            <p className="text-neutral-600">Comprehensive insights for policymakers and agronomists</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select className="px-3 sm:px-4 py-2 border rounded-lg bg-white text-sm">
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
            <select className="px-3 sm:px-4 py-2 border rounded-lg bg-white text-sm">
              <option>All Regions</option>
              <option>Northern Province</option>
              <option>Southern Province</option>
              <option>Eastern Province</option>
              <option>Western Province</option>
            </select>
            <ExportButton 
              data={{ kpis, yieldData, regionData, topPerformers }} 
              filename="analytics-report"
              title="AgriGuide Analytics Report"
            />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.title}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${kpi.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${kpi.color}`} />
                    </div>
                    {kpi.trend === 'up' && (
                      <Badge className="bg-green-100 text-green-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {kpi.change}
                      </Badge>
                    )}
                  </div>
                  <div className="text-neutral-600 mb-1">{kpi.title}</div>
                  <div className="text-neutral-900">{kpi.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="adoption">Adoption</TabsTrigger>
            <TabsTrigger value="regional">Regional Data</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Yield Trends */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Crop Yield Trends (tons/hectare)</CardTitle>
                  <CardDescription>6-month performance comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={yieldData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="maize" stroke="#16a34a" strokeWidth={2} name="Maize" />
                      <Line type="monotone" dataKey="beans" stroke="#2563eb" strokeWidth={2} name="Beans" />
                      <Line type="monotone" dataKey="potatoes" stroke="#f59e0b" strokeWidth={2} name="Potatoes" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Crop Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Crop Distribution</CardTitle>
                  <CardDescription>By cultivated area</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={cropDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {cropDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {cropDistribution.map((crop) => (
                      <div key={crop.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: crop.color }} />
                          <span className="text-neutral-700">{crop.name}</span>
                        </div>
                        <span className="text-neutral-900">{crop.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="w-5 h-5 text-green-600" />
                  Top Performing Farmers
                </CardTitle>
                <CardDescription>Highest yield improvements this season</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topPerformers.map((farmer, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-xl hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-green-700">#{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-neutral-900 mb-1">{farmer.name}</div>
                        <div className="text-neutral-600">{farmer.district} • {farmer.crops}</div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {farmer.yield}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="adoption" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Adoption Rate</CardTitle>
                <CardDescription>Number of active farmers over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={adoptionRate}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" fill="#16a34a" name="Active Users" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-600 mb-2">Monthly Growth Rate</div>
                  <div className="text-neutral-900 mb-1">+24.3%</div>
                  <p className="text-neutral-600">Consistent month-over-month growth</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-600 mb-2">User Retention</div>
                  <div className="text-neutral-900 mb-1">87%</div>
                  <p className="text-neutral-600">Farmers actively using the platform</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-600 mb-2">Daily Active Users</div>
                  <div className="text-neutral-900 mb-1">12,450</div>
                  <p className="text-neutral-600">Average daily engagement</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regional" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Performance Overview</CardTitle>
                <CardDescription>Adoption and yield improvement by province</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regionData.map((region, index) => (
                    <div key={index} className="p-4 border rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="text-neutral-900">{region.region}</div>
                            <div className="text-neutral-600">{region.farmers.toLocaleString()} farmers</div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {region.yield}
                        </Badge>
                      </div>
                      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600 rounded-full"
                          style={{ width: `${(region.farmers / 15234) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Economic Impact</CardTitle>
                  <CardDescription>Financial benefits to farmers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-neutral-700">Total Revenue Increase</span>
                    <span className="text-neutral-900">RWF 2.4B</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-neutral-700">Cost Savings</span>
                    <span className="text-neutral-900">RWF 680M</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-neutral-700">Avg Income per Farmer</span>
                    <span className="text-neutral-900">+RWF 45,200</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Environmental Impact</CardTitle>
                  <CardDescription>Sustainability metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-neutral-700">Water Saved</span>
                    <span className="text-neutral-900">1.2M liters</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-neutral-700">Pesticide Reduction</span>
                    <span className="text-neutral-900">-28%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <span className="text-neutral-700">Soil Health Improvement</span>
                    <span className="text-neutral-900">+32%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Food Security Contribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-neutral-50 rounded-xl">
                    <div className="text-neutral-900 mb-1">Additional Production</div>
                    <div className="text-neutral-600">45,000 tons</div>
                  </div>
                  <div className="text-center p-4 bg-neutral-50 rounded-xl">
                    <div className="text-neutral-900 mb-1">Households Fed</div>
                    <div className="text-neutral-600">125,000+</div>
                  </div>
                  <div className="text-center p-4 bg-neutral-50 rounded-xl">
                    <div className="text-neutral-900 mb-1">Malnutrition Reduction</div>
                    <div className="text-neutral-600">-15%</div>
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
