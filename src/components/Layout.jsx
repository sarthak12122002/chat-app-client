import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Outlet } from 'react-router-dom';
import AppSidebar from './AppSidebar';

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
        <AppSidebar />
      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}