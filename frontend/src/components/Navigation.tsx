import { useState } from 'react';
import { Button } from './ui/button';
import { Sprout, LayoutDashboard, Bot, Leaf, Cloud, Bug, BarChart3, FileText, LogOut, Settings as SettingsIcon, BookOpen, Map, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from './ui/sheet';
import type { Screen } from '../App';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  role: string;
}

import { LanguageSwitcher } from './LanguageSwitcher';

export function Navigation({ currentScreen, onNavigate, onLogout, role }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('agriguide_user') || '{}');

  const allMenuItems = [
    { id: 'dashboard' as Screen, label: 'Dashboard', icon: LayoutDashboard, roles: ['farmer', 'agronomist', 'policymaker'] },
    { id: 'farm' as Screen, label: 'My Farm', icon: Map, roles: ['farmer'] },
    { id: 'assistant' as Screen, label: 'AI Assistant', icon: Bot, roles: ['farmer', 'agronomist'] },
    { id: 'soil' as Screen, label: 'Soil Analysis', icon: Leaf, roles: ['farmer', 'agronomist'] },
    { id: 'weather' as Screen, label: 'Weather', icon: Cloud, roles: ['farmer', 'agronomist'] },
    { id: 'pest' as Screen, label: 'Pest Detection', icon: Bug, roles: ['farmer', 'agronomist'] },
    { id: 'plan' as Screen, label: 'Farming Plan', icon: FileText, roles: ['farmer'] },
    { id: 'knowledge' as Screen, label: 'Resources', icon: BookOpen, roles: ['farmer', 'agronomist', 'policymaker'] },
    { id: 'analytics' as Screen, label: 'Analytics', icon: BarChart3, roles: ['agronomist', 'policymaker'] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(role));

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
              <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
                <div className="p-6 bg-green-600 text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
                    <Sprout className="w-6 h-6 text-white" />
                  </div>
                  <SheetTitle className="text-white text-xl font-bold">AgriGuide AI</SheetTitle>
                  <SheetDescription className="sr-only">Mobile Navigation Menu</SheetDescription>
                </div>
                <div className="p-4 space-y-2">
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
            <LanguageSwitcher variant="light" />
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-gray-900">{user.name}</span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">{role}</span>
            </div>
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