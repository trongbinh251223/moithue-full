import { apiGet, apiPost } from '@/lib/apiClient';

export type BlogListItemDto = {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
  createdAt: string;
};

export type BlogPostDetailDto = {
  id: string;
  title: string;
  category: string;
  date: string;
  coverImage: string;
  excerpt: string;
  content: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

export async function fetchBlogPosts(category: string | undefined, page: number) {
  const q = new URLSearchParams({ page: String(page), limit: '12' });
  if (category && category !== 'Tất cả') q.set('category', category);
  return apiGet<{ data: BlogListItemDto[]; meta: { total: number } }>(`/blog/posts?${q}`);
}

export async function fetchBlogPostsPreview(limit = 4) {
  const q = new URLSearchParams({ page: '1', limit: String(limit) });
  return apiGet<{ data: BlogListItemDto[]; meta: { total: number } }>(`/blog/posts?${q}`);
}

export async function fetchBlogPost(id: string) {
  return apiGet<{ data: BlogPostDetailDto }>(`/blog/posts/${id}`);
}

export type BlogCommentDto = {
  id: string;
  content: string;
  authorName: string;
  createdAt: string;
  date: string;
};

export async function fetchBlogComments(postId: string, page: number) {
  const q = new URLSearchParams({ page: String(page), limit: '20' });
  return apiGet<{ data: BlogCommentDto[]; meta: { total: number } }>(`/blog/posts/${postId}/comments?${q}`);
}

export async function postBlogComment(postId: string, content: string, token: string) {
  return apiPost<{ data: BlogCommentDto }>(`/blog/posts/${postId}/comments`, { content }, { token });
}
