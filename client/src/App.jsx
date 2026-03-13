import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';

import Login from './pages/Login';
import Register from './pages/Register';
import registerBg from './assets/register-bg-2.jpg';

// Lazy load enterprise modules for performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectWorkspace = lazy(() => import('./pages/ProjectWorkspace'));
const ProjectOverview = lazy(() => import('./pages/ProjectOverview'));
const RequirementsModule = lazy(() => import('./pages/RequirementsModule'));
const TestCasesModule = lazy(() => import('./pages/TestCasesModule'));
const RtmModule = lazy(() => import('./pages/RtmModule'));
const SequenceFlowModule = lazy(() => import('./pages/SequenceFlowModule'));
const DocumentationModule = lazy(() => import('./pages/DocumentationModule'));

function LoadingFallback() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-base)', color: 'var(--text-secondary)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--accent-color)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: '600' }}>Loading...</p>
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
    // 1. Scroll the window to top (standard)
    window.scrollTo(0, 0);
    
    // 2. Proactively find any 'main' content areas or scrollable containers and reset them
    // This handles layouts with fixed sidebars and scrollable main areas
    const scrollContainers = document.querySelectorAll('main, [style*="overflow-y: auto"], [style*="overflowY: auto"]');
    scrollContainers.forEach(container => {
      container.scrollTo({ top: 0, behavior: 'instant' });
    });
  }, [pathname]);

  return null;
}

// Preloader for heavy assets to ensure they are ready when navigating
function ImagePreloader() {
  useEffect(() => {
    const img = new Image();
    img.src = registerBg;
  }, []);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ImagePreloader />
      <Routes>
        <Route path="/" element={<div className="enterprise-app"><Landing /></div>} />
        <Route path="/login" element={<div className="enterprise-app"><Login /></div>} />
        <Route path="/register" element={<div className="enterprise-app"><Register /></div>} />
        
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
          <Route path="sequence" element={<SequenceFlowModule />} />
          <Route path="documentation" element={<DocumentationModule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
