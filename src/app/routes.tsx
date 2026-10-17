import { createBrowserRouter, Navigate } from 'react-router-dom';
import { PublicLayout } from '../components/public/PublicLayout';
import { AdminLayout } from '../components/admin/AdminLayout';

// Public Pages
import { HomePage } from '../features/public/HomePage';
import { HallsPage } from '../features/public/HallsPage';
import { HallDetailPage } from '../features/public/HallDetailPage';
import { FacilitiesPage } from '../features/public/FacilitiesPage';
import { GalleryPage } from '../features/public/GalleryPage';
import { EnquirePage } from '../features/public/EnquirePage';
import { ContactPage } from '../features/public/ContactPage';
import { FAQPage } from '../features/public/FAQPage';

// Admin Pages
import { OverviewPage } from '../features/admin/OverviewPage';
import { EnquiriesPage } from '../features/admin/EnquiriesPage';
import { CalendarPage } from '../features/admin/CalendarPage';
import { BookingsPage } from '../features/admin/BookingsPage';
import { CustomersPage } from '../features/admin/CustomersPage';
import { OperationsPage } from '../features/admin/OperationsPage';
import { FinancePage } from '../features/admin/FinancePage';
import { StaffPage } from '../features/admin/StaffPage';
import { VendorsPage } from '../features/admin/VendorsPage';
import { MaintenancePage } from '../features/admin/MaintenancePage';
import { MarketingPage } from '../features/admin/MarketingPage';
import { ReportsPage } from '../features/admin/ReportsPage';
import { DocumentsPage } from '../features/admin/DocumentsPage';
import { AICopilotPage } from '../features/admin/AICopilotPage';
import { SettingsPage } from '../features/admin/SettingsPage';
import { AuditLogPage } from '../features/admin/AuditLogPage';

export const router = createBrowserRouter([
  // Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'halls', element: <HallsPage /> },
      { path: 'halls/:slug', element: <HallDetailPage /> },
      { path: 'facilities', element: <FacilitiesPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'tour', element: <Navigate to="/gallery" replace /> },
      { path: 'enquire', element: <EnquirePage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'faq', element: <FAQPage /> },
    ],
  },

  // Admin Routes
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'enquiries', element: <EnquiriesPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'bookings', element: <BookingsPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'operations', element: <OperationsPage /> },
      { path: 'finance', element: <FinancePage /> },
      { path: 'staff', element: <StaffPage /> },
      { path: 'vendors', element: <VendorsPage /> },
      { path: 'maintenance', element: <MaintenancePage /> },
      { path: 'marketing', element: <MarketingPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'documents', element: <DocumentsPage /> },
      { path: 'ai', element: <AICopilotPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: 'audit', element: <AuditLogPage /> },
    ],
  },

  // Catch-all 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
