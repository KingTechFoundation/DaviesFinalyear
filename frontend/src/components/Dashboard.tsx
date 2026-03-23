import { Navigation } from './Navigation';
import { FarmerDashboard } from './FarmerDashboard';
import { AgronomistDashboard } from './AgronomistDashboard';
import { PolicymakerDashboard } from './PolicymakerDashboard';
import type { Screen } from '../App';

interface DashboardProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  role: string;
}

export function Dashboard({ onNavigate, onLogout, role }: DashboardProps) {
  const renderDashboardByRole = () => {
    switch (role) {
      case 'agronomist':
        return <AgronomistDashboard onNavigate={onNavigate} />;
      case 'policymaker':
        return <PolicymakerDashboard onNavigate={onNavigate} />;
      case 'farmer':
      default:
        return <FarmerDashboard onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-12">
      <Navigation currentScreen="dashboard" onNavigate={onNavigate} onLogout={onLogout} role={role} />
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {renderDashboardByRole()}
      </div>
    </div>
  );
}