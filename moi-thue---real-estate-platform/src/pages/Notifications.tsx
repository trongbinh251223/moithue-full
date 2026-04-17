import PageShell from '@/components/layout/PageShell';
import UserSidebar from '@/components/layout/UserSidebar';

export default function Notifications() {
  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl w-full mx-auto px-4 sm:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        <UserSidebar />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-on-surface mb-8">Thông báo</h1>
          <div className="bg-white rounded-[32px] shadow-sm border border-outline-variant/20 p-8 text-center">
            <p className="text-on-surface-variant">Bạn không có thông báo mới.</p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
