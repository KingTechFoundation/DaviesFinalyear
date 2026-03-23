import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { Register } from './components/Register';
import { OTPVerification } from './components/OTPVerification';
import { Login } from './components/Login';
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
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';

export type Screen = 'landing' | 'register' | 'otp' | 'login' | 'dashboard' | 'assistant' | 'soil' | 'weather' | 'pest' | 'analytics' | 'plan' | 'farm' | 'settings' | 'knowledge' | 'forgot-password' | 'reset-password';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('agriguide_token'));
  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    return localStorage.getItem('agriguide_token') ? 'dashboard' : 'landing';
  });
  const [otpEmail, setOtpEmail] = useState('');
  const [otpName, setOtpName] = useState('');
  const [userRole, setUserRole] = useState<string | null>(localStorage.getItem('agriguide_role'));

  const handleLoginSuccess = () => {
    const user = JSON.parse(localStorage.getItem('agriguide_user') || '{}');
    setIsLoggedIn(true);
    setUserRole(user.role || 'farmer');
    localStorage.setItem('agriguide_role', user.role || 'farmer');
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('agriguide_token');
    localStorage.removeItem('agriguide_user');
    localStorage.removeItem('agriguide_role');
    setUserRole(null);
    setCurrentScreen('landing');
  };

  const handleNavigateToOTP = (email: string, name: string) => {
    setOtpEmail(email);
    setOtpName(name);
    setCurrentScreen('otp');
  };

  // Unauthenticated screens
  if (!isLoggedIn) {
    return (
      <>
        <Toaster position="top-right" />

        {currentScreen === 'landing' && (
          <LandingPage
            onLogin={() => setCurrentScreen('login')}
            onRegister={() => setCurrentScreen('register')}
          />
        )}

        {currentScreen === 'register' && (
          <Register
            onNavigateToLogin={() => setCurrentScreen('login')}
            onNavigateToOTP={handleNavigateToOTP}
          />
        )}

        {currentScreen === 'otp' && (
          <OTPVerification
            email={otpEmail}
            name={otpName}
            onVerified={() => setCurrentScreen('login')}
            onBack={() => setCurrentScreen('register')}
          />
        )}

        {currentScreen === 'login' && (
          <Login
            onNavigateToRegister={() => setCurrentScreen('register')}
            onForgotPassword={() => setCurrentScreen('forgot-password')}
            onLoginSuccess={handleLoginSuccess}
            onNeedsVerification={(email) => {
              setOtpEmail(email);
              setOtpName('');
              setCurrentScreen('otp');
            }}
          />
        )}

        {currentScreen === 'forgot-password' && (
          <ForgotPassword
            onBackToLogin={() => setCurrentScreen('login')}
            onCodeSent={(email) => {
              setOtpEmail(email);
              setCurrentScreen('reset-password');
            }}
          />
        )}

        {currentScreen === 'reset-password' && (
          <ResetPassword
            email={otpEmail}
            onBackToLogin={() => setCurrentScreen('login')}
            onResetSuccess={() => setCurrentScreen('login')}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <OfflineIndicator />
      <Toaster position="top-right" />
      
      {currentScreen === 'dashboard' && (
        <PageTransition key="dashboard">
          <Dashboard onNavigate={setCurrentScreen} onLogout={handleLogout} role={userRole || 'farmer'} />
        </PageTransition>
      )}
      {currentScreen === 'assistant' && (
        <PageTransition key="assistant">
          <AIAssistant onNavigate={setCurrentScreen} onLogout={handleLogout} role={userRole || 'farmer'} />
        </PageTransition>
      )}
      {currentScreen === 'soil' && (
        <PageTransition key="soil">
          <SoilAnalysis onNavigate={setCurrentScreen} onLogout={handleLogout} role={userRole || 'farmer'} />
        </PageTransition>
      )}
      {currentScreen === 'weather' && (
        <PageTransition key="weather">
          <WeatherMonitor onNavigate={setCurrentScreen} onLogout={handleLogout} role={userRole || 'farmer'} />
        </PageTransition>
      )}
      {currentScreen === 'pest' && (
        <PageTransition key="pest">
          <PestPredictor onNavigate={setCurrentScreen} onLogout={handleLogout} role={userRole || 'farmer'} />
        </PageTransition>
      )}
      {currentScreen === 'analytics' && (
        <PageTransition key="analytics">
          <Analytics onNavigate={setCurrentScreen} onLogout={handleLogout} role={userRole || 'farmer'} />
        </PageTransition>
      )}
      {currentScreen === 'plan' && (
        <PageTransition key="plan">
          <FarmingPlan onNavigate={setCurrentScreen} onLogout={handleLogout} role={userRole || 'farmer'} />
        </PageTransition>
      )}
      {currentScreen === 'farm' && (
        <PageTransition key="farm">
          <MyFarm onNavigate={setCurrentScreen} onLogout={handleLogout} role={userRole || 'farmer'} />
        </PageTransition>
      )}
      {currentScreen === 'settings' && (
        <PageTransition key="settings">
          <Settings onNavigate={setCurrentScreen} onLogout={handleLogout} role={userRole || 'farmer'} />
        </PageTransition>
      )}
      {currentScreen === 'knowledge' && (
        <PageTransition key="knowledge">
          <KnowledgeBase onNavigate={setCurrentScreen} onLogout={handleLogout} role={userRole || 'farmer'} />
        </PageTransition>
      )}
    </div>
  );
}