import { useState, useRef } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Upload, Camera, AlertCircle, CheckCircle2, Bug, Leaf, Info, X, Zap } from 'lucide-react';
import type { Screen } from '../App';
import { pestsAPI } from '../services/api';
import { useTranslation } from '../i18n/LanguageContext';
import { analyzeCropPest, PestAnalysisResult } from '../services/gemini';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface PestPredictorProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  role: string;
}

export function PestPredictor({ onNavigate, onLogout, role }: PestPredictorProps) {
  const { t } = useTranslation();
  const [hasScanned, setHasScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PestAnalysisResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);



  // This will be populated from API/Analysis history in a real app
  const [recentScans, setRecentScans] = useState([
    { date: 'Mar 23, 2026', crop: 'Maize', result: 'Healthy', status: 'healthy' }
  ]);

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error('Could not access camera');
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured_crop.jpg', { type: 'image/jpeg' });
            handleFile(file);
          }
        }, 'image/jpeg');
      }
      stopCamera();
    }
  };

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image is too large (max 10MB)');
      return;
    }
    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleScan = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    try {
      const { lang } = useTranslation();
      const result = await analyzeCropPest(selectedImage, lang);
      setPrediction(result);
      setHasScanned(true);
      
      // Update history
      const newScan = {
        date: new Date().toLocaleDateString(),
        crop: 'Scanned Crop', // In a real app, Gemini could identify the crop too
        result: result.prediction,
        status: result.severity === 'high' ? 'warning' : 'healthy'
      };
      setRecentScans([newScan, ...recentScans]);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('AI analysis failed. Please try again.');
      console.error('Scan error:', error);
    } finally {
      setLoading(false);
    }
  };

  const [commonPests, setCommonPests] = useState<any[]>([]);

  const fetchCommonPests = async () => {
    try {
      const data = await pestsAPI.getCommonPests();
      setCommonPests(data);
    } catch (error) {
      console.error('Error fetching common pests:', error);
      // Fallback to empty or a default set if needed
    }
  };

  useState(() => {
    fetchCommonPests();
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="pest" onNavigate={onNavigate} onLogout={onLogout} role={role} />
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden" 
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {/* Camera Dialog */}
      <Dialog open={isCameraOpen} onOpenChange={(open) => !open && stopCamera()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.pestPredictor.takePhoto}</DialogTitle>
            <DialogDescription>
              Use your camera to take a clear photo of the affected crop area.
            </DialogDescription>
          </DialogHeader>
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
              <Button onClick={capturePhoto} className="rounded-full w-12 h-12 p-0 bg-white hover:bg-neutral-100">
                <div className="w-8 h-8 rounded-full border-2 border-green-600" />
              </Button>
              <Button variant="secondary" onClick={stopCamera} className="rounded-full w-12 h-12 p-0 bg-red-600 hover:bg-red-700 text-white border-none">
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-green-900 mb-2">{t.pestPredictor.title}</h1>
          <p className="text-neutral-600">{t.pestPredictor.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-green-600" />
                  {t.pestPredictor.scanTitle}
                </CardTitle>
                <CardDescription>{t.pestPredictor.scanDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-12 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <Bug className="w-10 h-10 text-green-600" />
                    </div>
                    <div className="text-neutral-900 mb-2 font-medium">{t.pestPredictor.analyzing}</div>
                    <p className="text-neutral-600">{t.pestPredictor.analyzingDesc}</p>
                  </div>
                ) : !hasScanned ? (
                  <div className="border-2 border-dashed border-neutral-300 rounded-2xl p-8 text-center">
                    {previewUrl ? (
                      <div className="mb-6">
                        <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-xl shadow-lg mb-4" />
                        <div className="flex gap-4 justify-center">
                          <Button onClick={handleScan} className="bg-green-600 hover:bg-green-700">
                            <Zap className="w-4 h-4 mr-2" />
                            {t.pestPredictor.analyzing.split('...')[0]}
                          </Button>
                          <Button variant="outline" onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}>
                            {t.pestPredictor.scanAnother.split(' ')[0]}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Upload className="w-10 h-10 text-green-600" />
                        </div>
                        <div className="text-neutral-900 mb-2">{t.pestPredictor.scanTitle}</div>
                        <p className="text-neutral-600 mb-6">
                          Supported formats: JPG, PNG • Max size: 10MB
                        </p>
                        <div className="flex gap-4 justify-center">
                          <Button onClick={() => fileInputRef.current?.click()} className="bg-green-600 hover:bg-green-700">
                            <Upload className="w-4 h-4 mr-2" />
                            {t.pestPredictor.uploadImage}
                          </Button>
                          <Button onClick={startCamera} variant="outline">
                            <Camera className="w-4 h-4 mr-2" />
                            {t.pestPredictor.takePhoto}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="relative">
                      <img
                        src={previewUrl || ""}
                        alt="Crop scan"
                        className="w-full rounded-xl max-h-[400px] object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-green-600">{t.pestPredictor.analysisComplete}</Badge>
                      </div>
                    </div>

                    {prediction && (
                      <div className={`p-6 bg-gradient-to-r rounded-xl border-2 ${
                        prediction.severity === 'high' ? 'from-red-50 to-red-100 border-red-200' :
                        prediction.severity === 'medium' ? 'from-orange-50 to-orange-100 border-orange-200' :
                        'from-green-50 to-green-100 border-green-200'
                      }`}>
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            prediction.severity === 'high' ? 'bg-red-500' :
                            prediction.severity === 'medium' ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}>
                            <Bug className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="text-neutral-900 font-bold">{t.pestPredictor.resultTitle}</div>
                              <Badge className={prediction.severity === 'high' ? 'bg-red-600' : 'bg-orange-600'}>
                                AI Powered
                              </Badge>
                            </div>
                            <div className="text-neutral-900 mb-2 whitespace-pre-wrap leading-relaxed font-semibold">
                              {prediction.prediction}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button size="sm" onClick={() => { setHasScanned(false); setSelectedImage(null); setPreviewUrl(null); }}>
                            {t.pestPredictor.scanAnother}
                          </Button>
                          <Button size="sm" variant="outline">
                            {t.pestPredictor.saveHistory}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {hasScanned && prediction && (
              <Card>
                <CardHeader>
                  <CardTitle>{t.pestPredictor.treatmentTitle}</CardTitle>
                  <CardDescription>{t.pestPredictor.treatmentDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {prediction.treatments.map((treatment: any, index: number) => (
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
                        <div className="text-neutral-900 font-bold">{treatment.title}</div>
                        <Badge variant="outline" className="ml-auto">
                          {treatment.priority === 'high' ? t.pestPredictor.urgent :
                           treatment.priority === 'medium' ? t.pestPredictor.important :
                           t.pestPredictor.preventive}
                        </Badge>
                      </div>
                      <ul className="space-y-2">
                        {treatment.steps.map((step: string, stepIndex: number) => (
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

            <Card>
              <CardHeader>
                <CardTitle>{t.pestPredictor.recentScans}</CardTitle>
                <CardDescription>{t.pestPredictor.recentScansDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentScans.length > 0 ? recentScans.map((scan: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          scan.status === 'healthy' ? 'bg-green-500' : 'bg-orange-500'
                        }`} />
                        <div>
                          <div className="text-neutral-900 font-medium">{scan.crop}</div>
                          <div className="text-neutral-600 text-sm">{scan.date}</div>
                        </div>
                      </div>
                      <div className="text-neutral-700 text-sm italic">{scan.result}</div>
                    </div>
                  )) : (
                    <div className="text-center py-6 text-neutral-500 italic">
                      {t.pestPredictor.noScans}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t.pestPredictor.currentRisk}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bug className="w-12 h-12 text-orange-600" />
                  </div>
                  <div className="text-neutral-900 mb-1 font-bold">{t.pestPredictor.moderateRisk}</div>
                  <div className="text-neutral-600 text-sm">{t.pestPredictor.riskBasedOn}</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg text-sm">
                  <div className="text-neutral-700 mb-1">{t.pestPredictor.nextMonitoring}:</div>
                  <div className="text-neutral-900 font-bold">April 15, 2026</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.pestPredictor.commonPests}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {commonPests.map((pest: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-neutral-900 font-bold">{pest.name}</div>
                      <Badge className={pest.color || 'bg-neutral-100 text-neutral-700'}>{pest.risk} Risk</Badge>
                    </div>
                    <div className="text-neutral-600 text-sm">{pest.crops}</div>
                    <div className="text-neutral-500 text-xs mt-1">Peak: {pest.season}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  {t.pestPredictor.scanningTips}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-neutral-600 text-sm">
                {[1, 2, 3, 4].map((idx: number) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                    <div>{(t.pestPredictor as any)[`tip${idx}`]}</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-900">{t.pestPredictor.emergencySupport}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-800 mb-4 text-sm">
                  Severe infestation detected? Get immediate expert help.
                </p>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white border-none">
                  {t.pestPredictor.emergencyContact}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
