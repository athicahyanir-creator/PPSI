import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Public & Tourist pages
import { LandingPage } from './pages/public/LandingPage';
import { CatalogPage } from './pages/public/CatalogPage';
import { DestinationDetailPage } from './pages/public/DestinationDetailPage';
import { BookingPage } from './pages/public/BookingPage';
import { TicketConfirmationPage } from './pages/public/TicketConfirmationPage';
import { DigitalTicketPage } from './pages/public/DigitalTicketPage';
import { TicketCheckPage } from './pages/public/TicketCheckPage';
import { LoginPage } from './pages/public/LoginPage';

// Staff page
import { StaffValidationPage } from './pages/staff/StaffValidationPage';

// Admin layout & pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { DestinationsAdminPage } from './pages/admin/DestinationsAdminPage';
import { TicketTypesAdminPage } from './pages/admin/TicketTypesAdminPage';
import { BookingsAdminPage } from './pages/admin/BookingsAdminPage';
import { TransactionsAdminPage } from './pages/admin/TransactionsAdminPage';
import { ReportsAdminPage } from './pages/admin/ReportsAdminPage';
import { UsersAdminPage } from './pages/admin/UsersAdminPage';
import { AuditLogAdminPage } from './pages/admin/AuditLogAdminPage';

// Helper scroll to top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Public Layout wrapper with DemoBanner, Navbar, Footer
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-ivory-100">
      <DemoBanner />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Tourist Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <LandingPage />
              </PublicLayout>
            }
          />
          <Route
            path="/destinasi"
            element={
              <PublicLayout>
                <CatalogPage />
              </PublicLayout>
            }
          />
          <Route
            path="/destinasi/:slug"
            element={
              <PublicLayout>
                <DestinationDetailPage />
              </PublicLayout>
            }
          />
          <Route
            path="/pesan-tiket"
            element={
              <PublicLayout>
                <BookingPage />
              </PublicLayout>
            }
          />
          <Route
            path="/konfirmasi/:bookingCode"
            element={
              <PublicLayout>
                <TicketConfirmationPage />
              </PublicLayout>
            }
          />
          <Route
            path="/tiket/:bookingCode"
            element={
              <PublicLayout>
                <DigitalTicketPage />
              </PublicLayout>
            }
          />
          <Route
            path="/cek-tiket"
            element={
              <PublicLayout>
                <TicketCheckPage />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <LoginPage />
              </PublicLayout>
            }
          />

          {/* Staff QR Validation Route */}
          <Route
            path="/petugas/validasi"
            element={
              <PublicLayout>
                <StaffValidationPage />
              </PublicLayout>
            }
          />

          {/* Admin & Manager Dashboard Sub-routes */}
          <Route
            path="/admin"
            element={
              <>
                <DemoBanner />
                <AdminLayout />
              </>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="destinasi" element={<DestinationsAdminPage />} />
            <Route path="tarif" element={<TicketTypesAdminPage />} />
            <Route path="pemesanan" element={<BookingsAdminPage />} />
            <Route path="transaksi" element={<TransactionsAdminPage />} />
            <Route path="laporan" element={<ReportsAdminPage />} />
            <Route path="pengguna" element={<UsersAdminPage />} />
            <Route path="audit-log" element={<AuditLogAdminPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
