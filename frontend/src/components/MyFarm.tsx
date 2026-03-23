import { useState, useEffect, useCallback } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Plus, Edit2, Trash2, Calendar, Sprout, TrendingUp, Activity, Loader2, X, LandPlot, Droplets, Save } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { toast } from 'sonner';
import { useTranslation } from '../i18n/LanguageContext';
import { farmsAPI, cropsAPI, inputsAPI, tasksAPI } from '../services/api';
import type { Screen } from '../App';

interface Farm {
  _id?: string;
  name: string;
  location: string;
  size: number;
  unit: string;
  coordinates: string;
  soilType: string;
  plots: number;
}

interface Crop {
  _id?: string;
  farmId: string;
  crop: string;
  variety: string;
  plot: string;
  area: number;
  plantingDate: string;
  expectedHarvest: string;
  growthStage: string;
  health: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  progress: number;
}

interface InputEntry {
  _id: string;
  date: string;
  crop: string;
  input: string;
  quantity: string;
  purpose: string;
}

interface MyFarmProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  role: string;
}

export function MyFarm({ onNavigate, onLogout, role }: MyFarmProps) {
  const { t } = useTranslation();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [inputs, setInputs] = useState<InputEntry[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [cropFormData, setCropFormData] = useState<Partial<Crop>>({
    crop: '',
    variety: '',
    plot: '',
    area: 0,
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvest: '',
    growthStage: 'Germination',
    health: 'Good',
    progress: 0,
  });
  const [inputFormData, setInputFormData] = useState<Partial<InputEntry>>({
    date: new Date().toISOString().split('T')[0],
    crop: '',
    input: '',
    quantity: '',
    purpose: '',
  });

  const [formData, setFormData] = useState<Farm>({
    name: '',
    location: '',
    size: 0,
    unit: 'hectares',
    coordinates: '',
    soilType: 'Clay Loam',
    plots: 1,
  });

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      location: '',
      size: 0,
      unit: 'hectares',
      coordinates: '',
      soilType: 'Clay Loam',
      plots: 1,
    });
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const [farmsData, cropsData, inputsData, timelineData] = await Promise.all([
        farmsAPI.getAll(),
        cropsAPI.getAll(),
        inputsAPI.getAll(),
        tasksAPI.getTimeline()
      ]);
      setFarms(farmsData);
      setCrops(cropsData);
      setInputs(inputsData);
      setTimeline(timelineData);
    } catch (err: any) {
      toast.error(t.myFarm.fetchError || 'Error fetching farm data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [t.myFarm.fetchError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleOpenModal = (farm: Farm | null = null) => {
    if (farm) {
      setEditingFarm(farm);
      setFormData(farm);
    } else {
      setEditingFarm(null);
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSaveFarm = async () => {
    if (!formData.name || !formData.location || !formData.size) {
      toast.error(t.myFarm.validationError);
      return;
    }

    setSaving(true);
    try {
      if (editingFarm) {
        // Update
        const updated = await farmsAPI.update(editingFarm._id!, formData);
        setFarms(farms.map(f => f._id === editingFarm._id ? updated : f));
        toast.success(t.myFarm.updateSuccess);
      } else {
        // Create
        const created = await farmsAPI.create(formData);
        setFarms([...farms, created]);
        toast.success(t.myFarm.addSuccess);
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || t.myFarm.saveError);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFarm = async (id: string) => {
    if (!confirm(t.myFarm.deleteConfirm)) return;

    try {
      await farmsAPI.delete(id);
      setFarms(farms.filter(f => f._id !== id));
      toast.success(t.myFarm.deleteSuccess);
    } catch (err: any) {
      toast.error(err.message || t.myFarm.deleteError);
    }
  };

  const handleSaveCrop = async () => {
    if (!cropFormData.crop || !cropFormData.farmId) {
      toast.error('Please fill in crop name and select a farm');
      return;
    }

    setSaving(true);
    try {
      if (editingCrop) {
        const updated = await cropsAPI.update(editingCrop._id!, cropFormData);
        setCrops(crops.map(c => c._id === editingCrop._id ? updated : c));
        toast.success('Crop updated successfully');
      } else {
        const created = await cropsAPI.create(cropFormData);
        setCrops([...crops, created]);
        toast.success('New crop added successfully');
      }
      setIsCropModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Error saving crop');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInput = async () => {
    if (!inputFormData.input || !inputFormData.crop) {
      toast.error('Please fill in input name and crop');
      return;
    }

    setSaving(true);
    try {
      const created = await inputsAPI.create(inputFormData);
      setInputs([...inputs, created]);
      toast.success('Input application logged');
      setIsInputModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Error saving input');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCrop = async (id: string) => {
    if (!confirm('Are you sure you want to remove this crop?')) return;
    try {
      await cropsAPI.delete(id);
      setCrops(crops.filter(c => c._id !== id));
      toast.success('Crop removed');
    } catch (err: any) {
      toast.error(err.message || 'Error deleting crop');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="farm" onNavigate={onNavigate} onLogout={onLogout} role={role} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-green-900 mb-2 truncate max-w-[300px] sm:max-w-none">{t.myFarm.title}</h1>
            <p className="text-neutral-600 text-sm">{t.myFarm.subtitle}</p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4 mr-2" />
            {t.myFarm.addNewFarm}
          </Button>
        </div>

        <Tabs defaultValue="farms" className="space-y-6">
          <TabsList className="bg-white/50 backdrop-blur-sm p-1 rounded-xl border border-neutral-200">
            <TabsTrigger value="farms" className="rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all">
              {t.myFarm.farmProfile}
            </TabsTrigger>
            <TabsTrigger value="crops" className="rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all">
              {t.myFarm.currentCrops}
            </TabsTrigger>
            <TabsTrigger value="calendar" className="rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all">
              {t.myFarm.cropCalendar}
            </TabsTrigger>
            <TabsTrigger value="inputs" className="rounded-lg data-[state=active]:bg-green-600 data-[state=active]:text-white transition-all">
              {t.myFarm.inputTracking}
            </TabsTrigger>
          </TabsList>

          {/* Farm Profile */}
          <TabsContent value="farms" className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
                <Loader2 className="w-10 h-10 animate-spin text-green-600 mb-4" />
                <p>{t.myFarm.loading}</p>
              </div>
            ) : farms.length === 0 ? (
              <Card className="py-20 text-center border-dashed border-2 bg-neutral-50/50">
                <CardContent>
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sprout className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{t.myFarm.title}</h3>
                  <p className="text-neutral-500 max-w-sm mx-auto mb-6">{t.myFarm.noFarms}</p>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t.myFarm.addNewFarm}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {farms.map((farm) => (
                  <Card key={farm._id} className="hover:shadow-xl transition-all duration-300 border-neutral-200 group overflow-hidden">
                    <div className="h-2 w-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-neutral-900">{farm.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1 text-neutral-500">
                            <MapPin className="w-3.5 h-3.5 text-green-600" />
                            {farm.location}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-green-50 hover:text-green-600" onClick={() => handleOpenModal(farm)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50 hover:text-red-600" onClick={() => farm._id && handleDeleteFarm(farm._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">{t.myFarm.totalArea}</div>
                          <div className="text-sm font-semibold text-neutral-900">{farm.size} {farm.unit}</div>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">{t.myFarm.activePlots}</div>
                          <div className="text-sm font-semibold text-neutral-900">{farm.plots} plots</div>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">{t.myFarm.soilType}</div>
                          <div className="text-sm font-semibold text-neutral-900">{farm.soilType}</div>
                        </div>
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                          <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">{t.myFarm.coordinates}</div>
                          <div className="text-sm font-semibold text-neutral-900 truncate">{farm.coordinates || 'N/A'}</div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full border-neutral-200 hover:bg-neutral-50 group/btn">
                        <MapPin className="w-4 h-4 mr-2 text-green-600 group-hover/btn:scale-110 transition-transform" />
                        {t.myFarm.viewOnMap}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Current Crops */}
          <TabsContent value="crops" className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsCropModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                {t.myFarm.addCrop}
              </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {crops.length === 0 ? (
                <div className="col-span-full py-12 text-center text-neutral-500 bg-neutral-50 rounded-2xl border-2 border-dashed">
                  {t.myFarm.noCrops}
                </div>
              ) : (
                crops.map((crop) => (
                  <Card key={crop._id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Sprout className="w-5 h-5 text-green-600" />
                          {crop.crop}
                        </CardTitle>
                        <CardDescription className="mt-1">{crop.variety}</CardDescription>
                      </div>
                      <Badge className={
                        crop.health === 'Excellent' ? 'bg-green-100 text-green-700' :
                        crop.health === 'Good' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }>
                        {crop.health}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-neutral-600">
                      <div>
                        <div className="mb-1">{t.myFarm.plotLocation}</div>
                        <div className="text-neutral-900">{crop.plot}</div>
                      </div>
                      <div>
                        <div className="mb-1">{t.myFarm.plantedArea}</div>
                        <div className="text-neutral-900">{crop.area} ha</div>
                      </div>
                      <div>
                        <div className="mb-1">{t.myFarm.plantingDate}</div>
                        <div className="text-neutral-900">{crop.plantingDate ? new Date(crop.plantingDate).toLocaleDateString() : 'N/A'}</div>
                      </div>
                      <div>
                        <div className="mb-1">{t.myFarm.expectedHarvest}</div>
                        <div className="text-neutral-900">{crop.expectedHarvest ? new Date(crop.expectedHarvest).toLocaleDateString() : 'N/A'}</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-neutral-600">{t.myFarm.growthStage}: {crop.growthStage}</span>
                        <span className="text-neutral-900">{crop.progress}%</span>
                      </div>
                      <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-600 rounded-full transition-all"
                          style={{ width: `${crop.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Activity className="w-4 h-4 mr-1" />
                        {t.myFarm.details}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 hover:text-red-600 hover:bg-red-50"
                        onClick={() => crop._id && handleDeleteCrop(crop._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {t.myFarm.remove}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )))}
            </div>
          </TabsContent>

          {/* Crop Calendar */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  {t.myFarm.activeCrops}
                </CardTitle>
                <CardDescription>{t.myFarm.activeCropsSub || 'Currently growing'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline.length === 0 ? (
                    <div className="py-8 text-center text-neutral-500">{t.myFarm.noScheduledActivities}</div>
                  ) : (
                    timeline.map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-xl">
                        <div className="w-24 text-center">
                          <div className="w-full py-2 bg-green-100 rounded-lg flex flex-col items-center justify-center mx-auto mb-1">
                            <span className="text-[10px] font-bold text-green-800 uppercase leading-none mb-1">{t.myFarm.phase}</span>
                            <span className="text-xs font-black text-green-700">{item.phase}</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">{item.dates}</div>
                          <div className="flex flex-wrap gap-2">
                            {item.activities.map((act: string, idx: number) => (
                              <Badge key={idx} variant="outline" className="bg-white">
                                {act}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Badge className={
                          item.status === 'completed' ? 'bg-green-100 text-green-700' :
                          item.status === 'current' ? 'bg-blue-100 text-blue-700 shadow-[0_0_10px_rgba(59,130,246,0.3)] border-blue-200' :
                          'bg-neutral-100 text-neutral-500'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                    )))}
                </div>
              </CardContent>
            </Card>

            {/* Season Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-600 mb-2">{t.myFarm.currentSeason}</div>
                  <div className="text-neutral-900 mb-1">Season A 2025/2026</div>
                  <p className="text-neutral-600">Oct 2025 - Jan 2026</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-600 mb-2">{t.myFarm.activeCrops}</div>
                    <div className="text-neutral-900 mb-1">{crops.length} {t.myFarm.currentCrops.toLowerCase()}</div>
                  <p className="text-neutral-600">{t.myFarm.across} {crops.reduce((acc, c) => acc + (c.area || 0), 0).toFixed(1)} {t.myFarm.hectares}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-600 mb-2">{t.myFarm.nextActivity}</div>
                  <div className="text-neutral-900 mb-1">Fertilization</div>
                  <p className="text-neutral-600">In 2 days</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Input Tracking */}
          <TabsContent value="inputs" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t.myFarm.inputApplicationHistory}</CardTitle>
                    <CardDescription>{t.myFarm.inputTrackingDescription}</CardDescription>
                  </div>
                  <Button className="bg-green-600 hover:bg-green-700" onClick={() => setIsInputModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    {t.myFarm.logInput}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {inputs.length === 0 ? (
                    <div className="py-12 text-center text-neutral-500 bg-neutral-50 rounded-2xl border-2 border-dashed">
                      {t.myFarm.noInputs}
                    </div>
                  ) : (
                    inputs.map((entry, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-xl hover:shadow-md transition-shadow">
                        <div className="w-24 text-center">
                          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest leading-none mb-1">Date</div>
                          <div className="text-xs font-bold text-neutral-900">{new Date(entry.date).toLocaleDateString()}</div>
                        </div>
                        <div className="flex-1 grid md:grid-cols-4 gap-4">
                          <div>
                            <div className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Crop</div>
                            <div className="text-sm text-neutral-900">{entry.crop}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Input Used</div>
                            <div className="text-sm text-neutral-900">{entry.input}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Quantity</div>
                            <div className="text-sm text-neutral-900">{entry.quantity}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Purpose</div>
                            <div className="text-sm text-neutral-900">{entry.purpose}</div>
                          </div>
                        </div>
                      </div>
                    )))}
                </div>
              </CardContent>
            </Card>

            {/* Input Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{t.myFarm.inputSummary} - Season A</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="text-green-700 mb-2">{t.myFarm.totalEntries}</div>
                    <div className="text-neutral-900">{inputs.length} {t.myFarm.applications}</div>
                    <p className="text-neutral-600">{t.myFarm.totalEntries || 'This season'}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-blue-700 mb-2">{t.myFarm.mostRecent}</div>
                    <div className="text-neutral-900 truncate">{inputs[0]?.input || 'N/A'}</div>
                    <p className="text-neutral-600">{inputs[0]?.date ? new Date(inputs[0].date).toLocaleDateString() : '-'}</p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <div className="text-orange-700 mb-2">{t.myFarm.lastCropTreated}</div>
                    <div className="text-neutral-900">{inputs[0]?.crop || 'N/A'}</div>
                    <p className="text-neutral-600">{t.myFarm.quantityLabel}: {inputs[0]?.quantity || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Farm Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl overflow-hidden border-none p-0">
          <DialogHeader className="p-6 bg-green-600 text-white">
            <DialogTitle className="text-2xl font-bold text-white">{editingFarm ? t.myFarm.editFarmTitle : t.myFarm.addFarmTitle}</DialogTitle>
            <DialogDescription className="text-green-50 mt-1">{t.myFarm.addFarmDesc}</DialogDescription>
          </DialogHeader>
          <div className="p-6 bg-white space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="farm-name" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t.myFarm.farmName}</Label>
                <Input 
                  id="farm-name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={t.myFarm.farmNamePlaceholder} 
                  className="rounded-xl border-neutral-200 focus:ring-green-500"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="location" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t.myFarm.location}</Label>
                <Input 
                  id="location" 
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={t.myFarm.locationPlaceholder} 
                  className="rounded-xl border-neutral-200 focus:ring-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t.myFarm.unit}</Label>
                <select 
                  id="unit" 
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 h-10 border rounded-xl bg-white border-neutral-200 focus:ring-green-500 focus:outline-none text-sm shadow-sm"
                >
                  <option value="hectares">Hectares</option>
                  <option value="acres">Acres</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="soil-type" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t.myFarm.soilType}</Label>
                <select 
                  id="soil-type" 
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full px-3 h-10 border rounded-xl bg-white border-neutral-200 focus:ring-green-500 focus:outline-none text-sm shadow-sm"
                >
                  {['Clay Loam', 'Sandy Loam', 'Silt Loam', 'Clay', 'Sandy'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="plots" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t.myFarm.activePlots}</Label>
                <Input 
                  id="plots" 
                  type="number" 
                  value={formData.plots}
                  onChange={(e) => setFormData({ ...formData, plots: parseInt(e.target.value) })}
                  className="rounded-xl border-neutral-200 focus:ring-green-500"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="coordinates" className="text-xs font-bold text-neutral-500 uppercase tracking-wider">{t.myFarm.coordinates}</Label>
                <Input 
                  id="coordinates" 
                  value={formData.coordinates}
                  onChange={(e) => setFormData({ ...formData, coordinates: e.target.value })}
                  placeholder="-1.5008, 29.6346" 
                  className="rounded-xl border-neutral-200 focus:ring-green-500"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="p-6 pt-0 bg-white">
            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={() => setIsModalOpen(false)}>
                {t.myFarm.canceling}
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700 rounded-xl h-11 font-bold shadow-lg shadow-green-500/20" 
                onClick={handleSaveFarm}
                disabled={saving}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {t.myFarm.saveFarm}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    {/* Crop Modal */}
    <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl overflow-hidden p-0 border-none">
        <DialogHeader className="p-6 bg-green-600 text-white">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Sprout className="w-6 h-6" />
            {editingCrop ? t.myFarm.editCropTitle : t.myFarm.addCropTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 bg-white space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t.myFarm.selectFarm}</Label>
              <select 
                className="w-full h-11 px-3 border border-neutral-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
                value={cropFormData.farmId}
                onChange={(e) => setCropFormData({ ...cropFormData, farmId: e.target.value })}
              >
                <option value="">{t.myFarm.selectFarmPlaceholder}</option>
                {farms.map(f => (
                  <option key={f._id} value={f._id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t.myFarm.cropName}</Label>
              <Input 
                value={cropFormData.crop}
                onChange={(e) => setCropFormData({ ...cropFormData, crop: e.target.value })}
                placeholder="e.g. Maize"
                className="rounded-xl border-neutral-200 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t.myFarm.variety}</Label>
              <Input 
                value={cropFormData.variety}
                onChange={(e) => setCropFormData({ ...cropFormData, variety: e.target.value })}
                placeholder="e.g. Hybrid ZM521"
                className="rounded-xl border-neutral-200 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t.myFarm.plantedArea} (ha)</Label>
              <Input 
                type="number"
                value={cropFormData.area}
                onChange={(e) => setCropFormData({ ...cropFormData, area: parseFloat(e.target.value) })}
                className="rounded-xl border-neutral-200 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t.myFarm.growthStage}</Label>
              <select 
                className="w-full h-11 px-3 border border-neutral-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
                value={cropFormData.growthStage}
                onChange={(e) => setCropFormData({ ...cropFormData, growthStage: e.target.value })}
              >
                {['Germination', 'Vegetative', 'Flowering', 'Tuber Formation', 'Maturation', 'Harvesting'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t.myFarm.plantingDate}</Label>
              <Input 
                type="date"
                value={cropFormData.plantingDate}
                onChange={(e) => setCropFormData({ ...cropFormData, plantingDate: e.target.value })}
                className="rounded-xl border-neutral-200 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t.myFarm.expectedHarvest}</Label>
              <Input 
                type="date"
                value={cropFormData.expectedHarvest}
                onChange={(e) => setCropFormData({ ...cropFormData, expectedHarvest: e.target.value })}
                className="rounded-xl border-neutral-200 h-11"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 pt-0 bg-white">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 h-12 rounded-xl text-white font-bold text-lg shadow-lg shadow-green-500/20"
            onClick={handleSaveCrop}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
            {t.myFarm.saveCrop}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Input Modal */}
    <Dialog open={isInputModalOpen} onOpenChange={setIsInputModalOpen}>
      <DialogContent className="sm:max-w-[450px] rounded-2xl overflow-hidden p-0 border-none">
        <DialogHeader className="p-6 bg-green-600 text-white">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Droplets className="w-6 h-6" />
            {t.myFarm.logInputTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 bg-white space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t.myFarm.selectCrop}</Label>
            <select 
              className="w-full h-11 px-3 border border-neutral-200 rounded-xl bg-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
              value={inputFormData.crop}
              onChange={(e) => setInputFormData({ ...inputFormData, crop: e.target.value })}
            >
              <option value="">{t.myFarm.selectCropPlaceholder}</option>
              {crops.map(c => (
                <option key={c._id} value={c.crop}>{c.crop} ({c.variety})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t.myFarm.inputName}</Label>
              <Input 
                value={inputFormData.input}
                onChange={(e) => setInputFormData({ ...inputFormData, input: e.target.value })}
                placeholder="e.g. NPK 17-17-17"
                className="rounded-xl border-neutral-200 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t.myFarm.quantity}</Label>
              <Input 
                value={inputFormData.quantity}
                onChange={(e) => setInputFormData({ ...inputFormData, quantity: e.target.value })}
                placeholder="e.g. 25kg"
                className="rounded-xl border-neutral-200 h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t.myFarm.date}</Label>
              <Input 
                type="date"
                value={inputFormData.date}
                onChange={(e) => setInputFormData({ ...inputFormData, date: e.target.value })}
                className="rounded-xl border-neutral-200 h-11"
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{t.myFarm.purpose}</Label>
              <Input 
                value={inputFormData.purpose}
                onChange={(e) => setInputFormData({ ...inputFormData, purpose: e.target.value })}
                placeholder="e.g. Top dressing"
                className="rounded-xl border-neutral-200 h-11"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 pt-0 bg-white">
          <Button 
            className="w-full bg-green-600 hover:bg-green-700 h-12 rounded-xl text-white font-bold text-lg shadow-lg shadow-green-500/20"
            onClick={handleSaveInput}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
            {t.myFarm.saveInput}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
}
