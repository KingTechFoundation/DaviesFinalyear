import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { 
  Users, Map, Activity, MessageSquare, ArrowRight, 
  TrendingUp, Search, Bell, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { analyticsAPI, advisoryAPI } from '../services/api';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

import { useTranslation } from '../i18n/LanguageContext';

interface AgronomistDashboardProps {
  onNavigate: (screen: any) => void;
}

const iconMap: Record<string, any> = {
  Users, MessageSquare, Map, Bell, Activity, TrendingUp, ShieldCheck
};

export function AgronomistDashboard({ onNavigate }: AgronomistDashboardProps) {
  const user = JSON.parse(localStorage.getItem('agriguide_user') || '{}');
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [responseMsg, setResponseMsg] = useState('');
  const [isResponding, setIsResponding] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashboardData, advisoryData] = await Promise.all([
          analyticsAPI.getAgronomistDashboard(),
          advisoryAPI.getAll()
        ]);
        setData(dashboardData);
        setRequests(advisoryData);
      } catch (error) {
        console.error('Error fetching agronomist data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleResponse = async () => {
    if (!responseMsg.trim()) return;
    
    try {
      setIsResponding(true);
      await advisoryAPI.respond(selectedRequest._id, { message: responseMsg });
      toast.success('Response sent successfully');
      setRequests(requests.map(r => 
        r._id === selectedRequest._id ? { ...r, status: 'responded', response: { message: responseMsg } } : r
      ));
      setSelectedRequest(null);
      setResponseMsg('');
    } catch (error) {
      toast.error('Failed to send response');
    } finally {
      setIsResponding(false);
    }
  };

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
          <h1 className="text-2xl font-extrabold text-gray-900">Agronomist Overview</h1>
          <p className="text-gray-500 text-sm">Managing {user.farmLocation || 'the region'}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search farmers..." className="pl-10 pr-4 py-2 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" />
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 h-10">Send Regional Alert</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((s: any, i: number) => {
          const Icon = iconMap[s.icon] || Activity;
          const labelMapping: Record<string, string> = {
            'Farmers Managed': 'farmersManaged',
            'Advisory Requests': 'advisoryRequests',
            'Regional Soil Health': 'regionalSoilHealth',
            'Alerts Resolved': 'alertsResolved'
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
        {/* Advisory Requests */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Advisory Requests</CardTitle>
              <CardDescription>Farmers requiring technical assistance</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate('knowledge')}>View Knowledge Base</Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {requests.length > 0 ? (
              requests.map((req, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">{req.farmerId?.name || 'Farmer'}</span>
                      <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{req.category}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <strong>{req.subject}</strong>: {req.message}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                      req.priority === 'high' ? 'bg-red-100 text-red-600' : 
                      req.priority === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {req.priority || 'Low'}
                    </span>
                    {req.status === 'responded' ? (
                      <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" /> Responded
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => setSelectedRequest(req)} className="bg-emerald-600 hover:bg-emerald-700 h-8 px-4">Respond</Button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-2xl border-gray-100">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p>No advisory requests found for your region.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Regional Trends */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Regional Health</CardTitle>
            <CardDescription>Disease & pest monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Avg Soil Health</span>
                <span className="text-blue-500 font-bold">{data.regionalHealth?.soilHealth || 84}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${data.regionalHealth?.soilHealth || 84}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Regional Pest Risk</span>
                <span className="text-orange-500 font-bold">{data.regionalHealth?.pestRisk || 42}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: `${data.regionalHealth?.pestRisk || 42}%` }} />
              </div>
            </div>
            <div className="pt-4 border-t">
              <h4 className="text-sm font-bold text-gray-900 mb-3">AI Predictions</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">High humidity forecast for next week increases fungal risk in Kinigi Irish potato plots by 60%.</p>
              <Button variant="outline" className="w-full text-xs h-9 border-emerald-200 text-emerald-600 hover:bg-emerald-50" onClick={() => onNavigate('analytics')}>View Detailed Report</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Response Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Respond to Advisory Request</DialogTitle>
            <DialogDescription>
              Providing technical guidance to {selectedRequest?.farmerId?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-xs">
              <div className="font-bold text-gray-900 mb-1">Original Request:</div>
              <div className="text-gray-600 italic">"{selectedRequest?.message}"</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Your Advice</label>
              <Textarea 
                placeholder="Enter your expert recommendations here..." 
                value={responseMsg}
                onChange={(e) => setResponseMsg(e.target.value)}
                className="min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>Cancel</Button>
            <Button 
              onClick={handleResponse} 
              disabled={isResponding || !responseMsg.trim()}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isResponding ? 'Sending...' : 'Send Response'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
