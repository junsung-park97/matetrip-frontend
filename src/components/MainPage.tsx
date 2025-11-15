import { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  ClipboardList,
  Plus,
  Info,
  Sparkles,
  Wand2,
} from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import client from '../api/client';
import { type Post } from '../types/post';
import { MainPostCardSkeleton } from './MainPostCardSkeleton';
import { MatchingCarousel } from './MatchingCarousel';
import { useAuthStore } from '../store/authStore';
import type { MatchingInfo } from '../types/matching';

interface MainPageProps {
  onSearch: (params: {
    startDate?: string;
    endDate?: string;
    location?: string;
    title?: string;
  }) => void;
  onViewPost: (postId: string) => void;
  onCreatePost: () => void;
  isLoggedIn: boolean;
  fetchTrigger: number;
}

const REGION_CATEGORIES = [
  {
    id: 1,
    name: '제주도',
    image:
      'https://images.unsplash.com/photo-1614088459293-5669fadc3448?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx0cmF2ZWwlMjBkZXN0aW5hdGlvbnxlbnwxfHx8fDE3NjE4NjQwNzB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: '힐링 여행의 성지',
  },
  {
    id: 2,
    name: '부산',
    image:
      'https://images.unsplash.com/photo-1665231342828-229205867d94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxiZWFjaCUyMHBhcmFhZGlzZfGVufDF8fHx8MTc2MTg4Mzg2MHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: '바다와 도시의 조화',
  },
  {
    id: 3,
    name: '서울',
    image:
      'https://images.unsplash.com/photo-1597552661064-af143a5f3bee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxzZW91bCUyMGtvcmVhfGVufDF8fHx8MTc2MTk4MjQzNHww&ixlib=rb-4.1.0&q=80&w=1080',
    description: '트렌디한 도심 여행',
  },
  {
    id: 4,
    name: '경주',
    image:
      'https://images.unsplash.com/photo-1668850443435-c01eec56c4e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxnYnllb25namUlMjBrb3JlYXxlbnwxfHx8fDE3NjE5ODI0MzR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: '역사 문화 탐방',
  },
  {
    id: 5,
    name: '강릉',
    image:
      'https://images.unsplash.com/photo-1684042229029-8a99193a8e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxnYW5nbmV1bmclMjBrb3JlYXxlbnwxfHx8fDE3NjE5ODI0MzV8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: '동해안의 낭만',
  },
  {
    id: 6,
    name: '전주',
    image:
      'https://images.unsplash.com/photo-1520645521318-f03a12f0e67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxjaXR5JTIwdHJhdmVsfGVufDF8fHx8MTc2MTkxMjEzMXww&ixlib=rb-4.1.0&q=80&w=1080',
    description: '맛집 투어의 메카',
  },
];

const normalizeOverlapText = (values?: unknown): string | undefined => {
  if (!values) {
    return undefined;
  }

  const arrayValues = Array.isArray(values) ? values : [values];

  const normalized = arrayValues
    .map((value) => {
      if (!value) {
        return '';
      }
      if (typeof value === 'string') {
        return value;
      }
      if (typeof value === 'object') {
        const candidate = value as Record<string, unknown>;
        if (typeof candidate.label === 'string') {
          return candidate.label;
        }
        if (typeof candidate.value === 'string') {
          return candidate.value;
        }
        if (typeof candidate.name === 'string') {
          return candidate.name;
        }
      }
      return String(value);
    })
    .map((text) => text.trim())
    .filter((text) => text.length > 0);

  if (!normalized.length) {
    return undefined;
  }

  return normalized.join(', ');
};

// 임시 매칭 정보 생성 함수 (추후 실제 API로 교체 가능)
const generateMockMatchingInfo = (index: number): MatchingInfo => {
  const scores = [92, 85, 78, 73, 68, 65, 62, 58, 55, 52];
  const tendencies = ['즉흥적', '계획적', '주도적', '따라가는'];
  const styles = ['호텔', '게스트하우스', '에어비앤비', '캠핑'];
  
  return {
    score: scores[index % scores.length] || 50,
    tendency: tendencies[index % tendencies.length],
    style: styles[index % styles.length],
    vectorscore: Math.floor(Math.random() * 30) + 60, // 60-90 사이 랜덤값
  };
};

export function MainPage({
  onSearch,
  onViewPost,
  fetchTrigger,
  isLoggedIn,
}: MainPageProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Single loading state for both sections
  const { user, isAuthLoading } = useAuthStore(); // Get user and isAuthLoading from auth store
  const [matches, setMatches] = useState<MatchCandidateDto[]>([]);
  const [isMatchesLoading, setIsMatchesLoading] = useState(true);
  const [featuredView, setFeaturedView] = useState<'latest' | 'recommended'>(
    'latest'
  );
     const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isAuthLoading) {
      setIsLoading(true);
      return;
    }

    const fetchAllPosts = async () => {
      setIsLoading(true);
      try {
        const initialPostsResponse = await client.get<Post[]>('/posts');

        const sortedInitialPosts = initialPostsResponse.data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // '최신 동행 모집' 섹션에는 '모집중'인 글만 필터링하여 설정
        const recruitingPosts = sortedInitialPosts.filter(
          (post) => post.status === '모집중'
        );
        setPosts(recruitingPosts);
        console.log(`최신 동행 글 목록`, sortedInitialPosts);
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllPosts();
  }, [isAuthLoading, fetchTrigger]);


  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch({ title: searchQuery });
    }

    let isMounted = true;

    const fetchMatches = async () => {
      setIsMatchesLoading(true);
      try {
        const res = await client.post<MatchCandidateDto[]>( //응답타입
          '/profile/matching/search',
          {
            limit: 5, //BODY
          }
        );
        if (!isMounted) {
          return;
        }
        console.log('match response', res.data);
        setMatches(res.data ?? []);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        console.error('Failed to fetch matches', err);
      } finally {
        if (isMounted) {
          setIsMatchesLoading(false);
        }
      }
    };

    fetchMatches();
    console.log('matching search 완료!');

    return () => {
      isMounted = false;
    };
  }, [isAuthLoading, isLoggedIn, user?.userId]);

  // const handleSearch = (e: React.FormEvent) => {
  //   e?.preventDefault();
  //   onSearch({
  //     startDate: searchStartDate,
  //     endDate: searchEndDate,
  //     location: searchLocation,
  //     title: searchTitle,
  //   });
  // };

  useEffect(() => {
    if (!isLoggedIn) {
      setFeaturedView('latest');
    }
  }, [isLoggedIn]);

  const { recommendedPosts, matchingInfoByPostId } = useMemo(() => {
    const toPercent = (value?: number) => {
      if (value === undefined || value === null) {
        return 0;
      }
      return Math.round(value <= 1 ? value * 100 : value);
    };

    const entries: Array<{ post: Post; info: MatchingInfo }> = [];
    const seenPostIds = new Set<string>();

    matches.forEach((candidate) => {
      const matchedPost = posts.find((post) => {
        const writerIds = [
          post.writerId,
          post.writer?.id,
          post.writerProfile?.id,
        ].filter(Boolean);
        return writerIds.includes(candidate.userId);
      });

      if (!matchedPost || seenPostIds.has(matchedPost.id)) {
        return;
      }

      seenPostIds.add(matchedPost.id);

      const tendencyText = normalizeOverlapText(
        candidate.overlappingTendencies
      );

      const styleText = normalizeOverlapText(candidate.overlappingTravelStyles);

      entries.push({
        post: matchedPost,
        info: {
          score: toPercent(candidate.score),
          vectorscore:
            candidate.vectorScore !== undefined
              ? toPercent(candidate.vectorScore)
              : undefined,
          tendency: tendencyText,
          style: styleText,
        },
      });
    });

    return {
      recommendedPosts: entries.map((entry) => entry.post),
      matchingInfoByPostId: entries.reduce<Record<string, MatchingInfo>>(
        (acc, entry) => {
          acc[entry.post.id] = entry.info;
          return acc;
        },
        {}
      ),
    };
  }, [matches, posts]);

  const activeFeaturedView =
    featuredView === 'recommended' && isLoggedIn ? 'recommended' : 'latest';

  const featuredTitle =
    activeFeaturedView === 'recommended' && user
      ? `${user?.profile.nickname}님과 성향이 비슷한 유저들이 동행을 구하고 있어요`
      : '최신 동행 모집';

  const isFeaturedLoading =
    activeFeaturedView === 'recommended' ? isMatchesLoading : isLoading;

  const featuredItems =
    activeFeaturedView === 'recommended' ? recommendedPosts : posts;

  const featuredEmptyMessage =
    activeFeaturedView === 'recommended'
      ? '추천할 게시글이 없습니다.'
      : '최신 게시글이 없습니다.';

  const handleFeaturedViewChange = (view: 'latest' | 'recommended') => {
    if (view === 'recommended' && !isLoggedIn) {
      return;
    }
    setFeaturedView(view);
  };
  
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-16 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            당신과 잘 맞는 동행
          </h1>
          <p className="text-base text-gray-600">
            MateTrip AI가 추천하는 최적의 여행 파트너
          </p>
        </div>

        {!isLoggedIn ? (
          /* 로그인하지 않은 사용자를 위한 안내 */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="bg-white rounded-lg shadow-lg p-12 max-w-md text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                로그인이 필요한 서비스입니다
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                AI가 추천하는 최적의 여행 파트너를 만나려면
                <br />
                로그인이 필요합니다.
                <br />
                <br />
                로그인 후 당신에게 딱 맞는 동행을 찾아보세요!
              </p>
              <Button
                onClick={() => window.location.href = '/login'}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                로그인하러 가기
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Search Bar and Filters */}
            <div className="mb-10 flex items-center gap-3">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="여행지, 관심사, 여행 스타일로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </form>
              <Button
                variant="outline"
                className="gap-2 px-6 py-3 h-auto border-gray-200"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </Button>
            </div>

            {/* Recommended Posts Section */}
            <section className="mb-12">
              <h2 className="text-xl font-medium text-gray-900 mb-6">AI 추천 동행</h2>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <MainPostCardSkeleton key={index} />
                  ))}
                </div>
              </div>
              {isRecommendedView && (
                <p className="text-sm font-medium text-blue-900/80 flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  여행 성향·스타일·프로필 취향·MBTI를 모두 반영한 맞춤 추천
                  리스트예요.
                </p>
              )}
            </section>
          </>
        )}

        {/* Region Categories Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">인기 여행지</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {REGION_CATEGORIES.map((region) => (
              <button
                key={region.id}
                onClick={() => onSearch({ location: region.name })}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <ImageWithFallback
                  src={region.image}
                  alt={region.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="mb-1">{region.name}</h3>
                  <p className="text-xs text-gray-200">{region.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
