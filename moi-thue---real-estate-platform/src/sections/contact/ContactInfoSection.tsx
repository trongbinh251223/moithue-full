import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { fetchPublicContactPage, type ContactPageDto } from '@/lib/contactApi';
import { ApiError } from '@/lib/apiClient';

const FALLBACK: ContactPageDto = {
  officeTitle: 'Văn phòng chính',
  officeLines: ['123 Đường Nguyễn Huệ, Phường Bến Nghé', 'Quận 1, TP. Hồ Chí Minh'],
  hotlines: ['1900 1234 (24/7)', '028 3822 1234'],
  emails: ['support@moithue.com', 'partnership@moithue.com'],
  hours: ['Thứ 2 - Thứ 6: 08:00 - 18:00', 'Thứ 7: 08:00 - 12:00'],
};

export default function ContactInfoSection() {
  const [data, setData] = useState<ContactPageDto>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetchPublicContactPage();
        if (!cancelled) setData(res.data);
      } catch (e) {
        if (!cancelled) {
          setData(FALLBACK);
          toast.error(e instanceof ApiError ? e.message : 'Không tải được thông tin liên hệ.');
        }
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-surface-container-low rounded-[32px] p-8 sm:p-10">
        <h3 className="text-2xl font-bold text-on-surface mb-8">Thông tin liên hệ</h3>

        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-on-surface mb-1">{data.officeTitle}</h4>
              <p className="text-on-surface-variant leading-relaxed">
                {data.officeLines.map((line, i) => (
                  <span key={i}>
                    {i > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-on-surface mb-1">Hotline</h4>
              {data.hotlines.map((line, i) => (
                <p key={`h-${i}`} className="text-on-surface-variant">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-on-surface mb-1">Email</h4>
              {data.emails.map((line, i) => (
                <p key={`e-${i}`} className="text-on-surface-variant">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-on-surface mb-1">Giờ làm việc</h4>
              {data.hours.map((line, i) => (
                <p key={`w-${i}`} className="text-on-surface-variant">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
