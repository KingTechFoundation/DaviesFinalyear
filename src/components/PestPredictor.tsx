import { useState } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Upload, Camera, AlertCircle, CheckCircle2, Bug, Leaf, Info } from 'lucide-react';
import type { Screen } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PestPredictorProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function PestPredictor({ onNavigate, onLogout }: PestPredictorProps) {
  const [hasScanned, setHasScanned] = useState(false);

  const detectionResult = {
    pest: 'Aphids (Aphidoidea)',
    severity: 'Moderate',
    confidence: 92,
    affectedArea: '15-20%',
    risk: 'medium',
  };

  const treatments = [
    {
      title: 'Immediate Action',
      steps: [
        'Spray neem oil solution (2-3ml per liter) on affected leaves',
        'Remove heavily infested leaves and destroy them',
        'Isolate affected plants if possible',
      ],
      priority: 'high',
    },
    {
      title: 'Biological Control',
      steps: [
        'Introduce ladybugs as natural predators',
        'Plant companion crops like marigolds',
        'Encourage beneficial insects',
      ],
      priority: 'medium',
    },
    {
      title: 'Prevention',
      steps: [
        'Monitor plants weekly for early detection',
        'Maintain proper spacing for air circulation',
        'Avoid over-fertilizing with nitrogen',
      ],
      priority: 'low',
    },
  ];

  const commonPests = [
    {
      name: 'Aphids',
      risk: 'Medium',
      season: 'Rainy Season',
      crops: 'Beans, Maize',
      color: 'bg-orange-100 text-orange-700',
    },
    {
      name: 'Fall Armyworm',
      risk: 'High',
      season: 'Year-round',
      crops: 'Maize, Wheat',
      color: 'bg-red-100 text-red-700',
    },
    {
      name: 'Bean Weevil',
      risk: 'Low',
      season: 'Storage',
      crops: 'Beans',
      color: 'bg-green-100 text-green-700',
    },
    {
      name: 'Potato Beetle',
      risk: 'Medium',
      season: 'Dry Season',
      crops: 'Potatoes',
      color: 'bg-orange-100 text-orange-700',
    },
  ];

  const recentScans = [
    { date: 'Nov 8, 2025', crop: 'Maize', result: 'No pests detected', status: 'healthy' },
    { date: 'Nov 5, 2025', crop: 'Beans', result: 'Aphids - Low severity', status: 'warning' },
    { date: 'Nov 1, 2025', crop: 'Potatoes', result: 'No pests detected', status: 'healthy' },
  ];

  const handleScan = () => {
    setHasScanned(true);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="pest" onNavigate={onNavigate} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-green-900 mb-2">Pest & Disease Predictor</h1>
          <p className="text-neutral-600">AI-powered image recognition for early pest detection and treatment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-green-600" />
                  Scan Your Crops
                </CardTitle>
                <CardDescription>Upload or capture an image for AI analysis</CardDescription>
              </CardHeader>
              <CardContent>
                {!hasScanned ? (
                  <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-10 h-10 text-green-600" />
                    </div>
                    <div className="text-neutral-900 mb-2">Upload crop image for analysis</div>
                    <p className="text-neutral-600 mb-6">
                      Supported formats: JPG, PNG • Max size: 10MB
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={handleScan} className="bg-green-600 hover:bg-green-700">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                      <Button onClick={handleScan} variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Scanned Image */}
                    <div className="relative">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1758903178566-81b9026340ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9wJTIwZGlzZWFzZSUyMGxlYWZ8ZW58MXx8fHwxNzYyNzM4ODEyfDA&ixlib=rb-4.1.0&q=80&w=1080"
                        alt="Crop scan"
                        className="w-full rounded-xl"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-600">AI Analysis Complete</Badge>
                      </div>
                    </div>

                    {/* Detection Result */}
                    <div className="p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl border-2 border-orange-200">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Bug className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="text-neutral-900">Pest Detected</div>
                            <Badge className="bg-orange-600">{detectionResult.severity} Severity</Badge>
                          </div>
                          <div className="text-neutral-900 mb-1">{detectionResult.pest}</div>
                          <div className="text-neutral-700">
                            Confidence: {detectionResult.confidence}% • Affected Area: {detectionResult.affectedArea}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button size="sm" onClick={() => setHasScanned(false)}>
                          Scan Another Image
                        </Button>
                        <Button size="sm" variant="outline">
                          View Full Report
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Treatment Plan */}
            {hasScanned && (
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Treatment Plan</CardTitle>
                  <CardDescription>AI-generated action steps for pest control</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {treatments.map((treatment, index) => (
                    <div key={index} className="p-4 border rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          treatment.priority === 'high' ? 'bg-red-100' :
                          treatment.priority === 'medium' ? 'bg-orange-100' :
                          'bg-green-100'
                        }`}>
                          {treatment.priority === 'high' && <AlertCircle className="w-4 h-4 text-red-600" />}
                          {treatment.priority === 'medium' && <Info className="w-4 h-4 text-orange-600" />}
                          {treatment.priority === 'low' && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        </div>
                        <div className="text-neutral-900">{treatment.title}</div>
                        <Badge variant="outline" className="ml-auto">
                          {treatment.priority === 'high' ? 'Urgent' :
                           treatment.priority === 'medium' ? 'Important' :
                           'Preventive'}
                        </Badge>
                      </div>
                      <ul className="space-y-2">
                        {treatment.steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="flex items-start gap-2 text-neutral-700">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Recent Scans */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Scans</CardTitle>
                <CardDescription>History of your pest detection scans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentScans.map((scan, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          scan.status === 'healthy' ? 'bg-green-500' : 'bg-orange-500'
                        }`} />
                        <div>
                          <div className="text-neutral-900">{scan.crop}</div>
                          <div className="text-neutral-600">{scan.date}</div>
                        </div>
                      </div>
                      <div className="text-neutral-700">{scan.result}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Risk Level */}
            <Card>
              <CardHeader>
                <CardTitle>Current Pest Risk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bug className="w-12 h-12 text-orange-600" />
                  </div>
                  <div className="text-neutral-900 mb-1">Moderate Risk</div>
                  <div className="text-neutral-600">Based on current season and weather</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-neutral-700 mb-2">Next monitoring recommended:</div>
                  <div className="text-neutral-900">November 15, 2025</div>
                </div>
              </CardContent>
            </Card>

            {/* Common Pests */}
            <Card>
              <CardHeader>
                <CardTitle>Common Pests in Your Area</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {commonPests.map((pest, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-neutral-900">{pest.name}</div>
                      <Badge className={pest.color}>{pest.risk} Risk</Badge>
                    </div>
                    <div className="text-neutral-600">{pest.crops}</div>
                    <div className="text-neutral-500">Peak: {pest.season}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Detection Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  Scanning Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-neutral-600">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>Take photos in natural daylight</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>Focus on affected leaves or stems</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>Capture close-up details</div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                  <div>Include multiple angles if possible</div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-900">Emergency Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-800 mb-3">
                  Severe infestation detected? Get immediate expert help.
                </p>
                <Button className="w-full bg-red-600 hover:bg-red-700">
                  Contact Agronomist
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
