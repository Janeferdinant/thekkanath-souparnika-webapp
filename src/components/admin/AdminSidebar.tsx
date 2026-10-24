import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  CalendarDays,
  BookmarkCheck,
  Users,
  ClipboardList,
  IndianRupee,
  UserCog,
  Truck,
  Wrench,
  Megaphone,
  BarChart3,
  FileText,
  Sparkles,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/models';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  allowedRoles: UserRole[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const AdminSidebar: React.FC = () => {
  const { canAccess, currentUser } = useAuth();

  const sections: NavSection[] = [
    {
      title: 'Core Management',
      items: [
        {
          label: 'Overview',
          path: '/admin',
          icon: <LayoutDashboard className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator', 'booking_manager', 'operations_manager', 'accounts'],
        },
        {
          label: 'Enquiries Pipeline',
          path: '/admin/enquiries',
          icon: <Inbox className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator', 'booking_manager'],
        },
        {
          label: 'Booking Calendar',
          path: '/admin/calendar',
          icon: <CalendarDays className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator', 'booking_manager', 'operations_manager', 'staff'],
        },
        {
          label: 'Bookings List',
          path: '/admin/bookings',
          icon: <BookmarkCheck className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator', 'booking_manager', 'operations_manager'],
        },
        {
          label: 'Customers / CRM',
          path: '/admin/customers',
          icon: <Users className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator', 'booking_manager'],
        },
      ],
    },
    {
      title: 'Operations & Facilities',
      items: [
        {
          label: 'Event Operations',
          path: '/admin/operations',
          icon: <ClipboardList className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator', 'operations_manager', 'staff'],
        },
        {
          label: 'Staff Management',
          path: '/admin/staff',
          icon: <UserCog className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator', 'operations_manager'],
        },
        {
          label: 'Vendors & Suppliers',
          path: '/admin/vendors',
          icon: <Truck className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator', 'operations_manager'],
        },
        {
          label: 'Maintenance Blocks',
          path: '/admin/maintenance',
          icon: <Wrench className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator', 'operations_manager'],
        },
      ],
    },
    {
      title: 'Finance & Analytics',
      items: [
        {
          label: 'Finance & Billing',
          path: '/admin/finance',
          icon: <IndianRupee className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator', 'accounts'],
        },
        {
          label: 'Reports & Analytics',
          path: '/admin/reports',
          icon: <BarChart3 className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator', 'accounts'],
        },
        {
          label: 'Marketing & Leads',
          path: '/admin/marketing',
          icon: <Megaphone className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator', 'booking_manager'],
        },
        {
          label: 'Document Repository',
          path: '/admin/documents',
          icon: <FileText className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator', 'booking_manager', 'operations_manager', 'accounts'],
        },
      ],
    },
    {
      title: 'Intelligence & Settings',
      items: [
        {
          label: 'AI Management Copilot',
          path: '/admin/ai',
          icon: <Sparkles className="w-4 h-4 text-gold-500" />,
          allowedRoles: ['super_admin', 'administrator', 'booking_manager', 'accounts'],
        },
        {
          label: 'Venue Content & Settings',
          path: '/admin/settings',
          icon: <Settings className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator'],
        },
        {
          label: 'Audit Trail & Security',
          path: '/admin/audit',
          icon: <ShieldCheck className="w-4 h-4" />,
          allowedRoles: ['super_admin', 'administrator'],
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-wine-950 text-cream-200 border-r border-burgundy-900 flex flex-col shrink-0 select-none">
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {sections.map((section, sIdx) => {
          const visibleItems = section.items.filter((item) => canAccess(item.allowedRoles));
          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx} className="space-y-1">
              <div className="px-3 text-[10px] uppercase font-bold tracking-widest text-gold-400/80 mb-2">
                {section.title}
              </div>
              {visibleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-gold-400 via-gold-500 to-rose-400 text-burgundy-950 font-bold shadow-sm'
                        : 'text-cream-300 hover:text-white hover:bg-burgundy-900/80'
                    }`
                  }
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </div>

      {/* Role Indicator Footer */}
      <div className="p-3 border-t border-burgundy-900 bg-wine-950/90 text-[10px] text-cream-400">
        <div className="flex items-center justify-between">
          <span>Active Role:</span>
          <span className="font-bold text-gold-400 uppercase tracking-wider">
            {currentUser?.role?.replace('_', ' ') || 'Staff'}
          </span>
        </div>
      </div>
    </aside>
  );
};
