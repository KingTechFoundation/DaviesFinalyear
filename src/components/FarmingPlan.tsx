import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, CheckCircle2, Clock, AlertCircle, Sprout, Droplets, Bug, Leaf } from 'lucide-react';
import type { Screen } from '../App';

interface FarmingPlanProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function FarmingPlan({ onNavigate, onLogout }: FarmingPlanProps) {
  const upcomingTasks = [
    {
      id: 1,
      title: 'Apply NPK Fertilizer',
      crop: 'Maize',
      date: 'Nov 12, 2025',
      priority: 'high',
      status: 'pending',
      icon: Leaf,
      description: 'Apply 50kg/hectare NPK (17-17-17) fertilizer',
      daysUntil: 2,
    },
    {
      id: 2,
      title: 'Irrigation Check',
      crop: 'Beans',
      date: 'Nov 15, 2025',
      priority: 'medium',
      status: 'pending',
      icon: Droplets,
      description: 'Check and adjust drip irrigation system',
      daysUntil: 5,
    },
    {
      id: 3,
      title: 'Pest Monitoring',
      crop: 'All Crops',
      date: 'Nov 13, 2025',
      priority: 'medium',
      status: 'pending',
      icon: Bug,
      description: 'Weekly pest inspection and treatment if needed',
      daysUntil: 3,
    },
    {
      id: 4,
      title: 'Weeding',
      crop: 'Potatoes',
      date: 'Nov 17, 2025',
      priority: 'high',
      status: 'pending',
      icon: Sprout,
      description: 'Manual weeding around potato plants',
      daysUntil: 7,
    },
  ];

  const completedTasks = [
    {
      title: 'Soil Testing',
      crop: 'Maize Field',
      completedDate: 'Nov 5, 2025',
      result: 'pH optimal, nitrogen high',
    },
    {
      title: 'Planting',
      crop: 'Beans',
      completedDate: 'Nov 3, 2025',
      result: 'Successfully planted 0.5 hectares',
    },
    {
      title: 'Pest Treatment',
      crop: 'Maize',
      completedDate: 'Nov 8, 2025',
      result: 'Aphids treated with neem oil',
    },
  ];

  const seasonalTimeline = [
    {
      phase: 'Land Preparation',
      status: 'completed',
      dates: 'Oct 1-15',
      activities: ['Plowing', 'Harrowing', 'Organic matter addition'],
    },
    {
      phase: 'Planting',
      status: 'completed',
      dates: 'Oct 16-31',
      activities: ['Seed selection', 'Planting', 'Initial watering'],
    },
    {
      phase: 'Growth Stage',
      status: 'current',
      dates: 'Nov 1-30',
      activities: ['Fertilization', 'Irrigation', 'Pest control', 'Weeding'],
    },
    {
      phase: 'Flowering',
      status: 'upcoming',
      dates: 'Dec 1-15',
      activities: ['Increased irrigation', 'Disease monitoring', 'Pollination support'],
    },
    {
      phase: 'Maturation',
      status: 'upcoming',
      dates: 'Dec 16-31',
      activities: ['Reduce irrigation', 'Pre-harvest prep', 'Quality checks'],
    },
    {
      phase: 'Harvesting',
      status: 'upcoming',
      dates: 'Jan 1-15',
      activities: ['Harvesting', 'Post-harvest handling', 'Storage'],
    },
  ];

  const cropSchedule = [
    {
      crop: 'Maize',
      area: '1.2 hectares',
      planted: 'Oct 20, 2025',
      expectedHarvest: 'Jan 10, 2026',
      growth: 65,
      status: 'On track',
    },
    {
      crop: 'Common Beans',
      area: '0.5 hectares',
      planted: 'Nov 3, 2025',
      expectedHarvest: 'Jan 25, 2026',
      growth: 25,
      status: 'On track',
    },
    {
      crop: 'Irish Potatoes',
      area: '0.3 hectares',
      planted: 'Oct 25, 2025',
      expectedHarvest: 'Jan 20, 2026',
      growth: 55,
      status: 'Excellent',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="plan" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-green-900 mb-2">Personalized Farming Plan</h1>
            <p className="text-neutral-600">AI-generated roadmap for optimal crop management</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Calendar className="w-4 h-4 mr-2" />
            Export Schedule
          </Button>
        </div>

        {/* Summary Banner */}
        <Card className="mb-8 bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-green-100 mb-1">Active Tasks</div>
                <div className="flex items-center gap-2">
                  <div>{upcomingTasks.length}</div>
                  <Badge className="bg-green-400 text-green-900">This Week</Badge>
                </div>
              </div>
              <div>
                <div className="text-green-100 mb-1">Completion Rate</div>
                <div>92%</div>
              </div>
              <div>
                <div className="text-green-100 mb-1">Next Critical Task</div>
                <div>Fertilization in 2 days</div>
              </div>
              <div>
                <div className="text-green-100 mb-1">Season Progress</div>
                <div>45% Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  Upcoming Tasks
                </CardTitle>
                <CardDescription>Your personalized to-do list for the next week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingTasks.map((task) => {
                  const Icon = task.icon;
                  return (
                    <div
                      key={task.id}
                      className={`p-4 border-2 rounded-xl ${
                        task.priority === 'high' ? 'border-orange-200 bg-orange-50' : 'border-neutral-200'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          task.priority === 'high' ? 'bg-orange-100' : 'bg-green-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            task.priority === 'high' ? 'text-orange-600' : 'text-green-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="text-neutral-900">{task.title}</div>
                            <Badge variant={task.priority === 'high' ? 'destructive' : 'default'}>
                              {task.priority === 'high' ? 'Urgent' : 'Normal'}
                            </Badge>
                          </div>
                          <div className="text-neutral-600 mb-2">{task.description}</div>
                          <div className="flex items-center gap-4 text-neutral-600">
                            <div className="flex items-center gap-1">
                              <Sprout className="w-4 h-4" />
                              <span>{task.crop}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{task.date} ({task.daysUntil} days)</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm">Mark Complete</Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Seasonal Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Season A Timeline</CardTitle>
                <CardDescription>October 2025 - January 2026</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {seasonalTimeline.map((phase, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start gap-4">
                        <div className="relative flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            phase.status === 'completed' ? 'bg-green-500' :
                            phase.status === 'current' ? 'bg-blue-500' :
                            'bg-neutral-300'
                          }`}>
                            {phase.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-white" />}
                            {phase.status === 'current' && <Clock className="w-5 h-5 text-white" />}
                            {phase.status === 'upcoming' && <div className="w-3 h-3 bg-white rounded-full" />}
                          </div>
                          {index < seasonalTimeline.length - 1 && (
                            <div className={`w-0.5 h-20 ${
                              phase.status === 'completed' ? 'bg-green-500' : 'bg-neutral-300'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-neutral-900">{phase.phase}</div>
                            <Badge variant={
                              phase.status === 'completed' ? 'default' :
                              phase.status === 'current' ? 'default' :
                              'secondary'
                            } className={
                              phase.status === 'completed' ? 'bg-green-100 text-green-700' :
                              phase.status === 'current' ? 'bg-blue-100 text-blue-700' :
                              ''
                            }>
                              {phase.status === 'completed' ? 'Completed' :
                               phase.status === 'current' ? 'In Progress' :
                               'Upcoming'}
                            </Badge>
                          </div>
                          <div className="text-neutral-600 mb-2">{phase.dates}</div>
                          <div className="flex flex-wrap gap-2">
                            {phase.activities.map((activity, actIndex) => (
                              <span key={actIndex} className="px-2 py-1 bg-neutral-100 rounded text-neutral-700">
                                {activity}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Completed Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Recently Completed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {completedTasks.map((task, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-neutral-900 mb-1">{task.title} - {task.crop}</div>
                        <div className="text-neutral-600">{task.result}</div>
                      </div>
                      <div className="text-neutral-500">{task.completedDate}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Crop Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Active Crops Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cropSchedule.map((crop, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-neutral-900">{crop.crop}</div>
                      <Badge className="bg-green-100 text-green-700">{crop.status}</Badge>
                    </div>
                    <div className="text-neutral-600 mb-2">{crop.area}</div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-neutral-600">Growth</span>
                        <span className="text-neutral-900">{crop.growth}%</span>
                      </div>
                      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600 rounded-full transition-all"
                          style={{ width: `${crop.growth}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-neutral-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Harvest: {crop.expectedHarvest}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weather Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Weather-Based Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <div className="text-neutral-900">Rain Alert</div>
                  </div>
                  <p className="text-neutral-600">
                    Skip irrigation for next 2 days due to expected rainfall
                  </p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <div className="text-neutral-900">Optimal Window</div>
                  </div>
                  <p className="text-neutral-600">
                    Perfect conditions for pest treatment on Friday
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* AI Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-neutral-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    Your maize crop is outperforming regional average by 18%
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    Consider intercropping beans with marigolds for natural pest control
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    Optimal time for wheat planting starts in 2 weeks
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('assistant')}>
                  Ask AI for Advice
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('weather')}>
                  Check Weather Forecast
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('soil')}>
                  View Soil Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
