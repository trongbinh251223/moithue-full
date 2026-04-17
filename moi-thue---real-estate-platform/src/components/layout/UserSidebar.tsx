import { Link, useLocation } from 'react-router-dom';
import { LogOut, Plus, BookOpen, MapPin, Inbox, type LucideIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { USER_SIDEBAR_ITEMS } from '@/constants/navigation/userSidebarNav';
import { ROUTES } from '@/constants/routes';
import { useMemo } from 'react';

type NavItem = { path: string; icon: LucideIcon; label: string };

export default function UserSidebar() {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();

  const navItems = useMemo((): NavItem[] => {
    const base: NavItem[] = USER_SIDEBAR_ITEMS.map((i) => ({
      path: i.path,
      icon: i.icon,
      label: i.label,
    }));
    if (user?.role === 'admin') {
      base.splice(2, 0, { path: ROUTES.adminPostProperty, icon: Plus, label: 'Đăng tin mới' });
      base.splice(3, 0, { path: ROUTES.adminBlog, icon: BookOpen, label: 'Quản lý blog' });
      base.splice(4, 0, { path: ROUTES.adminContact, icon: MapPin, label: 'Chỉnh sửa liên hệ' });
      base.splice(5, 0, { path: ROUTES.adminContactMessages, icon: Inbox, label: 'Tin nhắn liên hệ' });
    }
    return base;
  }, [user?.role]);

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white rounded-[32px] shadow-sm border border-outline-variant/20 p-4 sticky top-24">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.path ||
              (item.path.length > 1 && pathname.startsWith(`${item.path}/`));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
          <div className="h-px bg-outline-variant/20 my-4" />
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Đăng xuất
          </button>
        </nav>
      </div>
    </div>
  );
}
