// POST /api/coc-pricing/quote — 공개.
// 서버에서 원가구조(coc_cost_config, 기밀)로 견적을 계산해 고객에겐 판매가만 반환한다.
// 마진·환율·권역 1박비용은 절대 응답에 포함하지 않는다.

const BLOCK_REGION = {
  ub_arrival: '중앙몽골', ub_departure: '중앙몽골',
  minisand: '중앙몽골', kharkhorin: '중앙몽골', kharkhorin_hustai: '중앙몽골', hustai: '중앙몽골', terelj: '중앙몽골', tsenkher: '중앙몽골',
  khongor: '남고비', yol: '남고비', tsagaan: '남고비',
  khovsgol: '훕스골', murun: '훕스골', terkhiin: '훕스골',
};

function nearHead(o, n) {
  const ks = Object.keys(o).map(Number).sort((a, b) => a - b);
  if (!ks.length) return 0;
  if (o[n] != null) return o[n];
  let v = o[ks[0]];
  for (const k of ks) if (k <= n) v = o[k];
  return v;
}

function opsForHead(COSTS, n) {
  if (!COSTS || !COSTS.ops_by_vehicle) return 0;
  const b = COSTS.ops_by_vehicle.find((x) => n >= x.lo && (x.hi == null || n <= x.hi));
  return b ? b.total : ((COSTS.ops_by_vehicle[COSTS.ops_by_vehicle.length - 1] || {}).total || 0);
}

// A = Σ(박마다 권역 1박비용[인원]); 1인 = (A + 차량운영비) × (1+마진) ÷ 환율 ÷ 인원; 풀패키지 = + 숙소차액 × 박수
function engineQuotePerPerson(COSTS, usedKeys, nights, fallbackRegion, people, tier) {
  if (!COSTS || !COSTS.region_night_cost_by_head || people < 1 || nights < 1) return 0;
  const rc = COSTS.region_night_cost_by_head;
  let A = 0, counted = 0;
  for (let i = 0; i < nights; i += 1) {
    const reg = BLOCK_REGION[(usedKeys && usedKeys[i])] || fallbackRegion || '중앙몽골';
    const tbl = rc[reg] || rc[fallbackRegion] || rc['중앙몽골'];
    if (!tbl) continue;
    A += nearHead(tbl, people); counted += 1;
  }
  if (!counted) { const tbl = rc[fallbackRegion] || rc['중앙몽골']; if (tbl) A = nights * nearHead(tbl, people); }
  if (A <= 0) return 0;
  let per = ((A + opsForHead(COSTS, people)) * (1 + (COSTS.margin || 0))) / (COSTS.exchange_rate || 2.3) / people;
  if (tier === '풀패키지') per += (COSTS.lodging_upgrade_per_night || 0) * nights;
  return Math.round(per);
}

async function lookupRealPriceDB(db, productId, people, tier) {
  const res = await db.prepare('SELECT tier, headcount, per_person FROM coc_prices WHERE product_id = ?').bind(productId).all();
  const rows = res.results || [];
  if (!rows.length) return null;
  const tiers = new Set(rows.map((r) => r.tier));
  const useTier = tiers.has(tier) ? tier : (tiers.has('실속') ? '실속' : rows[0].tier);
  const table = rows.filter((r) => r.tier === useTier);
  if (!table.length) return null;
  const heads = table.map((r) => Number(r.headcount)).sort((a, b) => a - b);
  const used = heads.includes(people) ? people : (heads.filter((h) => h <= people).pop() || heads[0]);
  const row = table.find((r) => Number(r.headcount) === used);
  return row ? { perPerson: Number(row.per_person), tier: useTier, matchedHead: used, approx: used !== people } : null;
}

const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const productId = b.product_id || '';
    const regionKeys = Array.isArray(b.regionKeys) ? b.regionKeys : [];
    const region = b.region || '중앙몽골';
    const nights = Math.max(1, Number(b.nights) || 1);
    const people = Math.max(1, Number(b.people) || 1);
    const tier = b.tier === '풀패키지' ? '풀패키지' : '실속';

    let COSTS = null;
    try {
      const cfg = await env.DB.prepare("SELECT config FROM coc_cost_config WHERE id = 'default'").first();
      if (cfg && cfg.config) COSTS = JSON.parse(cfg.config);
    } catch (e) { /* 설정 미존재 → 엔진 폴백 불가, real 또는 none */ }

    const engPer = engineQuotePerPerson(COSTS, regionKeys, nights, region, people, tier);
    const real = productId ? await lookupRealPriceDB(env.DB, productId, people, tier) : null;
    const trusted = real && real.perPerson > 0 && (!engPer || Math.abs(real.perPerson - engPer) / engPer <= 0.40);

    let perPerson = 0, source = 'none', outTier = tier, approxHead = false, matchedHead = people;
    if (trusted) { perPerson = real.perPerson; source = 'product'; outTier = real.tier; approxHead = real.approx; matchedHead = real.matchedHead; }
    else if (engPer > 0) { perPerson = engPer; source = 'custom'; }

    return json({ perPerson, partyTotal: perPerson * people, source, tier: outTier, approxHead, matchedHead, people });
  } catch (e) {
    return json({ perPerson: 0, partyTotal: 0, source: 'none', error: String((e && e.message) || e) }, 400);
  }
}
