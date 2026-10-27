import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router-dom';
import { PublicLayout } from '../components/public/PublicLayout';
import { HomePage } from '../features/public/HomePage';
import { RouteFallback } from './RouteFallback';

// Everything except the home page and its layout is loaded on demand.
const AdminRoot = lazy(() => import('./AdminRoot').then((m) => ({ default: m.AdminRoot })));
const AdminLayout = lazy(() => import('../components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const ProtectedRoute = lazy(() => import('../components/auth/ProtectedRoute').then((m) => ({ default: m.ProtectedRoute })));
const LoginPage = lazy(() => import('../features/auth/LoginPage').then((m) => ({ default: m.LoginPage })));
const HallsPage = lazy(() => import('../features/public/HallsPage').then((m) => ({ default: m.HallsPage })));
const HallDetailPage = lazy(() => import('../features/public/HallDetailPage').then((m) => ({ default: m.HallDetailPage })));
const FacilitiesPage = lazy(() => import('../features/public/FacilitiesPage').then((m) => ({ default: m.FacilitiesPage })));
const GalleryPage = lazy(() => import('../features/public/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const EnquirePage = lazy(() => import('../features/public/EnquirePage').then((m) => ({ default: m.EnquirePage })));
const ContactPage = lazy(() => import('../features/public/ContactPage').then((m) => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('../features/public/FAQPage').then((m) => ({ default: m.FAQPage })));
const OverviewPage = lazy(() => import('../features/admin/OverviewPage').then((m) => ({ default: m.OverviewPage })));
const EnquiriesPage = lazy(() => import('../features/admin/EnquiriesPage').then((m) => ({ default: m.EnquiriesPage })));
const CalendarPage = lazy(() => import('../features/admin/CalendarPage').then((m) => ({ default: m.CalendarPage })));
const BookingsPage = lazy(() => import('../features/admin/BookingsPage').then((m) => ({ default: m.BookingsPage })));
const CustomersPage = lazy(() => import('../features/admin/CustomersPage').then((m) => ({ default: m.CustomersPage })));
const OperationsPage = lazy(() => import('../features/admin/OperationsPage').then((m) => ({ default: m.OperationsPage })));
const FinancePage = lazy(() => import('../features/admin/FinancePage').then((m) => ({ default: m.FinancePage })));
const StaffPage = lazy(() => import('../features/admin/StaffPage').then((m) => ({ default: m.StaffPage })));
const VendorsPage = lazy(() => import('../features/admin/VendorsPage').then((m) => ({ default: m.VendorsPage })));
const MaintenancePage = lazy(() => import('../features/admin/MaintenancePage').then((m) => ({ default: m.MaintenancePage })));
const MarketingPage = lazy(() => import('../features/admin/MarketingPage').then((m) => ({ default: m.MarketingPage })));
const ReportsPage = lazy(() => import('../features/admin/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const DocumentsPage = lazy(() => import('../features/admin/DocumentsPage').then((m) => ({ default: m.DocumentsPage })));
const AICopilotPage = lazy(() => import('../features/admin/AICopilotPage').then((m) => ({ default: m.AICopilotPage })));
const SettingsPage = lazy(() => import('../features/admin/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const AuditLogPage = lazy(() => import('../features/admin/AuditLogPage').then((m) => ({ default: m.AuditLogPage })));

const withSuspense = (element: React.ReactElement) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
);

export const routes: RouteObject[] = [
  // Authentication
  {
    path: '/login',
    element: withSuspense(
      <AdminRoot>
        <LoginPage />
      </AdminRoot>,
    ),
  },

  // Public Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'halls', element: withSuspense(<HallsPage />) },
      { path: 'halls/:slug', element: withSuspense(<HallDetailPage />) },
      { path: 'facilities', element: withSuspense(<FacilitiesPage />) },
      { path: 'gallery', element: withSuspense(<GalleryPage />) },
      { path: 'tour', element: <Navigate to="/gallery" replace /> },
      { path: 'enquire', element: withSuspense(<EnquirePage />) },
      { path: 'contact', element: withSuspense(<ContactPage />) },
      { path: 'faq', element: withSuspense(<FAQPage />) },
    ],
  },

  // Admin Routes (Protected)
  {
    path: '/admin',
    element: withSuspense(
      <AdminRoot>
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      </AdminRoot>,
    ),
    children: [
      { index: true, element: withSuspense(<OverviewPage />) },
      { path: 'enquiries', element: withSuspense(<EnquiriesPage />) },
      { path: 'calendar', element: withSuspense(<CalendarPage />) },
      { path: 'bookings', element: withSuspense(<BookingsPage />) },
      { path: 'customers', element: withSuspense(<CustomersPage />) },
      { path: 'operations', element: withSuspense(<OperationsPage />) },
      { path: 'finance', element: withSuspense(<FinancePage />) },
      { path: 'staff', element: withSuspense(<StaffPage />) },
      { path: 'vendors', element: withSuspense(<VendorsPage />) },
      { path: 'maintenance', element: withSuspense(<MaintenancePage />) },
      { path: 'marketing', element: withSuspense(<MarketingPage />) },
      { path: 'reports', element: withSuspense(<ReportsPage />) },
      { path: 'documents', element: withSuspense(<DocumentsPage />) },
      { path: 'ai', element: withSuspense(<AICopilotPage />) },
      { path: 'settings', element: withSuspense(<SettingsPage />) },
      { path: 'audit', element: withSuspense(<AuditLogPage />) },
    ],
  },

  // Catch-all 404
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
];

export const router = createBrowserRouter(routes);
