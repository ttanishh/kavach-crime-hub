
import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
        <Toaster />
        <SonnerToaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
