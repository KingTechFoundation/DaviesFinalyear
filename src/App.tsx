import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { AIAssistant } from './components/AIAssistant';
import { SoilAnalysis } from './components/SoilAnalysis';
import { WeatherMonitor } from './components/WeatherMonitor';
import { PestPredictor } from './components/PestPredictor';
import { Analytics } from './components/Analytics';
import { FarmingPlan } from './components/FarmingPlan';
import { MyFarm } from './components/MyFarm';
import { Settings } from './components/Settings';
import { KnowledgeBase } from './components/KnowledgeBase';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PageTransition } from './components/PageTransition';
import { Toaster } from './components/ui/sonner';

export type Screen = 'landing' | 'dashboard' | 'assistant' | 'soil' | 'weather' | 'pest' | 'analytics' | 'plan' | 'farm' | 'settings' | 'knowledge';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('landing');
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <OfflineIndicator />
      <Toaster position="top-right" />
      
      {currentScreen === 'dashboard' && (
        <PageTransition key="dashboard">
          <Dashboard onNavigate={setCurrentScreen} onLogout={handleLogout} />
        </PageTransition>
      )}
      {currentScreen === 'assistant' && (
        <PageTransition key="assistant">
          <AIAssistant onNavigate={setCurrentScreen} onLogout={handleLogout} />
        </PageTransition>
      )}
      {currentScreen === 'soil' && (
        <PageTransition key="soil">
          <SoilAnalysis onNavigate={setCurrentScreen} onLogout={handleLogout} />
        </PageTransition>
      )}
      {currentScreen === 'weather' && (
        <PageTransition key="weather">
          <WeatherMonitor onNavigate={setCurrentScreen} onLogout={handleLogout} />
        </PageTransition>
      )}
      {currentScreen === 'pest' && (
        <PageTransition key="pest">
          <PestPredictor onNavigate={setCurrentScreen} onLogout={handleLogout} />
        </PageTransition>
      )}
      {currentScreen === 'analytics' && (
        <PageTransition key="analytics">
          <Analytics onNavigate={setCurrentScreen} onLogout={handleLogout} />
        </PageTransition>
      )}
      {currentScreen === 'plan' && (
        <PageTransition key="plan">
          <FarmingPlan onNavigate={setCurrentScreen} onLogout={handleLogout} />
        </PageTransition>
      )}
      {currentScreen === 'farm' && (
        <PageTransition key="farm">
          <MyFarm onNavigate={setCurrentScreen} onLogout={handleLogout} />
        </PageTransition>
      )}
      {currentScreen === 'settings' && (
        <PageTransition key="settings">
          <Settings onNavigate={setCurrentScreen} onLogout={handleLogout} />
        </PageTransition>
      )}
      {currentScreen === 'knowledge' && (
        <PageTransition key="knowledge">
          <KnowledgeBase onNavigate={setCurrentScreen} onLogout={handleLogout} />
        </PageTransition>
      )}
    </div>
  );
}