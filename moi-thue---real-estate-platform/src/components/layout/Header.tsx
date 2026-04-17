import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, ChevronDown, LogOut, Settings, Home, Menu, X, PenSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { MAIN_NAV_LINKS } from '@/constants/navigation/headerNav';
import { ROUTES } from '@/constants/routes';
import { Logo } from '@/components/ui/Logo';
import { getDesktopNavLinkClass, getMobileNavLinkClass } from '@/utils/navigation';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

export default function Header() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useOnClickOutside(menuRef, () => setIsMenuOpen(false), Boolean(user));

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate(ROUTES.home);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-outline-variant/10">
      <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4 md:gap-12">
          <button
            type="button"
            className="md:hidden p-2 -ml-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Mở menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Logo />
          <div className="hidden md:flex gap-8 items-center">
            {MAIN_NAV_LINKS.map(({ path, label }) => (
              <Link key={path} className={getDesktopNavLinkClass(pathname, path)} to={path}>
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 hover:bg-surface-container-low px-2 md:px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border border-primary/20">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-primary" />
                  )}
                </div>
                <span className="font-medium text-sm text-on-surface hidden sm:block">{user.name}</span>
                <ChevronDown
                  className={`w-4 h-4 text-on-surface-variant transition-transform hidden sm:block ${isMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-outline-variant/20 overflow-hidden py-2"
                  >
                    <div className="px-4 py-3 border-b border-outline-variant/20 mb-2">
                      <p className="text-sm font-bold text-on-surface truncate">{user.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
                    </div>

                    <Link
                      to={ROUTES.profile}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <Settings className="w-4 h-4 text-on-surface-variant" />
                      Thông tin cá nhân
                    </Link>
                    <Link
                      to={ROUTES.manageRentals}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <Home className="w-4 h-4 text-on-surface-variant" />
                      Quản lý thuê nhà
                    </Link>

                    <div className="h-px bg-outline-variant/20 my-2" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to={ROUTES.login}
              className="font-medium text-sm text-on-surface/70 hover:text-primary transition-colors cursor-pointer hidden sm:block"
            >
              Đăng nhập
            </Link>
          )}
          {user?.role === 'admin' ? (
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to={ROUTES.adminPostProperty}
                className="inline-flex items-center gap-2 bg-primary text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-medium text-sm shadow-sm hover:shadow-md hover:opacity-90 transition-all cursor-pointer whitespace-nowrap"
              >
                <PenSquare className="w-4 h-4 shrink-0" />
                Đăng tin
              </Link>
            </motion.div>
          ) : null}
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-outline-variant/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-2">
              {MAIN_NAV_LINKS.map(({ path, label }) => (
                <Link
                  key={path}
                  className={getMobileNavLinkClass(pathname, path)}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              {!user && (
                <Link
                  className="font-medium text-base text-on-surface/70 hover:text-on-surface transition-colors block py-2 border-t border-outline-variant/10 mt-2 pt-4"
                  to={ROUTES.login}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
              )}
              {user?.role === 'admin' ? (
                <Link
                  to={ROUTES.adminPostProperty}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-medium text-base text-primary block py-2"
                >
                  Đăng tin mới
                </Link>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
