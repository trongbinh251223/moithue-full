import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/apiClient';

export type ContactPageDto = {
  officeTitle: string;
  officeLines: string[];
  hotlines: string[];
  emails: string[];
  hours: string[];
};

export type ContactSubmissionDto = {
  id: string;
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
  createdAt: string;
};

export async function fetchPublicContactPage() {
  return apiGet<{ data: ContactPageDto }>('/public/contact');
}

export async function submitContactMessage(body: {
  name: string;
  phone: string;
  email: string;
  topic: string;
  message: string;
}) {
  return apiPost<{ data: { id: string; createdAt: string } }>('/public/contact/submissions', body);
}

export async function fetchAdminContactPage(token: string) {
  return apiGet<{ data: ContactPageDto }>('/admin/contact', { token });
}

export async function patchAdminContactPage(token: string, patch: Partial<ContactPageDto>) {
  return apiPatch<{ data: ContactPageDto }>('/admin/contact', patch, { token });
}

export async function fetchAdminContactSubmissions(page: number, token: string, limit = 20) {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiGet<{
    data: ContactSubmissionDto[];
    meta: { page: number; limit: number; total: number; offset: number };
  }>(`/admin/contact/submissions?${q}`, { token });
}

export async function deleteAdminContactSubmission(id: string, token: string) {
  await apiDelete(`/admin/contact/submissions/${id}`, { token });
}
