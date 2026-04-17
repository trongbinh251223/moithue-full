import { Errors } from '../lib/errors';
import type { Logger } from '../lib/logger';
import { ContactRepository } from '../repositories/contact.repository';
import type { Db } from '../types/app';
import type { z } from 'zod';
import type { contactPagePatchSchema, contactPageSettingsSchema } from '../validation/contact.schemas';

const DEFAULT_PAGE: z.infer<typeof contactPageSettingsSchema> = {
  officeTitle: 'Văn phòng chính',
  officeLines: ['123 Đường Nguyễn Huệ, Phường Bến Nghé', 'Quận 1, TP. Hồ Chí Minh'],
  hotlines: ['1900 1234 (24/7)', '028 3822 1234'],
  emails: ['support@moithue.com', 'partnership@moithue.com'],
  hours: ['Thứ 2 - Thứ 6: 08:00 - 18:00', 'Thứ 7: 08:00 - 12:00'],
};

type ContactPage = z.infer<typeof contactPageSettingsSchema>;

export function createSiteContactService(db: Db, _log: Logger) {
  const repo = new ContactRepository(db);
  const key = repo.getContactPageKey();

  async function loadPage(): Promise<ContactPage> {
    const raw = await repo.getSetting(key);
    if (!raw) return DEFAULT_PAGE;
    try {
      const v = JSON.parse(raw) as unknown;
      if (v && typeof v === 'object') return { ...DEFAULT_PAGE, ...(v as ContactPage) };
    } catch {
      /* fallthrough */
    }
    return DEFAULT_PAGE;
  }

  return {
    async getContactPage(): Promise<ContactPage> {
      return loadPage();
    },

    async patchContactPage(patch: z.infer<typeof contactPagePatchSchema>): Promise<ContactPage> {
      const cur = await loadPage();
      const next: ContactPage = {
        officeTitle: patch.officeTitle ?? cur.officeTitle,
        officeLines: patch.officeLines ?? cur.officeLines,
        hotlines: patch.hotlines ?? cur.hotlines,
        emails: patch.emails ?? cur.emails,
        hours: patch.hours ?? cur.hours,
      };
      await repo.setSetting(key, JSON.stringify(next));
      return next;
    },

    async submit(input: {
      name: string;
      phone: string;
      email: string;
      topic: string;
      message: string;
    }) {
      const row = await repo.insertSubmission({
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email.trim(),
        topic: input.topic.trim(),
        message: input.message.trim(),
      });
      return { id: row.id, createdAt: row.createdAt };
    },

    async listSubmissions(page: number, limit: number) {
      const offset = (page - 1) * limit;
      const { rows, total } = await repo.listSubmissions(limit, offset);
      return {
        data: rows.map((r) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          email: r.email,
          topic: r.topic,
          message: r.message,
          createdAt: r.createdAt,
        })),
        meta: { page, limit, total, offset },
      };
    },

    async deleteSubmission(id: string): Promise<void> {
      const ok = await repo.deleteSubmission(id);
      if (!ok) throw Errors.notFound('Submission');
    },
  };
}
