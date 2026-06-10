import type { VercelRequest, VercelResponse } from '@vercel/node';

const CONTACT_EMAIL = 'dayainow@gmail.com';
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

    <h2>4. 광고</h2>
    <p>
      앱은 무료 서비스 유지를 위해 Google AdMob을 통해 광고를 표시할 수 있습니다.
      광고 제공 과정에서 Google이 기기 식별자, IP 주소, 광고 상호작용 정보 등을 수집·처리할 수 있습니다.
    </p>
    <ul>
      <li>광고 파트너: Google LLC (AdMob)</li>
      <li>처리 목적: 맞춤형·비맞춤형 광고 게재, 광고 성과 측정</li>
      <li>Google 개인정보 처리: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google 개인정보처리방침</a></li>
      <li>광고 설정: 기기 설정 &gt; Google &gt; 광고에서 맞춤형 광고를 제한할 수 있습니다.</li>
    </ul>

    <h2>5. 제3자 제공</h2>
    <p>
      앱 운영자는 사용자의 위치·즐겨찾기 정보를 제3자에게 판매하거나 제공하지 않습니다.
    </p>
    <p>
      앱은 공공데이터포털(data.go.kr)의 공공도서관 API를 통해 도서관 정보를 불러옵니다.
      이 과정에서 사용자 개인정보는 전달되지 않습니다.
    </p>

    <h2>6. 외부 링크</h2>
    <p>
      도서관 카드에서 외부 홈페이지나 지도 앱으로 이동할 수 있습니다.
      외부 서비스의 개인정보 처리는 해당 서비스의 방침을 따릅니다.
    </p>

    <h2>7. 아동 개인정보</h2>
    <p>
      앱은 만 14세 미만 아동으로부터 의도적으로 개인정보를 수집하지 않습니다.
    </p>

    <h2>8. 데이터 삭제 요청</h2>
    <p>
      <strong>${APP_NAME}</strong>은 회원 계정을 운영하지 않으며, 사용자 개인정보를 서버에 저장하지 않습니다.
      데이터 삭제는 아래 방법으로 요청하거나 직접 수행할 수 있습니다.
    </p>
    <ul>
      <li>
        <span class="highlight">즐겨찾기</span> —
        앱을 기기에서 삭제(제거)하면 기기에 저장된 즐겨찾기 데이터가 함께 삭제됩니다.
      </li>
      <li>
        <span class="highlight">위치 정보</span> —
        서버에 저장하지 않습니다. 앱 종료 시 메모리에서 삭제되며,
        기기 설정에서 위치 권한을 해제할 수 있습니다.
      </li>
      <li>
        <span class="highlight">광고 관련 데이터</span> —
        Google AdMob이 처리하는 데이터는
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google 개인정보처리방침</a> 및
        기기 설정의 광고 ID 재설정·맞춤형 광고 제한을 통해 관리할 수 있습니다.
      </li>
      <li>
        <span class="highlight">기타 문의·삭제 요청</span> —
        아래 이메일로 앱 이름과 요청 내용을 보내 주시면 확인 후 안내드립니다.
        이메일: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>
      </li>
    </ul>

    <h2>9. 방침 변경</h2>
    <p>
      본 방침이 변경될 경우 앱 내 공지 또는 이 페이지를 통해 안내합니다.
      변경된 방침은 게시 즉시 효력이 발생합니다.
    </p>

    <h2>10. 문의</h2>
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
