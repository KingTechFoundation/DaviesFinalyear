import { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from './ui/select';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from './ui/dialog';
import {
  Calendar, CheckCircle2, Clock, AlertCircle, Sprout, Droplets,
  Bug, Leaf, Plus, Trash2, Edit2, BarChart2
} from 'lucide-react';
import type { Screen } from '../App';
import { useTranslation } from '../i18n/LanguageContext';
import { tasksAPI, cropsAPI } from '../services/api';
import { toast } from 'sonner';

/* ─── Types ─────────────────────────────────────────── */
interface Task {
  _id: string;
  title: string;
  crop?: string;
  date?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  description?: string;
  result?: string;
  completedDate?: string;
}

interface TimelinePhase {
  _id: string;
  phase: string;
  status: 'completed' | 'current' | 'upcoming';
  dates?: string;
  activities: string[];
}

interface Crop {
  _id: string;
  crop: string;
  area?: number;
  growthStage?: string;
  health?: string;
  progress?: number;
  expectedHarvest?: string;
}

interface FarmingPlanProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  role: string;
}

/* ─── Helpers ────────────────────────────────────────── */
const EMPTY_FORM = { title: '', crop: '', date: '', priority: 'medium', description: '' };

function getTaskIcon(title: string) {
  const lc = title.toLowerCase();
  if (lc.includes('irrigation') || lc.includes('water')) return Droplets;
  if (lc.includes('pest') || lc.includes('bug') || lc.includes('spray')) return Bug;
  if (lc.includes('fertilizer') || lc.includes('npk') || lc.includes('nutrient')) return Leaf;
  return Sprout;
}

function priorityBg(p: string) {
  if (p === 'high') return 'bg-orange-100';
  if (p === 'medium') return 'bg-blue-100';
  return 'bg-green-100';
}
function priorityText(p: string) {
  if (p === 'high') return 'text-orange-600';
  if (p === 'medium') return 'text-blue-600';
  return 'text-green-600';
}

/* ─── Component ──────────────────────────────────────── */
export function FarmingPlan({ onNavigate, onLogout, role }: FarmingPlanProps) {
  const { t } = useTranslation();

  /* state */
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeline, setTimeline] = useState<TimelinePhase[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);

  /* modal state */
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  /* derived */
  const pending  = tasks.filter(t => t.status !== 'completed');
  const done     = tasks.filter(t => t.status === 'completed');
  const pct      = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;
  const nextTask = pending.find(t => t.priority === 'high') ?? pending[0];

  /* ── fetch ─────────────────────────────────────────── */
  const fetchAll = async () => {
    setLoading(true);
    try {
      const [td, tl, cr] = await Promise.all([
        tasksAPI.getAll(),
        tasksAPI.getTimeline(),
        cropsAPI.getAll(),
      ]);
      setTasks(td);
      setTimeline(tl);
      setCrops(cr);
    } catch {
      toast.error(t.myFarm.fetchError);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  /* ── CRUD ──────────────────────────────────────────── */
  const openAdd = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM });
    setModalOpen(true);
  };

  const openEdit = (task: Task) => {
    setEditing(task);
    setForm({
      title: task.title,
      crop: task.crop ?? '',
      date: task.date ? new Date(task.date).toISOString().split('T')[0] : '',
      priority: task.priority,
      description: task.description ?? '',
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setForm({ ...EMPTY_FORM });
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error(t.toast.fillRequired); return; }
    setSaving(true);
    try {
      if (editing) {
        await tasksAPI.update(editing._id, form);
        toast.success(t.farmingPlan.updateOk);
      } else {
        await tasksAPI.create(form);
        toast.success(t.farmingPlan.saveOk);
      }
      closeModal();
      fetchAll();
    } catch {
      toast.error(t.farmingPlan.saveFail);
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async (task: Task) => {
    try {
      await tasksAPI.update(task._id, { status: 'completed', completedDate: new Date().toISOString() });
      toast.success(t.farmingPlan.completed);
      fetchAll();
    } catch {
      toast.error(t.farmingPlan.saveFail);
    }
  };

  const handleReopen = async (task: Task) => {
    try {
      await tasksAPI.update(task._id, { status: 'pending', completedDate: null });
      fetchAll();
    } catch {
      toast.error(t.farmingPlan.saveFail);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t.farmingPlan.confirmDelete)) return;
    try {
      await tasksAPI.delete(id);
      toast.success(t.farmingPlan.deleteOk);
      fetchAll();
    } catch {
      toast.error(t.farmingPlan.deleteFail);
    }
  };

  /* ── Render ────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="plan" onNavigate={onNavigate} onLogout={onLogout} role={role} />

      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-green-900 mb-1">{t.farmingPlan.title}</h1>
            <p className="text-neutral-600 text-sm">{t.farmingPlan.subtitle}</p>
          </div>
          <Button onClick={openAdd} className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-2" />
            {t.farmingPlan.addTask}
          </Button>
        </div>

        {/* Stats Banner */}
        <Card className="mb-8 bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-green-100 text-sm mb-1">{t.farmingPlan.activeTasks}</div>
                <div className="text-3xl font-bold">{pending.length}</div>
              </div>
              <div>
                <div className="text-green-100 text-sm mb-1">{t.farmingPlan.completionRate}</div>
                <div className="text-3xl font-bold">{pct}%</div>
              </div>
              <div>
                <div className="text-green-100 text-sm mb-1">{t.farmingPlan.nextCriticalTask}</div>
                <div className="font-semibold truncate">{nextTask?.title ?? '—'}</div>
              </div>
              <div>
                <div className="text-green-100 text-sm mb-1">{t.myFarm.activeCrops}</div>
                <div className="text-3xl font-bold">{crops.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Left column (span 2) ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Upcoming / Active Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    {t.farmingPlan.upcomingTasks}
                  </CardTitle>
                  <CardDescription className="mt-0.5">{t.farmingPlan.upcomingTasksDesc}</CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={openAdd}>
                  <Plus className="w-4 h-4 mr-1" /> {t.farmingPlan.addTask}
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  <div className="py-10 text-center text-neutral-400">{t.myFarm.loading}</div>
                ) : pending.length === 0 ? (
                  <div className="py-10 text-center text-neutral-500 italic">
                    {t.farmingPlan.noTasks}
                  </div>
                ) : pending.map(task => {
                  const Icon = getTaskIcon(task.title);
                  return (
                    <div
                      key={task._id}
                      className={`p-4 border-2 rounded-xl transition-all hover:shadow-sm ${
                        task.priority === 'high'
                          ? 'border-orange-200 bg-orange-50'
                          : task.priority === 'medium'
                            ? 'border-blue-100 bg-blue-50/40'
                            : 'border-neutral-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* icon */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${priorityBg(task.priority)}`}>
                          <Icon className={`w-5 h-5 ${priorityText(task.priority)}`} />
                        </div>

                        {/* body */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-0.5">
                            <span className="font-semibold text-neutral-900">{task.title}</span>
                            <Badge
                              variant={task.priority === 'high' ? 'destructive' : 'default'}
                              className="text-[11px] px-1.5 py-0 h-5"
                            >
                              {task.priority === 'high'
                                ? t.farmingPlan.urgent
                                : task.priority === 'medium'
                                  ? 'Medium'
                                  : t.farmingPlan.normal}
                            </Badge>
                          </div>
                          {task.description && (
                            <p className="text-neutral-600 text-sm mb-1.5">{task.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
                            {task.crop && (
                              <span className="flex items-center gap-1">
                                <Sprout className="w-3.5 h-3.5" /> {task.crop}
                              </span>
                            )}
                            {task.date && (
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(task.date).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            size="sm"
                            className="bg-green-600 text-white hover:bg-green-700 h-8 text-xs px-2"
                            onClick={() => handleComplete(task)}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            {t.farmingPlan.markComplete}
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400 hover:text-blue-600" onClick={() => openEdit(task)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-neutral-400 hover:text-red-600" onClick={() => handleDelete(task._id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Seasonal Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>{t.farmingPlan.seasonalTimeline}</CardTitle>
                <CardDescription>Season A 2025 / 2026</CardDescription>
              </CardHeader>
              <CardContent>
                {timeline.length === 0 ? (
                  <div className="py-6 text-center text-neutral-500 italic text-sm">
                    {t.myFarm.noScheduledActivities}
                  </div>
                ) : (
                  <div className="space-y-0">
                    {timeline.map((phase, i) => (
                      <div key={phase._id} className="flex items-start gap-4">
                        {/* timeline indicator */}
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            phase.status === 'completed' ? 'bg-green-500' :
                            phase.status === 'current'   ? 'bg-blue-500'  : 'bg-neutral-300'
                          }`}>
                            {phase.status === 'completed' && <CheckCircle2 className="w-5 h-5 text-white" />}
                            {phase.status === 'current'   && <Clock        className="w-5 h-5 text-white" />}
                            {phase.status === 'upcoming'  && <div className="w-3 h-3 bg-white rounded-full" />}
                          </div>
                          {i < timeline.length - 1 && (
                            <div className={`w-0.5 flex-1 min-h-[2.5rem] ${phase.status === 'completed' ? 'bg-green-400' : 'bg-neutral-200'}`} />
                          )}
                        </div>

                        {/* content */}
                        <div className="flex-1 pb-6 pt-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-neutral-900">{phase.phase}</span>
                            <Badge
                              className={
                                phase.status === 'completed' ? 'bg-green-100 text-green-700 border-0' :
                                phase.status === 'current'   ? 'bg-blue-100 text-blue-700 border-0'  :
                                'bg-neutral-100 text-neutral-600 border-0'
                              }
                            >
                              {phase.status === 'completed' ? t.farmingPlan.completed :
                               phase.status === 'current'   ? t.farmingPlan.inProgress :
                               t.farmingPlan.upcoming}
                            </Badge>
                          </div>
                          {phase.dates && (
                            <p className="text-xs text-neutral-500 mb-2">{phase.dates}</p>
                          )}
                          <div className="flex flex-wrap gap-1.5">
                            {phase.activities.map((a, ai) => (
                              <span key={ai} className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-xs">
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recently Completed */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  {t.farmingPlan.recentlyCompleted}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {done.length === 0 ? (
                  <div className="py-6 text-center text-neutral-500 italic text-sm">
                    {t.myFarm.noScheduledActivities}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {done.map(task => (
                      <div key={task._id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg group">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-neutral-900 text-sm truncate">
                            {task.title}{task.crop ? ` — ${task.crop}` : ''}
                          </div>
                          {task.result && (
                            <div className="text-xs text-neutral-600 truncate">{task.result}</div>
                          )}
                        </div>
                        <div className="text-xs text-neutral-400 flex-shrink-0">
                          {task.completedDate ? new Date(task.completedDate).toLocaleDateString() : ''}
                        </div>
                        {/* reopen + delete on hover */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon" variant="ghost"
                            className="h-7 w-7 text-neutral-400 hover:text-blue-600"
                            title="Reopen task"
                            onClick={() => handleReopen(task)}
                          >
                            <Clock className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="icon" variant="ghost"
                            className="h-7 w-7 text-neutral-400 hover:text-red-600"
                            onClick={() => handleDelete(task._id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-6">

            {/* Crop Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-green-600" />
                  {t.farmingPlan.activeCropsProgress}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {crops.length === 0 ? (
                  <div className="py-4 text-center text-neutral-500 italic text-sm">{t.myFarm.noCrops}</div>
                ) : crops.map((crop, i) => (
                  <div key={crop._id ?? i} className="p-3 border rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-neutral-900">{crop.crop}</span>
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">{crop.health ?? 'Good'}</Badge>
                    </div>
                    {crop.area != null && (
                      <div className="text-xs text-neutral-500 mb-1.5">{crop.area} ha</div>
                    )}
                    <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
                      <span>{t.farmingPlan.growthStage}: {crop.growthStage ?? '—'}</span>
                      <span className="font-bold">{crop.progress ?? 0}%</span>
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-600 rounded-full transition-all duration-700"
                        style={{ width: `${crop.progress ?? 0}%` }}
                      />
                    </div>
                    {crop.expectedHarvest && (
                      <div className="mt-1.5 text-xs text-neutral-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {t.myFarm.expectedHarvest}: {new Date(crop.expectedHarvest).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Weather Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>{t.farmingPlan.weatherAlerts}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="font-semibold text-neutral-900 text-sm">Rain Alert</span>
                  </div>
                  <p className="text-neutral-600 text-xs">Skip irrigation for next 2 days due to expected rainfall</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-neutral-900 text-sm">Optimal Window</span>
                  </div>
                  <p className="text-neutral-600 text-xs">Perfect conditions for pest treatment on Friday</p>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle>{t.farmingPlan.aiInsights}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-neutral-600">
                {[
                  'Your maize crop is outperforming regional average by 18%',
                  'Consider intercropping beans with marigolds for natural pest control',
                  'Optimal time for soil testing starts in 2 weeks',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t.farmingPlan.quickActions}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-sm" onClick={() => onNavigate('assistant')}>
                  <Bug className="w-4 h-4 mr-2 text-green-600" />
                  {t.farmingPlan.askAI}
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" onClick={() => onNavigate('weather')}>
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  {t.farmingPlan.checkWeather}
                </Button>
                <Button variant="outline" className="w-full justify-start text-sm" onClick={() => onNavigate('soil')}>
                  <Sprout className="w-4 h-4 mr-2 text-amber-600" />
                  {t.farmingPlan.viewSoil}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* ── Add / Edit Task Modal ── */}
      <Dialog open={modalOpen} onOpenChange={(open) => { if (!open) closeModal(); }}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-2xl">

          {/* Gradient Header */}
          <div className={`px-6 pt-6 pb-5 ${editing
            ? 'bg-gradient-to-r from-blue-600 to-blue-700'
            : 'bg-gradient-to-r from-green-600 to-green-700'
          } text-white`}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                {editing ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </div>
              <DialogTitle className="text-xl font-bold text-white m-0">
                {editing ? t.farmingPlan.editTask : t.farmingPlan.addTask}
              </DialogTitle>
            </div>
            <DialogDescription className="text-white/70 text-sm mt-1 ml-12">
              {editing
                ? 'Update the details of your existing task.'
                : 'Fill in the details to schedule a new farming task.'}
            </DialogDescription>
          </div>

          {/* Form Body */}
          <div className="px-6 py-5 space-y-4">

            {/* Task Title */}
            <div className="space-y-1.5">
              <Label htmlFor="fp-title" className="text-sm font-semibold text-neutral-700">
                {t.farmingPlan.taskTitle}
                <span className="text-red-500 ml-0.5">*</span>
              </Label>
              <Input
                id="fp-title"
                placeholder="e.g., Apply NPK fertilizer on maize field"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="h-10 border-neutral-200 focus:border-green-400 focus:ring-green-400/20 rounded-lg"
              />
            </div>

            {/* Crop + Date row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="fp-crop" className="text-sm font-semibold text-neutral-700 flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-green-600" />
                  {t.farmingPlan.taskCrop}
                </Label>
                <Input
                  id="fp-crop"
                  placeholder="e.g., Maize"
                  value={form.crop}
                  onChange={e => setForm({ ...form, crop: e.target.value })}
                  className="h-10 border-neutral-200 focus:border-green-400 rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fp-date" className="text-sm font-semibold text-neutral-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  {t.farmingPlan.taskDate}
                </Label>
                <Input
                  id="fp-date"
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className="h-10 border-neutral-200 focus:border-green-400 rounded-lg"
                />
              </div>
            </div>

            {/* Priority — visual card selector */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-neutral-700">{t.farmingPlan.taskPriority}</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'low',    label: t.farmingPlan.normal, emoji: '🟢', activeBg: 'bg-green-50',  activeBorder: 'border-green-500',  activeText: 'text-green-700'  },
                  { value: 'medium', label: 'Medium',              emoji: '🔵', activeBg: 'bg-blue-50',   activeBorder: 'border-blue-500',   activeText: 'text-blue-700'   },
                  { value: 'high',   label: t.farmingPlan.urgent,  emoji: '🔴', activeBg: 'bg-orange-50', activeBorder: 'border-orange-500', activeText: 'text-orange-700' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setForm({ ...form, priority: opt.value })}
                    className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border-2 transition-all text-center cursor-pointer select-none
                      ${form.priority === opt.value
                        ? `${opt.activeBg} ${opt.activeBorder} ${opt.activeText} shadow-sm scale-[1.02]`
                        : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:bg-neutral-50'
                      }`}
                  >
                    <span className="text-lg leading-none">{opt.emoji}</span>
                    <span className="text-xs font-semibold mt-0.5">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="fp-desc" className="text-sm font-semibold text-neutral-700">{t.farmingPlan.taskDesc}</Label>
              <Textarea
                id="fp-desc"
                placeholder="Optional notes, quantities, or specific instructions..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="border-neutral-200 focus:border-green-400 rounded-lg resize-none text-sm"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-neutral-50 border-t border-neutral-100">
            <Button variant="outline" onClick={closeModal} className="rounded-lg px-5">
              {t.myFarm.canceling}
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || !form.title.trim()}
              className={`rounded-lg px-6 font-semibold ${editing
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-green-600 hover:bg-green-700'
              } text-white`}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {t.farmingPlan.saveTask}
                </span>
              )}
            </Button>
          </div>

        </DialogContent>
      </Dialog>

    </div>
  );
}
