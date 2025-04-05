
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to landing page
    navigate('/');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kavach-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-medium text-gray-600">Redirecting...</h1>
      </div>
    </div>
  );
};

export default Index;
