import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';

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

  console.log('~user', user);
  return (
    <>
      {!user ? (
        <Onboarding />
      ) : (
        <Dashboard user={user} />
      )}
    </>
  );
}


export default App;