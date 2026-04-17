import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants/routes';
import { fetchBlogComments, postBlogComment } from '@/lib/blogApi';
import { ApiError } from '@/lib/apiClient';

interface BlogDetailCommentsSectionProps {
  postId: string;
}

export default function BlogDetailCommentsSection({ postId }: BlogDetailCommentsSectionProps) {
  const { user, accessToken } = useAuth();
  const [visibleCount, setVisibleCount] = useState(20);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<
    Array<{ id: string; user: string; date: string; content: string; avatar?: string }>
  >([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchBlogComments(postId, 1);
      setComments(
        res.data.map((c) => ({
          id: c.id,
          user: c.authorName,
          date: c.date,
          content: c.content,
        })),
      );
      setTotal(res.meta.total);
    } catch {
      setComments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleSubmit = async () => {
    const text = newComment.trim();
    if (!text || !accessToken) return;
    setSubmitting(true);
    try {
      await postBlogComment(postId, text, accessToken);
      setNewComment('');
      await load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : 'Không gửi được bình luận.');
    } finally {
      setSubmitting(false);
    }
  };

  const shown = comments.slice(0, visibleCount);

  return (
    <div className="bg-white rounded-[32px] shadow-sm border border-outline-variant/20 p-6 sm:p-10">
      <h3 className="text-2xl font-bold text-on-surface mb-8 flex items-center gap-2">
        <MessageCircle className="w-6 h-6 text-primary" />
        Bình luận ({total || comments.length})
      </h3>

      {loading ? (
        <p className="text-on-surface-variant text-sm mb-8">Đang tải bình luận…</p>
      ) : null}

      {user ? (
        <div className="flex gap-4 mb-10">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 m-2 text-primary" />
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              className="w-full p-4 rounded-xl border border-outline-variant/40 bg-surface-container-lowest focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none min-h-[100px]"
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                disabled={submitting || !newComment.trim()}
                onClick={handleSubmit}
                className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Đang gửi…' : 'Gửi bình luận'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-low p-6 rounded-2xl text-center mb-10 border border-outline-variant/20">
          <p className="text-on-surface-variant mb-4">Vui lòng đăng nhập để để lại bình luận.</p>
          <Link
            to={ROUTES.login}
            className="inline-block bg-primary text-white px-6 py-2 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Đăng nhập ngay
          </Link>
        </div>
      )}

      <div className="space-y-6">
        {shown.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/15 flex-shrink-0 flex items-center justify-center text-primary font-bold text-sm">
              {comment.user.slice(0, 1).toUpperCase()}
            </div>
            <div className="flex-1 bg-surface-container-lowest p-4 rounded-2xl border border-outline-variant/20">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-on-surface text-sm">{comment.user}</h4>
                <span className="text-xs text-on-surface-variant">{comment.date}</span>
              </div>
              <p className="text-on-surface-variant text-sm leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      {visibleCount < comments.length && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => setVisibleCount((v) => v + 10)}
            className="px-6 py-2 border border-outline-variant/40 rounded-full text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            Xem thêm bình luận
          </button>
        </div>
      )}
    </div>
  );
}
