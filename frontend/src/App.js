import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import DocsWiki from "./pages/DocsWiki";
import AdminPage from "./pages/AdminPage";

function ThemedToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme} position="bottom-right" richColors />;
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/docs/*" element={<DocsWiki />} />
            <Route path="/areas/*" element={<Navigate to="/docs" replace />} />
            <Route path="/areas" element={<Navigate to="/docs" replace />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
          <ThemedToaster />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
