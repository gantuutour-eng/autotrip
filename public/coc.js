/* AI 콕콕 플래너 — 인트로 → 6단계 질문 → 결과(일정+지도) → 접수 완료.
   제출 시 요청을 Web App에 저장(설정된 경우). 데이터/디자인은 제공받은 시안 기준. */
const ACCENT = '#27c28c';
const A = ACCENT;

const DEST = [
  { key: 'ub', group: '울란바타르 / 근교', desc: '도착 · 시내 · 테를지', items: [
    { id: 'ulaanbaatar', label: '울란바타르' }, { id: 'terelj', label: '테를지' }, { id: 'hustai', label: '호스타이' }] },
  { key: 'central', group: '중앙 몽골', desc: '역사 · 온천 · 폭포', items: [
    { id: 'minisand', label: '미니사막' }, { id: 'kharkhorin', label: '하르허링' }, { id: 'tsenkher', label: '쳉헤르 온천' }, { id: 'orkhon', label: '어르헝 폭포' }, { id: 'ugii', label: '어기호수' }] },
  { key: 'gobi', group: '고비', desc: '사막 · 협곡 · 붉은 절벽', items: [
    { id: 'baga', label: '바그가즈린촐로' }, { id: 'tsagaan', label: '차강소브락' }, { id: 'yol', label: '욜린암' }, { id: 'khongor', label: '홍고린엘스' }, { id: 'bayanzag', label: '바양작' }] },
  { key: 'north', group: '북부 / 호수', desc: '홉스골 · 초원 · 호수', items: [
    { id: 'khovsgol', label: '홉스골' }, { id: 'murun', label: '무릉' }, { id: 'terkhiin', label: '테르힝 차강노르' }, { id: 'erdenet', label: '에르덴트' }, { id: 'bulgan', label: '불강' }] },
];
const ACTS = [
  { id: 'city', label: '시내투어', emoji: '🏙️' }, { id: 'horse', label: '승마', emoji: '🐎' },
  { id: 'camel', label: '낙타', emoji: '🐪' }, { id: 'sand', label: '샌드보드', emoji: '🏄' },
  { id: 'galaxy', label: '은하수', emoji: '🌌' }, { id: 'khorhog', label: '허르헉', emoji: '🍖' },
];
const STAYS = [
  { id: 'hotel3', label: '3성급 호텔', desc: '편안한 도심 숙박', emoji: '🏨' },
  { id: 'hotel4', label: '4성급 호텔', desc: '한 단계 높은 편의', emoji: '🛎️' },
  { id: 'ger', label: '일반 게르', desc: '몽골 전통 유목 숙소', emoji: '⛺' },
  { id: 'gerlux', label: '고급 게르', desc: '프라이빗 · 편의시설', emoji: '🏕️' },
];
const VEHS = [
  { id: 'any', label: '상관없음', desc: '인원·일정 맞춤 추천', emoji: '✨' },
  { id: 'sedan', label: '승용차', desc: '1–3명 시내/근교', emoji: '🚗' },
  { id: 'suv', label: 'SUV', desc: '장거리·비포장 이동', emoji: '🚙' },
  { id: 'van', label: '밴', desc: '4–7명 짐 많은 일정', emoji: '🚐' },
  { id: 'minibus', label: '미니버스', desc: '단체·여유 좌석', emoji: '🚌' },
];
const CAT = {
  '명소': { col: '#27c28c', soft: '#d4f3e8', emoji: '🏛️' },
  '자연': { col: '#18A957', soft: '#E4F6EC', emoji: '⛰️' },
  '액티비티': { col: '#F4870B', soft: '#FFF1DD', emoji: '🐎' },
  '식사': { col: '#FF5A5A', soft: '#FFECEC', emoji: '🍖' },
  '숙소': { col: '#6B4EFF', soft: '#EDEAFF', emoji: '⛺' },
};
const DAYCOL = ['#27c28c', '#1FB877', '#F4870B', '#FF5A5A', '#6B4EFF', '#14B8A6', '#E8467C', '#0EA5E9'];
const ITINERARY = [
  { sub: '울란바타르 도착 & 시내', geo: [47.918, 106.917], items: [
    { cat: '명소', name: '칭기스칸 광장', addr: '울란바타르 수흐바타르구', desc: '정부청사와 칭기스칸 동상이 자리한 울란바타르의 중심 광장.' },
    { cat: '명소', name: '간단 사원', addr: '울란바타르 칭겔테구', desc: '몽골 최대 불교 사원에서 마니차를 돌리며 평안을 빕니다.' },
    { cat: '식사', name: '모던 노마즈 (현지식)', addr: '울란바타르 시내', desc: '현지 셰프가 차려내는 정갈한 몽골 가정식으로 첫 끼를.' },
    { cat: '명소', name: '자이승 전망대', addr: '울란바타르 남부 언덕', desc: '언덕 위에서 울란바타르 시내를 한눈에 담는 일몰 포인트.' },
    { cat: '숙소', name: 'UB 그랜드 호텔', addr: '울란바타르 시내', desc: '시내 중심 준5성급 호텔에서 편안하게 첫 밤을 보냅니다.' }] },
  { sub: '테를지 국립공원', geo: [47.98, 107.46], items: [
    { cat: '자연', name: '테를지 국립공원', addr: '투브 아이막 테를지', desc: '기암괴석과 초원이 어우러진 몽골 대표 국립공원.' },
    { cat: '명소', name: '거북바위', addr: '테를지 공원 내', desc: '거북이를 닮은 거대한 화강암 바위 앞에서 기념 촬영.' },
    { cat: '액티비티', name: '초원 승마 체험', addr: '테를지 일대', desc: '끝없는 초원을 말과 함께 달리는 1시간 승마 체험.' },
    { cat: '명소', name: '아리야발 사원', addr: '테를지 공원 내', desc: '108계단을 올라 만나는 절벽 위 명상 사원.' },
    { cat: '숙소', name: '테를지 게르캠프', addr: '투브 아이막 테를지', desc: '몽골 전통 게르에서 별이 쏟아지는 밤을 보냅니다.' }] },
  { sub: '하르허링 (카라코룸)', geo: [47.20, 102.82], items: [
    { cat: '명소', name: '에르덴조 사원', addr: '우부르항가이 하르허링', desc: '제국의 수도 카라코룸에 세워진 몽골 최초의 대사원.' },
    { cat: '명소', name: '카라코룸 박물관', addr: '하르허링 중심', desc: '13세기 대초원 제국의 유물로 보는 역사 여행.' },
    { cat: '식사', name: '허르헉 전통 만찬', addr: '하르허링 게르캠프', desc: '달군 돌로 익히는 양고기 허르헉을 캠프에서.' },
    { cat: '자연', name: '어기 호수', addr: '아르항가이 어기노르', desc: '철새가 머무는 잔잔한 호숫가에서의 여유 (이동 중).' },
    { cat: '숙소', name: '하르허링 게르캠프', addr: '우부르항가이 하르허링', desc: '초원 한가운데 게르에서의 하룻밤.' }] },
  { sub: '쳉헤르 온천 & 어르헝', geo: [47.16, 101.78], items: [
    { cat: '자연', name: '어르헝 폭포', addr: '우부르항가이 어르헝', desc: '현무암 협곡으로 쏟아지는 몽골 최대급 폭포.' },
    { cat: '액티비티', name: '쳉헤르 노천 온천', addr: '아르항가이 쳉헤르', desc: '대자연 속 노천 온천에서 여독을 풉니다.' },
    { cat: '자연', name: '화산 용암 지대', addr: '어르헝 계곡 일대', desc: '오래전 분출한 용암이 만든 독특한 지형 산책.' },
    { cat: '식사', name: '유목민 가정식', addr: '쳉헤르 일대', desc: '유목민 가정에 초대받아 즐기는 소박한 현지식.' },
    { cat: '숙소', name: '쳉헤르 온천 게르', addr: '아르항가이 쳉헤르', desc: '온천 캠프 게르에서 따뜻한 밤을.' }] },
  { sub: '고비 — 홍고린엘스', geo: [43.78, 102.25], items: [
    { cat: '자연', name: '홍고린엘스 모래언덕', addr: '우믄고비 사막', desc: '높이 300m, 길이 100km의 노래하는 모래언덕.' },
    { cat: '액티비티', name: '낙타 트레킹', addr: '홍고린엘스 일대', desc: '쌍봉낙타를 타고 사막 능선을 넘는 트레킹.' },
    { cat: '액티비티', name: '샌드보드 체험', addr: '홍고린엘스 모래언덕', desc: '거대한 모래 능선을 보드로 미끄러져 내려와요.' },
    { cat: '자연', name: '사막 은하수 관측', addr: '고비 캠프 인근', desc: '빛 공해 없는 사막에서 쏟아지는 은하수.' },
    { cat: '숙소', name: '고비 사막 게르캠프', addr: '우믄고비', desc: '사막 한가운데 게르에서의 특별한 밤.' }] },
  { sub: '욜린암 & 바양작', geo: [43.70, 103.90], items: [
    { cat: '자연', name: '욜린암 협곡', addr: '우믄고비 욜린암', desc: '한여름에도 얼음이 남는 독수리 협곡 트레킹.' },
    { cat: '명소', name: '바양작 불타는 절벽', addr: '우믄고비 바양작', desc: '석양에 붉게 타오르는 사암 절벽.' },
    { cat: '명소', name: '공룡 화석지', addr: '바양작 일대', desc: '세계 최초 공룡알 화석이 발견된 고생물 명소.' },
    { cat: '식사', name: '고비 현지 식당', addr: '달란자드가드', desc: '달란자드가드 시내에서 즐기는 현지 식사.' },
    { cat: '숙소', name: '고비 게르캠프', addr: '우믄고비', desc: '사막의 별빛 아래 또 하룻밤.' }] },
  { sub: '홉스골 호수', geo: [50.43, 100.16], items: [
    { cat: '자연', name: '홉스골 호수', addr: '홉스골 아이막', desc: '"몽골의 푸른 진주"로 불리는 거대 담수호.' },
    { cat: '액티비티', name: '호수 보트 투어', addr: '홉스골 하트갈', desc: '맑은 호수 위를 가르는 보트 투어.' },
    { cat: '명소', name: '차탕족 순록 마을', addr: '홉스골 북부', desc: '순록과 함께 살아가는 차탕족 마을 방문.' },
    { cat: '숙소', name: '홉스골 호숫가 게르', addr: '홉스골 하트갈', desc: '호숫가 게르에서의 청정한 하룻밤.' }] },
  { sub: '울란바타르 복귀 & 출국', geo: [47.918, 106.917], items: [
    { cat: '명소', name: '국영백화점 쇼핑', addr: '울란바타르 시내', desc: '캐시미어·기념품을 한곳에서 쇼핑.' },
    { cat: '명소', name: '자나바자르 미술관', addr: '울란바타르 시내', desc: '몽골 불교 미술의 정수를 모은 미술관.' },
    { cat: '식사', name: '송별 만찬', addr: '울란바타르 시내', desc: '여행을 마무리하는 특별한 송별 만찬.' }] },
];
const EXPERIENCES = [
  { cat: '고비 사막', title: '사막 위 은하수 캠프', sub: '쏟아지는 별빛 아래 하룻밤', g: 'linear-gradient(135deg,#2b2150,#4a3a7a)' },
  { cat: '유목 문화', title: '유목민 게르 스테이', sub: '초원의 전통 가옥에서의 하루', g: 'linear-gradient(135deg,#7a5a3a,#b08a5a)' },
  { cat: '대초원', title: '초원 승마 트레킹', sub: '끝없는 평원을 말과 함께', g: 'linear-gradient(135deg,#3a6a4a,#6aa07a)' },
  { cat: '고비 사막', title: '낙타 사파리', sub: '홍고린엘스 모래언덕 횡단', g: 'linear-gradient(135deg,#a8763e,#d8b074)' },
  { cat: '전통 미식', title: '허르헉 화덕 요리', sub: '달군 돌로 익히는 양고기', g: 'linear-gradient(135deg,#7a3a2a,#b0603a)' },
  { cat: '힐링', title: '쳉헤르 노천 온천', sub: '대자연 속 온천욕', g: 'linear-gradient(135deg,#2a6a7a,#5aa0b0)' },
  { cat: '축제', title: '나담 축제', sub: '씨름·경마·활쏘기의 향연', g: 'linear-gradient(135deg,#7a2a4a,#b05a7a)' },
];
const STEP_DEF = [
  { kicker: '몽골, 어디부터 둘러볼까요?', t1: '가보고 싶은 지역을', t2: '모두 선택해 주세요.' },
  { kicker: '여유로운 일정을 추천해 드려요', t1: '여행 기간을', t2: '선택해 주세요.' },
  { kicker: '취향에 맞는 일정을 짜드려요', t1: '어떤 활동을 원하세요?', t2: '관심 활동을 골라 주세요.' },
  { kicker: '편안한 밤을 위해', t1: '숙소 스타일을', t2: '선택해 주세요.' },
  { kicker: '드넓은 초원을 달릴', t1: '이동 차량을', t2: '선택해 주세요.' },
  { kicker: '맞춤 견적을 보내드릴게요', t1: '여행자 정보를', t2: '입력해 주세요.' },
];

// ---- 실제 엔진 연결: 권역 매핑 + 상품 매칭 + 지오코딩 ----
const REGION_OF_KEY = { ub: '중앙몽골', central: '중앙몽골', gobi: '남고비', north: '훕스골' };
const REGION_MIN_NIGHTS = { '중앙몽골': 0, '남고비': 4, '훕스골': 5, '트레킹': 2, '골프': 0, '승마': 2, '패밀리': 2, '기타': 0 };
const ID_REGION = {};
DEST.forEach((g) => g.items.forEach((it) => { ID_REGION[it.id] = REGION_OF_KEY[g.key] || '중앙몽골'; }));
const GEO = {
  '울란바타르': [47.918, 106.917], '공항': [47.843, 106.766], '시내': [47.918, 106.917],
  '테를지': [47.98, 107.46], '천진': [47.78, 107.36], '호스타이': [47.70, 105.85],
  '미니사막': [47.24, 103.62], '엘승': [47.24, 103.62], '엘슨': [47.24, 103.62], '엘센': [47.24, 103.62],
  '하르허': [47.20, 102.82], '카라코룸': [47.20, 102.82], '어기': [47.76, 102.75],
  '쳉헤르': [47.32, 101.65], '챙헤르': [47.32, 101.65], '첸헤르': [47.32, 101.65],
  '어르헝': [46.79, 101.96], '오르혼': [46.79, 101.96],
  '홍고린': [43.78, 102.25], '헝고린': [43.78, 102.25], '욜린암': [43.49, 104.07], '욜링암': [43.49, 104.07],
  '바양작': [44.13, 103.73], '차강소브락': [44.60, 105.50], '차간소브락': [44.60, 105.50],
  '바그가즈린': [46.20, 106.00], '바가가즈린': [46.20, 106.00], '이흐가즈린': [45.90, 106.60],
  '훕스골': [50.43, 100.16], '홉스골': [50.43, 100.16], '하트갈': [50.43, 100.16], '무릉': [49.63, 100.16],
  '테르힝': [48.17, 99.72], '차강노르': [48.17, 99.72], '에르덴트': [49.03, 104.08], '볼강': [48.81, 103.53], '볼간': [48.81, 103.53],
};
function geoFor(text) { for (const k in GEO) { if (text.indexOf(k) >= 0) return GEO[k]; } return null; }
function inferCat(it) {
  const t = (it.place || '') + ' ' + (it.detail || '');
  if (/이동|출발|도착|픽업|샌딩|공항/.test(t) && !/관광|투어|체험|식사/.test(t)) return '이동';
  if (/조식|중식|점심|석식|저녁|식사|현지식|만찬|특식|샤브|허르헉|한식|뷔페/.test(t)) return '식사';
  if (/체크인|게르|호텔|캠프|캠핑|숙박|스테이|롯지/.test(t)) return '숙소';
  if (/승마|낙타|샌드|온천|트레킹|보트|사파리|체험|골프|라이딩|짚라인|관측|헌팅|낚시/.test(t)) return '액티비티';
  if (/폭포|호수|사막|협곡|모래|은하수|국립공원|초원|화석|화산|계곡|언덕|절벽|전망/.test(t)) return '자연';
  return '명소';
}
const uniq = (a) => [...new Set(a)];
let COC = null;
fetch('./coc_data.json').then((r) => r.json()).then((d) => { COC = d; if (state.started && state.step > 5) render(); }).catch((e) => console.warn('coc_data.json 로딩 실패', e));
let BLOCKS = null;
fetch('./coc_blocks.json').then((r) => r.json()).then((d) => { BLOCKS = d; if (state.started && state.step > 5) render(); }).catch((e) => console.warn('coc_blocks.json 로딩 실패', e));
// 가격: 서버 견적 API. 원가·마진은 서버에만 있고 브라우저로 내려오지 않는다.
// 결과 화면에서 선택조건을 POST /api/coc-pricing/quote 로 보내 1인 판매가만 받는다.
const QUOTE_API = '/api/coc-pricing/quote';
let QUOTE = { sig: '', data: null, loading: '' };  // 마지막 견적 시그니처/결과 캐시 (stale 가드)
function requestServerQuote(sig, params) {
  if (QUOTE.loading === sig) return;
  QUOTE.loading = sig;
  // 서버 무가격/실패 시: 가짜 숫자를 만들지 않고 "담당자 확정" 안내로 폴백 (일정·지도·제출은 유지)
  const softFail = { people: params.people, tier: params.tier, hasCost: false, source: 'none' };
  fetch(QUOTE_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(params) })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      const data = (d && d.perPerson > 0)
        ? { people: params.people, perPerson: d.perPerson, partyTotal: d.partyTotal || d.perPerson * params.people, hasCost: true, source: d.source || 'product', tier: d.tier || params.tier, approxHead: !!d.approxHead, matchedHead: d.matchedHead }
        : softFail;
      QUOTE = { sig, data, loading: '' };
      if (state.started && state.step > 5) render();
    })
    .catch(() => { QUOTE = { sig, data: softFail, loading: '' }; if (state.started && state.step > 5) render(); });
}
const TYPE_EMOJI = { '도착': '✈️', '출국': '✈️', '이동': '🚐', '명소': '🏛️', '자연': '⛰️', '식사': '🍽️', '숙소': '🏨', '액티비티': '🐎', '공연': '🎭' };
const BLOCK_GEO = {
  ub_arrival: GEO['울란바타르'], ub_departure: GEO['울란바타르'],
  minisand: [47.31, 103.57], kharkhorin: [47.20, 102.82], hustai: [47.70, 105.85],
  kharkhorin_hustai: [47.45, 104.30], terelj: [47.98, 107.46], tsenkher: [47.32, 101.53],
  khongor: [43.80, 102.00], yol: [43.48, 104.08], tsagaan: [44.56, 105.74],
  khovsgol: [50.44, 100.15], murun: [49.63, 100.16], terkhiin: [48.16, 99.72],
};
// 상품의 한 일자 -> 큐레이션 블록 키 매핑
function blockKeyForDay(day, di, nDays) {
  if (di === 0) return 'ub_arrival';
  const txt = day.items.map((x) => (x.place || '') + (x.detail || '')).join(' ');
  const KEYS = [
    ['minisand', /미니사막|엘승|엘슨|엘센/], ['kharkhorin', /하르허|카라코룸/],
    ['tsenkher', /쳉헤르|챙헤르|첸헤르|어르헝|오르혼|온천/], ['hustai', /호스타이/],
    ['khongor', /홍고린|헝고린/], ['yol', /욜린암|욜링암|바양작/], ['tsagaan', /차강소브락|차간소브락/],
    ['khovsgol', /홉스골|훕스골|하트갈/], ['terkhiin', /테르힝|차강노르|호르고/], ['murun', /무릉/], ['terelj', /테를지/],
  ];
  for (const [k, re] of KEYS) { if (re.test(txt)) return k; }
  if (di === nDays - 1) return 'ub_departure';
  return null;
}
function blockItems(key) {
  if (!BLOCKS || !key || !BLOCKS[key]) return null;
  const blk = BLOCKS[key];
  const variant = key === 'ub_departure' ? state.departure : state.arrival;
  const list = blk.variants ? (blk.variants[variant] || blk.variants['오전']) : blk.items;
  return {
    title: blk.title,
    subtitle: blk.subtitle || '',
    route: blk.route || '',
    region: blk.region || '',
    items: list || [],
  };
}

// 권역 + 기간으로 사장님 실제 상품 1개 선택
function matchProduct() {
  const reqNights = (state.rangeStart && state.rangeEnd) ? diffDays(state.rangeStart, state.rangeEnd) : 5;
  const counts = {};
  state.dest.forEach((id) => { const r = ID_REGION[id]; if (r) counts[r] = (counts[r] || 0) + 1; });
  const regionsHit = Object.keys(counts);
  let region = regionsHit.sort((a, b) => counts[b] - counts[a])[0] || '중앙몽골';
  let warning = '';
  if ((REGION_MIN_NIGHTS[region] || 0) > reqNights) {
    warning = `${region}은(는) 거리상 최소 ${REGION_MIN_NIGHTS[region]}박이 필요해, ${reqNights}박은 중앙몽골 일정으로 추천했어요.`;
    region = '중앙몽골';
  } else if (regionsHit.length > 1) {
    warning = `여러 권역을 고르셨어요. 거리상 ${region} 위주로 추천했어요.`;
  }
  const placeLabels = [];
  DEST.forEach((g) => g.items.forEach((it) => { if (state.dest.includes(it.id)) placeLabels.push(it.label); }));
  if (!COC) return { product: null, region, warning, reqNights };
  let cands = COC.filter((p) => p.region === region);
  if (!cands.length) cands = COC.slice();
  let best = null, bestScore = -1;
  cands.forEach((p) => {
    const durDiff = Math.abs((p.nights || 0) - reqNights);
    let score = durDiff === 0 ? 100 : Math.max(0, 70 - durDiff * 25);
    const cov = placeLabels.filter((l) => (p.route || '').indexOf(l) >= 0 || (p.tour_name || '').indexOf(l) >= 0 || p.days.some((d) => d.items.some((it) => (it.place + it.detail).indexOf(l) >= 0))).length;
    score += cov * 20;
    if (score > bestScore) { bestScore = score; best = p; }
  });
  return { product: best, region, warning, reqNights };
}

const now = new Date();
const state = {
  step: 0, started: false, active: 0,
  dest: [], acts: [], stays: [], vehicle: 'any',
  rangeStart: '', rangeEnd: '', calY: now.getFullYear(), calM: now.getMonth(),
  name: '', email: '', startDate: '', note: '', people: 2, arrival: '오전', departure: '오후',
  star: 0, focus: '', triedSubmit: false, sent: false,
};
const app = document.getElementById('app');

// ---- helpers ----
const esc = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pad = (n) => (n < 10 ? '0' + n : '' + n);
const iso = (y, m, d) => y + '-' + pad(m + 1) + '-' + pad(d);
const todayISO = () => iso(now.getFullYear(), now.getMonth(), now.getDate());
const diffDays = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
const fmtK = (di) => { const p = di.split('-'); return +p[1] + '월 ' + +p[2] + '일'; };
const emailOk = () => /.+@.+\..+/.test(state.email);

function canNext() {
  if (state.step === 0) return state.dest.length > 0;
  if (state.step === 1) return !!state.rangeStart && !!state.rangeEnd;
  if (state.step === 5) return !!state.name.trim() && emailOk();
  return true;
}

// ---- actions ----
const actions = {
  start: () => { state.started = true; render(); },
  setActive: (e) => { state.active = +e.dataset.idx; render(); },
  toggleDest: (e) => { const id = e.dataset.id; state.dest = state.dest.includes(id) ? state.dest.filter((x) => x !== id) : [...state.dest, id]; render(); },
  toggleAct: (e) => { const id = e.dataset.id; state.acts = state.acts.includes(id) ? state.acts.filter((x) => x !== id) : [...state.acts, id]; render(); },
  toggleStay: (e) => { const id = e.dataset.id; state.stays = state.stays.includes(id) ? state.stays.filter((x) => x !== id) : [...state.stays, id]; render(); },
  selectVehicle: (e) => { state.vehicle = e.dataset.id; render(); },
  setArrival: (e) => { state.arrival = e.dataset.arr; render(); },
  setDeparture: (e) => { state.departure = e.dataset.dep; render(); },
  prevMonth: () => { let m = state.calM - 1, y = state.calY; if (m < 0) { m = 11; y--; } state.calM = m; state.calY = y; render(); },
  nextMonth: () => { let m = state.calM + 1, y = state.calY; if (m > 11) { m = 0; y++; } state.calM = m; state.calY = y; render(); },
  pickDay: (e) => {
    const d = e.dataset.date;
    if (!d || d < todayISO()) return;
    if (!state.rangeStart || (state.rangeStart && state.rangeEnd)) { state.rangeStart = d; state.rangeEnd = ''; }
    else if (d < state.rangeStart) { state.rangeStart = d; state.rangeEnd = ''; }
    else if (d === state.rangeStart) { /* noop */ }
    else { state.rangeEnd = d; }
    render();
  },
  bump: (e) => { const f = e.dataset.field; state[f] = Math.max(1, (+state[f] || 0) + (+e.dataset.delta)); render(); },
  setStar: (e) => { state.star = +e.dataset.n; render(); },
  focusItem: (e) => { state.focus = e.dataset.id; render(); },
  next: () => { if (!canNext()) { if (state.step === 5) { state.triedSubmit = true; render(); } return; } state.step += 1; render(); },
  prev: () => { state.step = Math.max(0, state.step - 1); render(); },
  restart: () => { Object.assign(state, { step: 0, dest: [], acts: [], stays: [], vehicle: 'any', rangeStart: '', rangeEnd: '', calY: now.getFullYear(), calM: now.getMonth(), name: '', email: '', startDate: '', note: '', people: 2, arrival: '오전', departure: '오후', star: 0, focus: '', triedSubmit: false, sent: false }); render(); },
  sendQuote: () => { submitQuote(); },
};

// 이벤트 위임 (한 번만 바인딩)
app.addEventListener('click', (ev) => {
  const t = ev.target.closest('[data-action]');
  if (t && actions[t.dataset.action]) actions[t.dataset.action](t);
});
app.addEventListener('input', (ev) => {
  const t = ev.target.closest('[data-field]');
  if (t && t.dataset.field && ('value' in t)) state[t.dataset.field] = t.value; // 재렌더 안 함(포커스 유지)
});

// ---- derive result data (사장님 실제 상품 기반) ----
const WD = ['일', '월', '화', '수', '목', '금', '토'];
const DEST_BLOCK = {
  minisand: 'minisand', kharkhorin: 'kharkhorin', hustai: 'hustai', terelj: 'terelj',
  tsenkher: 'tsenkher', orkhon: 'tsenkher', khongor: 'khongor', yol: 'yol', bayanzag: 'yol',
  tsagaan: 'tsagaan', khovsgol: 'khovsgol', murun: 'murun', terkhiin: 'terkhiin',
};

function plannedBlockKeys(nDays, productDays) {
  const middleSlots = Math.max(0, nDays - 2);
  const hasKharkhorin = state.dest.includes('kharkhorin');
  const hasHustai = state.dest.includes('hustai');
  const other = state.dest
    .filter((id) => !['ulaanbaatar', 'kharkhorin', 'hustai'].includes(id))
    .map((id) => DEST_BLOCK[id])
    .filter(Boolean);
  const middle = [];
  if (hasKharkhorin && hasHustai) {
    if (middleSlots >= other.length + 2) middle.push('kharkhorin', 'hustai');
    else middle.push('kharkhorin_hustai');
  } else {
    if (hasKharkhorin) middle.push('kharkhorin');
    if (hasHustai) middle.push('hustai');
  }
  middle.push(...other);

  productDays.forEach((day, index) => {
    const key = blockKeyForDay(day, index, productDays.length);
    if (key && !['ub_arrival', 'ub_departure'].includes(key) && !middle.includes(key)) middle.push(key);
  });
  while (middle.length < middleSlots) middle.push(null);
  return ['ub_arrival', ...middle.slice(0, middleSlots), 'ub_departure'];
}

// 견적 금액 표기 (단위는 사장님 단가 입력 통화 기준 — 기본 원)
const won = (n) => (Math.round(Number(n) || 0)).toLocaleString() + '원';

// 숙소 선택 -> 가격 등급. 실속=3성급+일반게르, 풀패키지=4성급+고급게르 (등급 차이는 숙소뿐)
function selectedTier() {
  return (state.stays.includes('hotel4') || state.stays.includes('gerlux')) ? '풀패키지' : '실속';
}

function resultData() {
  const m = matchProduct();
  const veh = VEHS.find((v) => v.id === state.vehicle) || VEHS[0];
  const selStayLabels = STAYS.filter((st) => state.stays.includes(st.id)).map((st) => st.label);
  const stayText = selStayLabels.length ? (selStayLabels.length > 1 ? selStayLabels[0] + ' 외 ' + (selStayLabels.length - 1) : selStayLabels[0]) : '게르 추천';
  const themeTags = (state.acts.length ? state.acts : ['horse', 'galaxy', 'khorhog']).map((id) => ACTS.find((x) => x.id === id) || ACTS[0]);
  const selDestLabels = [];
  DEST.forEach((g) => g.items.forEach((it) => { if (state.dest.includes(it.id)) selDestLabels.push(it.label); }));
  const regionText = selDestLabels.length ? (selDestLabels.length > 2 ? selDestLabels.slice(0, 2).join(' · ') + ' 외 ' + (selDestLabels.length - 2) + '곳' : selDestLabels.join(' · ')) : '몽골 중부 일대';
  const base = { warning: m.warning, regionText, themeTags, stayText, vehLabel: veh.label, vehEmoji: veh.emoji };

  const p = m.product;
  if (!p) return Object.assign({ loading: !COC, tourName: '', durShort: '', distance: 0, totalCount: 0, days: [], mapDays: [] }, base);

  const nights = p.nights || m.reqNights;
  const durShort = nights + '박' + (nights + 1) + '일';
  const tripDist = Math.round(250 + nights * 330);
  const dayDate = (i) => {
    if (!state.rangeStart) return '';
    const d = new Date(state.rangeStart); d.setDate(d.getDate() + i);
    return (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + WD[d.getDay()] + '요일';
  };
  const days = [], mapDays = [], usedKeys = [];
  let total = 0, prevGeo = GEO['울란바타르'];
  const requestedDays = state.rangeStart && state.rangeEnd ? diffDays(state.rangeStart, state.rangeEnd) + 1 : p.days.length;
  const nD = Math.max(2, requestedDays || p.days.length);
  const plannedKeys = plannedBlockKeys(nD, p.days);
  for (let di = 0; di < nD; di += 1) {
    const day = p.days[Math.min(di, p.days.length - 1)] || { day: di + 1, items: [] };
    const blockKey = plannedKeys[di] || (di === nD - 1 ? 'ub_departure' : blockKeyForDay(day, di, nD));
    usedKeys.push(blockKey);
    const col = DAYCOL[di % DAYCOL.length];
    let dayGeo = BLOCK_GEO[blockKey] || null;
    day.items.forEach((it) => { const g = geoFor((it.place || '') + ' ' + (it.detail || '')); if (g && !dayGeo) dayGeo = g; });
    if (!dayGeo) dayGeo = prevGeo; else prevGeo = dayGeo;
    // 콘텐츠: 큐레이션 블록 우선, 없으면 시트 추출 일정으로 폴백
    const blk = blockItems(blockKey);
    let items, sub;
    if (blk) {
      items = blk.items.map((it) => ({
        cat: it.type, name: it.name, desc: it.desc || '', photos: it.photos || 0,
        transit: it.type === '도착' || it.type === '출국' || it.type === '이동', emoji: TYPE_EMOJI[it.type] || '📍',
        tag: (it.type === '명소' || it.type === '자연' || it.type === '액티비티') ? '자세히' : '',
      }));
      sub = blk.title;
    } else {
      items = day.items.map((it) => {
        const cat = inferCat(it);
        return {
          cat, name: (it.detail || it.place || '일정'), desc: [it.time, it.place].filter(Boolean).join(' · '),
          photos: cat === '이동' ? 0 : 1, transit: cat === '이동', emoji: TYPE_EMOJI[cat] || '📍',
          tag: (cat === '명소' || cat === '자연' || cat === '액티비티') ? '자세히' : '',
        };
      });
      sub = uniq(day.items.map((x) => x.place).filter((x) => x && !['이동', '캠프장', '호텔', '공항', '캠프'].includes(x))).slice(0, 3).join(' · ');
    }
    total += items.length;
    days.push({
      label: 'Day ' + (di + 1),
      dateLabel: dayDate(di),
      sub,
      summary: blk?.subtitle || '',
      route: blk?.route || '',
      arrivalLabel: di === 0 ? state.arrival + ' 도착 일정' : (di === nD - 1 ? state.departure + ' 출국 일정' : ''),
      items,
    });
    mapDays.push({ label: 'Day ' + (di + 1) + (sub ? (' · ' + sub) : ''), col, geo: dayGeo, stops: items.map((x) => x.name).slice(0, 6) });
  }
  // 견적: 서버(POST /api/coc-pricing/quote)가 원가구조로 계산해 판매가만 반환.
  //   우선순위(서버): ① 실제 가격표(±40% 신뢰 게이트) ② 원가엔진 맞춤 산출 ③ 블록 폴백.
  //   클라이언트는 선택조건만 보내고 결과를 캐시(QUOTE)에서 표시. 비밀(마진/환율)은 받지 않음.
  const people = state.people || 1;
  const tier = selectedTier();
  const tripNights = Math.max(1, nD - 1);
  const params = { product_id: p.product_id || '', regionKeys: usedKeys, region: m.region, nights: tripNights, people, tier };
  const sig = [params.product_id, tier, people, tripNights, usedKeys.join(',')].join('|');
  let quote;
  if (QUOTE.sig === sig && QUOTE.data) {
    quote = QUOTE.data;
  } else {
    requestServerQuote(sig, params);  // 비동기 — 도착하면 render() 재호출
    quote = { people, tier, hasCost: false, pending: true };
  }
  return Object.assign({ loading: false, tourName: p.tour_name, durShort, distance: tripDist, totalCount: total, days, mapDays, quote }, base);
}

// ---- render ----
function render() {
  if (!state.started) { app.innerHTML = wrap(renderIntro()); }
  else if (state.step <= 5) { app.innerHTML = wrap(renderQuestion()); }
  else { app.innerHTML = wrap(renderResult() + (state.sent ? renderSent() : '')); initCocMap(); }
}
function wrap(inner) {
  return `<div style="height:100vh; width:100%; font-family:var(--font-sans); color:var(--mrt-ink); background:#fff; border-top:3px solid ${A}; overflow:hidden; display:flex; flex-direction:column;">${inner}</div>`;
}

function renderIntro() {
  const N = EXPERIENCES.length;
  const slides = EXPERIENCES.map((ex, i) => {
    let off = i - state.active;
    if (off > N / 2) off -= N;
    if (off < -N / 2) off += N;
    const ab = Math.abs(off), center = off === 0;
    const tx = off * 216, ty = ab * 26, rot = off * 5, sc = center ? 1 : (ab === 1 ? 0.84 : 0.68);
    return { i, ex, center, transform: `translate(calc(-50% + ${tx}px), ${ty}px) rotate(${rot}deg) scale(${sc})`, opacity: ab <= 2 ? (center ? 1 : 0.92) : 0, z: 20 - ab * 2, pointer: ab <= 2 ? 'auto' : 'none', shadow: center ? '0 24px 50px rgba(40,30,20,.30)' : '0 14px 30px rgba(40,30,20,.18)', catCol: center ? A : 'rgba(255,255,255,.9)', titleSize: center ? '22px' : '17px' };
  });
  const cards = slides.map((c) => `
    <div data-action="setActive" data-idx="${c.i}" style="position:absolute; left:50%; top:30px; width:260px; height:330px; transform:${c.transform}; opacity:${c.opacity}; z-index:${c.z}; pointer-events:${c.pointer}; transition:transform .55s cubic-bezier(.4,.1,.2,1), opacity .55s ease; cursor:pointer; border-radius:22px; box-shadow:${c.shadow}; overflow:hidden; background:${c.ex.g};">
      <div style="position:absolute; inset:0; background:linear-gradient(180deg, rgba(20,18,30,0) 38%, rgba(20,18,30,.82) 100%);"></div>
      <div style="position:absolute; left:0; right:0; bottom:0; padding:0 20px 22px; text-align:center;">
        <div style="font-size:13px; font-weight:800; color:${c.catCol};">${esc(c.ex.cat)}</div>
        <div style="margin-top:5px; font-size:${c.titleSize}; font-weight:800; letter-spacing:-.03em; color:#fff; line-height:1.25;">${esc(c.ex.title)}</div>
        ${c.center ? `<div style="margin-top:7px; font-size:13px; font-weight:500; color:rgba(255,255,255,.82);">${esc(c.ex.sub)}</div>` : ''}
      </div>
    </div>`).join('');
  const dots = EXPERIENCES.map((ex, i) => `<button type="button" data-action="setActive" data-idx="${i}" style="width:${i === state.active ? '22px' : '7px'}; height:7px; border-radius:999px; border:none; background:${i === state.active ? A : 'rgba(0,0,0,.16)'}; cursor:pointer; padding:0; transition:all .3s;"></button>`).join('');
  return `
  <div style="flex:1; min-height:0; display:flex; flex-direction:column; background:radial-gradient(125% 90% at 50% -5%, #FCEBDD 0%, #FFF6EF 42%, #FFFFFF 100%);">
    <div style="flex:none; display:flex; align-items:center; justify-content:space-between; padding:24px 34px;">
      <div style="font-size:19px; font-weight:800; letter-spacing:-.03em; color:${A};">MilkyWay</div>
      <div style="display:inline-flex; align-items:center; gap:7px; padding:7px 14px; border-radius:999px; background:rgba(255,255,255,.7); border:1px solid rgba(0,0,0,.05); font-size:13px; font-weight:700; color:var(--mrt-gray-600);">🇲🇳 몽골 프라이빗 투어</div>
    </div>
    <div style="flex:1; min-height:0; position:relative; display:flex; align-items:center; justify-content:center; overflow:hidden;">
      <div style="position:relative; width:100%; height:380px;">${cards}</div>
    </div>
    <div style="flex:none; display:flex; align-items:center; justify-content:center; gap:7px; margin-bottom:4px;">${dots}</div>
    <div style="flex:none; text-align:center; padding:18px 32px 40px;">
      <div style="font-size:13.5px; font-weight:800; letter-spacing:.04em; color:${A}; text-transform:uppercase; animation:mwCineKicker 1s ease .1s both;">ONLY IN MONGOLIA</div>
      <h1 style="margin:9px 0 0; font-size:32px; font-weight:800; letter-spacing:-.035em; line-height:1.22; animation:mwCineUp 1.15s cubic-bezier(.2,.7,.2,1) .35s both;">몽골에서만 만나는 특별한 순간</h1>
      <p style="margin:11px auto 0; max-width:520px; font-size:15.5px; line-height:1.6; color:var(--mrt-gray-600); animation:mwCineUp 1s ease .72s both;">사막의 은하수, 유목민 게르, 대초원 승마까지 — 몇 가지 질문에 답하면 현지 전문가가 당신만의 일정과 견적을 설계해 드려요.</p>
      <button type="button" data-action="start" class="hov-ink" style="margin-top:24px; height:58px; padding:0 40px; border:none; border-radius:15px; background:var(--mrt-ink); color:#fff; font-size:17px; font-weight:800; letter-spacing:-.02em; cursor:pointer; display:inline-flex; align-items:center; gap:10px; box-shadow:0 10px 26px rgba(26,27,30,.22); animation:mwCineBtn .9s cubic-bezier(.2,.7,.2,1) 1.05s both;">
        견적 요청 시작하기
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
      </button>
    </div>
  </div>`;
}

function renderQuestion() {
  const P = STEP_DEF[Math.min(5, state.step)];
  let steps = '';
  for (let i = 0; i < 6; i++) {
    steps += `<span style="display:flex; align-items:center; gap:8px;"><span style="color:${state.step >= i ? 'var(--mrt-ink)' : 'var(--mrt-gray-400)'};">0${i + 1}</span>${i < 5 ? `<span style="width:20px; height:2px; border-radius:2px; background:${state.step >= i + 1 ? 'var(--mrt-ink)' : 'var(--mrt-gray-200)'};"></span>` : ''}</span>`;
  }
  const body = [renderQ1, renderQ2, renderQ3, renderQ4, renderQ5, renderQ6][state.step]();
  const ok = canNext();
  const nameBad = state.triedSubmit && !state.name.trim();
  const emailBad = state.triedSubmit && !emailOk();
  let errorMsg = '';
  if (nameBad && emailBad) errorMsg = '이름과 이메일을 입력해 주세요.';
  else if (nameBad) errorMsg = '이름을 입력해 주세요.';
  else if (emailBad) errorMsg = '올바른 이메일을 입력해 주세요.';
  const isLast = state.step === 5;
  return `
  <div style="flex:1; min-height:0; display:flex; flex-direction:column; max-width:760px; width:100%; margin:0 auto; padding:30px 32px 26px;">
    <div style="display:flex; align-items:center; justify-content:space-between;">
      <div style="font-size:19px; font-weight:800; letter-spacing:-.03em; color:${A};">MilkyWay</div>
      <div style="display:flex; align-items:center; gap:8px; font-size:14px; font-weight:800; letter-spacing:.02em;">${steps}</div>
    </div>
    <div style="margin-top:32px;">
      <div style="font-size:14.5px; font-weight:500; color:var(--mrt-gray-500);">${esc(P.kicker)}</div>
      <h1 style="margin:9px 0 0; font-size:30px; font-weight:800; letter-spacing:-.035em; line-height:1.28;">${esc(P.t1)}<br><span style="font-weight:600; color:var(--mrt-gray-700);">${esc(P.t2)}</span></h1>
    </div>
    <div class="mw-scroll" style="flex:1; min-height:0; overflow-y:auto; margin-top:28px; padding-bottom:8px;">${body}</div>
    <div style="display:flex; align-items:center; justify-content:space-between; padding-top:16px;">
      ${state.step > 0 ? `<button type="button" data-action="prev" class="hov-ghost" style="height:56px; padding:0 38px; border:1.5px solid var(--border-default); border-radius:13px; background:#fff; color:var(--mrt-gray-700); font-size:16px; font-weight:700; letter-spacing:-.02em; cursor:pointer;">이전</button>` : '<span></span>'}
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:7px;">
        <button type="button" data-action="next" style="height:56px; padding:0 44px; border:none; border-radius:13px; background:${ok ? 'var(--mrt-ink)' : 'var(--mrt-gray-200)'}; color:${ok ? '#fff' : 'var(--mrt-gray-400)'}; font-size:16px; font-weight:800; letter-spacing:-.02em; cursor:${ok ? 'pointer' : 'not-allowed'}; transition:background .14s; display:flex; align-items:center; gap:9px;">
          ${isLast ? '일정 만들기' : '다음'}
          ${isLast ? '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.2 6.6H21l-5.4 3.9 2 6.6L12 15.6 6.4 19.1l2-6.6L3 8.6h6.8z"></path></svg>' : ''}
        </button>
        ${state.triedSubmit && errorMsg ? `<span style="font-size:12.5px; font-weight:600; color:var(--mrt-red);">${esc(errorMsg)}</span>` : ''}
      </div>
    </div>
  </div>`;
}

function renderQ1() {
  return `<div style="display:flex; flex-direction:column; gap:20px; animation:mwfade .22s ease;">${DEST.map((g) => {
    const count = g.items.filter((it) => state.dest.includes(it.id)).length;
    const pills = g.items.map((it) => {
      const on = state.dest.includes(it.id);
      return `<button type="button" data-action="toggleDest" data-id="${it.id}" class="hov-accent" style="display:inline-flex; align-items:center; gap:8px; padding:11px 17px; border-radius:999px; border:1.5px solid ${on ? A : 'var(--border-default)'}; background:${on ? `color-mix(in srgb, ${A} 10%, #fff)` : '#fff'}; color:${on ? A : 'var(--mrt-gray-700)'}; font-size:15px; font-weight:${on ? '800' : '600'}; letter-spacing:-.02em; cursor:pointer; transition:all .13s;">${on ? `<span style="width:7px; height:7px; border-radius:50%; background:${A};"></span>` : ''}${esc(it.label)}</button>`;
    }).join('');
    return `<div><div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;"><span style="font-size:14.5px; font-weight:800; letter-spacing:-.02em;">${esc(g.group)}</span><span style="font-size:12px; font-weight:500; color:var(--mrt-gray-400);">${esc(g.desc)}</span>${count ? `<span style="font-size:11px; font-weight:800; color:#fff; background:${A}; min-width:18px; height:18px; padding:0 5px; border-radius:999px; display:inline-flex; align-items:center; justify-content:center;">${count}</span>` : ''}</div><div style="display:flex; flex-wrap:wrap; gap:9px;">${pills}</div></div>`;
  }).join('')}</div>`;
}

function renderQ2() {
  const wk = ['일', '월', '화', '수', '목', '금', '토'];
  const calTitle = state.calY + '년 ' + (state.calM + 1) + '월';
  const firstDow = new Date(state.calY, state.calM, 1).getDay();
  const dim = new Date(state.calY, state.calM + 1, 0).getDate();
  const todayI = todayISO();
  const lightBand = `color-mix(in srgb, ${A} 13%, #fff)`;
  let cells = '';
  for (let i = 0; i < firstDow; i++) cells += `<button type="button" style="height:42px; border:none; background:none;"></button>`;
  for (let d = 1; d <= dim; d++) {
    const di = iso(state.calY, state.calM, d);
    const isStart = di === state.rangeStart, isEnd = di === state.rangeEnd;
    const both = state.rangeStart && state.rangeEnd;
    const inRange = both && di > state.rangeStart && di < state.rangeEnd;
    const past = di < todayI;
    const dow = (firstDow + d - 1) % 7;
    let fg = past ? 'var(--mrt-gray-300)' : (dow === 0 ? 'var(--mrt-red)' : (dow === 6 ? A : 'var(--mrt-gray-800)'));
    let dotBg = 'transparent', dotShadow = 'none', fw = '600', bandBg = 'transparent', bandLeft = '0', bandRight = '0';
    if (both) { if (isStart) { bandBg = lightBand; bandLeft = '50%'; } else if (isEnd) { bandBg = lightBand; bandRight = '50%'; } else if (inRange) { bandBg = lightBand; } }
    if (isStart || isEnd) { dotBg = A; fg = '#fff'; fw = '800'; dotShadow = `0 4px 10px color-mix(in srgb, ${A} 40%, transparent)`; }
    else if (inRange) { fg = A; fw = '700'; }
    cells += `<button type="button" data-action="pickDay" data-date="${di}" style="height:42px; border:none; background:none; padding:0; cursor:${past ? 'default' : 'pointer'}; position:relative; display:flex; align-items:center; justify-content:center;"><span style="position:absolute; top:3px; bottom:3px; left:${bandLeft}; right:${bandRight}; background:${bandBg};"></span><span style="position:relative; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:${fw}; color:${fg}; background:${dotBg}; box-shadow:${dotShadow};">${d}</span></button>`;
  }
  const hasRng = !!(state.rangeStart && state.rangeEnd);
  const nights = hasRng ? diffDays(state.rangeStart, state.rangeEnd) : 0;
  const rangeLabel = state.rangeStart ? (fmtK(state.rangeStart) + (state.rangeEnd ? ' → ' + fmtK(state.rangeEnd) : ' →')) : '';
  const wkRow = wk.map((label, i) => `<span style="text-align:center; font-size:12px; font-weight:700; color:${i === 0 ? 'var(--mrt-red)' : (i === 6 ? A : 'var(--mrt-gray-500)')};">${label}</span>`).join('');
  return `<div style="display:flex; flex-direction:column; align-items:center; gap:20px; padding-top:2px; animation:mwfade .22s ease;">
    <div style="width:384px; max-width:100%; border:1.5px solid var(--border-subtle); border-radius:20px; padding:20px 22px 22px; box-shadow:var(--shadow-sm);">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <button type="button" data-action="prevMonth" class="hov-soft" style="width:36px; height:36px; border:1px solid var(--border-default); border-radius:10px; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mrt-gray-700)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg></button>
        <span style="font-size:17px; font-weight:800; letter-spacing:-.02em;">${calTitle}</span>
        <button type="button" data-action="nextMonth" class="hov-soft" style="width:36px; height:36px; border:1px solid var(--border-default); border-radius:10px; background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--mrt-gray-700)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg></button>
      </div>
      <div style="display:grid; grid-template-columns:repeat(7,1fr); margin-bottom:6px;">${wkRow}</div>
      <div style="display:grid; grid-template-columns:repeat(7,1fr); row-gap:1px;">${cells}</div>
    </div>
    ${hasRng
      ? `<div style="display:inline-flex; align-items:center; gap:14px; padding:13px 22px; border-radius:14px; background:color-mix(in srgb, ${A} 9%, #fff); border:1px solid color-mix(in srgb, ${A} 28%, #fff);"><span style="font-size:14px; font-weight:700; color:var(--mrt-gray-700);">${esc(rangeLabel)}</span><span style="width:1px; height:18px; background:color-mix(in srgb, ${A} 30%, #fff);"></span><span style="font-size:17px; font-weight:800; letter-spacing:-.02em; color:${A};">${nights}박 ${nights + 1}일</span></div>`
      : `<div style="font-size:14px; font-weight:600; color:var(--mrt-gray-400);">${state.rangeStart ? '여행 종료일을 선택해 주세요' : '여행 시작일과 종료일을 선택해 주세요'}</div>`}
  </div>`;
}

function renderQ3() {
  return `<div style="display:flex; flex-wrap:wrap; gap:13px; max-width:600px; animation:mwfade .22s ease;">${ACTS.map((t) => {
    const on = state.acts.includes(t.id);
    return `<button type="button" data-action="toggleAct" data-id="${t.id}" class="hov-accent" style="display:inline-flex; align-items:center; gap:9px; padding:14px 22px; border-radius:999px; border:1.5px solid ${on ? A : 'var(--border-default)'}; background:${on ? `color-mix(in srgb, ${A} 10%, #fff)` : '#fff'}; color:${on ? A : 'var(--mrt-gray-700)'}; font-size:16px; font-weight:${on ? '800' : '600'}; letter-spacing:-.02em; cursor:pointer; transition:all .13s;"><span style="font-size:18px;">${t.emoji}</span>${esc(t.label)}</button>`;
  }).join('')}</div>`;
}

function renderQ4() {
  return `<div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; max-width:600px; animation:mwfade .22s ease;">${STAYS.map((st) => {
    const on = state.stays.includes(st.id);
    return `<button type="button" data-action="toggleStay" data-id="${st.id}" class="hov-accent" style="text-align:left; padding:18px 19px; border-radius:16px; border:1.5px solid ${on ? A : 'var(--border-default)'}; background:${on ? `color-mix(in srgb, ${A} 8%, #fff)` : '#fff'}; cursor:pointer; transition:all .13s; display:flex; align-items:center; gap:14px;"><span style="width:48px; height:48px; flex:none; border-radius:13px; background:${on ? `color-mix(in srgb, ${A} 16%, #fff)` : 'var(--mrt-gray-100)'}; display:flex; align-items:center; justify-content:center; font-size:24px;">${st.emoji}</span><span style="flex:1; min-width:0;"><span style="display:block; font-size:16px; font-weight:${on ? '800' : '700'}; letter-spacing:-.02em; color:${on ? 'var(--mrt-ink)' : 'var(--mrt-gray-900)'};">${esc(st.label)}</span><span style="display:block; font-size:12.5px; font-weight:500; color:var(--mrt-gray-500); margin-top:2px;">${esc(st.desc)}</span></span><span style="width:22px; height:22px; flex:none; border-radius:7px; border:1.5px solid ${on ? A : 'var(--mrt-gray-300)'}; background:${on ? A : '#fff'}; display:inline-flex; align-items:center; justify-content:center;">${on ? '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"></path></svg>' : ''}</span></button>`;
  }).join('')}</div>`;
}

function renderQ5() {
  return `<div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:13px; max-width:640px; animation:mwfade .22s ease;">${VEHS.map((v) => {
    const on = state.vehicle === v.id;
    return `<button type="button" data-action="selectVehicle" data-id="${v.id}" class="hov-accent" style="text-align:left; padding:17px 18px; border-radius:16px; border:1.5px solid ${on ? A : 'var(--border-default)'}; background:${on ? `color-mix(in srgb, ${A} 8%, #fff)` : '#fff'}; cursor:pointer; transition:all .13s; display:flex; flex-direction:column; gap:8px; min-height:118px;"><span style="display:flex; align-items:center; justify-content:space-between;"><span style="font-size:26px;">${v.emoji}</span><span style="width:20px; height:20px; border-radius:50%; border:1.5px solid ${on ? A : 'var(--mrt-gray-300)'}; display:inline-flex; align-items:center; justify-content:center; flex:none;">${on ? `<span style="width:10px; height:10px; border-radius:50%; background:${A};"></span>` : ''}</span></span><span><span style="display:block; font-size:15.5px; font-weight:${on ? '800' : '700'}; letter-spacing:-.02em; color:${on ? 'var(--mrt-ink)' : 'var(--mrt-gray-900)'};">${esc(v.label)}</span><span style="display:block; font-size:12px; font-weight:500; color:var(--mrt-gray-500); margin-top:3px; line-height:1.4;">${esc(v.desc)}</span></span></button>`;
  }).join('')}</div>`;
}

function renderQ6() {
  const nameBd = state.triedSubmit && !state.name.trim() ? 'var(--mrt-red)' : 'var(--border-default)';
  const emailBd = state.triedSubmit && !emailOk() ? 'var(--mrt-red)' : 'var(--border-default)';
  return `<div style="display:flex; flex-direction:column; gap:18px; max-width:600px; animation:mwfade .22s ease;">
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
      <label style="display:flex; flex-direction:column; gap:7px;"><span style="font-size:13px; font-weight:700; color:var(--mrt-gray-700);">이름</span><input type="text" data-field="name" value="${esc(state.name)}" placeholder="예: 김민수" class="coc-input" style="height:50px; padding:0 16px; border-radius:13px; border:1.5px solid ${nameBd}; background:#fff; font-size:15px; font-family:var(--font-sans); color:var(--mrt-gray-900); outline:none;"></label>
      <label style="display:flex; flex-direction:column; gap:7px;"><span style="font-size:13px; font-weight:700; color:var(--mrt-gray-700);">이메일</span><input type="email" data-field="email" value="${esc(state.email)}" placeholder="customer@example.com" class="coc-input" style="height:50px; padding:0 16px; border-radius:13px; border:1.5px solid ${emailBd}; background:#fff; font-size:15px; font-family:var(--font-sans); color:var(--mrt-gray-900); outline:none;"></label>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px;">
      <div style="display:flex; flex-direction:column; gap:7px;"><span style="font-size:13px; font-weight:700; color:var(--mrt-gray-700);">인원</span>
        <div style="height:50px; display:flex; align-items:center; justify-content:space-between; padding:0 9px; border-radius:13px; border:1.5px solid var(--border-default);">
          <button type="button" data-action="bump" data-field="people" data-delta="-1" style="width:34px; height:34px; border:none; border-radius:9px; background:var(--mrt-gray-100); color:var(--mrt-gray-700); font-size:20px; font-weight:700; cursor:pointer; line-height:1;">−</button>
          <span style="font-size:16px; font-weight:800; color:var(--mrt-ink);">${state.people}<span style="font-size:13px; font-weight:600; color:var(--mrt-gray-500); margin-left:2px;">명</span></span>
          <button type="button" data-action="bump" data-field="people" data-delta="1" style="width:34px; height:34px; border:none; border-radius:9px; background:var(--mrt-gray-100); color:var(--mrt-gray-700); font-size:20px; font-weight:700; cursor:pointer; line-height:1;">+</button>
        </div>
      </div>
      <label style="display:flex; flex-direction:column; gap:7px;"><span style="font-size:13px; font-weight:700; color:var(--mrt-gray-700);">출발 희망일</span><input type="date" data-field="startDate" value="${esc(state.startDate)}" class="coc-input" style="height:50px; padding:0 16px; border-radius:13px; border:1.5px solid var(--border-default); background:#fff; font-size:15px; font-family:var(--font-sans); color:var(--mrt-gray-900); outline:none;"></label>
    </div>
    <div style="display:flex; flex-direction:column; gap:7px;">
      <span style="font-size:13px; font-weight:700; color:var(--mrt-gray-700);">몽골 도착 시간대 <span style="font-weight:500; color:var(--mrt-gray-400);">(1일차 일정이 달라져요)</span></span>
      <div style="display:flex; gap:8px;">
        ${['오전', '오후'].map((a) => `<button type="button" data-action="setArrival" data-arr="${a}" style="flex:1; height:50px; border-radius:13px; border:1.5px solid ${state.arrival === a ? A : 'var(--border-default)'}; background:${state.arrival === a ? `color-mix(in srgb, ${A} 8%, #fff)` : '#fff'}; color:${state.arrival === a ? 'var(--mrt-ink)' : 'var(--mrt-gray-700)'}; font-size:14px; font-weight:${state.arrival === a ? '800' : '600'}; cursor:pointer; font-family:var(--font-sans);">${a} 도착</button>`).join('')}
      </div>
    </div>
    <div style="display:flex; flex-direction:column; gap:7px;">
      <span style="font-size:13px; font-weight:700; color:var(--mrt-gray-700);">몽골 출국 시간대 <span style="font-weight:500; color:var(--mrt-gray-400);">(마지막 날 일정이 달라져요)</span></span>
      <div style="display:flex; gap:8px;">
        ${['오전', '오후'].map((a) => `<button type="button" data-action="setDeparture" data-dep="${a}" style="flex:1; height:50px; border-radius:13px; border:1.5px solid ${state.departure === a ? A : 'var(--border-default)'}; background:${state.departure === a ? `color-mix(in srgb, ${A} 8%, #fff)` : '#fff'}; color:${state.departure === a ? 'var(--mrt-ink)' : 'var(--mrt-gray-700)'}; font-size:14px; font-weight:${state.departure === a ? '800' : '600'}; cursor:pointer; font-family:var(--font-sans);">${a} 출국</button>`).join('')}
      </div>
    </div>
    <label style="display:flex; flex-direction:column; gap:7px;"><span style="font-size:13px; font-weight:700; color:var(--mrt-gray-700);">세부 요청 <span style="font-weight:500; color:var(--mrt-gray-400);">(선택)</span></span><textarea data-field="note" rows="3" placeholder="예: 1일차 울란바타르 시내투어, 2일차 테를지 게르, 3일차 쳉헤르 온천을 넣어주세요." class="coc-input" style="width:100%; resize:vertical; padding:14px 16px; border-radius:13px; border:1.5px solid var(--border-default); background:#fff; font-size:14.5px; font-family:var(--font-sans); line-height:1.6; color:var(--mrt-gray-900); outline:none;">${esc(state.note)}</textarea></label>
  </div>`;
}

function renderResult() {
  const v = resultData();
  const starRow = [1, 2, 3, 4, 5].map((n) => `<button type="button" data-action="setStar" data-n="${n}" style="background:none; border:none; padding:0; cursor:pointer; font-size:21px; line-height:1; color:${n <= state.star ? 'var(--mrt-gold)' : 'var(--mrt-gray-300)'};">★</button>`).join('');
  const tags = v.themeTags.map((t) => `<span style="display:inline-flex; align-items:center; gap:5px; padding:6px 11px; border-radius:999px; background:rgba(255,255,255,.2); font-size:12px; font-weight:700;">${t.emoji} #${esc(t.label)}</span>`).join('');
  const dayBlocks = v.loading
    ? '<div style="padding:48px 0; text-align:center; color:var(--mrt-gray-400); font-size:13.5px;">일정을 불러오는 중…</div>'
    : v.days.map((day, dIdx) => {
    const stops = day.items.map((it, i) => {
      const last = i === day.items.length - 1;
      const conn = last ? '' : '<span style="flex:1; width:2px; background:var(--mrt-gray-200); margin:3px 0;"></span>';
      const dot = `<div style="flex:none; width:14px; display:flex; flex-direction:column; align-items:center;"><span style="width:13px; height:13px; border-radius:50%; background:#fff; border:3px solid #40c9a2; margin-top:5px;"></span>${conn}</div>`;
      if (it.transit) {
        return `<div style="display:flex; gap:13px;">${dot}<div style="flex:1; min-width:0; padding:2px 0 ${last ? '4px' : '14px'};"><div style="font-size:13.5px; font-weight:700; color:var(--mrt-gray-700);">${it.emoji} ${esc(it.name)}</div>${it.desc ? `<div style="font-size:12px; color:var(--mrt-gray-500); margin-top:2px; line-height:1.5;">${esc(it.desc)}</div>` : ''}</div></div>`;
      }
      const tag = it.tag ? `<span style="flex:none; font-size:10.5px; font-weight:700; color:var(--mrt-gray-500); background:var(--mrt-gray-100); padding:2px 7px; border-radius:6px;">${esc(it.tag)}</span>` : '';
      const photoRow = it.photos > 0
        ? `<div class="coc-photo-row">${Array.from({ length: it.photos }).map((_, j) => `<div class="coc-photo-slot"><span aria-hidden="true">${it.emoji}</span><small>추천 사진 ${j + 1}</small></div>`).join('')}</div>`
        : '';
      return `
      <div style="display:flex; gap:13px;">
        ${dot}
        <div style="flex:1; min-width:0; padding-bottom:${last ? '4px' : '18px'};">
          <div style="display:flex; align-items:center; gap:7px; margin-bottom:4px; flex-wrap:wrap;">
            <span style="font-size:10.5px; font-weight:800; color:#fff; background:#1A1B1E; padding:2px 7px; border-radius:6px;">${esc(it.cat)}</span>
            <span style="font-size:15px; font-weight:700; letter-spacing:-.02em; color:var(--mrt-ink);">${esc(it.name)}</span>
            ${tag}
          </div>
          ${it.desc ? `<div style="font-size:12.5px; color:var(--mrt-gray-600); line-height:1.55; margin-bottom:${it.photos ? '8px' : '0'};">${esc(it.desc)}</div>` : ''}
          ${photoRow}
        </div>
      </div>`;
    }).join('');
    return `
    <section class="coc-day-section" style="margin-top:${dIdx === 0 ? 18 : 28}px;">
      <div style="display:flex; align-items:center; gap:9px; margin-bottom:8px; flex-wrap:wrap;">
        <span style="font-size:11px; font-weight:800; color:var(--mrt-ink); background:#48e5c2; padding:4px 9px; border-radius:8px;">${esc(day.label)}</span>
        ${day.dateLabel ? `<span style="font-size:13.5px; font-weight:700; color:var(--mrt-ink);">${esc(day.dateLabel)}</span>` : ''}
        ${day.arrivalLabel ? `<span class="coc-condition-badge">${esc(day.arrivalLabel)}</span>` : ''}
      </div>
      ${day.sub ? `<h3 class="coc-day-title">${esc(day.sub)}</h3>` : ''}
      ${day.summary ? `<p class="coc-day-summary">${esc(day.summary)}</p>` : ''}
      ${day.route ? `<div class="coc-route-strip"><span>이동 경로</span><strong>${esc(day.route)}</strong></div>` : ''}
      <div class="coc-day-timeline">
      ${stops}
      </div>
    </section>`;
  }).join('');
  const legend = v.mapDays.map((dl, i) => `<span style="display:inline-flex; align-items:center; gap:5px;"><span style="width:11px; height:11px; border-radius:50%; background:${dl.col};"></span>Day ${i + 1}</span>`).join('');
  return `
  <div class="coc-result-shell" style="flex:1; min-height:0; display:flex;">
    <div class="coc-result-panel" style="width:min(540px,48vw); flex:none; height:100%; display:flex; flex-direction:column; border-right:1px solid var(--border-subtle);">
      <div style="padding:16px 22px 14px; flex:none; border-bottom:1px solid var(--border-subtle); display:flex; align-items:center; gap:10px;">
        <button type="button" data-action="restart" title="다시 만들기" class="hov-soft" style="width:34px; height:34px; flex:none; border-radius:10px; border:1px solid var(--border-default); background:#fff; cursor:pointer; display:flex; align-items:center; justify-content:center;"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--mrt-gray-700)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg></button>
        <div style="min-width:0; flex:1;">
          <div style="display:flex; align-items:center; gap:8px;"><span style="font-size:16px; font-weight:800; letter-spacing:-.03em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(v.tourName || ('몽골 ' + v.durShort + ' 일정'))}</span><span style="flex:none; font-size:11px; font-weight:700; color:${A}; background:color-mix(in srgb, ${A} 12%, #fff); padding:3px 9px; border-radius:999px;">AI추천</span></div>
          <div style="display:flex; align-items:center; gap:5px; margin-top:3px; font-size:12.5px; color:var(--mrt-gray-500); font-weight:500;"><span style="color:var(--mrt-gold);">★</span> ${state.star ? state.star.toFixed(1) : '0.0'} <span style="color:var(--mrt-gray-300);">|</span> ${state.people}명 여행</div>
        </div>
      </div>
      <div class="mw-scroll" style="flex:1; min-height:0; overflow-y:auto; padding:16px 18px 26px;">
        <div style="border-radius:16px; background:linear-gradient(135deg,#1FB877 0%,#13A268 100%); color:#fff; padding:18px 18px 16px; box-shadow:0 6px 18px rgba(20,162,104,.28);">
          <div style="display:flex; gap:14px;">
            <div style="width:58px; height:58px; flex:none; border-radius:50%; background:rgba(255,255,255,.18); display:flex; align-items:center; justify-content:center; font-weight:800; letter-spacing:-.03em;"><span style="font-size:15px;">${esc(v.durShort)}</span></div>
            <div style="flex:1; min-width:0; display:flex; flex-direction:column; gap:6px; font-size:13px; line-height:1.45;">
              <div style="display:flex; gap:7px;"><span style="opacity:.82; font-weight:600; white-space:nowrap;">· 총 이동거리</span><span style="opacity:.5;">|</span><span style="font-weight:800;">${v.distance}km</span></div>
              <div style="display:flex; gap:7px;"><span style="opacity:.82; font-weight:600; white-space:nowrap;">· 여행지역</span><span style="opacity:.5;">|</span><span style="font-weight:800;">${esc(v.regionText)}</span></div>
              <div style="display:flex; gap:7px;"><span style="opacity:.82; font-weight:600; white-space:nowrap;">· 총 ${v.totalCount}개</span><span style="font-weight:600; opacity:.9;">명소/식사/숙소 추천!</span></div>
            </div>
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:7px; margin-top:14px;">${tags}</div>
        </div>
        <div style="display:flex; gap:10px; margin-top:12px;">
          <div style="flex:1; padding:13px 15px; border-radius:13px; background:var(--mrt-gray-50); display:flex; align-items:center; gap:10px;"><span style="font-size:20px;">⛺</span><span style="min-width:0;"><span style="display:block; font-size:11px; font-weight:700; color:var(--mrt-gray-400);">숙소</span><span style="display:block; font-size:13.5px; font-weight:700; letter-spacing:-.02em; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(v.stayText)}</span></span></div>
          <div style="flex:1; padding:13px 15px; border-radius:13px; background:var(--mrt-gray-50); display:flex; align-items:center; gap:10px;"><span style="font-size:20px;">${v.vehEmoji}</span><span style="min-width:0;"><span style="display:block; font-size:11px; font-weight:700; color:var(--mrt-gray-400);">차량</span><span style="display:block; font-size:13.5px; font-weight:700; letter-spacing:-.02em;">${esc(v.vehLabel)}</span></span></div>
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:12px; padding:13px 16px; border-radius:12px; background:var(--mrt-gray-50);"><span style="font-size:13.5px; font-weight:600; color:var(--mrt-gray-600);">이 일정이 마음에 드세요?</span><div style="display:flex; gap:4px;">${starRow}</div></div>
        ${v.warning ? `<div style="margin-top:12px; padding:10px 13px; border-radius:11px; background:#FFF7DC; border:1px solid #F2D38B; font-size:12.5px; color:#9A6700; line-height:1.5;">⚠ ${esc(v.warning)}</div>` : ''}
        <div style="margin-top:20px; font-size:15px; font-weight:800; letter-spacing:-.02em; color:var(--mrt-ink);">일자별 일정표</div>
        ${dayBlocks}
      </div>
      <div style="flex:none; padding:14px 18px; border-top:1px solid var(--border-subtle); background:#fff;">
        ${v.quote && v.quote.hasCost ? `
        <div style="display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:11px;">
          <div>
            <div style="font-size:11px; font-weight:700; color:var(--mrt-gray-400);">예상 견적 · ${v.quote.people}명${v.quote.source === 'blocks' ? (v.quote.costedDays < v.quote.totalDays ? ' <span style="color:#9A6700;">(일부 단가 입력 전)</span>' : '') : ` · ${esc(v.quote.tier)} 기준${v.quote.approxHead ? ` (${v.quote.matchedHead}인가 적용)` : ''}`}</div>
            <div style="font-size:12.5px; color:var(--mrt-gray-500); margin-top:2px;">1인 ${won(v.quote.perPerson)}</div>
          </div>
          <div style="font-size:23px; font-weight:800; letter-spacing:-.03em; color:var(--mrt-ink);">${won(v.quote.partyTotal)}</div>
        </div>` : (v.quote && v.quote.pending ? `
        <div style="margin-bottom:11px; font-size:12.5px; color:var(--mrt-gray-400); display:flex; align-items:center; gap:7px;"><span style="width:13px;height:13px;border:2px solid var(--mrt-gray-300);border-top-color:var(--mrt-gray-500);border-radius:50%;display:inline-block;animation:cocspin .7s linear infinite;"></span>예상 견적을 계산하고 있어요…</div>` : `
        <div style="margin-bottom:11px; font-size:12px; color:var(--mrt-gray-400);">맞춤 견적은 요청 후 담당자가 확정해 안내드립니다.</div>`)}
        <button type="button" data-action="sendQuote" class="hov-ink" style="width:100%; height:54px; border:none; border-radius:14px; background:var(--mrt-ink); color:#fff; font-size:16px; font-weight:800; letter-spacing:-.02em; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">이 일정으로 견적 요청하기 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></button>
      </div>
    </div>
    <div class="coc-result-map" style="flex:1; min-width:0; position:relative; background:#E9F0E6; overflow:hidden;">
      <div id="cocMap" style="position:absolute; inset:0; z-index:1;"></div>
      <div style="position:absolute; top:16px; left:16px; z-index:1000; display:flex; flex-wrap:wrap; gap:8px; max-width:60%; padding:8px 13px; border-radius:14px; background:rgba(255,255,255,.94); box-shadow:var(--shadow-sm); font-size:12px; font-weight:700; color:var(--mrt-gray-700); pointer-events:none;">${legend}</div>
      <div style="position:absolute; bottom:16px; right:16px; z-index:1000; display:flex; align-items:center; gap:13px; padding:13px 16px; border-radius:14px; background:linear-gradient(135deg,#1FB877,#13A268); color:#fff; box-shadow:0 6px 18px rgba(20,162,104,.32);"><div style="line-height:1.3;"><div style="font-size:12px; font-weight:600; opacity:.9;">추천 일정이 마음에 들지 않나요?</div><div style="font-size:16px; font-weight:800; letter-spacing:-.02em;">다시 추천받기</div></div><button type="button" data-action="restart" style="width:38px; height:38px; flex:none; border-radius:50%; border:none; background:rgba(255,255,255,.22); color:#fff; font-size:13px; font-weight:800; cursor:pointer;">Go</button></div>
    </div>
  </div>`;
}

let cocMap = null;
function initCocMap() {
  const c = document.getElementById('cocMap');
  if (!c || typeof L === 'undefined') return;
  if (cocMap) { try { cocMap.remove(); } catch (e) { /* noop */ } cocMap = null; }
  const v = resultData();
  const pts = v.mapDays.map((d) => d.geo);
  cocMap = L.map(c, { scrollWheelZoom: true });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '&copy; OpenStreetMap contributors' }).addTo(cocMap);
  if (pts.length > 1) L.polyline(pts, { color: A, weight: 3, dashArray: '6 8', opacity: 0.75 }).addTo(cocMap);
  v.mapDays.forEach((d, i) => {
    const icon = L.divIcon({ className: 'coc-pin', html: `<div style="width:28px;height:28px;border-radius:50%;background:${d.col};border:2.5px solid #fff;color:#fff;font-size:13px;font-weight:800;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.35);">${i + 1}</div>`, iconSize: [28, 28], iconAnchor: [14, 14] });
    L.marker(d.geo, { icon }).addTo(cocMap).bindPopup('<b>' + d.label + '</b>');
  });
  if (pts.length > 1) cocMap.fitBounds(pts, { padding: [55, 55] });
  else if (pts.length === 1) cocMap.setView(pts[0], 7);
  else cocMap.setView([47.5, 104], 5);
  setTimeout(() => { try { cocMap.invalidateSize(); } catch (e) { /* noop */ } }, 60);
}

function renderSent() {
  const v = resultData();
  return `
  <div style="position:fixed; inset:0; z-index:100; background:rgba(26,27,30,.45); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; padding:24px;">
    <div style="width:440px; max-width:100%; background:#fff; border-radius:22px; box-shadow:var(--shadow-lg); padding:34px; text-align:center;">
      <div style="width:68px; height:68px; border-radius:50%; background:color-mix(in srgb, ${A} 14%, #fff); display:flex; align-items:center; justify-content:center; margin:0 auto 18px;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${A}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"></path></svg></div>
      <h1 style="margin:0; font-size:23px; font-weight:800; letter-spacing:-.03em;">견적 요청이 접수됐어요!</h1>
      <p style="margin:11px 0 0; font-size:14.5px; line-height:1.6; color:var(--mrt-gray-600);"><strong style="color:var(--mrt-gray-900);">${esc(state.name || '고객')}</strong>님, 이 일정 기준으로 맞춤 견적을 24시간 내 보내드릴게요.</p>
      <div style="background:var(--mrt-gray-50); border-radius:14px; padding:16px 18px; margin-top:20px; text-align:left; display:flex; flex-direction:column; gap:9px;">
        <div style="display:flex; justify-content:space-between; font-size:13.5px;"><span style="color:var(--mrt-gray-500); font-weight:600;">일정</span><span style="color:var(--mrt-ink); font-weight:700;">${esc(v.durShort)} · ${state.people}명</span></div>
        <div style="display:flex; justify-content:space-between; gap:14px; font-size:13.5px;"><span style="color:var(--mrt-gray-500); font-weight:600; flex:none;">여행지역</span><span style="color:var(--mrt-ink); font-weight:700; text-align:right;">${esc(v.regionText)}</span></div>
        <div style="display:flex; justify-content:space-between; font-size:13.5px;"><span style="color:var(--mrt-gray-500); font-weight:600;">차량</span><span style="color:var(--mrt-ink); font-weight:700;">${esc(v.vehLabel)}</span></div>
      </div>
      <button type="button" data-action="restart" class="hov-soft" style="margin-top:20px; height:48px; width:100%; border:1.5px solid var(--border-default); border-radius:13px; background:#fff; color:var(--mrt-gray-700); font-size:14.5px; font-weight:700; letter-spacing:-.02em; cursor:pointer;">새 일정 만들기</button>
    </div>
  </div>`;
}

// ---- 제출: 요청을 Web App에 저장 (설정된 경우) 후 접수 완료 표시 ----
function buildRequest() {
  const places = [];
  DEST.forEach((g) => g.items.forEach((it) => { if (state.dest.includes(it.id)) places.push(it.label); }));
  const activities = ACTS.filter((t) => state.acts.includes(t.id)).map((t) => t.label);
  const accommodations = STAYS.filter((st) => state.stays.includes(st.id)).map((st) => st.label);
  const vehicle = (VEHS.find((v) => v.id === state.vehicle) || VEHS[0]).label;
  const nights = (state.rangeStart && state.rangeEnd) ? diffDays(state.rangeStart, state.rangeEnd) : '';
  const parts = [];
  if (places.length) parts.push(`희망 지역: ${places.join(', ')}`);
  if (activities.length) parts.push(`희망 활동: ${activities.join(', ')}`);
  if (accommodations.length) parts.push(`숙소: ${accommodations.join(', ')}`);
  if (vehicle && vehicle !== '상관없음') parts.push(`차량: ${vehicle}`);
  parts.push(`도착 시간대: ${state.arrival}, 출국 시간대: ${state.departure}`);
  if (state.note.trim()) parts.push(state.note.trim());
  const m = matchProduct();
  const rec = m.product ? `${m.product.tour_name} (${m.product.nights}박${m.product.nights + 1}일)` : '';
  if (rec) parts.push(`추천 상품: ${rec}`);
  const est = (resultData().quote) || { perPerson: 0, partyTotal: 0, hasCost: false };
  const basisLabel = { product: '가격표', custom: '맞춤산출', blocks: '블록단가' };
  if (est.hasCost) parts.push(`예상 견적(${est.tier || ''}·${basisLabel[est.source] || ''}): 1인 ${won(est.perPerson)} / ${state.people}명 ${won(est.partyTotal)}`);
  const ts = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return {
    request_id: `REQ-COC-${ts}`,
    customer_name: state.name.trim(),
    email: state.email.trim(),
    travelers: String(state.people),
    start_date: state.rangeStart || state.startDate || '',
    nights: nights === '' ? '' : String(nights),
    arrival_time_band: state.arrival,
    departure_time_band: state.departure,
    vehicle,
    recommended_product: m.product ? m.product.tour_name : '',
    recommended_product_id: m.product ? m.product.product_id : '',
    est_per_person: est.perPerson || 0,
    est_total: est.partyTotal || 0,
    est_tier: est.tier || '',
    est_basis: est.source || '',
    raw_request: parts.join('. '),
  };
}
async function submitQuote() {
  const request = buildRequest();
  try { localStorage.setItem('tourPlanner.customerRequest', JSON.stringify(request)); } catch (e) { /* noop */ }
  const quoteEndpoint = String(window.MILKYWAY_QUOTE_API_URL || '').trim();
  const sheetEndpoint = String(window.CUSTOMER_REQUEST_WEB_APP_URL || '').trim();
  const selectedDestinations = DEST.flatMap((group) => group.items)
    .filter((item) => state.dest.includes(item.id))
    .map((item) => item.label);
  const selectedActivities = ACTS.filter((item) => state.acts.includes(item.id)).map((item) => item.label);
  const selectedAccommodations = STAYS.filter((item) => state.stays.includes(item.id)).map((item) => item.label);
  const matched = matchProduct();
  const quotePayload = {
    type: 'personal',
    status: 'new',
    name: request.customer_name,
    email: request.email,
    destination: selectedDestinations.join(', '),
    period: [state.rangeStart, state.rangeEnd].filter(Boolean).join(' ~ '),
    headcount: `${request.travelers}명`,
    travel_types: selectedActivities,
    accommodations: selectedAccommodations,
    vehicle: request.vehicle,
    additional_request: request.raw_request,
    budget: '',
    created_at: new Date().toISOString(),
    source: 'ai-coc-planner',
    source_request_id: request.request_id,
    recommended_product: request.recommended_product,
    recommended_product_id: request.recommended_product_id,
    recommendation_region: matched.region,
  };

  try {
    if (quoteEndpoint) {
      const response = await fetch(quoteEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(quotePayload),
        keepalive: true,
      });
      if (!response.ok) throw new Error(`Quote API returned ${response.status}`);
    }
    state.sent = true;
    render();
  } catch (e) {
    console.error('Milkyway quote save failed.', e);
    window.alert('견적 요청 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    return;
  }

  if (sheetEndpoint) {
    try {
      await fetch(sheetEndpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(request), keepalive: true });
    } catch (e) { console.warn('Google Sheets backup save skipped.', e); }
  }
}
// 인트로 캐러셀 자동 회전
setInterval(() => { if (!state.started) { state.active = (state.active + 1) % EXPERIENCES.length; render(); } }, 3600);

render();
