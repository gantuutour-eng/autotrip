// GET /api/coc-pricing/prices — 관리자 전용(토큰). 전체 판매가표(경쟁 민감) 조회. 공개 아님.
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
const authed = (request, env) => !!env.ADMIN_TOKEN && (request.headers.get('Authorization') || '') === 'Bearer ' + env.ADMIN_TOKEN;

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!authed(request, env)) return json({ error: 'Unauthorized' }, 401);
  const res = await env.DB.prepare('SELECT product_id, tier, headcount, per_person FROM coc_prices').all();
  const nested = {};
  for (const r of (res.results || [])) {
    (nested[r.product_id] = nested[r.product_id] || {});
    (nested[r.product_id][r.tier] = nested[r.product_id][r.tier] || {});
    nested[r.product_id][r.tier][String(r.headcount)] = Number(r.per_person);
  }
  return json(nested);
}
