import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Building2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import {
  HERO_DISTRICT_OPTIONS,
  HERO_GALLERY_IMAGES,
  HERO_PROPERTY_GROUP_OPTIONS,
  HERO_TREND_KEYWORDS,
} from '@/constants/home/hero';
import { Input } from '@/components/ui/Input';
import { createEmptySelectedSearchFilters } from '@/constants/search/filterDefaults';
import { DEFAULT_SORT_LABEL, serializeSearchUrlState, type SearchUrlState } from '@/constants/search/searchUrlState';

const GROUP_TO_PROPERTY_TYPE: Partial<Record<string, string>> = {
  'Phòng khép kín': 'Phòng trọ',
  'Nhà nguyên căn': 'Nhà nguyên căn',
};

export default function HeroSection() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [district, setDistrict] = useState<string>(HERO_DISTRICT_OPTIONS[0]);
  const [propertyGroup, setPropertyGroup] = useState<string>(HERO_PROPERTY_GROUP_OPTIONS[0]);

  const runSearch = (trendKeyword?: string) => {
    const kwBase = (trendKeyword ?? keyword).trim();
    const filters = createEmptySelectedSearchFilters();

    let q = kwBase;
    if (district && district !== 'Quận / Huyện') {
      q = [q, district].filter(Boolean).join(' ').trim();
    }

    if (propertyGroup && propertyGroup !== 'Nhóm Nguồn Hàng') {
      const mapped = GROUP_TO_PROPERTY_TYPE[propertyGroup];
      if (mapped) filters['Loại hình nhà ở'] = mapped;
      else if (propertyGroup === 'Văn phòng') {
        q = [q, 'văn phòng'].filter(Boolean).join(' ').trim();
      } else {
        q = [q, propertyGroup].filter(Boolean).join(' ').trim();
      }
    }

    const state: SearchUrlState = {
      keyword: q,
      selectedFilters: filters,
      activePriceRange: null,
      sortBy: DEFAULT_SORT_LABEL,
      page: 1,
    };
    navigate(`${ROUTES.search}?${serializeSearchUrlState(state)}`);
  };

  return (
    <section className="bg-surface-container-low pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 items-center w-full relative z-10">
        <div className="flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10 space-y-6"
          >
            <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] text-on-surface tracking-tight">
              An tâm <span className="text-brand-yellow">tìm nhà</span> với cố vấn chuyên nghiệp
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-lg">
              Thông tin minh bạch đáng tin cậy. An tâm tìm nhà không lo về giá. Quản lý, cố vấn cho thuê
              chuyên nghiệp, tận tâm.
            </p>
          </motion.div>

          <div className="h-auto lg:h-[72px] w-full mb-10">
            <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-[800px] xl:w-[900px] z-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-full bg-white rounded-3xl lg:rounded-full shadow-xl p-2 flex flex-col lg:flex-row items-center border border-outline-variant/10"
              >
                <div className="flex-1 w-full lg:w-1/3 flex items-center px-6 border-b lg:border-b-0 lg:border-r border-outline-variant/10 h-14 group hover:bg-surface-container-low/50 transition-colors rounded-2xl lg:rounded-full cursor-text">
                  <Sparkles className="text-gray-400 mr-3 w-5 h-5 group-focus-within:text-brand-yellow transition-colors" />
                  <Input
                    className="placeholder:text-gray-400 cursor-text"
                    placeholder="Từ khóa"
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') runSearch();
                    }}
                  />
                </div>
                <div className="flex-1 w-full lg:w-1/3 flex items-center px-6 border-b lg:border-b-0 lg:border-r border-outline-variant/10 h-14 group hover:bg-surface-container-low/50 transition-colors cursor-pointer rounded-2xl lg:rounded-full">
                  <MapPin className="text-gray-400 mr-3 w-5 h-5 group-hover:text-brand-yellow transition-colors" />
                  <select
                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-600 appearance-none cursor-pointer outline-none"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    {HERO_DISTRICT_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1 w-full lg:w-1/3 flex items-center px-6 h-14 group hover:bg-surface-container-low/50 transition-colors cursor-pointer rounded-2xl lg:rounded-full">
                  <Building2 className="text-gray-400 mr-3 w-5 h-5 group-hover:text-brand-yellow transition-colors" />
                  <select
                    className="w-full bg-transparent border-none focus:ring-0 text-sm text-gray-600 appearance-none cursor-pointer outline-none"
                    value={propertyGroup}
                    onChange={(e) => setPropertyGroup(e.target.value)}
                  >
                    {HERO_PROPERTY_GROUP_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="px-2 w-full lg:w-auto mt-2 lg:mt-0">
                  <button
                    type="button"
                    onClick={() => runSearch()}
                    className="w-full lg:w-auto bg-brand-yellow text-white h-14 px-8 rounded-2xl lg:rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                  >
                    <Search className="w-5 h-5" />
                    Tìm kiếm
                  </button>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="text-sm text-on-surface-variant">
            Xu hướng:{' '}
            {HERO_TREND_KEYWORDS.map((kw, i) => (
              <span key={kw}>
                {i > 0 ? ', ' : ''}
                <button
                  type="button"
                  className="hover:text-brand-yellow cursor-pointer transition-colors bg-transparent border-0 p-0 font-inherit"
                  onClick={() => runSearch(kw)}
                >
                  {kw}
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="relative grid grid-cols-12 grid-rows-12 gap-4 h-[300px] sm:h-[400px] lg:h-[600px] mt-8 lg:mt-0">
          {HERO_GALLERY_IMAGES.map((img, index) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: img.motionDelay ?? index * 0.1 }}
              className={img.gridClass}
            >
              <img
                className="w-full h-full object-cover"
                src={img.src}
                alt={img.alt}
                referrerPolicy="no-referrer"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
