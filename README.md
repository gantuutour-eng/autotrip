# autotravel-mongolia

몽골 프라이빗 투어 **맞춤 일정·견적 자동화** 플랫폼 (AI 콕콕 플래너).
고객이 권역/기간/인원/숙소등급을 고르면 → 맞춤 일정 + 지도 + **예상 견적**을 보여주고, 견적 요청을 저장한다.

> mongolryokou.com 과는 **별개 플랫폼**이며 별도 Cloudflare 계정에 배포한다. 이 저장소에는 mongolryokou.com 코드/이력이 없다.

## 구성 (빌드 불필요 — 정적 + Cloudflare Pages Functions)

```
public/                         정적 고객 화면 (빌드 없음, Pages output 디렉터리)
  index.html                    AI 콕콕 플래너
  coc.js  coc.css               위저드 + 결과(일정 타임라인 + Leaflet 지도)
  coc_data.json coc_blocks.json 일정 데이터 (공개 가능 — 가격 없음)
  customer-config.js            /api/quotes 엔드포인트 설정
functions/api/                  Cloudflare Pages Functions (자동 인식, /functions)
  coc-pricing/quote.js          POST 견적 계산 (공개, 서버에서 판매가만 반환)
  coc-pricing/prices.js         GET 판매가표 (관리자 토큰)
  coc-pricing/seed.js           POST 가격·원가 적재 (관리자 토큰)
  quotes.js                     POST 요청 저장(공개) / GET 목록(관리자 토큰)
  migrate.js                    GET 테이블 생성 (관리자 토큰)
```

> ⚠️ `wrangler.toml` 은 두지 않는다. Cloudflare Pages는 wrangler.toml이 있으면 대시보드에서 만든 바인딩(D1 등)을 무시하므로, 이 프로젝트는 **모든 설정을 대시보드에서** 한다.

## 보안 원칙
- **원가구조(마진·환율·권역 1박비용)는 D1(`coc_cost_config`)에만** 저장되고 서버에서만 계산에 쓰인다. 브라우저/응답으로 절대 내보내지 않는다.
- 가격·원가 데이터(`coc_prices.json`, `coc_costs.json`)는 **git에 커밋하지 않는다.** 배포 후 `/api/coc-pricing/seed` 로 주입한다(.gitignore 처리됨).
- 관리자 엔드포인트는 `ADMIN_TOKEN`(Pages Secret)로 보호한다.

## 배포 (새 Cloudflare 계정 — 전부 대시보드에서)
1. **Pages 프로젝트 생성**: Workers & Pages → Create → Pages → Connect to Git → 이 저장소 선택.
   - Framework preset: **None** / Build command: **(비움)** / Build output directory: **`public`**
2. **D1 생성**: Workers & Pages → D1 → Create database (예: `autotravel-db`).
3. **D1 바인딩**: Pages 프로젝트 → Settings → Functions(또는 Bindings) → D1 binding 추가: 변수명 **`DB`** → 위 데이터베이스.
4. **Secret 추가**: Settings → Variables and Secrets → **`ADMIN_TOKEN`** = 충분히 긴 임의 문자열.
5. 3~4 적용 후 **재배포**(Deployments → 최신 배포 Retry).
6. **테이블 생성**:
   ```bash
   curl -H "Authorization: Bearer $ADMIN_TOKEN" https://<배포주소>/api/migrate
   ```
7. **가격·원가 주입**(시드): 로컬의 `coc_prices.json`·`coc_costs.json` 을 한 번 주입
   ```bash
   curl -X POST https://<배포주소>/api/coc-pricing/seed \
     -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" \
     -d "{\"prices\": $(cat coc_prices.json), \"costs\": $(cat coc_costs.json)}"
   ```
   → `{"success":true,"priceRows":...}` 확인. 재실행해도 멱등(덮어쓰기).

## 견적 동작
- 고객 결과 화면이 `POST /api/coc-pricing/quote` 호출 → 서버가 ① 실제 가격표(±40% 신뢰 게이트로 오염셀 차단) ② 원가엔진 맞춤 산출 순으로 1인 판매가만 반환.
- API 불가/D1 미설정 시 가짜 숫자 없이 "담당자 확정" 안내로 폴백하고, 일정·지도·제출은 정상 동작.

## 요청 확인
- 제출된 견적 요청은 `quotes` 테이블에 저장된다. 목록은 `GET /api/quotes` (관리자 토큰).
  메일 알림이 필요하면 추후 추가(이메일 서비스 연동).
