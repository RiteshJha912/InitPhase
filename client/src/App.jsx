import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import LoadingState from './components/LoadingState';
import { ToastProvider } from './components/ToastProvider';

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
const IssuesModule = lazy(() => import('./pages/IssuesModule'));
const IdeaBrdModule = lazy(() => import('./pages/IdeaBrdModule'));
const ChangeImpactModule = lazy(() => import('./pages/ChangeImpactModule'));
function LoadingFallback() {
  return <LoadingState title="Opening InitPhase" />;
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
    <div className="enterprise-app">
      <ToastProvider>
        <BrowserRouter>
          <ScrollToTop />
          <ImagePreloader />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
              <Suspense fallback={<LoadingFallback />}>
                <Dashboard />
              </Suspense>
            } />
            
            <Route path="/projects/:id" element={
              <Suspense fallback={<LoadingFallback />}>
                <ProjectWorkspace />
              </Suspense>
            }>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<ProjectOverview />} />
              <Route path="requirements" element={<RequirementsModule />} />
              <Route path="testcases" element={<TestCasesModule />} />
              <Route path="rtm" element={<RtmModule />} />
              <Route path="sequence" element={<SequenceFlowModule />} />
              <Route path="idea-brd" element={<IdeaBrdModule />} />
              <Route path="change-impact" element={<ChangeImpactModule />} />
              <Route path="documentation" element={<DocumentationModule />} />
              <Route path="issues" element={<IssuesModule />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </div>
  );
}

export default App;
