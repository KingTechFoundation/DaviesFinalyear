import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Sprout, Droplets, ThermometerSun, Wind, AlertCircle, 
  CheckCircle2, ArrowRight, Bot, Leaf, Bug, FileText, 
  Cloud, Calendar, LayoutDashboard, Settings, MapPin 
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { analyticsAPI } from '../services/api';
import { toast } from 'sonner';

interface FarmerDashboardProps {
  onNavigate: (screen: any) => void;
}

// Icon mapping for dynamic data
const iconMap: Record<string, any> = {
  Sprout, Droplets, ThermometerSun, Wind, AlertCircle, 
  CheckCircle2, Bot, Leaf, Bug, FileText, Cloud, Calendar
};

export function FarmerDashboard({ onNavigate }: FarmerDashboardProps) {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem('agriguide_user') || '{}');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardData = await analyticsAPI.getFarmerDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error('Error fetching dashboard:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const features = [
    { id: 'assistant', title: t.landing.features.aiTitle, desc: t.landing.features.aiDesc, icon: Bot, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { id: 'soil', title: t.landing.features.soilTitle, desc: t.landing.features.soilDesc, icon: Leaf, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'weather', title: t.landing.features.weatherTitle, desc: t.landing.features.weatherDesc, icon: Cloud, color: 'text-sky-600', bgColor: 'bg-sky-50' },
    { id: 'pest', title: t.landing.features.pestTitle, desc: t.landing.features.pestDesc, icon: Bug, color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const dashboardStats = data?.stats || [];
  const activities = data?.activities || [];
  const upcomingTasks = data?.upcomingTasks || [];
  const weather = data?.weather;
  const farmStats = data?.farmStats;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-900/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-emerald-50/80 text-sm sm:text-base max-w-xl">
              Your farm in {farmStats?.location || user.farmLocation || 'Musanze District'} is performing well this season. 
              {upcomingTasks.length > 0 ? ` You have ${upcomingTasks.length} pending tasks for this week.` : ' All your tasks are up to date!'}
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
                <MapPin className="w-4 h-4" /> <span>{farmStats?.totalArea || 0} hectares</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full backdrop-blur-sm border border-white/10">
                <Sprout className="w-4 h-4" /> <span>{farmStats?.activeCrops || 0} Active Crops</span>
              </div>
            </div>
          </div>
          
          {weather && (
            <div className="flex items-center gap-8 px-6 py-4 bg-black/10 rounded-2xl backdrop-blur-md border border-white/5">
              <div className="text-center">
                <div className="text-emerald-100/60 text-xs mb-1 uppercase tracking-wider">Temp</div>
                <div className="flex items-center gap-2 font-bold text-xl"><ThermometerSun className="w-5 h-5" /> {weather.temp}°C</div>
              </div>
              <div className="text-center">
                <div className="text-emerald-100/60 text-xs mb-1 uppercase tracking-wider">Humidity</div>
                <div className="flex items-center gap-2 font-bold text-xl"><Droplets className="w-5 h-5" /> {weather.humidity}%</div>
              </div>
              <div className="text-center">
                <div className="text-emerald-100/60 text-xs mb-1 uppercase tracking-wider">Wind</div>
                <div className="flex items-center gap-2 font-bold text-xl"><Wind className="w-5 h-5" /> {weather.wind} km/h</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {dashboardStats.map((stat: any) => {
          const Icon = iconMap[stat.icon] || Sprout;
          const labelMapping: Record<string, string> = {
            'Farms': 'farms',
            'Soil Health': 'soilHealth',
            'Active Crops': 'activeCrops',
            'Pest Risk': 'pestRisk'
          };
          const labelKey = labelMapping[stat.title] || stat.title.toLowerCase().replace(/\s+/g, '');
          
          return (
            <Card key={stat.title} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-gray-500 text-sm font-medium mb-1">
                  {(t.dashboard as any)[labelKey] || stat.title}
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-emerald-600 text-xs font-semibold">{stat.change}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Key Modules */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((f) => (
          <button key={f.id} onClick={() => onNavigate(f.id)} 
            className="text-left group bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all">
            <div className={`w-12 h-12 rounded-xl ${f.bgColor} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
              <f.icon className={`w-6 h-6 ${f.color}`} />
            </div>
            <h3 className="text-gray-900 font-bold mb-2 group-hover:text-emerald-600 transition-colors">{f.title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest updates from your farm operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {activities.length > 0 ? (
              activities.map((a: any, i: number) => {
                const Icon = iconMap[a.icon] || CheckCircle2;
                return (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white shadow-sm`}>
                      <Icon className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900">{a.text}</div>
                      <div className="text-[11px] text-gray-500">{new Date(a.time).toLocaleDateString()}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-xl border-gray-100">
                No recent activity recorded yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Farming Plan */}
        <Card className="border-none shadow-sm bg-emerald-50/30">
          <CardHeader>
            <CardTitle className="text-lg">Your Farming Plan</CardTitle>
            <CardDescription>Upcoming tasks and milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((p: any, i: number) => (
                <div key={i} className="relative pl-4 border-l-2 border-emerald-200">
                  <div className={`absolute left-[-5px] top-1 w-2 h-2 rounded-full ${p.color.replace('text-', 'bg-')}`} />
                  <div className="text-sm font-bold text-gray-900">{p.title}</div>
                  <div className="text-xs text-gray-500">{p.sub}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-400 text-xs">
                No upcoming tasks.
              </div>
            )}
            <Button onClick={() => onNavigate('plan')} className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700">View Full Schedule</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
