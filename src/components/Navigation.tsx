import { useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Sprout, LayoutDashboard, Bot, Leaf, Cloud, Bug, BarChart3, FileText, LogOut, Settings as SettingsIcon, BookOpen, Map, Menu } from 'lucide-react';
import type { Screen } from '../App';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
}

export function Navigation({ currentScreen, onNavigate, onLogout }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard' as Screen, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'farm' as Screen, label: 'My Farm', icon: Map },
    { id: 'assistant' as Screen, label: 'AI Assistant', icon: Bot },
    { id: 'soil' as Screen, label: 'Soil Analysis', icon: Leaf },
    { id: 'weather' as Screen, label: 'Weather', icon: Cloud },
    { id: 'pest' as Screen, label: 'Pest Detection', icon: Bug },
    { id: 'plan' as Screen, label: 'Farming Plan', icon: FileText },
    { id: 'knowledge' as Screen, label: 'Resources', icon: BookOpen },
    { id: 'analytics' as Screen, label: 'Analytics', icon: BarChart3 },
  ];

  const handleNavigate = (screen: Screen) => {
    onNavigate(screen);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px]">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <Sprout className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-900">AgriGuide AI</span>
                </div>
                <div className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentScreen === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-green-50 text-green-700'
                            : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  <div className="border-t pt-4 mt-4 space-y-2">
                    <button
                      onClick={() => handleNavigate('settings')}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                      <SettingsIcon className="w-5 h-5" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="text-green-900 hidden sm:inline">AgriGuide AI</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-700'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <select className="px-2 sm:px-3 py-2 border rounded-lg bg-white text-neutral-700 text-sm">
              <option>🇬🇧 EN</option>
              <option>🇷🇼 RW</option>
              <option>🇫🇷 FR</option>
            </select>
            <Button variant="ghost" size="icon" onClick={() => onNavigate('settings')} className="hidden lg:flex">
              <SettingsIcon className="w-5 h-5" />
            </Button>
            <Button variant="ghost" onClick={onLogout} className="gap-2 hidden lg:flex">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}