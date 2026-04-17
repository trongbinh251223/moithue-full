import { Link, useNavigate } from 'react-router-dom';
import PageShell from '@/components/layout/PageShell';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import { usePropertyDetailPage } from '@/hooks/property/usePropertyDetailPage';
import {
  PropertyDetailBreadcrumbsSection,
  PropertyDetailDescriptionSection,
  PropertyDetailGallerySection,
  PropertyDetailSimilarSection,
  PropertyDetailSpecsSection,
  PropertyDetailSummarySection,
} from '@/sections/property-detail';

export default function PropertyDetail() {
  const navigate = useNavigate();
  const { accessToken, isAuthenticated } = useAuth();
  const {
    state,
    currentImageIndex,
    setCurrentImageIndex,
    nextImage,
    prevImage,
    toggleSaved,
  } = usePropertyDetailPage(accessToken);

  if (state.status === 'loading') {
    return (
      <PageShell className="bg-surface" mainClassName="flex-1 pt-28 pb-12 max-w-5xl w-full mx-auto px-4 sm:px-8">
        <p className="text-on-surface-variant text-center py-20">Đang tải tin đăng…</p>
      </PageShell>
    );
  }

  if (state.status === 'error') {
    return (
      <PageShell className="bg-surface" mainClassName="flex-1 pt-28 pb-12 max-w-5xl w-full mx-auto px-4 sm:px-8">
        <div className="rounded-2xl border border-outline-variant/30 bg-white p-8 text-center">
          <p className="text-on-surface-variant mb-4">{state.message}</p>
          <Link to={ROUTES.search} className="font-bold text-primary hover:underline">
            Về trang tìm kiếm
          </Link>
        </div>
      </PageShell>
    );
  }

  const { property, similar, isSaved } = state;

  return (
    <PageShell
      className="bg-surface selection:bg-primary/10"
      mainClassName="flex-1 pt-28 pb-12 max-w-5xl w-full mx-auto px-4 sm:px-8"
    >
      <PropertyDetailBreadcrumbsSection title={property.title} />
      <PropertyDetailGallerySection
        property={property}
        currentImageIndex={currentImageIndex}
        onSelectImage={setCurrentImageIndex}
        onPrev={prevImage}
        onNext={nextImage}
      />
      <PropertyDetailSummarySection
        property={property}
        isSaved={isSaved}
        onToggleSaved={() => {
          if (!isAuthenticated) {
            navigate(ROUTES.login);
            return;
          }
          void toggleSaved(property.id, isSaved);
        }}
      />
      <PropertyDetailSpecsSection property={property} />
      <PropertyDetailDescriptionSection property={property} />
      <PropertyDetailSimilarSection properties={similar} />
    </PageShell>
  );
}
