import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectWorkspace from './pages/ProjectWorkspace';
import ProjectOverview from './pages/ProjectOverview';
import RequirementsModule from './pages/RequirementsModule';
import TestCasesModule from './pages/TestCasesModule';
import RtmModule from './pages/RtmModule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        <Route path="/projects/:id" element={<ProjectWorkspace />}>
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
