import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import PageShell from '@/components/layout/PageShell';
import UserSidebar from '@/components/layout/UserSidebar';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import { ApiError } from '@/lib/apiClient';
import { fetchAdminContactPage, patchAdminContactPage, type ContactPageDto } from '@/lib/contactApi';

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function AdminContact() {
  const { accessToken, isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [officeTitle, setOfficeTitle] = useState('');
  const [officeLines, setOfficeLines] = useState('');
  const [hotlines, setHotlines] = useState('');
  const [emails, setEmails] = useState('');
  const [hours, setHours] = useState('');

  const applyDto = (d: ContactPageDto) => {
    setOfficeTitle(d.officeTitle);
    setOfficeLines(d.officeLines.join('\n'));
    setHotlines(d.hotlines.join('\n'));
    setEmails(d.emails.join('\n'));
    setHours(d.hours.join('\n'));
  };

  const load = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchAdminContactPage(accessToken);
      applyDto(res.data);
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Không tải được cấu hình liên hệ.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    void load();
  }, [load]);

  const publicUrl = typeof window !== 'undefined' ? `${window.location.origin}${ROUTES.contact}` : ROUTES.contact;

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    setSaving(true);
    try {
      const patch: Partial<ContactPageDto> = {
        officeTitle: officeTitle.trim(),
        officeLines: linesToArray(officeLines),
        hotlines: linesToArray(hotlines),
        emails: linesToArray(emails),
        hours: linesToArray(hours),
      };
      const res = await patchAdminContactPage(accessToken, patch);
      applyDto(res.data);
      toast.success('Đã lưu thông tin liên hệ.');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Lưu thất bại.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl mx-auto px-4 sm:px-8">
        <p className="text-center text-on-surface-variant">
          Vui lòng{' '}
          <Link to={ROUTES.login} className="font-bold text-primary">
            đăng nhập
          </Link>
          .
        </p>
      </PageShell>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl mx-auto px-4 sm:px-8">
        <p className="text-center text-on-surface-variant">Chỉ quản trị viên mới truy cập được trang này.</p>
      </PageShell>
    );
  }

  return (
    <PageShell className="bg-surface" mainClassName="pt-32 pb-12 max-w-7xl w-full mx-auto px-4 sm:px-8">
      <div className="flex flex-col md:flex-row gap-8">
        <UserSidebar />
        <div className="flex-1 max-w-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold text-on-surface">Chỉnh sửa trang liên hệ</h1>
            <Link
              to={ROUTES.adminContactMessages}
              className="text-sm font-medium text-primary hover:underline whitespace-nowrap"
            >
              Xem tin nhắn →
            </Link>
          </div>

          <p className="text-sm text-on-surface-variant mb-6">
            Trang công khai:{' '}
            <a href={publicUrl} className="text-primary font-medium break-all" target="_blank" rel="noreferrer">
              {publicUrl}
            </a>{' '}
            — ai cũng có thể gửi biểu mẫu từ đó; nội dung xem tại mục tin nhắn liên hệ.
          </p>

          {loading ? (
            <p className="text-on-surface-variant">Đang tải…</p>
          ) : (
            <form onSubmit={(ev) => void onSave(ev)} className="bg-white rounded-[32px] border border-outline-variant/20 p-6 sm:p-8 space-y-5">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="ac-office-title">
                  Tiêu đề khối văn phòng
                </label>
                <input
                  id="ac-office-title"
                  value={officeTitle}
                  onChange={(e) => setOfficeTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary outline-none"
                  maxLength={256}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="ac-office-lines">
                  Địa chỉ (mỗi dòng một phần)
                </label>
                <textarea
                  id="ac-office-lines"
                  value={officeLines}
                  onChange={(e) => setOfficeLines(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary outline-none resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="ac-hotlines">
                  Hotline (mỗi dòng một số)
                </label>
                <textarea
                  id="ac-hotlines"
                  value={hotlines}
                  onChange={(e) => setHotlines(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary outline-none resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="ac-emails">
                  Email (mỗi dòng một địa chỉ)
                </label>
                <textarea
                  id="ac-emails"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary outline-none resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-2" htmlFor="ac-hours">
                  Giờ làm việc (mỗi dòng)
                </label>
                <textarea
                  id="ac-hours"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:border-primary outline-none resize-y"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-xl bg-primary text-white font-bold hover:opacity-90 disabled:opacity-60 cursor-pointer"
              >
                {saving ? 'Đang lưu…' : 'Lưu'}
              </button>
            </form>
          )}
        </div>
      </div>
    </PageShell>
  );
}
