# Android Developer Verification — Step-by-step Manual for ValueBite

**날짜**: 2026-04-19
**대상**: Jay Yoon (`economistview123@gmail.com`)
**목표**: Google Play Console에서 ValueBite을 publish할 수 있도록 Developer 신원 verification 완료

---

## 0. 개요 — 두 가지 verification이 있습니다

Google이 2024년부터 강화한 Android 생태계에는 두 종류의 developer verification이 있습니다. 둘은 별개이고 둘 다 통과해야 합니다.

| 종류 | 어디서 | 언제 필요 | 시간 |
|---|---|---|---|
| **A. Play Console Account Verification** | Google Play Console → Account details | Play Store에 publish 하기 전에 반드시 | 2-7일 |
| **B. (선택) Android Developer Verification** | Google's new developer-verification portal | Play Store **이외**의 곳에 배포할 때만 (sideload, 직접 APK 배포 등) | 별도 |

ValueBite은 Play Store로 publish하므로 **A는 필수**, **B는 지금 안 해도 됩니다**.
이 문서는 A에 집중합니다 (B는 마지막에 간단히 다룸).

---

## 1. Pre-flight checklist — 시작 전 5분간 체크

verification 도중에 막히면 다시 처음부터 해야 할 수도 있어요. 시작 전에 아래를 모두 준비:

### 1.1 본인 verification에 필요한 것 (Individual / 개인 계정)

- [ ] **여권** 또는 **운전면허증** (한국 운전면허증도 OK, 영문병기 권장)
  - 만료일이 6개월 이상 남았어야 함
  - 사진면이 선명하게 나와야 함
- [ ] **셀카 사진** 찍을 수 있는 환경 (밝은 조명, 단색 배경)
- [ ] **수신 가능한 우편 주소** — Google이 우편으로 verification code를 보낼 수 있음
  - PO Box 안 됨 (실제 거주 주소)
- [ ] **본인 명의 신용카드 또는 직불카드** (account 연결 확인용)

### 1.2 Organization (법인/사업자) 계정으로 등록한 경우 추가

(Jay가 개인이라면 이 섹션 SKIP)

- [ ] **D-U-N-S Number** — Dun & Bradstreet에서 무료 발급, 1-30일 소요
  - 신청: https://www.dnb.com/duns/get-a-duns-number.html
- [ ] **사업자 등록증** PDF
- [ ] **법인 등기부 등본** 또는 동등한 서류
- [ ] **회사 명의 결제수단**

### 1.3 Console 상태 확인

- [ ] Play Console (https://play.google.com/console) 로그인 가능
- [ ] $25 등록비 결제 완료 (이미 됨 ✅ — Jay 확인됨)
- [ ] Account type 확인 (Personal vs. Organization)
  - 잘못 골랐으면 새 account 만들어야 하므로 미리 확인
  - Settings → Developer account → Account details

---

## 2. Step-by-step — Play Console Account Verification

### Step 1: Account details 페이지 진입

1. Chrome에서 https://play.google.com/console 접속
2. 우측 상단 본인 계정 확인 → `economistview123@gmail.com`
3. 왼쪽 sidebar 맨 아래 → **Settings** (톱니바퀴 아이콘)
4. **Developer account** 섹션 → **Account details** 클릭

### Step 2: Verification status 확인

**Account details** 페이지를 스크롤하면 아래 섹션이 있습니다:

```
┌────────────────────────────────────────────┐
│ Identity verification                      │
│ Status: ⚠ Action required                  │
│ [Start verification] 버튼                   │
└────────────────────────────────────────────┘
```

**상태별 의미**:
- `⚠ Action required` → 지금 시작하면 됨
- `🔵 In review` → Google이 검토 중 (최대 7일 대기)
- `✅ Verified` → 이미 완료, Skip 가능
- `❌ Rejected` → Section 6 (Common Issues) 참고

### Step 3: Personal info 입력

`Start verification` 클릭 후 form 입력:

| Field | 입력 값 | 주의사항 |
|---|---|---|
| **Legal name** | 여권/면허증과 **정확히 동일**한 이름 | 영문 표기 (예: "Yoon Jay" or "JAEHYUNG YOON" — 여권과 동일 철자) |
| **Date of birth** | 생년월일 | 21세 이상이어야 함 |
| **Country / Region** | 거주국 (예: South Korea) | 변경 불가 — 신중히 |
| **Home address** | 실제 거주지 (한글 OR 영문 OK) | PO Box 절대 안 됨 |
| **Phone number** | 본인 명의 핸드폰 | OTP 인증 들어옴 |
| **Email** | 자동 채워짐 | economistview123@gmail.com |

**Tip**: 한국 주소는 영문으로 입력하면 Google verifier 처리 빠름. 변환은 https://www.juso.go.kr → "영문주소" 검색.

### Step 4: ID 업로드

**다음 페이지에서 신분증 사진 업로드**:

1. **신분증 종류 선택** — 권장 순서:
   - 1순위: **여권 (Passport)** — 가장 빨리 통과
   - 2순위: **운전면허증 (Driving License)** — 영문 표기 있어야 함
   - 3순위: **주민등록증** — 영문 표기 없어서 시간 더 걸릴 수 있음

2. **사진 촬영 가이드**:
   - 밝은 조명, 그림자 없이
   - 모든 모서리가 사진 안에 들어와야 함
   - 글자가 흐리지 않게 (4032×3024 이상 추천)
   - PNG/JPG, 10MB 이하
   - 배경은 단색 어두운 표면 (검은 책상, 어두운 천 등)

3. **자주 실패하는 이유**:
   - 빛 반사로 글자 가려짐 → 각도 살짝 틀어서 재촬영
   - 손가락이 정보 가림 → 모서리만 잡고 들기
   - 사진이 너무 어둠 → 자연광 + 필터 OFF

### Step 5: Selfie 촬영

다음 단계에서 **셀카** 요청:

- 정면, 어깨까지 보이게
- 안경 OFF (반사 방지)
- 모자/마스크 OFF
- 배경 단색 (벽 권장)
- 표정 자연스럽게 — 너무 강한 미소도 비교 실패 가능

⚠ 신분증 사진과 selfie가 **얼굴 비교**됩니다. 너무 큰 차이 (예: 면도 vs. 수염, 안경 vs. 무안경)는 거절 사유.

### Step 6: 제출 + 대기

- [ ] **Submit** 클릭
- [ ] **이메일 (economistview123@gmail.com)** 으로 receipt 도착 — 보관
- [ ] **상태 = `🔵 In review`** 로 바뀜
- [ ] **2~7 영업일** 대기 (한국 시간 평일 기준)

대기 중 할 일 → Section 4 참고 (앱 listing 등 병행 작업 가능)

---

## 3. Verification 통과 후 자동으로 풀리는 것들

- ✅ Production track으로 internal testing 완료된 앱 release 가능
- ✅ Open testing → Production 승격 가능
- ✅ In-app payment 활성화 (지금 ValueBite은 free + AdSense라 무관)
- ✅ Sensitive permission 사용 가능 (location은 이미 사용 중이라 후속 verification 따로 있음)

---

## 4. Verification 대기 동안 병행할 작업

verification 결과 기다리는 2-7일 동안 ValueBite 출시 준비 마무리:

### 4.1 AAB (Android App Bundle) 빌드 — Bubblewrap

ValueBite은 TWA로 publish하므로 Bubblewrap CLI로 AAB를 만듭니다.

```bash
# 1. Bubblewrap 설치 (1회만)
npm i -g @bubblewrap/cli

# 2. ValueBite 프로젝트 디렉토리에서
cd /Users/jayyoon/Documents/MyClaudeProject01/ValueBite_01
mkdir -p android-twa && cd android-twa

# 3. manifest.json 기준으로 init
bubblewrap init --manifest=https://truevaluebite.com/manifest.json
# → 질문에 답하기:
#   - Application name: ValueBite
#   - Short name: ValueBite
#   - Theme color: #16a34a (녹색)
#   - Background color: #ffffff
#   - Application Id: app.valuebite.twa  ← 반드시 이 값
#   - Display mode: standalone
#   - Orientation: any
#   - Status bar color: #16a34a
#   - Splash screen color: #ffffff

# 4. AAB 빌드
bubblewrap build
# → app-release-bundle.aab 생성됨
# → SHA-256 fingerprint 화면에 표시 — 메모해두기
```

### 4.2 SHA-256 fingerprint 일치 확인

`apps/web/public/.well-known/assetlinks.json`의 fingerprint와 빌드된 AAB의 fingerprint가 **반드시 일치**해야 함.

현재 ValueBite의 assetlinks.json:
```
0C:22:65:99:14:0E:28:B5:39:37:33:36:50:E4:6D:EA:45:80:08:87:A7:E2:E0:88:AE:3B:C0:8D:3F:FE:D0:0E
```

위와 동일하면 그대로 OK. 다르면:
1. 새 빌드의 fingerprint를 `assetlinks.json`에 update
2. `git add . && git commit -m "Update TWA fingerprint" && git push`
3. Vercel 자동 배포 후 https://truevaluebite.com/.well-known/assetlinks.json 에서 확인

### 4.3 Play Console에서 앱 listing 작성 (verification과 별개로 가능)

- Store listing → Main store listing
  - App name: **ValueBite**
  - Short description (80자 이내):
    > Smart budget dining: find restaurants you can actually afford
  - Full description (4000자 이내) — APP_STORE_LISTING.md에 작성된 내용 사용
- Graphics:
  - Icon (512×512): `apps/web/public/icon-512.png`
  - Feature graphic (1024×500): `apps/web/public/feature-graphic.png`
  - Screenshots (최소 2개, 권장 8개): `play-store-assets/` 디렉토리
- Categorization: Food & Drink → Restaurant guide
- Contact info: economistview123@gmail.com
- Privacy policy: https://truevaluebite.com/privacy

### 4.4 App content (필수 questionnaire)

Play Console → Policy → App content → 모두 답변:
- [ ] Privacy policy URL
- [ ] App access (login 필요 없음 → "All functionality is available without restrictions")
- [ ] Ads (Yes — AdSense)
- [ ] Content rating questionnaire
- [ ] Target audience (13+)
- [ ] News app (No)
- [ ] COVID-19 contact tracing (No)
- [ ] Data safety (location, device info, ad data 사용)
- [ ] Government app (No)
- [ ] Financial features (No — ValueBite은 budget tracker 있지만 거래 안 함)

---

## 5. Verification 완료 후 — Production release까지

verification 결과 메일이 오면 (~2-7일):

### Step A: Internal testing track 먼저
1. Play Console → Testing → Internal testing → Create new release
2. AAB 업로드 (`app-release-bundle.aab`)
3. Release notes 입력 (영문 권장)
4. Tester 추가 (본인 이메일만)
5. Save → Review → Start rollout
6. **본인 폰에서 install URL로 다운로드 → 실제 동작 확인**

### Step B: Production track으로 승격
1. Internal testing 통과 후 → Production → Create new release
2. Same AAB
3. Pricing & distribution: 무료, 145개국 (전체)
4. Release → Submit for review
5. **Google review: 7-14일** (첫 출시는 더 오래 걸릴 수 있음)

---

## 6. Common Issues & Fixes

### "Identity verification rejected"
**원인 1**: 신분증 사진 흐림 / 잘림 / 빛 반사
**해결**: 다른 신분증으로 재시도. 여권 권장.

**원인 2**: Selfie와 신분증 얼굴 매칭 실패
**해결**: 안경/모자 벗고 정면 자연 표정으로 재촬영

**원인 3**: Legal name과 ID 표기 불일치
**해결**: ID와 정확히 동일한 철자로 재입력 (대문자 차이도 영향)

### "Account verification stuck for 7+ days"
**원인**: 한국 공휴일/주말 대량 신청 backlog
**해결**: Play Console → Help → Contact support → "Identity verification status request" 카테고리로 문의. 통상 24시간 내 응답.

### "AAB upload failed: signing certificate mismatch"
**원인**: Bubblewrap가 새 keystore 생성 → assetlinks.json fingerprint와 불일치
**해결**: Section 4.2 따라 fingerprint 업데이트 후 push

### "Play App Signing 활성화하라는 메시지"
**원인**: 신규 앱은 Play App Signing 필수
**해결**: 활성화 (Google이 production signing key 관리). Bubblewrap upload key는 별도 보관.

### "TWA가 Chrome으로 열림 (full-screen이 아님)"
**원인**: assetlinks.json에 잘못된 fingerprint OR https 인증서 문제
**해결**:
1. https://truevaluebite.com/.well-known/assetlinks.json 직접 접속해서 JSON 정상 응답 확인
2. https://developers.google.com/digital-asset-links/tools/generator 에서 검증 도구 실행
3. 폰 재시작 → TWA 캐시 갱신

### "Push notifications가 안 옴" (post-launch)
**원인**: Web Push 미구현 (현재 ValueBite는 Settings에서 toggle hide 처리 완료)
**해결**: 추후 V1.1에서 Web Push API + Vercel Cron 구현

---

## 7. (선택) Android Developer Verification — Sideload 배포용

> Play Store로만 배포할 거면 이 섹션은 SKIP.

2025년부터 Google은 Play Store **이외**의 모든 Android 배포 (sideload, 자체 APK 다운로드, 3rd-party store)에 대해서도 developer verification을 요구하기 시작했습니다.

### 7.1 적용 시기
- 2026년 9월부터 일부 국가에서 단계적 시행
- 한국은 2027년부터로 예상

### 7.2 ValueBite에 영향?
- **현재로서 영향 없음** — Play Store로만 publish 예정
- 미래에 사용자가 APK 직접 다운로드받게 하려면 그때 신청

### 7.3 신청 방법 (참고)
- Android Developer Console (Play Console과 별개): https://developer.android.com/distribute/console
- 절차는 Play Console verification과 거의 동일 (ID + selfie + address)
- 무료, 1회 verification으로 영구 유효

---

## 8. Final Pre-Launch Checklist

verification 통과 + AAB 빌드 완료 후 출시 직전 마지막 점검:

### Code & Deploy
- [x] P0+P1+P2 16개 폴리싱 완료 (commit `9b4309d`)
- [x] Vercel production deploy 완료 (https://truevaluebite.com)
- [x] DB 마이그레이션 적용 (has_photos + unique_menu_items)
- [x] Non-restaurant POI 정리 완료 (animate, hostels)
- [x] Date Night / Special Occasion 다양화 적용

### Android-specific
- [ ] AAB 빌드 + SHA-256 fingerprint 확인
- [ ] assetlinks.json fingerprint 일치
- [ ] Play Console에서 internal testing 통과
- [ ] 본인 폰으로 실제 동작 확인 (위치, 사진, 카메라)

### Identity Verification
- [ ] Play Console identity verification 신청 완료
- [ ] verification status = `✅ Verified`

### Listing
- [ ] Store listing 작성 완료 (App name, descriptions, graphics)
- [ ] Privacy policy URL 동작 확인 (https://truevaluebite.com/privacy)
- [ ] Content rating questionnaire 완료
- [ ] Data safety form 완료
- [ ] Pricing & distribution: 무료 + 전체 국가

### AdSense
- [ ] CMP 메시지 publish 완료 (이미 진행 중)
- [ ] AdSense 승인 대기 중 → 승인 후 ad slot ID 환경변수 추가

---

## 9. 시간 예상

| 단계 | 소요 시간 |
|---|---|
| Section 1: Pre-flight 준비 | 30분 |
| Section 2: Verification 신청 | 20분 |
| Section 2-6: Google review 대기 | 2-7일 |
| Section 4: 병행 작업 (AAB, listing) | 3-4시간 |
| Section 5: Internal testing → Production submit | 1시간 |
| Google production review | 7-14일 |
| **Total active time** | **~5시간** |
| **Total wall-clock time** | **2-3주** |

---

## 10. 막히면 할 것

1. **이 문서 다시 읽기** — Common Issues (Section 6) 우선 확인
2. **Play Console support** — 한글 지원, 24시간 내 응답: 
   - Play Console → 우측 상단 `?` → Help → Contact support
3. **Google Play Console Korea forum**: https://support.google.com/googleplay/android-developer/community
4. **Stack Overflow `[google-play-console]` 태그** — 영문이지만 정확한 답변 빠름

---

## 11. Verification 직후 즉시 할 것

`✅ Verified` 메일 받자마자:

```bash
cd /Users/jayyoon/Documents/MyClaudeProject01/ValueBite_01
# 1. 최신 production 한 번 더 빌드 + 배포
git pull
npm run build  # apps/web에서

# 2. AAB 빌드
cd android-twa && bubblewrap build

# 3. Play Console → Internal testing → 새 release → AAB 업로드
# 4. 본인 폰에서 install link 받아서 다운로드 → 동작 확인
# 5. 모두 OK면 Production track으로 승격
```

---

좋은 launch 되시길 바랍니다 🚀
