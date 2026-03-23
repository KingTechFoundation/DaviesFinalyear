import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/LanguageContext';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Cloud, CloudRain, Sun, Wind, Droplets, ThermometerSun, Calendar, AlertTriangle, Loader2 } from 'lucide-react';
import { weatherAPI } from '../services/api';
import { toast } from 'sonner';
import type { Screen } from '../App';

interface WeatherMonitorProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  role: string;
}

export function WeatherMonitor({ onNavigate, onLogout, role }: WeatherMonitorProps) {
  const { t } = useTranslation();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const weatherData = await weatherAPI.getCurrent('Musanze');
      setData(weatherData);
    } catch (error: any) {
      console.error('Error fetching weather:', error);
      toast.error('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navigation currentScreen="weather" onNavigate={onNavigate} onLogout={onLogout} role={role} />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mb-4" />
          <p className="text-neutral-600">{t.weather.loading}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { current, forecast, alerts, recommendations, monthlyData, climateZone } = data;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun': return Sun;
      case 'CloudRain': return CloudRain;
      case 'AlertTriangle': return AlertTriangle;
      default: return Cloud;
    }
  };

  const currentIcon = getIcon(current.condition === 'Clear Sky' ? 'Sun' : current.condition === 'Rain' ? 'CloudRain' : 'Cloud');

  return (
    <div className="min-h-screen bg-neutral-50 transition-colors duration-300">
      <Navigation currentScreen="weather" onNavigate={onNavigate} onLogout={onLogout} role={role} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-green-900 border-l-4 border-green-600 pl-4 mb-2">{t.weather.title}</h1>
          <p className="text-neutral-600">{t.weather.subtitle}</p>
        </div>

        {/* Weather Alerts */}
        {alerts && alerts.length > 0 ? (
          <div className="mb-8 space-y-4 animate-in fade-in slide-in-from-top-6 duration-700">
            {alerts.map((alert: any, index: number) => {
              const Icon = getIcon(alert.icon);
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 shadow-sm transition-all hover:shadow-md ${
                    alert.severity === 'warning'
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                      alert.severity === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        alert.severity === 'warning' ? 'text-orange-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-neutral-900">{alert.title}</span>
                        <Badge className={`${
                          alert.severity === 'warning' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'
                        }`}>
                          {alert.severity === 'warning' ? t.weather.warning : t.weather.info}
                        </Badge>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">{alert.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mb-8 p-4 bg-green-50 border border-green-100 rounded-xl text-green-800 flex items-center gap-3">
             <Sun className="w-5 h-5" />
             {t.weather.noAlerts}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Weather Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Weather */}
            <Card className="overflow-hidden border-none shadow-xl bg-white">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-blue-500 to-green-600" />
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                  <div className="text-center md:text-left">
                    <div className="text-neutral-500 font-medium uppercase tracking-wider text-xs mb-2">
                      {t.weather.currentWeather}
                    </div>
                    <div className="text-3xl font-bold text-neutral-900 mb-1">{data.location}</div>
                    <div className="text-neutral-500">
                      {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="p-4 bg-neutral-50 rounded-full mb-2">
                       {/* @ts-ignore */}
                       <currentIcon className="w-16 h-16 text-green-600" />
                    </div>
                    <span className="text-xl font-bold text-neutral-800">{current.condition}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="group">
                    <div className="text-neutral-500 text-sm mb-1 group-hover:text-green-600 transition-colors uppercase font-bold tracking-tighter">
                      {t.weather.temperature}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-neutral-900">{current.temp}°C</span>
                      <ThermometerSun className="w-5 h-5 text-orange-500 animate-pulse" />
                    </div>
                  </div>
                  <div className="group">
                    <div className="text-neutral-500 text-sm mb-1 group-hover:text-blue-600 transition-colors uppercase font-bold tracking-tighter">
                      {t.weather.humidity}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-neutral-900">{current.humidity}%</span>
                      <Droplets className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                  <div className="group">
                    <div className="text-neutral-500 text-sm mb-1 group-hover:text-neutral-800 transition-colors uppercase font-bold tracking-tighter">
                      {t.weather.windSpeed}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-neutral-900">{current.wind} km/h</span>
                      <Wind className="w-5 h-5 text-neutral-400" />
                    </div>
                  </div>
                  <div className="group">
                    <div className="text-neutral-500 text-sm mb-1 uppercase font-bold tracking-tighter">{t.weather.uvIndex}</div>
                    <div className="text-xl font-bold text-neutral-900">{current.uvIndex}</div>
                  </div>
                  <div className="group">
                    <div className="text-neutral-500 text-sm mb-1 uppercase font-bold tracking-tighter">{t.weather.rainfall} mm</div>
                    <div className="text-xl font-bold text-neutral-900">{current.rainfall} mm</div>
                  </div>
                  <div className="group">
                    <div className="text-neutral-500 text-sm mb-1 uppercase font-bold tracking-tighter">{t.weather.lastUpdated}</div>
                    <div className="text-sm font-medium text-neutral-600">
                      {new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 7-Day Forecast */}
            <Card className="border-none shadow-lg">
              <CardHeader className="border-b bg-neutral-50/50">
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <Calendar className="w-6 h-6 text-green-600" />
                  {t.weather.forecast7Day}
                </CardTitle>
                <CardDescription>{t.weather.forecastSubtitle}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y overflow-hidden rounded-b-xl">
                  {forecast.map((day: any, index: number) => {
                    const DayIcon = getIcon(day.icon);
                    return (
                      <div key={index} className="flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors group">
                        <div className="flex items-center gap-6 flex-1">
                          <div className="w-24 font-bold text-neutral-700 group-hover:text-green-700 transition-colors">{day.day}</div>
                          <div className="flex items-center gap-3">
                            <DayIcon className={`w-6 h-6 ${
                              day.icon === 'Sun' ? 'text-orange-500' :
                              day.icon === 'CloudRain' ? 'text-blue-500' :
                              'text-neutral-400'
                            }`} />
                            <span className="text-neutral-800 font-medium hidden md:inline">{day.condition}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="flex items-center gap-2 text-sm">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            <span className="text-neutral-600 font-bold">{day.rain}%</span>
                          </div>
                          <div className="flex items-center gap-1 font-bold text-lg">
                            <span className="text-neutral-900">{day.temp.high}°</span>
                            <span className="text-neutral-400 mx-1">/</span>
                            <span className="text-neutral-400">{day.temp.low}°</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-green-900">{t.weather.trendsTitle}</CardTitle>
                <CardDescription>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {monthlyData.map((period: any, index: number) => (
                    <div key={index} className="p-5 bg-neutral-50 rounded-2xl hover:bg-neutral-100 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-bold text-neutral-700">{period.month}</div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 rounded-lg">
                              <CloudRain className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-neutral-900 font-bold">{period.rainfall}mm</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-orange-100 rounded-lg">
                              <ThermometerSun className="w-4 h-4 text-orange-600" />
                            </div>
                            <span className="text-neutral-900 font-bold">{period.avgTemp}°C</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-3 bg-neutral-200 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000"
                          style={{ width: `${(period.rainfall / 80) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Weather-Based Recommendations */}
            <Card className="border-none shadow-xl bg-gradient-to-br from-green-600 to-green-800 text-white overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10">
                  <AlertTriangle className="w-32 h-32" />
               </div>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-white text-xl">
                  <AlertTriangle className="w-5 h-5 text-green-200" />
                  {t.weather.recommendationsTitle}
                </CardTitle>
                <CardDescription className="text-green-100 opacity-90">{t.weather.recommendationsSubtitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {recommendations.map((rec: any, index: number) => (
                  <div key={index} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                    <div className="font-bold text-green-50 mb-1">{rec.activity}</div>
                    <div className="flex items-center gap-2 mb-2">
                       <Badge className="bg-white text-green-800 hover:bg-green-50 uppercase text-[10px] py-0 px-2 font-bold">
                         {rec.status}
                       </Badge>
                    </div>
                    <div className="text-sm text-green-100 leading-snug">{rec.reason}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Climate Info */}
            <Card className="border-none shadow-lg">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Badge variant="outline" className="text-green-600 border-green-200">{t.weather.climateZone}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-medium">{t.weather.region}</span>
                  <span className="text-neutral-900 font-bold">{climateZone.region}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-medium">{t.weather.altitude}</span>
                  <span className="text-neutral-900 font-bold">{climateZone.altitude}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-medium">{t.weather.annualRainfall}</span>
                  <span className="text-neutral-900 font-bold">{climateZone.annualRainfall}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-500 font-medium">{t.weather.growingSeason}</span>
                  <span className="text-neutral-900 font-bold">{climateZone.growingSeason}</span>
                </div>
              </CardContent>
            </Card>

            {/* Weather Best Practices */}
            <Card className="border-none shadow-lg overflow-hidden">
               <div className="h-1 bg-green-500" />
              <CardHeader>
                <CardTitle className="text-lg">{t.weather.bestPractices}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-neutral-600">
                {[
                  "Monitor rainfall patterns for irrigation planning",
                  "Avoid fertilizing before heavy rain",
                  "Plan pest treatments during dry spells",
                  "Check UV index before field work"
                ].map((practice, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform" />
                    <div className="text-sm font-medium leading-relaxed group-hover:text-neutral-900 transition-colors">{practice}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
