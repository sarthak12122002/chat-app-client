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
        
          {user && (
            <div className="space-y-2 p-4">
              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => logout(true)}
              >
                Logout
              </Button>
            </div>
          )}

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}