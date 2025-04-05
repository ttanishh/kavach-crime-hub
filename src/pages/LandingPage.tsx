
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, FileText, BarChart2, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage = () => {
  const { currentUser, userData, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && currentUser && userData) {
      if (userData.role === 'user') {
        navigate('/u/dashboard');
      } else if (userData.role === 'admin') {
        navigate('/a/dashboard');
      } else if (userData.role === 'superadmin') {
        navigate('/sa/dashboard');
      }
    }
  }, [currentUser, userData, isLoading, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-white px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-kavach-700" />
            <span className="font-bold text-xl">Kavach</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/auth/login" className="text-sm font-medium text-kavach-700 hover:text-kavach-800">
              Log in
            </Link>
            <Button asChild>
              <Link to="/auth/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Hero section */}
      <section className="kavach-gradient py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Smart Crime Reporting and Management
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            A secure platform connecting citizens, law enforcement, and government officials 
            for effective crime management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-kavach-700 hover:bg-white/90" asChild>
              <Link to="/auth/signup">Report a Crime</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link to="/auth/login">Access Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="w-12 h-12 bg-kavach-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-kavach-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Reporting</h3>
            <p className="text-muted-foreground">
              Quickly file detailed crime reports with location data and supporting evidence.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart2 className="h-6 w-6 text-blue-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Tracking</h3>
            <p className="text-muted-foreground">
              Monitor the status of your reports and receive updates from authorities.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="w-12 h-12 bg-police-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-police-700" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Data-driven Insights</h3>
            <p className="text-muted-foreground">
              Advanced analytics and heatmaps help authorities identify crime patterns.
            </p>
          </div>
        </div>
      </section>
      
      {/* User Types */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">For All Stakeholders</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">For Citizens</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Easy crime reporting
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Track case progress
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Direct communication with police
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/auth/signup?role=user">
                  Register as a Citizen <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">For Police Stations</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Case management dashboard
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Performance analytics
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Streamlined investigation workflow
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/auth/signup?role=admin">
                  Register a Station <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="bg-white p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-4">For Government Officials</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  National crime overview
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Resource allocation insights
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Station performance monitoring
                </li>
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/auth/signup?role=superadmin">
                  Government Access <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 px-4 bg-kavach-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join Kavach today and contribute to a safer community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-kavach-700 hover:bg-white/90" asChild>
              <Link to="/auth/signup">Create an Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link to="/auth/login">Log In</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="font-bold text-white">Kavach</span>
              </div>
              <p className="text-sm">
                A comprehensive crime reporting and management platform for citizens, 
                police stations, and government officials.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/auth/login" className="hover:text-white">Log In</Link></li>
                <li><Link to="/auth/signup" className="hover:text-white">Sign Up</Link></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Guidelines</a></li>
                <li><a href="#" className="hover:text-white">Emergency Contacts</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Data Protection</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>© 2025 Kavach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
