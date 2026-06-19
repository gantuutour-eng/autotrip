// POST /api/coc-pricing/seed — 관리자 전용(토큰). { prices, costs } 적재(upsert, 멱등).
// 가격·원가구조 데이터는 git에 두지 않고 배포 후 이 엔드포인트로 1회 주입한다.
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
const authed = (request, env) => !!env.ADMIN_TOKEN && (request.headers.get('Authorization') || '') === 'Bearer ' + env.ADMIN_TOKEN;

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!authed(request, env)) return json({ error: 'Unauthorized' }, 401);
  try {
    const { prices, costs } = await request.json();
    let priceRows = 0;

    if (costs && typeof costs === 'object') {
      await env.DB.prepare(
        "INSERT INTO coc_cost_config (id, config, updated_at) VALUES ('default', ?, CURRENT_TIMESTAMP) " +
        "ON CONFLICT(id) DO UPDATE SET config = excluded.config, updated_at = CURRENT_TIMESTAMP"
      ).bind(JSON.stringify(costs)).run();
    }

    if (prices && typeof prices === 'object') {
      const up = "INSERT INTO coc_prices (product_id, tier, headcount, per_person, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP) " +
        "ON CONFLICT(product_id, tier, headcount) DO UPDATE SET per_person = excluded.per_person, updated_at = CURRENT_TIMESTAMP";
      const stmts = [];
      for (const pid of Object.keys(prices)) {
        const byTier = prices[pid] || {};
        for (const t of Object.keys(byTier)) {
          const tbl = byTier[t] || {};
          for (const h of Object.keys(tbl)) {
            const v = Number(tbl[h]);
            if (!Number.isFinite(v) || v <= 0) continue;
            stmts.push(env.DB.prepare(up).bind(pid, t, Number(h), Math.round(v)));
            priceRows += 1;
          }
        }
      }
      for (let i = 0; i < stmts.length; i += 80) await env.DB.batch(stmts.slice(i, i + 80));
    }

    return json({ success: true, priceRows, costs: !!costs });
  } catch (e) {
    return json({ success: false, error: String((e && e.message) || e) }, 400);
  }
}
