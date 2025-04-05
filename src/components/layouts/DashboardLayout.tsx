
import { ReactNode } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, Home, FileText, PlusCircle, BarChart3, Users, Settings, LogOut, Map, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { userData, logout } = useAuth();
  
  // Determine navigation items based on user role
  let navigationItems = [];
  
  if (userData?.role === 'user') {
    navigationItems = [
      { name: 'Dashboard', path: '/u/dashboard', icon: Home },
      { name: 'New Report', path: '/u/report', icon: PlusCircle },
      { name: 'My Reports', path: '/u/reports', icon: FileText },
    ];
  } else if (userData?.role === 'admin') {
    navigationItems = [
      { name: 'Dashboard', path: '/a/dashboard', icon: Home },
      { name: 'Reports', path: '/a/reports', icon: FileText },
      { name: 'Analytics', path: '/a/analytics', icon: BarChart3 },
    ];
  } else if (userData?.role === 'superadmin') {
    navigationItems = [
      { name: 'Dashboard', path: '/sa/dashboard', icon: Home },
      { name: 'Reports', path: '/sa/reports', icon: FileText },
      { name: 'Stations', path: '/sa/stations', icon: Users },
      { name: 'Heatmap', path: '/sa/heatmap', icon: Map },
    ];
  }
  
  // Get user initials for avatar
  const getInitials = () => {
    if (!userData?.email) return 'U';
    return userData.email.substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
          {/* Logo */}
          <div className="px-4 py-6">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-8 w-8" />
              <span className="font-bold text-lg">Kavach</span>
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center px-3 py-2 text-sm rounded-md group transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )
                }
              >
                <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          
          {/* User profile */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={userData?.photoURL || ''} />
                <AvatarFallback className="bg-sidebar-accent">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {userData?.displayName || userData?.email}
                </p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">
                  {userData?.role}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden border-b p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-kavach-700" />
            <span className="font-bold">Kavach</span>
          </Link>
          
          <Avatar className="h-8 w-8">
            <AvatarImage src={userData?.photoURL || ''} />
            <AvatarFallback className="bg-kavach-100 text-kavach-700">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
        
        {/* Mobile navigation */}
        <div className="md:hidden border-t bg-background flex justify-around p-2">
          {navigationItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center py-2 px-4 rounded-md text-xs",
                  isActive
                    ? "text-kavach-700"
                    : "text-muted-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
