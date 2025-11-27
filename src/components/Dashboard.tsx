import { useEffect } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { TrendingUp, TrendingDown, Droplets, ThermometerSun, Wind, Sprout, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { DataCache, CACHE_KEYS } from '../utils/dataCache';
import type { Screen } from '../App';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function Dashboard({ onNavigate, onLogout }: DashboardProps) {
  // Cache dashboard data for offline access
  useEffect(() => {
    const dashboardData = {
      stats,
      recentActivities,
      lastUpdated: new Date().toISOString(),
    };
    DataCache.set('dashboard_data', dashboardData, 60); // Cache for 60 minutes
  }, []);

  const stats = [
    {
      title: 'Active Crops',
      value: '3',
      change: '+1 this season',
      trending: 'up' as const,
      icon: Sprout,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Soil Health',
      value: '87%',
      change: '+5% from last month',
      trending: 'up' as const,
      icon: CheckCircle2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Weather Alert',
      value: 'Rain Expected',
      change: 'Next 48 hours',
      trending: 'neutral' as const,
      icon: Droplets,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pest Risk',
      value: 'Low',
      change: 'No action needed',
      trending: 'down' as const,
      icon: AlertCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  const recentActivities = [
    { id: 1, action: 'AI Advisory received for maize crop', time: '2 hours ago', type: 'info' },
    { id: 2, action: 'Soil analysis completed - pH optimal', time: '5 hours ago', type: 'success' },
    { id: 3, action: 'Weather update: Rain forecast updated', time: '1 day ago', type: 'warning' },
    { id: 4, action: 'Pest detection scan completed', time: '2 days ago', type: 'success' },
  ];

  const quickActions = [
    { label: 'Chat with AI Assistant', screen: 'assistant' as Screen, icon: 'Bot' },
    { label: 'Analyze Soil', screen: 'soil' as Screen, icon: 'Leaf' },
    { label: 'Check Weather', screen: 'weather' as Screen, icon: 'Cloud' },
    { label: 'Detect Pests', screen: 'pest' as Screen, icon: 'Bug' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="dashboard" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="mb-2">Welcome back, Muhabwe Davies!</h1>
              <p className="text-green-50 text-sm sm:text-base">Your farm in Musanze District is performing well this season</p>
              <div className="mt-4 flex flex-wrap gap-3 sm:gap-4 text-sm sm:text-base">
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4" />
                  <span>Main Farm • 2.0 hectares</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>•</span>
                  <span>3 Active Crops</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 lg:text-center">
              <div>
                <div className="text-green-50 text-xs sm:text-sm">Temperature</div>
                <div className="flex items-center gap-2">
                  <ThermometerSun className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>24°C</span>
                </div>
              </div>
              <div>
                <div className="text-green-50 text-xs sm:text-sm">Humidity</div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>65%</span>
                </div>
              </div>
              <div>
                <div className="text-green-50 text-xs sm:text-sm">Wind</div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>12 km/h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                    </div>
                    {stat.trending === 'up' && <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />}
                    {stat.trending === 'down' && <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />}
                  </div>
                  <div className="text-neutral-600 mb-1 text-sm">{stat.title}</div>
                  <div className="text-neutral-900 mb-1">{stat.value}</div>
                  <div className="text-neutral-500 text-sm">{stat.change}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Quick Actions */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Access key features instantly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-between text-sm sm:text-base h-auto py-3"
                  onClick={() => onNavigate(action.screen)}
                >
                  <span>{action.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your farm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 sm:gap-4 p-3 rounded-lg border">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'success' ? 'bg-green-500' :
                      activity.type === 'warning' ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-neutral-900 text-sm sm:text-base">{activity.action}</div>
                      <div className="text-neutral-500 text-xs sm:text-sm">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Farming Plan Preview */}
        <Card className="mt-6 sm:mt-8">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Current Farming Plan</CardTitle>
                <CardDescription>Your personalized agricultural roadmap</CardDescription>
              </div>
              <Button onClick={() => onNavigate('plan')} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                View Full Plan
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="text-green-700 mb-2 text-sm">Next Task</div>
                <div className="text-neutral-900 mb-1">Apply Fertilizer</div>
                <div className="text-neutral-600 text-sm">Maize crop - Due in 2 days</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="text-blue-700 mb-2 text-sm">Upcoming</div>
                <div className="text-neutral-900 mb-1">Irrigation Check</div>
                <div className="text-neutral-600 text-sm">Bean crop - Due in 5 days</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="text-purple-700 mb-2 text-sm">This Week</div>
                <div className="text-neutral-900 mb-1">Pest Monitoring</div>
                <div className="text-neutral-600 text-sm">All crops - Ongoing</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}