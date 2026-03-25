# Matetrip Frontend

AI 기반 협업 여행 플래닝 웹 애플리케이션의 프론트엔드 프로젝트입니다.

## 프로젝트 실행 방법

### 사전 요구사항

- Node.js 18 이상
- npm

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (기본 포트: 3001)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 코드 린트
npm run lint

# 코드 포맷팅
npm run format
```

### 환경 변수

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수를 설정합니다.

```env
VITE_REACT_APP_SERVER_URL=<백엔드 API 서버 URL>
VITE_KAKAO_REST_API_KEY=<카카오 REST API 키>
VITE_KAKAO_MAP_APP_KEY=<카카오 맵 JavaScript 키>
```

---

## 프로젝트 소개
<img width="594" height="840" alt="POST V  2 - A1(small)" src="https://github.com/user-attachments/assets/f82fdca8-f482-4b1d-9473-4f5fcbfed66b" />


---

## 서비스 기능 요약

### 1. 여행 워크스페이스 (실시간 협업)
- 다수의 사용자가 동시에 여행 일정을 편집할 수 있는 **실시간 협업 워크스페이스**
- 일차별 일정 관리 및 **드래그 앤 드롭**으로 POI(관심 장소) 순서 변경
- 멤버 커서 실시간 추적 및 WebSocket 기반 동기화
- 경로 시각화 및 이동 거리/시간 계산

### 2. AI 기반 추천 및 매칭
- 여행 스타일, MBTI, 성향을 기반으로 **여행 메이트 매칭**
- AI 챗봇을 통한 장소 추천 및 일정 최적화
- 벡터 기반 프로필 유사도 분석

### 3. 카카오맵 연동
- 카카오맵 기반 인터랙티브 지도
- 장소 검색 및 카테고리별 POI 마커 표시 (문화, 스포츠, 자연, 음식, 숙소 등)
- 경로 시각화 및 다중 사용자 커서 표시

### 4. 여행 모집 게시판
- 여행 동행 모집 게시글 작성/수정/삭제
- 참가 신청 및 승인/거절 관리
- 모집 상태 관리 (모집중, 모집완료, 완료)

### 5. 커뮤니케이션
- 워크스페이스 내 실시간 채팅
- 알림 시스템
- Amazon Chime SDK 기반 화상 통화

### 6. 사용자 프로필
- MBTI, 여행 스타일, 성향 등 상세 프로필 관리
- 매너 온도 평가 시스템
- 장소 리뷰 작성

### 7. PDF 내보내기
- 여행 일정표를 PDF로 생성 및 다운로드

### 8. 영감 피드
- 다른 여행자들의 게시글 탐색
- 인기 여행지 캐러셀

---

## 사용 기술

### Core

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.1.1 | UI 라이브러리 |
| TypeScript | 5.9.3 | 정적 타입 시스템 |
| Vite | 7.1.7 | 빌드 도구 및 개발 서버 |
| React Router DOM | 7.9.5 | 클라이언트 사이드 라우팅 |

### 상태 관리 & 데이터 통신

| 기술 | 버전 | 용도 |
|------|------|------|
| Zustand | 5.0.8 | 전역 상태 관리 |
| Axios | 1.13.1 | HTTP 클라이언트 |
| Socket.IO Client | 4.8.1 | 실시간 WebSocket 통신 |
| React Hook Form | 7.55.0 | 폼 상태 관리 |

### UI & 스타일링

| 기술 | 버전 | 용도 |
|------|------|------|
| Tailwind CSS | 4.1.14 | 유틸리티 퍼스트 CSS |
| Radix UI | - | 접근성 기반 헤드리스 컴포넌트 |
| Framer Motion | 12.23.24 | 애니메이션 |
| Lucide React | 0.487.0 | 아이콘 |
| Sonner | 2.0.3 | 토스트 알림 |

### 지도 & 위치

| 기술 | 버전 | 용도 |
|------|------|------|
| React Kakao Maps SDK | 1.2.0 | 카카오맵 연동 |
| Kakao Maps REST API | - | 장소 검색 |

### 기타

| 기술 | 버전 | 용도 |
|------|------|------|
| @dnd-kit | 6.3.1 / 10.0.0 | 드래그 앤 드롭 |
| Recharts | 2.15.2 | 데이터 차트 |
| jsPDF + html2canvas-pro | 3.0.3 / 1.5.13 | PDF 생성 |
| Amazon Chime SDK | 3.10.0 | 화상 통화 |
| React Markdown | 10.1.0 | 마크다운 렌더링 |
| date-fns | 4.1.0 | 날짜 유틸리티 |
| Embla Carousel | 8.6.0 | 캐러셀 |

### 개발 도구

| 기술 | 버전 | 용도 |
|------|------|------|
| ESLint | 9.36.0 | 코드 린트 |
| Prettier | 3.6.2 | 코드 포맷터 |
| @vitejs/plugin-react-swc | 3.11.0 | SWC 기반 빠른 HMR |

---

## 프로젝트 구조

```
src/
├── api/           # API 클라이언트 및 엔드포인트
├── components/    # 재사용 가능한 React 컴포넌트
├── page/          # 페이지 컴포넌트 (라우트)
├── store/         # Zustand 전역 상태 스토어
├── hooks/         # 커스텀 훅 (채팅, POI 소켓 등)
├── types/         # TypeScript 타입 정의
├── constants/     # 상수 (MBTI, 여행 스타일 등)
├── utils/         # 유틸리티 함수
├── styles/        # 글로벌 스타일
└── image/         # 정적 이미지 리소스
```
