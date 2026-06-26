# 오늘의 도서관

**지금 열린 도서관을 가까운 순으로 찾아주는 모바일 앱**입니다.

공부할 곳이나 책을 읽을 공간을 찾을 때, 홈페이지마다 운영 시간을 일일이 확인하기 번거롭습니다. 오늘의 도서관은 전국 공공도서관·작은도서관 데이터를 모아 **오늘 문을 연 곳만 골라 보여주고**, 내 위치에서 가까운 순으로 정렬해 줍니다.

## 이런 분께

- 지금 당장 갈 수 있는 도서관을 찾고 싶을 때
- 주말에도 여는 도서관만 골라 보고 싶을 때
- 자주 가는 도서관을 즐겨찾기로 저장해 두고 싶을 때

## 주요 기능

- **지금 열림** — 오늘 운영 중인 도서관을 우선 표시
- **가까운 순** — 현재 위치 기준 거리순 정렬
- **검색·필터** — 지역·도서관명 검색, 주말 운영·즐겨찾기 필터
- **한눈에 보는 정보** — 평일·주말 운영시간, 좌석 수, 휴관일
- **바로 연결** — 전화, 홈페이지, 길찾기(외부 지도 앱)

## 스크린샷

<p align="center">
  <img src="assets/screenshots/01-home.png" width="220" alt="홈 — 열린 도서관 목록" />
  <img src="assets/screenshots/02-search-mapo.png" width="220" alt="마포 검색 결과" />
  <img src="assets/screenshots/03-library-list.png" width="220" alt="도서관 카드 상세" />
</p>

<p align="center"><sub>홈 · 검색 · 도서관 상세</sub></p>

## 링크

| | |
|---|---|
| **서비스** | [today-library-sigma.vercel.app](https://today-library-sigma.vercel.app) |
| **개인정보 처리방침** | [today-library-sigma.vercel.app/api/privacy](https://today-library-sigma.vercel.app/api/privacy) |

Android 패키지: `com.dobedub.todaylibrary`

## 데이터

전국 도서관 정보는 [공공데이터포털 전국도서관표준데이터](https://www.data.go.kr)를 기반으로 하며, Vercel serverless API가 매일 갱신해 앱에 전달합니다. API 키는 서버에만 두고 앱에는 공개하지 않습니다.

## 로컬 개발

```shell
npm install
npm start        # Expo 개발 서버
npm run ios      # iOS 시뮬레이터
npm run android  # Android 에뮬레이터
```

환경 변수는 `.env.example`을 참고해 `.env.local`에 설정합니다. 앱이 사용하는 API 주소는 `EXPO_PUBLIC_LIBRARY_API_URL`입니다.
