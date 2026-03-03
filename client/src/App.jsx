import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';

// Regular imports for standard auth
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy load enterprise modules for performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectWorkspace = lazy(() => import('./pages/ProjectWorkspace'));
const ProjectOverview = lazy(() => import('./pages/ProjectOverview'));
const RequirementsModule = lazy(() => import('./pages/RequirementsModule'));
const TestCasesModule = lazy(() => import('./pages/TestCasesModule'));
const RtmModule = lazy(() => import('./pages/RtmModule'));

function LoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>Initializing Module Subsystem...</p>
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}} />
      </div>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={
          <Suspense fallback={<LoadingFallback />}>
            <div className="enterprise-app"><Dashboard /></div>
          </Suspense>
        } />
        
        <Route path="/projects/:id" element={
          <Suspense fallback={<LoadingFallback />}>
            <div className="enterprise-app"><ProjectWorkspace /></div>
          </Suspense>
        }>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<ProjectOverview />} />
          <Route path="requirements" element={<RequirementsModule />} />
          <Route path="testcases" element={<TestCasesModule />} />
          <Route path="rtm" element={<RtmModule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
