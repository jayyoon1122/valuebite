# Jay님이 직접 하실 것 — 단계별 가이드

클로드가 할 수 있는 모든 작업은 완료했습니다. 이제 Jay님이 직접 하셔야 하는 부분만 남았습니다.

**총 소요 시간**: 약 4–6시간 (실작업) + Google 심사 1–7일 대기

---

## ✅ 클로드가 이미 완료한 것들

코드는 모두 launch-ready 상태입니다:
- ✅ 모든 버그 수정 (3개 critical bug fix)
- ✅ PWA 셋업 완료 (manifest, icons, service worker)
- ✅ 데이터 강화 (Tokyo 712 phones, 723 hours, 22 community posts + 72 comments, 235 chains tagged)
- ✅ Privacy Policy + Terms 페이지 Play Store 호환
- ✅ Feature graphic (1024x500), 모든 아이콘 생성
- ✅ Store listing 카피 + Play Console 답변 문서 작성
- ✅ TypeScript 컴파일 통과 + Production build 성공
- ✅ GitHub에 push 완료 (commit `5f4b8de`)

---

## 🎯 Step 1: Vercel 배포 (30분)

### 1-1. Vercel CLI 업데이트 + 로그인
```bash
npm i -g vercel@latest
vercel login
```
브라우저가 열리면 Vercel 계정으로 로그인.

### 1-2. Production 배포
```bash
cd /Users/jayyoon/Documents/MyClaudeProject01/ValueBite_01/apps/web
vercel --prod
```

처음 실행하면 질문이 나옵니다:
- `Set up and deploy?` → **Y**
- `Which scope?` → 본인 계정 선택
- `Link to existing project?` → 기존 valuebite 프로젝트가 있다면 **Y**, 없으면 **N**
- `Project name?` → `valuebite` (또는 원하는 이름)
- `In which directory is your code located?` → `./` (그냥 엔터)
- `Auto-detected settings?` → **Y** (Next.js 자동 인식)

배포가 끝나면 `https://valuebite-xxx.vercel.app` URL이 나옵니다. **이 URL을 메모해두세요.**

### 1-3. 환경변수 설정
Vercel Dashboard로 이동 (https://vercel.com/dashboard) → valuebite 프로젝트 → Settings → Environment Variables.

다음 변수들을 추가 (모두 **Production**에 체크).
**값은 본인 로컬 `.env` 파일에서 복사하세요. 절대 git에 커밋하지 마세요.**

```
GOOGLE_PLACES_API_KEY = (.env에서 복사)
NEXT_PUBLIC_GOOGLE_MAPS_KEY = (.env에서 복사)
NEXT_PUBLIC_SUPABASE_URL = (.env에서 복사)
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY = (.env에서 복사)
SUPABASE_SERVICE_KEY = (.env에서 복사)
ANTHROPIC_API_KEY = (.env에서 복사)
ADMIN_SECRET = (.env에서 복사)
NEXT_PUBLIC_SITE_URL = https://valuebite.app  (또는 본인 도메인)
```

빠른 방법 — Vercel CLI로 한 번에:
```bash
cd /Users/jayyoon/Documents/MyClaudeProject01/ValueBite_01
vercel env pull apps/web/.env.production.local  # 기존 값 확인
# 또는 Vercel Dashboard에서 직접 추가
```

저장 후 다시 배포:
```bash
vercel --prod
```

### 1-4. (강력 추천) 커스텀 도메인 구매
- **Namecheap.com** 또는 **Cloudflare Registrar**로 가서 `valuebite.app` 또는 비슷한 도메인 구매 (~$12/년)
- Vercel Dashboard → Settings → Domains → Add → 도메인 입력
- Vercel이 알려주는 DNS 레코드를 도메인 등록업체 사이트에서 추가
- 5–60분 후 DNS 전파 완료

**왜 필요한가**: Google Play TWA는 도메인과 Android 앱 사이의 Digital Asset Links로 인증합니다. `*.vercel.app` 보다는 본인 도메인이 깔끔합니다.

---

## 🎯 Step 2: Production 사이트 검증 (15분)

본인 휴대폰의 **Chrome 브라우저**로 production URL 접속:

체크리스트:
- [ ] 홈 페이지가 로드되고 식당이 보이는가?
- [ ] 검색 → "ramen" 입력 → 결과가 나오는가?
- [ ] 식당 카드 탭 → 상세페이지 열리는가?
- [ ] Get Directions 버튼 → Google Maps 열리는가?
- [ ] Community 탭 → 22개 글 보이는가?
- [ ] Profile 탭 → Budget/Favorites/Stats 탭 작동하는가?
- [ ] Settings → Dark Mode 토글 작동하는가?
- [ ] Settings → 언어를 한국어로 바꿔보기

문제가 있으면 클로드에게 알려주세요. 없으면 다음 단계.

### 2-1. PWA 설치 테스트
크롬 점 3개 메뉴 → **"앱 설치"** 또는 **"홈 화면에 추가"** 옵션이 보여야 함.

탭하여 설치 → 홈 화면에 ValueBite 아이콘 → 탭 → 브라우저 주소창 없이 standalone으로 열려야 함.

### 2-2. Lighthouse PWA 점검 (선택)
크롬 데스크탑에서:
- DevTools (F12) → Lighthouse 탭
- Mobile + "Progressive Web App" 체크
- "Analyze page load" 클릭
- **PWA 점수 90+ 목표**. 90 이하면 클로드에게 알려주세요.

---

## 🎯 Step 3: PWABuilder로 AAB 생성 (30분)

이 단계가 핵심입니다. PWABuilder가 Android 앱 번들(AAB)을 자동 생성해줍니다.

### 3-1. PWABuilder 접속
https://www.pwabuilder.com 접속 → Production URL 입력 → **Start**

30초 후 점수 카드:
- **Manifest**: ✅ 녹색 체크 (확인)
- **Service Worker**: ✅ 녹색 체크 (확인)
- **Security (HTTPS)**: ✅ 녹색 체크 (확인)

빨간색/노란색이 있으면 클로드에게 알려주세요.

### 3-2. Android 패키지 생성
1. 상단 **"Package for Stores"** 클릭
2. **Android** 카드 → **"Generate Package"**
3. 폼 작성:
   - **Package ID**: `app.valuebite.twa`
   - **App name**: `ValueBite`
   - **Launcher name**: `ValueBite`
   - **App version**: `1.0.0`
   - **App version code**: `1`
   - **Host**: 본인 production 도메인 (예: `valuebite.app`)
   - **Start URL**: `/`
   - **Theme color**: `#22c55e`
   - **Background color**: `#0a0a0a`
   - **Status bar color**: `#0a0a0a`
   - **Icon URL**: `https://valuebite.app/icon-512.png` (본인 도메인으로)
   - **Maskable icon URL**: `https://valuebite.app/icon-maskable-512.png`
   - **Display mode**: `standalone`
   - **Orientation**: `portrait`
   - **Signing key**: **"Generate a new signing key"** 선택
4. **Download Package** 클릭

ZIP 파일을 받게 됩니다. 안에:
- `app-release-bundle.aab` ← Play Store에 업로드할 파일
- `app-release-signed.apk` ← 휴대폰 테스트용
- `signing.keystore` + `signing-key-info.txt` ← **⚠️ 절대 잃어버리면 안 됨**

### 3-3. ⚠️ Signing Key 백업 (가장 중요!)
`signing.keystore` 파일을 **3군데**에 저장:
1. 패스워드 매니저 (1Password, Bitwarden)
2. 외장 하드/USB
3. 암호화된 클라우드 폴더 (Google Drive, iCloud)

**이 파일을 잃어버리면 ValueBite 앱을 영원히 업데이트할 수 없습니다.** 신규 앱으로 다시 출시해야 하고, 모든 사용자가 재설치해야 합니다.

### 3-4. 휴대폰에서 APK 테스트
1. `app-release-signed.apk` 파일을 본인 Gmail에 첨부 → 휴대폰에서 받기
2. 또는 Google Drive에 올리고 휴대폰에서 다운로드
3. 휴대폰에서 APK 탭 → "알 수 없는 출처 허용" → 설치
4. ValueBite 앱 열기 → 모든 기능 확인

### 3-5. assetlinks.json 업데이트 + 재배포
PWABuilder가 다운로드한 ZIP 안에 `assetlinks.json` 파일이 있습니다. 거기에 SHA256 fingerprint가 있어요.

그 fingerprint를 복사해서 클로드에게 주세요. 클로드가 `apps/web/public/.well-known/assetlinks.json` 파일을 업데이트하고 재배포할 겁니다.

또는 직접:
1. ZIP 안의 `assetlinks.json` 열기
2. `apps/web/public/.well-known/assetlinks.json` 파일을 그 내용으로 덮어쓰기
3. ```bash
   git add apps/web/public/.well-known/assetlinks.json
   git commit -m "Add real Digital Asset Links fingerprint"
   git push
   vercel --prod
   ```

확인: `https://valuebite.app/.well-known/assetlinks.json` 접속 → JSON 보여야 함.

---

## 🎯 Step 4: Play Store 스크린샷 + Feature Graphic (1시간)

### 4-1. 스크린샷 5–8장 찍기
본인 휴대폰에 설치된 ValueBite 앱에서 직접 스크린샷:

추천 5장:
1. **홈 페이지** (식당 리스트 + 지도) — 캡션: "Find best-value restaurants near you"
2. **식당 상세페이지** (Value Analysis 카드 보이게) — 캡션: "AI-powered value scoring"
3. **Purpose 페이지** (Daily Eats / Date Night 등) — 캡션: "Browse by occasion"
4. **Community 피드** — 캡션: "Tips from local diners"
5. **Profile + Budget** — 캡션: "Track your dining budget"

스크린샷 사이즈는 휴대폰이 알아서 잡아줍니다 (보통 1080x2400 정도).

### 4-2. Feature Graphic
이미 클로드가 만들어 놓았습니다:
**파일 위치**: `/Users/jayyoon/Documents/MyClaudeProject01/ValueBite_01/apps/web/public/feature-graphic.png`

이 파일을 그대로 Play Store에 업로드하시면 됩니다. (1024x500 PNG, 96KB)

마음에 안 들면 Canva에서 새로 만들거나, 클로드에게 디자인 변경을 요청하세요.

### 4-3. App Icon
**파일 위치**: `/Users/jayyoon/Documents/MyClaudeProject01/ValueBite_01/apps/web/public/icon-512.png`

이 파일이 Play Store 아이콘입니다. 그대로 업로드.

---

## 🎯 Step 5: Play Console에서 출시 (1시간)

### 5-1. App 생성
1. https://play.google.com/console 접속
2. **Create app** 클릭
3. 입력:
   - App name: `ValueBite`
   - Default language: English (United States)
   - App or game: **App**
   - Free or paid: **Free**
   - 두 declaration 모두 체크
4. **Create app** 클릭

### 5-2. 좌측 사이드바 따라 작성
좌측에 체크리스트가 나옵니다. 위에서 아래로 작성:

**모든 답변은 이 파일에 정리되어 있습니다**:
`/Users/jayyoon/Documents/MyClaudeProject01/ValueBite_01/play-store-assets/PLAY_CONSOLE_ANSWERS.md`

이 파일을 열어서 각 폼에 그대로 복사-붙여넣기.

### 5-3. Store Listing 작성
좌측 메뉴에서 **Main store listing** 선택.

**모든 카피는 이 파일에 정리되어 있습니다**:
`/Users/jayyoon/Documents/MyClaudeProject01/ValueBite_01/play-store-assets/STORE_LISTING.md`

각 필드에 복사-붙여넣기:
- App name
- Short description (80자)
- Full description (4000자)
- Phone screenshots (Step 4에서 찍은 5장)
- Feature graphic (`feature-graphic.png`)
- App icon (`icon-512.png`)

### 5-4. AAB 업로드
좌측 **Production** → **Create new release**

1. **Release name**: `1.0.0 (1)`
2. **Upload App Bundles**: Step 3-2에서 받은 `app-release-bundle.aab` 업로드
3. **Release notes**: STORE_LISTING.md의 "What's new" 섹션 복사
4. **Save** → **Review release**

### 5-5. (강력 추천) Internal Testing 먼저
Production에 바로 올리지 말고 **Internal testing** 먼저:
1. 좌측 **Internal testing** → **Create new release**
2. 같은 AAB 업로드
3. 본인 이메일을 tester로 추가 (`economistview123@gmail.com`)
4. opt-in URL 받기 → 휴대폰에서 클릭 → Play Store에서 정상 설치
5. 모든 기능 다시 확인
6. 문제 없으면 같은 release를 Production으로 promote

### 5-6. Submit for review
**Production** → **Review release** → **Start rollout to Production**

Google 심사 시작. **신규 계정은 1–7일 소요**.

승인되면 이메일로 알림 → 앱 자동 출시.
거절되면 이메일로 이유 → 수정 후 재제출.

---

## 📋 출시일 최종 체크리스트

Production에 rollout 클릭 전에:

```
[ ] Production URL이 본인 휴대폰에서 작동
[ ] PWA 설치 가능 (Chrome 메뉴에서 "앱 설치" 보임)
[ ] Lighthouse PWA 점수 90+ (선택)
[ ] APK 휴대폰 테스트 완료 (모든 페이지/버튼 정상)
[ ] assetlinks.json 본인 도메인에서 JSON 응답
[ ] Signing keystore 3군데 백업 완료
[ ] 스크린샷 5장 준비 완료
[ ] Feature graphic 준비 완료
[ ] App icon 512x512 준비 완료
[ ] AAB 업로드 완료
[ ] Content rating 설문 완료
[ ] Data safety form 완료
[ ] Target audience 18+ 설정
[ ] Countries 선택 (소프트 런칭이면 일본/미국/영국/싱가폴부터)
```

---

## 🚀 출시 후 (Week 1)

### Day 1 (승인 직후)
- 가족/친구에게 Play Store 링크 공유 (첫 다운로드 확보)
- 개인 SNS에 출시 게시
- ProductHunt 제출 (금요일이 트래픽 좋음)
- Reddit 추천: r/japanlife, r/JapanTravel, r/budgetfood

### Week 1
- 모든 review에 답글 달기
- Play Console → "Android vitals" → 크래시 모니터링
- Vercel analytics → 트래픽 급증 확인
- Supabase dashboard → DB 한도 확인

### 클로드와 다시 작업할 것 (Step 6 = 사용자 작업 후 클로드)
- 실제 유저 피드백 기반 v1.1 버그 수정
- 새 도시 추가 (사용자 요청 기반)
- assetlinks.json에 진짜 SHA256 fingerprint 업데이트
- Play Store 거절 시 대응

---

## 💰 비용 정리

| 항목 | 비용 | 비고 |
|------|------|------|
| Google Play Developer | $25 | 일회성 ✅ 이미 결제 |
| Vercel Hobby | $0 | 무료 (Pro $20/월은 트래픽 많아지면) |
| 도메인 (.app) | ~$12/년 | 강력 추천 |
| Google Places API | $0 | $200/월 free credit 안에서 |
| Supabase | $0 | Free tier 안에서 시작 가능 |
| **총 v1 출시 비용** | **~$37** | (도메인 포함) |

---

## ❓ 궁금한 점이 있으면

각 단계에서 막히면 클로드에게:
- 에러 메시지 캡처해서 보여주기
- "Step X에서 막혔어" 라고 말하기
- 또는 그냥 "Play Store 출시 진행 중인데 [상황]" 라고 알려주세요

좋은 출시가 되시길 바랍니다! 🚀

---

**파일 위치 빠른 참조**:
- `PLAY_STORE_LAUNCH_GUIDE.md` — 영어 풀버전 (9 parts)
- `JAY_DO_THIS_NEXT.md` — 이 파일 (한국어 액션 가이드)
- `play-store-assets/STORE_LISTING.md` — 스토어 리스팅 카피
- `play-store-assets/PLAY_CONSOLE_ANSWERS.md` — Play Console 답변
- `apps/web/public/feature-graphic.png` — Feature graphic 1024x500
- `apps/web/public/icon-512.png` — App icon
- `apps/web/public/icon-maskable-512.png` — Maskable icon
