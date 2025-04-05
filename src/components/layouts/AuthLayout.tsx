
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:block lg:w-1/2 kavach-gradient">
        <div className="flex flex-col items-center justify-center h-full p-8">
          <div className="flex items-center gap-3 mb-12">
            <Shield className="w-12 h-12" />
            <h1 className="text-3xl font-bold text-white">Kavach</h1>
          </div>
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Smart Crime Reporting and Management System</h2>
            <p className="text-lg opacity-90 mb-6">
              Empowering citizens, law enforcement, and government officials to work together for a safer community.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                <h3 className="font-semibold">Easy Reporting</h3>
                <p className="text-sm opacity-90">File reports quickly with location data</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                <h3 className="font-semibold">Real-time Updates</h3>
                <p className="text-sm opacity-90">Track the status of your reports</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                <h3 className="font-semibold">Secure Communication</h3>
                <p className="text-sm opacity-90">Direct line to authorities</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg backdrop-blur">
                <h3 className="font-semibold">Data-driven Decisions</h3>
                <p className="text-sm opacity-90">Advanced analytics for officials</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Shield className="h-8 w-8 text-kavach-700" />
            <h1 className="text-2xl font-bold text-kavach-700">Kavach</h1>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
