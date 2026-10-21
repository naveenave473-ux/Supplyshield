import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppLayout } from './components/layout/AppLayout';
import { OverviewPage } from './pages/OverviewPage';
import { DataImportsPage } from './pages/DataImportsPage';
import { PurchaseOrdersPage } from './pages/PurchaseOrdersPage';
import { InventoryRisksPage } from './pages/InventoryRisksPage';
import { SuppliersPage } from './pages/SuppliersPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { CommunicationsPage } from './pages/CommunicationsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/imports" element={<DataImportsPage />} />
            <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
            <Route path="/inventory-risks" element={<InventoryRisksPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/communications" element={<CommunicationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
