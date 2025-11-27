import { useState } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Settings as SettingsIcon, Globe, Bell, Database, Wifi, WifiOff, User, Shield, Download, Trash2 } from 'lucide-react';
import { DataCache } from '../utils/dataCache';
import { toast } from 'sonner';
import type { Screen } from '../App';

interface SettingsProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function Settings({ onNavigate, onLogout }: SettingsProps) {
  const [language, setLanguage] = useState('english');
  const [units, setUnits] = useState('metric');
  const [notifications, setNotifications] = useState({
    weather: true,
    pest: true,
    tasks: true,
    sms: false,
    push: true,
    email: true,
  });
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState({
    cropCalendar: true,
    weatherData: true,
    knowledgeBase: false,
    chatHistory: true,
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="settings" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 max-w-4xl">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-green-900 mb-2">Settings & Personalization</h1>
          <p className="text-neutral-600 text-sm sm:text-base">Customize your AgriGuide AI experience</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {/* Online/Offline Status */}
          <Card className={isOnline ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  {isOnline ? (
                    <Wifi className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                  ) : (
                    <WifiOff className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="text-neutral-900 mb-1 text-sm sm:text-base">
                      {isOnline ? 'Online Mode' : 'Offline Mode'}
                    </div>
                    <p className={`text-xs sm:text-sm ${isOnline ? 'text-green-700' : 'text-orange-700'}`}>
                      {isOnline 
                        ? 'Connected - All features available'
                        : 'Limited - Using cached data'
                      }
                    </p>
                  </div>
                </div>
                <Badge className={`${isOnline ? 'bg-green-600' : 'bg-orange-600'} flex-shrink-0 text-xs`}>
                  {isOnline ? 'Active' : 'Limited'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-green-600" />
                Language & Region
              </CardTitle>
              <CardDescription>Choose your preferred language for the interface</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Interface Language</Label>
                <div className="grid md:grid-cols-3 gap-3">
                  <button
                    onClick={() => setLanguage('kinyarwanda')}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${
                      language === 'kinyarwanda' 
                        ? 'border-green-600 bg-green-50' 
                        : 'border-neutral-200 hover:border-green-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🇷🇼</span>
                      <div className="text-neutral-900">Kinyarwanda</div>
                    </div>
                    <div className="text-neutral-600">Ururimi rw'Ikinyarwanda</div>
                  </button>
                  <button
                    onClick={() => setLanguage('english')}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${
                      language === 'english' 
                        ? 'border-green-600 bg-green-50' 
                        : 'border-neutral-200 hover:border-green-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🇬🇧</span>
                      <div className="text-neutral-900">English</div>
                    </div>
                    <div className="text-neutral-600">Default language</div>
                  </button>
                  <button
                    onClick={() => setLanguage('french')}
                    className={`p-4 border-2 rounded-xl text-left transition-all ${
                      language === 'french' 
                        ? 'border-green-600 bg-green-50' 
                        : 'border-neutral-200 hover:border-green-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">🇫🇷</span>
                      <div className="text-neutral-900">Français</div>
                    </div>
                    <div className="text-neutral-600">Langue française</div>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="mb-3 block">Region Settings</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <select id="country" className="w-full px-3 py-2 border rounded-lg bg-white">
                      <option>Rwanda</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province">Province</Label>
                    <select id="province" className="w-full px-3 py-2 border rounded-lg bg-white">
                      <option>Northern Province</option>
                      <option>Southern Province</option>
                      <option>Eastern Province</option>
                      <option>Western Province</option>
                      <option>Kigali City</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unit Preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Unit Preferences</CardTitle>
              <CardDescription>Choose your preferred measurement system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-3">
                <button
                  onClick={() => setUnits('metric')}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    units === 'metric' 
                      ? 'border-green-600 bg-green-50' 
                      : 'border-neutral-200 hover:border-green-200'
                  }`}
                >
                  <div className="text-neutral-900 mb-2">Metric System</div>
                  <div className="text-neutral-600">
                    Hectares, Kilograms, Celsius, Liters
                  </div>
                </button>
                <button
                  onClick={() => setUnits('imperial')}
                  className={`p-4 border-2 rounded-xl text-left transition-all ${
                    units === 'imperial' 
                      ? 'border-green-600 bg-green-50' 
                      : 'border-neutral-200 hover:border-green-200'
                  }`}
                >
                  <div className="text-neutral-900 mb-2">Imperial System</div>
                  <div className="text-neutral-600">
                    Acres, Pounds, Fahrenheit, Gallons
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-green-600" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Control when and how you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <div className="text-neutral-900 mb-1">Weather Alerts</div>
                    <p className="text-neutral-600">Severe weather warnings and forecasts</p>
                  </div>
                  <Switch
                    checked={notifications.weather}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weather: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <div className="text-neutral-900 mb-1">Pest & Disease Alerts</div>
                    <p className="text-neutral-600">Regional pest outbreak notifications</p>
                  </div>
                  <Switch
                    checked={notifications.pest}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pest: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <div className="text-neutral-900 mb-1">Task Reminders</div>
                    <p className="text-neutral-600">Farming activity and schedule reminders</p>
                  </div>
                  <Switch
                    checked={notifications.tasks}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, tasks: checked })}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="mb-3 block">Notification Channels</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-neutral-900">Push Notifications</div>
                        <div className="text-neutral-600">Mobile app notifications</div>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600">📱</span>
                      </div>
                      <div>
                        <div className="text-neutral-900">SMS Alerts</div>
                        <div className="text-neutral-600">Text message notifications</div>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600">✉️</span>
                      </div>
                      <div>
                        <div className="text-neutral-900">Email Notifications</div>
                        <div className="text-neutral-600">Weekly summary emails</div>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Offline Mode Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-green-600" />
                Offline Mode & Data Sync
              </CardTitle>
              <CardDescription>Manage cached content for offline access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <Database className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-neutral-900 mb-1">Offline Storage: 45 MB used</div>
                    <p className="text-neutral-600">
                      Selected content is cached for offline access. Data syncs automatically when online.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="mb-2 block">Available Offline Content</Label>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-neutral-900">Crop Calendar</div>
                    <div className="text-neutral-600">Your farming schedule (2.1 MB)</div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Cached</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-neutral-900">Weather Data (7 days)</div>
                    <div className="text-neutral-600">Forecast information (850 KB)</div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Cached</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-neutral-900">Chat History</div>
                    <div className="text-neutral-600">AI assistant conversations (3.5 MB)</div>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Cached</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="text-neutral-900">Knowledge Base Articles</div>
                    <div className="text-neutral-600">Crop guides and tutorials (38 MB)</div>
                  </div>
                  <Badge variant="outline">Not Downloaded</Badge>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download All for Offline
                </Button>
                <Button variant="outline">Clear Cache</Button>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg">
                <div className="text-neutral-700 mb-1">Last Synced</div>
                <div className="text-neutral-900">2 minutes ago</div>
              </div>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Account Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <div className="text-neutral-900 mb-1">Name</div>
                  <div className="text-neutral-600">Jean-Claude Mugabo</div>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <div className="text-neutral-900 mb-1">Phone Number</div>
                  <div className="text-neutral-600">+250 788 123 456</div>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <div className="text-neutral-900 mb-1">Email</div>
                  <div className="text-neutral-600">jc.mugabo@example.com</div>
                </div>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Privacy & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Privacy Policy
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Terms of Service
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Save Settings */}
          <div className="flex gap-3">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
            <Button variant="outline">Reset to Defaults</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
