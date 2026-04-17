export function getDesktopNavLinkClass(pathname: string, path: string): string {
  const isActive = path === '/' ? pathname === '/' : pathname.startsWith(path);
  return isActive
    ? 'font-medium text-sm text-primary border-b-2 border-primary pb-1 transition-colors'
    : 'font-medium text-sm text-on-surface/70 hover:text-on-surface transition-colors pb-1 border-b-2 border-transparent';
}

export function getMobileNavLinkClass(pathname: string, path: string): string {
  const isActive = path === '/' ? pathname === '/' : pathname.startsWith(path);
  return isActive
    ? 'font-medium text-base text-primary transition-colors block py-2'
    : 'font-medium text-base text-on-surface/70 hover:text-on-surface transition-colors block py-2';
}
