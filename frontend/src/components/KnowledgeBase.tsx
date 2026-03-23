import { useState, useEffect, useRef } from 'react';
import { Navigation } from './Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import {
  BookOpen, Video, Search, FileText, TrendingUp, TrendingDown,
  DollarSign, Download, Play, ExternalLink, Star, X, Minus,
  ChevronRight
} from 'lucide-react';
import type { Screen } from '../App';
import { useTranslation } from '../i18n/LanguageContext';
import { knowledgeAPI, marketAPI } from '../services/api';
import { toast } from 'sonner';

/* ─── Types ─────────────────────────────────────────────────── */
interface Article {
  _id: string;
  title: string;
  description?: string;
  type: 'guide' | 'video';
  crops?: string[];
  duration?: string;
  downloads?: number;
  rating?: number;
  offline?: boolean;
  content?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  language?: string;
  views?: number;
}

interface Scheme {
  _id: string;
  title: string;
  description?: string;
  eligibility?: string;
  benefits?: string;
  deadline?: string;
  type: string;
  schemeUrl?: string;
}

interface MarketItem {
  _id: string;
  crop: string;
  currentPrice: number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  unit: string;
  market?: string;
}

interface Props {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  role: string;
}

/* ─── Helpers ────────────────────────────────────────────────── */
const SCHEME_COLORS: Record<string, string> = {
  Subsidy:        'bg-green-100 text-green-700',
  Infrastructure: 'bg-blue-100 text-blue-700',
  Insurance:      'bg-purple-100 text-purple-700',
  Equipment:      'bg-orange-100 text-orange-700',
  Training:       'bg-teal-100 text-teal-700',
};

/* ─── Component ──────────────────────────────────────────────── */
export function KnowledgeBase({ onNavigate, onLogout, role }: Props) {
  const { t } = useTranslation();
  const kb = t.knowledgeBase;

  const [query, setQuery]          = useState('');
  const [loading, setLoading]      = useState(true);
  const [guides,  setGuides]       = useState<Article[]>([]);
  const [videos,  setVideos]       = useState<Article[]>([]);
  const [schemes, setSchemes]      = useState<Scheme[]>([]);
  const [market,  setMarket]       = useState<MarketItem[]>([]);

  // modals
  const [guideModal, setGuideModal] = useState<Article | null>(null);
  const [videoModal, setVideoModal] = useState<Article | null>(null);

  // search debounce
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── fetch ─────────────────────────────────────────────────── */
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [g, v, s, m] = await Promise.all([
          knowledgeAPI.getGuides(),
          knowledgeAPI.getVideos(),
          knowledgeAPI.getSchemes(),
          marketAPI.getAll(),
        ]);
        setGuides(g);
        setVideos(v);
        setSchemes(s);
        setMarket(m);
      } catch {
        toast.error(t.myFarm.fetchError);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* ── search ────────────────────────────────────────────────── */
  const handleSearch = (val: string) => {
    setQuery(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!val.trim()) { return; }
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await knowledgeAPI.search(val);
        const arts: Article[] = res.articles || [];
        setGuides(arts.filter((a: Article) => a.type === 'guide'));
        setVideos(arts.filter((a: Article) => a.type === 'video'));
        setSchemes(res.schemes || []);
      } catch { /* silent */ }
    }, 500);
  };

  const clearSearch = async () => {
    setQuery('');
    setLoading(true);
    try {
      const [g, v, s] = await Promise.all([
        knowledgeAPI.getGuides(),
        knowledgeAPI.getVideos(),
        knowledgeAPI.getSchemes(),
      ]);
      setGuides(g); setVideos(v); setSchemes(s);
    } finally { setLoading(false); }
  };

  /* ── open video (increment views) ──────────────────────────── */
  const openVideo = async (video: Article) => {
    setVideoModal(video);
    try { await knowledgeAPI.incrementViews(video._id); } catch { /* silent */ }
  };

  /* ── derived market stats ──────────────────────────────────── */
  const highestPriceItem = market.reduce((max, m) => m.currentPrice > (max?.currentPrice ?? 0) ? m : max, market[0]);
  const bestPerformer    = [...market].filter(m => m.trend === 'up').sort((a,b) => {
    const pa = parseFloat(a.change); const pb = parseFloat(b.change); return pb - pa;
  })[0];
  const risingCount      = market.filter(m => m.trend === 'up').length;

  /* ─── Render ─────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation currentScreen="knowledge" onNavigate={onNavigate} onLogout={onLogout} role={role} />

      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-green-900 mb-1">{kb.title}</h1>
          <p className="text-neutral-600 text-sm">{kb.subtitle}</p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                value={query}
                onChange={e => handleSearch(e.target.value)}
                placeholder={kb.searchPlaceholder}
                className="pl-10 pr-10"
              />
              {query && (
                <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="py-20 text-center text-neutral-500">{kb.loading}</div>
        ) : (
          <Tabs defaultValue="guides" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="guides">{kb.tabGuides}</TabsTrigger>
              <TabsTrigger value="videos">{kb.tabVideos}</TabsTrigger>
              <TabsTrigger value="schemes">{kb.tabSchemes}</TabsTrigger>
              <TabsTrigger value="market">{kb.tabMarket}</TabsTrigger>
            </TabsList>

            {/* ── CROP GUIDES ── */}
            <TabsContent value="guides">
              {guides.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 italic">{kb.noGuides}</div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                  {guides.map(guide => (
                    <Card key={guide._id} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="flex items-center gap-2 text-base leading-snug">
                              <BookOpen className="w-5 h-5 text-green-600 flex-shrink-0" />
                              {guide.title}
                            </CardTitle>
                            <CardDescription className="mt-1.5">{guide.description}</CardDescription>
                          </div>
                          {guide.offline && (
                            <Badge className="bg-green-100 text-green-700 border-0 text-xs flex-shrink-0">
                              <Download className="w-3 h-3 mr-1" />{kb.offline}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* crop tags */}
                        {guide.crops && guide.crops.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {guide.crops.map((crop, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{crop}</Badge>
                            ))}
                          </div>
                        )}

                        {/* meta */}
                        <div className="flex items-center justify-between text-sm text-neutral-600">
                          <div className="flex items-center gap-3">
                            {guide.rating != null && (
                              <span className="flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                {guide.rating}
                              </span>
                            )}
                            {guide.duration && <span>{guide.duration}</span>}
                          </div>
                          {guide.downloads != null && (
                            <span>{guide.downloads.toLocaleString()} {kb.downloads}</span>
                          )}
                        </div>

                        {/* actions */}
                        <div className="flex gap-2 pt-1">
                          <Button
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => setGuideModal(guide)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            {kb.readGuide}
                          </Button>
                          <Button variant="outline" size="icon" title="Download">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ── VIDEO TUTORIALS ── */}
            <TabsContent value="videos">
              {videos.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 italic">{kb.noVideos}</div>
              ) : (
                <div className="grid lg:grid-cols-2 gap-6">
                  {videos.map(video => (
                    <Card key={video._id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group" onClick={() => openVideo(video)}>
                      {/* thumbnail */}
                      <div className="relative">
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="w-full h-44 object-cover"
                            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/640x360/16a34a/white?text=Video'; }}
                          />
                        ) : (
                          <div className="w-full h-44 bg-green-900 flex items-center justify-center">
                            <Video className="w-12 h-12 text-green-400" />
                          </div>
                        )}
                        {/* play overlay */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                            <Play className="w-7 h-7 text-green-600 ml-1" />
                          </div>
                        </div>
                        {/* duration badge */}
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded font-mono">
                            {video.duration}
                          </div>
                        )}
                      </div>

                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Video className="w-4 h-4 text-green-600 flex-shrink-0" />
                          {video.title}
                        </CardTitle>
                        {video.description && (
                          <CardDescription className="mt-0.5">{video.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        <div className="flex items-center justify-between text-sm text-neutral-600">
                          {video.language && (
                            <Badge variant="outline" className="text-xs">{kb.language}: {video.language}</Badge>
                          )}
                          {video.views != null && (
                            <span>{video.views.toLocaleString()} {kb.views}</span>
                          )}
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={e => { e.stopPropagation(); openVideo(video); }}>
                          <Play className="w-4 h-4 mr-2" />
                          {kb.watchVideo}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* ── GOVERNMENT SCHEMES ── */}
            <TabsContent value="schemes" className="space-y-6">
              {schemes.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 italic">{kb.noSchemes}</div>
              ) : (
                <div className="space-y-4">
                  {schemes.map(scheme => (
                    <Card key={scheme._id} className="hover:shadow-sm transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <CardTitle className="text-base">{scheme.title}</CardTitle>
                            {scheme.description && (
                              <CardDescription className="mt-1">{scheme.description}</CardDescription>
                            )}
                          </div>
                          <Badge className={`${SCHEME_COLORS[scheme.type] ?? 'bg-neutral-100 text-neutral-700'} border-0 flex-shrink-0`}>
                            {scheme.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                          <div>
                            <div className="text-neutral-500 font-medium mb-0.5">{kb.eligibility}</div>
                            <div className="text-neutral-900">{scheme.eligibility}</div>
                          </div>
                          <div>
                            <div className="text-neutral-500 font-medium mb-0.5">{kb.benefits}</div>
                            <div className="text-neutral-900">{scheme.benefits}</div>
                          </div>
                          <div>
                            <div className="text-neutral-500 font-medium mb-0.5">{kb.deadline}</div>
                            <div className="text-neutral-900">{scheme.deadline}</div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => window.open(scheme.schemeUrl || 'https://www.minagri.gov.rw/', '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {kb.applyNow}
                          </Button>
                          <Button variant="outline">{kb.learnMore}</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* AI help banner */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-900 mb-1">{kb.schemesAITitle}</div>
                      <p className="text-neutral-600 text-sm mb-3">{kb.schemesAIDesc}</p>
                      <Button onClick={() => onNavigate('assistant')} variant="outline" className="bg-white text-sm">
                        {kb.askAIHelp} <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── MARKET PRICES ── */}
            <TabsContent value="market" className="space-y-6">
              {market.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 italic">{kb.noMarket}</div>
              ) : (
                <>
                  {/* Prices table */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        {kb.marketTitle}
                      </CardTitle>
                      <CardDescription>{kb.marketSubtitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {market.map(item => (
                          <div key={item._id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition-shadow">
                            <div className="flex items-center gap-4">
                              <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center">
                                <span className="text-green-700 font-bold text-lg">{item.crop.charAt(0)}</span>
                              </div>
                              <div>
                                <div className="font-semibold text-neutral-900">{item.crop}</div>
                                <div className="text-neutral-500 text-xs">{item.unit}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-neutral-900 text-lg">
                                {item.currentPrice.toLocaleString()} RWF
                              </div>
                              <div className={`flex items-center justify-end gap-1 text-sm font-medium ${
                                item.trend === 'up'   ? 'text-green-600' :
                                item.trend === 'down' ? 'text-red-600'   : 'text-neutral-500'
                              }`}>
                                {item.trend === 'up'      && <TrendingUp   className="w-4 h-4" />}
                                {item.trend === 'down'    && <TrendingDown className="w-4 h-4" />}
                                {item.trend === 'neutral' && <Minus        className="w-4 h-4" />}
                                {item.change}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Summary cards */}
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardContent className="p-5">
                        <div className="text-neutral-500 text-sm mb-1.5">{kb.highestPrice}</div>
                        {highestPriceItem && (
                          <>
                            <div className="font-bold text-neutral-900">{highestPriceItem.crop} — {highestPriceItem.currentPrice.toLocaleString()} RWF/kg</div>
                            <div className={`mt-1 text-sm font-medium flex items-center gap-1 ${highestPriceItem.trend === 'up' ? 'text-green-600' : highestPriceItem.trend === 'down' ? 'text-red-600' : 'text-neutral-500'}`}>
                              {highestPriceItem.change}
                            </div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-5">
                        <div className="text-neutral-500 text-sm mb-1.5">{kb.bestPerformer}</div>
                        {bestPerformer ? (
                          <>
                            <div className="font-bold text-neutral-900">{bestPerformer.crop}</div>
                            <div className="mt-1 text-green-600 font-medium text-sm">{bestPerformer.change} this week</div>
                          </>
                        ) : <div className="font-bold text-neutral-900">—</div>}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-5">
                        <div className="text-neutral-500 text-sm mb-1.5">{kb.marketTrend}</div>
                        <div className="font-bold text-neutral-900">
                          {risingCount > market.length / 2 ? 'Generally Positive' : 'Mixed'}
                        </div>
                        <div className="mt-1 text-green-600 text-sm">{risingCount} of {market.length} crops rising</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Alert banner */}
                  {bestPerformer && (
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-neutral-900 mb-1">Price Alert</div>
                            <p className="text-neutral-700 text-sm">
                              {bestPerformer.crop} prices are rising ({bestPerformer.change}).
                              {highestPriceItem?.crop !== bestPerformer.crop &&
                                ` ${highestPriceItem?.crop ?? ''} has the highest price at ${highestPriceItem?.currentPrice.toLocaleString()} RWF/kg.`}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* ── Guide Reader Modal ── */}
      <Dialog open={!!guideModal} onOpenChange={open => { if (!open) setGuideModal(null); }}>
        <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 bg-gradient-to-r from-green-600 to-green-700 text-white flex-shrink-0">
            <DialogTitle className="text-white text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              {guideModal?.title}
            </DialogTitle>
            <DialogDescription className="text-white/75 text-sm mt-1">
              {guideModal?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* meta */}
            <div className="flex flex-wrap gap-3 mb-5 text-sm text-neutral-600 border-b pb-4">
              {guideModal?.crops?.map((c, i) => <Badge key={i} variant="outline">{c}</Badge>)}
              {guideModal?.rating && (
                <span className="flex items-center gap-1 ml-auto">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />{guideModal.rating}
                </span>
              )}
              {guideModal?.duration && <span>{guideModal.duration}</span>}
            </div>
            {/* content */}
            {guideModal?.content ? (
              <div className="prose prose-sm max-w-none text-neutral-800 space-y-4">
                {guideModal.content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-green-800 mt-6 mb-2">{line.slice(3)}</h2>;
                  if (line.startsWith('### ')) return <h3 key={i} className="font-bold text-neutral-800 mt-4 mb-1">{line.slice(4)}</h3>;
                  if (line.startsWith('- ')) return <li key={i} className="ml-4 text-neutral-700">{line.slice(2)}</li>;
                  if (line.trim() === '') return <div key={i} className="h-2" />;
                  return <p key={i} className="text-neutral-700 leading-relaxed">{line}</p>;
                })}
              </div>
            ) : (
              <p className="text-neutral-500 italic">Full guide content coming soon.</p>
            )}
          </div>
          <div className="px-6 py-4 border-t flex justify-end gap-2 bg-neutral-50">
            <Button variant="outline" onClick={() => setGuideModal(null)}>{kb.closeModal}</Button>
            <Button className="bg-green-600 hover:bg-green-700"><Download className="w-4 h-4 mr-2" /> Download PDF</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Video Player Modal ── */}
      <Dialog open={!!videoModal} onOpenChange={open => { if (!open) setVideoModal(null); }}>
        <DialogContent className="sm:max-w-[750px] p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{videoModal?.title}</DialogTitle>
            <DialogDescription>{videoModal?.description}</DialogDescription>
          </DialogHeader>
          {/* Video embed */}
          {videoModal?.videoUrl ? (
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={videoModal.videoUrl}
                title={videoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-black flex items-center justify-center">
              <p className="text-white/60 text-sm">Video not available</p>
            </div>
          )}
          {/* Info bar below video */}
          <div className="px-5 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-neutral-900">{videoModal?.title}</h3>
                {videoModal?.description && (
                  <p className="text-sm text-neutral-600 mt-0.5">{videoModal.description}</p>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-3">
                {videoModal?.language && <Badge variant="outline" className="text-xs">{videoModal.language}</Badge>}
                {videoModal?.views != null && <span className="text-xs text-neutral-400">{videoModal.views.toLocaleString()} {kb.views}</span>}
              </div>
            </div>
            <Button variant="outline" className="mt-3 text-sm" onClick={() => setVideoModal(null)}>
              {kb.closeModal}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
