import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { PrivacyPolicy } from './components/PrivacyPolicy';

function App() {
  useTheme();
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Dashboard user={user} /> : <Onboarding />}
        />
        <Route path="/privacy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
}


export default App;