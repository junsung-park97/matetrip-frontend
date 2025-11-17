import { useState, useRef, useEffect } from 'react';
<<<<<<< HEAD
import { Search, MapPin, Calendar, User, Clock, X } from 'lucide-react';
import { Input } from './ui/input';

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

// 각 제안 항목의 데이터 타입을 정의합니다.
interface SuggestionPlace {
  id: string;
  name: string;
  type: string;
}

interface SuggestionTrip {
  id: string;
  title: string;
  members?: string;
  author?: string;
}

interface SuggestionUser {
  id: string;
  name: string;
  nickname: string;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches] = useState(['경주', '김민준', '제주도']);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // 모든 제안 항목을 포함하는 discriminated union 타입을 정의합니다.
  type SearchItem =
    | { type: 'recent'; data: string; index: number }
    | { type: 'place'; data: SuggestionPlace; index: number }
    | { type: 'trip'; data: SuggestionTrip; index: number }
    | { type: 'user'; data: SuggestionUser; index: number };

  // 검색 제안 데이터
  const suggestions = {
    places: [
      { id: '1', name: '부산 (도시)', type: 'city' },
      { id: '2', name: '부산역 (주요 지점)', type: 'station' },
      { id: '3', name: '부산 돼지국밥 (키워드 추천)', type: 'keyword' },
    ],
    trips: [
      { id: '1', title: '[동행] 부산 2박 3일 힐링/맛집', members: '3/4명' },
      {
        id: '2',
        title: '[일정] 완벽한 부산 1박 2일 코스',
        author: 'by. 이수호',
      },
    ],
    users: [{ id: '1', name: '부산사는 최유나', nickname: '닉네임' }],
  };

  // 현재 표시되는 모든 항목들
  const getAllItems = (): SearchItem[] => {
    if (!query) {
      return recentSearches.map((search, idx) => ({
        type: 'recent',
        data: search,
        index: idx,
      }));
    }

    const items: SearchItem[] = [];
    suggestions.places.forEach((place) => {
      items.push({ type: 'place', data: place, index: items.length });
    });
    suggestions.trips.forEach((trip) => {
      items.push({ type: 'trip', data: trip, index: items.length });
    });
    suggestions.users.forEach((user) => {
      items.push({ type: 'user', data: user, index: items.length });
    });
    return items;
  };

  const allItems = getAllItems();

  // 선택된 항목으로 스크롤
  useEffect(() => {
    if (selectedIndex >= 0 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  // query나 focus 변경 시 선택 초기화
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query, isFocused]);

=======
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import client from '../api/client';
import type {
  MatchCandidateDto,
  MatchingInfo,
  MatchRecruitingPostDto,
} from '../types/matching';
import {
  KEYWORD_TYPES,
  type KeywordKey,
  type KeywordValue,
} from '../utils/keyword';
import { useNavigate } from 'react-router-dom';
import type { MatchingResult } from '../types/matchSearch';

const KEYWORD_ENTRIES = Object.entries(KEYWORD_TYPES).map(([key, label]) => ({
  key: key as KeywordKey,
  label,
}));

// 헤더에서 사용하는 통합 검색바. 입력한 조건으로 매칭 API를 직접 호출하고 결과를 즉시 MatchingCard로 보여준다.
export function MatchingSearchBar() {
  const [locationQuery, setLocationQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedKeywords, setSelectedKeyword] = useState<KeywordValue[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  // 검색창 바깥을 클릭하면 필터/결과 패널을 닫는다.
>>>>>>> f2d0bc6d3dca8100174e6ee5de4cdd6a68103b90
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
<<<<<<< HEAD
        setIsFocused(false);
=======
        setIsFilterOpen(false);
>>>>>>> f2d0bc6d3dca8100174e6ee5de4cdd6a68103b90
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

<<<<<<< HEAD
  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query);
      setIsFocused(false);
    }
  };

  const handleItemClick = (item: SearchItem) => {
    if (item.type === 'recent' || item.type === 'place') {
      setQuery(item.type === 'recent' ? item.data : item.data.name);
      inputRef.current?.focus();
    } else if (item.type === 'trip') {
      // trip의 제목을 검색어로 설정 후 검색
      const searchQuery = item.data.title;
      setQuery(searchQuery);
      onSearch?.(searchQuery);
      setIsFocused(false);
    } else if (item.type === 'user') {
      // user의 이름을 검색어로 설정 후 검색
      const searchQuery = item.data.name;
      setQuery(searchQuery);
      onSearch?.(searchQuery);
      setIsFocused(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isFocused) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + allItems.length) % allItems.length
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < allItems.length) {
        handleItemClick(allItems[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setSelectedIndex(-1);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative flex-1" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="통합 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 py-2 w-full rounded-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* 드롭다운 */}
      {isFocused && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
          {/* 빈 상태: 최근 검색어 */}
          {!query && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3 text-gray-500">
                <Clock className="w-4 h-4" />
                <span className="text-sm">최근 검색어</span>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    onClick={() => handleRecentSearchClick(search)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedIndex === index
                        ? 'bg-blue-100 text-blue-900'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 입력 상태: 실시간 제안 */}
          {query && (
            <div className="p-4 space-y-4">
              {/* 장소 */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">장소</span>
                </div>
                <div className="space-y-1">
                  {suggestions.places.map((place) => {
                    const itemIndex = allItems.findIndex(
                      (item) =>
                        item.type === 'place' && item.data.id === place.id
                    );
                    return (
                      <button
                        key={place.id}
                        ref={(el) => {
                          itemRefs.current[itemIndex] = el;
                        }}
                        onClick={() => handleRecentSearchClick(place.name)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedIndex === itemIndex
                            ? 'bg-blue-100 text-blue-900'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {place.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 여행 일정/동행 */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">여행 일정/동행</span>
                </div>
                <div className="space-y-1">
                  {suggestions.trips.map((trip) => {
                    const itemIndex = allItems.findIndex(
                      (item) => item.type === 'trip' && item.data.id === trip.id
                    );
                    return (
                      <button
                        key={trip.id}
                        ref={(el) => {
                          itemRefs.current[itemIndex] = el;
                        }}
                        onClick={() => handleItemClick(allItems[itemIndex])}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedIndex === itemIndex
                            ? 'bg-blue-100 text-blue-900'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div>{trip.title}</div>
                        <div className="text-sm text-gray-500">
                          {trip.members || trip.author}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 사용자 */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-gray-500">
                  <User className="w-4 h-4" />
                  <span className="text-sm">사용자</span>
                </div>
                <div className="space-y-1">
                  {suggestions.users.map((user) => {
                    const itemIndex = allItems.findIndex(
                      (item) => item.type === 'user' && item.data.id === user.id
                    );
                    return (
                      <button
                        key={user.id}
                        ref={(el) => {
                          itemRefs.current[itemIndex] = el;
                        }}
                        onClick={() => handleItemClick(allItems[itemIndex])}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedIndex === itemIndex
                            ? 'bg-blue-100 text-blue-900'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div>{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {user.nickname}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
=======
  const hasFilters = Boolean(
    startDate || endDate || locationQuery || selectedKeywords.length
  );

  const buildMatchingInfo = (candidate: MatchCandidateDto): MatchingInfo => ({
    score: Math.round((candidate.score ?? 0) * 100),
    vectorscore:
      candidate.vectorScore !== undefined
        ? Math.round(candidate.vectorScore * 100)
        : undefined,
    tendency: candidate.overlappingTendencies?.join(', '),
    style: candidate.overlappingTravelStyles?.join(', '),
  });

  const convertCandidateToResult = (
    candidate: MatchCandidateDto,
    post?: MatchRecruitingPostDto | null
  ): MatchingResult | null => {
    if (!post) {
      return null;
    }

    return {
      post,
      matchingInfo: buildMatchingInfo(candidate),
    };
  };

  // 현재 입력된 조건을 기반으로 매칭 추천 API를 호출한다.
  const executeMatchingSearch = async () => {
    const params: Record<string, unknown> = {};

    if (locationQuery.trim()) {
      params.locationQuery = locationQuery.trim();
    }
    if (startDate) {
      params.startDate = startDate;
    }
    if (endDate) {
      params.endDate = endDate;
    }
    if (selectedKeywords.length > 0) {
      params.keywords = selectedKeywords;
    }

    if (!Object.keys(params).length) {
      setError('검색 조건을 입력해주세요.');
      return;
    }

    if (isSearching) {
      return;
    }
    setIsSearching(true);
    setError(null);
    try {
      //📌API 호출
      const response = await client.get<
        MatchCandidateDto[] | { matches?: MatchCandidateDto[] }
      >('/profile/matching/detailsearch', {
        params: {
          ...params,
        },
        paramsSerializer: (requestParams) => {
          //console.log('직렬화 직전 params', requestParams);
          const usp = new URLSearchParams();
          Object.entries(requestParams).forEach(([key, value]) => {
            if (value === undefined || value === null) {
              return;
            }
            if (Array.isArray(value)) {
              value.forEach((item) => {
                if (item !== undefined && item !== null) {
                  usp.append(key, String(item));
                }
              });
            } else {
              usp.append(key, String(value));
            }
          });
          // axios 기본 직렬화는 배열을 문자열로 만들기 때문에 직접 조합한 쿼리스트링을 반환한다.
          return usp.toString();
        },
      });

      const rawData = response.data;
      //console.log(rawData);
      //데이터 프론트가 이해하게끔
      const candidates: MatchCandidateDto[] = Array.isArray(rawData)
        ? (rawData as MatchCandidateDto[])
        : (rawData?.matches ?? []);
      const filters = {
        location: locationQuery.trim() || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        keyword: selectedKeywords.length ? selectedKeywords : undefined,
      };

      const normalized: MatchingResult[] = [];

      candidates.forEach((candidate) => {
        const posts: MatchRecruitingPostDto[] = candidate.recruitingPosts ?? [];
        posts.forEach((recruitingPost) => {
          const converted = convertCandidateToResult(candidate, recruitingPost);
          if (converted) {
            normalized.push(converted);
          }
        });
      });

      if (!normalized.length) {
        setError('조건에 맞는 추천 동행을 찾지 못했습니다.');
        return;
      }

      navigate('/match-search', {
        state: {
          results: normalized,
          query: filters,
        },
      });
    } catch (err) {
      console.error('매칭 검색 실패:', err);
      setError('맞춤 검색 결과를 불러오지 못했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  // 엔터나 검색 버튼 클릭 시 실행
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    executeMatchingSearch();
  };

  const handleKeywordSelect = (keyword: KeywordValue) => {
    setSelectedKeyword((prev) =>
      prev.includes(keyword)
        ? prev.filter((k) => k !== keyword)
        : [...prev, keyword]
    );
  };

  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedKeyword([]);
  };

  return (
    <div ref={containerRef}>
      <div className="flex items-center gap-3" ref={containerRef}>
        <form onSubmit={handleSubmit} className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="여행지, 관심사, 여행 스타일로 검색..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              className="w-full !pl-12 !pr-4 !py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button type="submit" className="sr-only">
              검색
            </button>
          </div>
        </form>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsFilterOpen((prev) => !prev)}
          className={`gap-2 px-6 py-3 h-auto border-gray-200 ${
            hasFilters ? 'border-blue-500 text-blue-600 bg-blue-50' : ''
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </Button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {error}
        </p>
      )}

      {/* 필터 패널 */}
      {isFilterOpen && (
        <div className="absolute right-0 mt-2 w-96 rounded-2xl border border-gray-200 bg-white shadow-xl p-5 z-50 space-y-5">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              여행 기간
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              여행 키워드
            </h4>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1">
              {KEYWORD_ENTRIES.map((keyword) => {
                const isSelected = selectedKeywords.includes(keyword.label);
                return (
                  <button
                    key={keyword.key}
                    type="button"
                    onClick={() => handleKeywordSelect(keyword.label)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {keyword.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              초기화
            </button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-600"
              >
                닫기
              </Button>
              <Button type="button" onClick={executeMatchingSearch}>
                적용
              </Button>
            </div>
          </div>
>>>>>>> f2d0bc6d3dca8100174e6ee5de4cdd6a68103b90
        </div>
      )}
    </div>
  );
}
