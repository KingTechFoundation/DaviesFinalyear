import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Cloud, CloudRain, Sun, Wind, Droplets, ThermometerSun, Calendar, AlertTriangle } from 'lucide-react';
import type { Screen } from '../App';

interface WeatherMonitorProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function WeatherMonitor({ onNavigate, onLogout }: WeatherMonitorProps) {
  const currentWeather = {
    temp: 24,
    condition: 'Partly Cloudy',
    humidity: 65,
    wind: 12,
    rainfall: 0,
    uvIndex: 6,
  };

  const forecast = [
    { day: 'Today', icon: Cloud, temp: { high: 26, low: 18 }, rain: 20, condition: 'Partly Cloudy' },
    { day: 'Tomorrow', icon: CloudRain, temp: { high: 23, low: 17 }, rain: 80, condition: 'Rain Expected' },
    { day: 'Wednesday', icon: CloudRain, temp: { high: 22, low: 16 }, rain: 70, condition: 'Light Rain' },
    { day: 'Thursday', icon: Cloud, temp: { high: 24, low: 17 }, rain: 30, condition: 'Cloudy' },
    { day: 'Friday', icon: Sun, temp: { high: 27, low: 19 }, rain: 10, condition: 'Sunny' },
    { day: 'Saturday', icon: Sun, temp: { high: 28, low: 20 }, rain: 5, condition: 'Clear' },
    { day: 'Sunday', icon: Cloud, temp: { high: 25, low: 18 }, rain: 25, condition: 'Partly Cloudy' },
  ];

  const alerts = [
    {
      title: 'Heavy Rainfall Alert',
      message: 'Expected rainfall of 35mm in the next 48 hours. Delay irrigation and ensure proper drainage.',
      severity: 'warning',
      icon: CloudRain,
    },
    {
      title: 'Optimal Planting Window',
      message: 'Weather conditions favorable for bean planting from Friday. Soil moisture will be ideal.',
      severity: 'info',
      icon: Sun,
    },
  ];

  const recommendations = [
    {
      activity: 'Irrigation',
      status: 'Skip Next 2 Days',
      reason: 'Rain expected - 35mm forecast',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      activity: 'Fertilizer Application',
      status: 'Postpone',
      reason: 'Heavy rain will wash away nutrients',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      activity: 'Pest Spraying',
      status: 'Wait Until Friday',
      reason: 'Sunny weather needed for effectiveness',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      activity: 'Harvesting',
      status: 'Safe to Proceed',
      reason: 'No rain today, proceed as planned',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const monthlyData = [
    { month: 'Nov 1-10', rainfall: 45, avgTemp: 23 },
    { month: 'Nov 11-20', rainfall: 38, avgTemp: 24 },
    { month: 'Nov 21-30', rainfall: 52, avgTemp: 23 },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="weather" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-green-900 mb-2">Weather & Climate Monitoring</h1>
          <p className="text-neutral-600">Real-time weather data and agricultural forecasts for Musanze District</p>
        </div>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <div className="mb-8 space-y-4">
            {alerts.map((alert, index) => {
              const Icon = alert.icon;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 ${
                    alert.severity === 'warning'
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      alert.severity === 'warning' ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        alert.severity === 'warning' ? 'text-orange-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-neutral-900">{alert.title}</div>
                        <Badge variant={alert.severity === 'warning' ? 'destructive' : 'default'}>
                          {alert.severity === 'warning' ? 'Warning' : 'Info'}
                        </Badge>
                      </div>
                      <p className="text-neutral-600">{alert.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Weather Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Weather */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="text-neutral-600 mb-2">Current Weather</div>
                    <div className="text-neutral-900 mb-1">Musanze, Northern Province</div>
                    <div className="text-neutral-600">Monday, November 10, 2025</div>
                  </div>
                  <Cloud className="w-20 h-20 text-neutral-400" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-neutral-600 mb-1">Temperature</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-neutral-900">{currentWeather.temp}°C</span>
                      <ThermometerSun className="w-5 h-5 text-orange-500" />
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-600 mb-1">Humidity</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-neutral-900">{currentWeather.humidity}%</span>
                      <Droplets className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-600 mb-1">Wind Speed</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-neutral-900">{currentWeather.wind} km/h</span>
                      <Wind className="w-5 h-5 text-neutral-500" />
                    </div>
                  </div>
                  <div>
                    <div className="text-neutral-600 mb-1">Condition</div>
                    <div className="text-neutral-900">{currentWeather.condition}</div>
                  </div>
                  <div>
                    <div className="text-neutral-600 mb-1">UV Index</div>
                    <div className="text-neutral-900">{currentWeather.uvIndex} (Moderate)</div>
                  </div>
                  <div>
                    <div className="text-neutral-600 mb-1">Rainfall</div>
                    <div className="text-neutral-900">{currentWeather.rainfall} mm</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 7-Day Forecast */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  7-Day Forecast
                </CardTitle>
                <CardDescription>Extended weather outlook for planning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {forecast.map((day, index) => {
                    const Icon = day.icon;
                    return (
                      <div key={index} className="flex items-center justify-between p-4 rounded-xl border hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 text-neutral-700">{day.day}</div>
                          <Icon className={`w-6 h-6 ${
                            day.icon === Sun ? 'text-orange-500' :
                            day.icon === CloudRain ? 'text-blue-500' :
                            'text-neutral-400'
                          }`} />
                          <div className="flex-1">{day.condition}</div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            <span className="text-neutral-700">{day.rain}%</span>
                          </div>
                          <div className="text-neutral-900 min-w-[80px] text-right">
                            {day.temp.high}° / {day.temp.low}°
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Rainfall */}
            <Card>
              <CardHeader>
                <CardTitle>Rainfall & Temperature Trends</CardTitle>
                <CardDescription>November 2025 data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monthlyData.map((period, index) => (
                    <div key={index} className="p-4 bg-neutral-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-neutral-700">{period.month}</div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <CloudRain className="w-4 h-4 text-blue-500" />
                            <span className="text-neutral-900">{period.rainfall}mm</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ThermometerSun className="w-4 h-4 text-orange-500" />
                            <span className="text-neutral-900">{period.avgTemp}°C</span>
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${(period.rainfall / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather-Based Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Activity Recommendations
                </CardTitle>
                <CardDescription>AI-powered farming advice based on weather</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div key={index} className={`p-3 rounded-lg ${rec.bgColor}`}>
                    <div className="text-neutral-900 mb-1">{rec.activity}</div>
                    <div className={`${rec.color} mb-1`}>{rec.status}</div>
                    <div className="text-neutral-600">{rec.reason}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Climate Info */}
            <Card>
              <CardHeader>
                <CardTitle>Climate Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Region</span>
                  <span className="text-neutral-900">Highland Tropical</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Altitude</span>
                  <span className="text-neutral-900">1,850m</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Annual Rainfall</span>
                  <span className="text-neutral-900">1,200-1,500mm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-600">Growing Season</span>
                  <span className="text-neutral-900">Year-round</span>
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card>
              <CardHeader>
                <CardTitle>Weather Best Practices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-neutral-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>Monitor rainfall patterns for irrigation planning</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>Avoid fertilizing before heavy rain</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>Plan pest treatments during dry spells</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>Check UV index before field work</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
