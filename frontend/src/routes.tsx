import { Route, Routes } from "react-router-dom";
import { ChatPage } from "./pages/Chat";
import { DashboardPage } from "./pages/Dashboard";
import { HistoryPage } from "./pages/History";
import { NotFoundPage } from "./pages/NotFound";
import { UploadPage } from "./pages/Upload";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/upload" element={<UploadPage />} />
      <Route path="/chat/:documentId" element={<ChatPage />} />
      <Route path="/history/:documentId" element={<HistoryPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
