import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LandingPage from '@/pages/LandingPage';

// Lazy load pages
const LoginPage = lazy(() => import('@/app/auth/login/page'));
const SignupPage = lazy(() => import('@/app/auth/signup/page'));

// User pages
const UserDashboard = lazy(() => import('@/app/u/dashboard/page'));
const CreateReport = lazy(() => import('@/app/u/report/page'));
const UserReports = lazy(() => import('@/app/u/reports/page'));
const UserReportDetail = lazy(() => import('@/app/u/reports/[id]/page'));

// Admin pages
const AdminDashboard = lazy(() => import('@/app/a/dashboard/page'));

// SuperAdmin pages
const SuperAdminDashboard = lazy(() => import('@/app/sa/dashboard/page'));

// Other pages
const NotFound = lazy(() => import('@/pages/NotFound'));

function App() {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kavach-600"></div>
    </div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth routes */}
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<SignupPage />} />
        
        {/* User routes */}
        <Route 
          path="/u/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/u/report" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <CreateReport />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/u/reports" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserReports />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/u/reports/:id" 
          element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserReportDetail />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin routes */}
        <Route 
          path="/a/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Super Admin routes */}
        <Route 
          path="/sa/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all route for 404 */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
