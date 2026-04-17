import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/apiClient';

export type AdminBlogListRow = {
  id: string;
  title: string;
  category: string;
  isPublished: boolean;
  coverImage: string;
  excerpt: string;
  createdAt: string;
  updatedAt: string;
  authorName: string;
};

export type AdminBlogPostPayload = {
  title: string;
  content: string;
  excerpt?: string | null;
  coverImage?: string | null;
  category?: string | null;
  slug?: string | null;
  isPublished?: boolean;
};

export type AdminBlogDetailDto = {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  slug: string;
  isPublished: boolean;
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

export async function fetchAdminBlogPost(id: string, token: string) {
  return apiGet<{ data: AdminBlogDetailDto }>(`/admin/blog/posts/${id}`, { token });
}

export async function fetchAdminBlogPosts(page: number, token: string, limit = 12) {
  const q = new URLSearchParams({ page: String(page), limit: String(limit) });
  return apiGet<{
    data: AdminBlogListRow[];
    meta: { page: number; limit: number; total: number; offset: number };
  }>(`/admin/blog/posts?${q}`, { token });
}

export async function createAdminBlogPost(body: AdminBlogPostPayload, token: string) {
  return apiPost<{ data: { id: string } }>('/admin/blog/posts', body, { token });
}

export async function updateAdminBlogPost(id: string, body: Partial<AdminBlogPostPayload>, token: string) {
  return apiPatch<{ data: unknown }>(`/admin/blog/posts/${id}`, body, { token });
}

export async function deleteAdminBlogPost(id: string, token: string) {
  await apiDelete(`/admin/blog/posts/${id}`, { token });
}
