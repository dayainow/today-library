import type { VercelRequest, VercelResponse } from '@vercel/node';

const CONTACT_EMAIL = 'devops@dobedub.com';
const APP_NAME = '오늘의 도서관';
const EFFECTIVE_DATE = '2026년 6월 5일';

export default function handler(_request: VercelRequest, response: VercelResponse) {
  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>개인정보 처리방침 – ${APP_NAME}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f7f8fb;
      color: #0b1220;
      line-height: 1.7;
      padding: 0 16px 64px;
    }
    header {
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      padding: 20px 16px;
      margin: 0 -16px 32px;
    }
    .brand { display: flex; align-items: center; gap: 10px; }
    .logo {
      width: 32px; height: 32px;
      background: #2563eb; border-radius: 8px;
      display: inline-block;
    }
    .brand-name { font-size: 17px; font-weight: 800; }
    .container { max-width: 680px; margin: 0 auto; }
    h1 { font-size: 24px; font-weight: 900; margin-bottom: 6px; }
    .effective { color: #64748b; font-size: 13px; margin-bottom: 32px; }
    h2 {
      font-size: 16px; font-weight: 800;
      margin: 28px 0 10px;
      padding-left: 12px;
      border-left: 3px solid #2563eb;
    }
    p { color: #334155; margin-bottom: 10px; }
    ul { color: #334155; padding-left: 20px; margin-bottom: 10px; }
    ul li { margin-bottom: 4px; }
    .card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 16px;
    }
    .highlight { color: #2563eb; font-weight: 700; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    footer { margin-top: 40px; color: #94a3b8; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <div class="brand">
        <span class="logo"></span>
        <span class="brand-name">${APP_NAME}</span>
      </div>
    </div>
  </header>

  <div class="container">
    <h1>개인정보 처리방침</h1>
    <p class="effective">시행일: ${EFFECTIVE_DATE}</p>

    <div class="card">
      <p>
        <strong>${APP_NAME}</strong>('앱')은 사용자의 개인정보를 소중히 여깁니다.
        본 방침은 앱이 수집하는 정보, 사용 방법, 보호 방법을 안내합니다.
      </p>
    </div>

    <h2>1. 수집하는 정보</h2>
    <p>앱은 다음 정보를 수집할 수 있습니다.</p>
    <ul>
      <li>
        <span class="highlight">위치 정보 (선택적)</span> —
        현재 위치 기반으로 가까운 도서관을 거리순으로 정렬하기 위해 사용합니다.
        권한을 허용하지 않아도 앱의 모든 기능을 이용할 수 있습니다.
      </li>
      <li>
        <span class="highlight">즐겨찾기 데이터</span> —
        사용자가 저장한 도서관 ID를 기기의 로컬 저장소에만 보관합니다.
        서버로 전송되지 않습니다.
      </li>
    </ul>

    <h2>2. 정보 사용 목적</h2>
    <ul>
      <li>위치 정보: 현재 위치에서 각 도서관까지의 거리 계산 (기기 내 연산)</li>
      <li>즐겨찾기: 앱 재실행 시 저장된 도서관 복원</li>
    </ul>

    <h2>3. 정보의 저장 및 보관</h2>
    <p>
      위치 정보는 <strong>서버에 저장하지 않습니다.</strong>
      앱 실행 중 기기 메모리에서만 사용하며 앱 종료 시 삭제됩니다.
    </p>
    <p>
      즐겨찾기 데이터는 사용자 기기의 로컬 저장소(AsyncStorage)에만 저장되며,
      앱을 삭제하면 함께 삭제됩니다.
    </p>

    <h2>4. 제3자 제공</h2>
    <p>
      수집한 개인정보를 <strong>어떠한 제3자에게도 제공하거나 판매하지 않습니다.</strong>
    </p>
    <p>
      앱은 공공데이터포털(data.go.kr)의 공공도서관 API를 통해 도서관 정보를 불러옵니다.
      이 과정에서 사용자 개인정보는 전달되지 않습니다.
    </p>

    <h2>5. 외부 링크</h2>
    <p>
      도서관 카드에서 외부 홈페이지나 지도 앱으로 이동할 수 있습니다.
      외부 서비스의 개인정보 처리는 해당 서비스의 방침을 따릅니다.
    </p>

    <h2>6. 아동 개인정보</h2>
    <p>
      앱은 만 14세 미만 아동으로부터 의도적으로 개인정보를 수집하지 않습니다.
    </p>

    <h2>7. 방침 변경</h2>
    <p>
      본 방침이 변경될 경우 앱 내 공지 또는 이 페이지를 통해 안내합니다.
      변경된 방침은 게시 즉시 효력이 발생합니다.
    </p>

    <h2>8. 문의</h2>
    <p>
      개인정보 처리방침에 대한 문의는 아래로 연락해 주세요.
    </p>
    <p>
      이메일: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
    </p>

    <footer>
      &copy; ${new Date().getFullYear()} ${APP_NAME} — 공공데이터 기반 도서관 탐색 앱
    </footer>
  </div>
</body>
</html>`;

  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=86400');
  response.status(200).send(html);
}
