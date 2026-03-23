import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BarChart3, Globe, ShieldCheck, TrendingUp, Map, Download, FileText, Calendar, Droplets } from 'lucide-react';
import { analyticsAPI } from '../services/api';
import { toast } from 'sonner';

import { useTranslation } from '../i18n/LanguageContext';

interface PolicymakerDashboardProps {
  onNavigate: (screen: any) => void;
}

const iconMap: Record<string, any> = {
  BarChart3, Globe, ShieldCheck, TrendingUp, Map, Download, FileText, Calendar, Droplets
};

export function PolicymakerDashboard({ onNavigate }: PolicymakerDashboardProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const dashboardData = await analyticsAPI.getPolicymakerDashboard();
        setData(dashboardData);
      } catch (error) {
        console.error('Error fetching policymaker dashboard:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const stats = data?.stats || [];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">National Agricultural Analytics</h1>
          <p className="text-gray-500 text-sm">Strategic planning and decision support system</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 h-10">
            <Calendar className="w-4 h-4" /> Period: Q1 2025
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 h-10 gap-2">
            <Download className="w-4 h-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((s: any, i: number) => {
          const Icon = iconMap[s.icon] || TrendingUp;
          const labelMapping: Record<string, string> = {
            'National Farmers': 'nationalFarmers',
            'Registered Farms': 'registeredFarms',
            'Digital Adoption': 'digitalAdoption',
            'Agri-Land (ha)': 'agriLand'
          };
          const labelKey = labelMapping[s.title] || s.title.toLowerCase().replace(/\s+/g, '');
          
          return (
            <Card key={i} className="border-none shadow-sm">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${s.bgColor} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div className="text-gray-500 text-sm font-medium mb-1">
                  {(t.dashboard as any)[labelKey] || s.title}
                </div>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-emerald-600 text-xs mt-1 font-semibold">{s.change}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Regional Insights */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Regional Production Distribution</CardTitle>
            <CardDescription>Comparison of crop yields across provinces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 py-2">
              {[
                { province: 'Northern Province', yield: 'Irish Potatoes, Maize', value: 85 },
                { province: 'Eastern Province', yield: 'Beans, Banana, Rice', value: 72 },
                { province: 'Southern Province', yield: 'Coffee, Cassava', value: 68 },
                { province: 'Western Province', yield: 'Tea, Irish Potatoes', value: 79 },
              ].map((r, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-sm font-bold text-gray-900">{r.province}</div>
                      <div className="text-xs text-gray-500">Main Crops: {r.yield}</div>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">{r.value}% Goal</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${r.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Policy Impact */}
        <Card className="border-none shadow-sm bg-blue-50/20">
          <CardHeader>
            <CardTitle className="text-lg">Policy Compliance</CardTitle>
            <CardDescription>Smart agriculture program reach</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-white rounded-2xl border border-blue-100">
              <div className="text-xs text-blue-600 font-bold uppercase tracking-widest mb-1">Target Achievement</div>
              <div className="text-2xl font-black text-gray-900">88.4%</div>
              <p className="text-[11px] text-gray-500 mt-1">Goal: 90% digital coverage by 2026</p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Map className="w-4 h-4 text-emerald-600" /> Key Trends
              </h4>
              {[
                'Increasing adoption of Irish Potato insurance',
                'Musanze district leads in AI-consulted farming',
                'Wait times for agronomist responses down 30%',
              ].map((t, i) => (
                <div key={i} className="flex gap-3 text-xs text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  {t}
                </div>
              ))}
            </div>

            <Button onClick={() => onNavigate('analytics')} className="w-full mt-2 bg-blue-600 hover:bg-blue-700">Open Full Analytics</Button>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Initiatives */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: 'Subsidies Distribution', desc: 'Monitor fertilizer & seed support', icon: FileText },
          { title: 'Market Access', desc: 'Real-time regional price tracking', icon: Globe },
          { title: 'Irrigation Expansion', desc: 'Satellite monitoring of water reach', icon: Droplets },
        ].map((init, i) => {
          const Icon = init.icon;
          return (
            <div key={i} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-200 transition-colors">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">{init.title}</div>
                <div className="text-[11px] text-gray-500">{init.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
