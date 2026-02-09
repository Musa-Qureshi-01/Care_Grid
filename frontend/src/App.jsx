import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./hooks/useAuth.jsx"
import { ProtectedRoute } from "./auth/ProtectedRoute"
import { MainLayout } from "./layouts/MainLayout"
import { DashboardLayout } from "./layouts/DashboardLayout"
import { Suspense, lazy } from "react"
import { Loader2 } from "lucide-react"
import { ToastProvider } from "./context/ToastContext"

// Lazy Load Pages
const LandingPage = lazy(() => import("./pages/LandingPage").then(module => ({ default: module.LandingPage })))
const ContactPage = lazy(() => import("./pages/ContactPage").then(module => ({ default: module.ContactPage })))
const DashboardPage = lazy(() => import("./pages/DashboardPage"))
const AgentsPage = lazy(() => import("./pages/AgentsPage").then(module => ({ default: module.AgentsPage })))
const ChatbotPage = lazy(() => import("./pages/ChatbotPage").then(module => ({ default: module.ChatbotPage })))
const SettingsPage = lazy(() => import("./pages/SettingsPage").then(module => ({ default: module.SettingsPage })))
const ResearchPage = lazy(() => import("./pages/ResearchPage").then(module => ({ default: module.ResearchPage })))
const MapPage = lazy(() => import("./pages/MapPage").then(module => ({ default: module.MapPage })))
const LoadingDemoPage = lazy(() => import("./pages/LoadingDemoPage").then(module => ({ default: module.LoadingDemoPage })))

// Import premium loading component
import { LoadingAnimation } from "./components/LoadingAnimation"

// Premium Loading State
const LoadingFallback = () => <LoadingAnimation message="Loading CareGrid" fullScreen={true} />


function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/loading-demo" element={<LoadingDemoPage />} />
              </Route>

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />

              <Route path="/research" element={
                <ProtectedRoute>
                  <ResearchPage />
                </ProtectedRoute>
              } />

              <Route element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route path="/agents" element={<AgentsPage />} />
                <Route path="/assistant" element={<ChatbotPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
