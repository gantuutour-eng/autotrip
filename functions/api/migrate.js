// GET /api/migrate — 관리자 전용(토큰). D1 테이블 생성(멱등). 배포 후 1회 방문.
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
const authed = (request, env) => !!env.ADMIN_TOKEN && (request.headers.get('Authorization') || '') === 'Bearer ' + env.ADMIN_TOKEN;

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!authed(request, env)) return json({ error: 'Unauthorized' }, 401);
  const out = [];
  const run = async (label, sql) => {
    try { await env.DB.prepare(sql).run(); out.push('OK: ' + label); }
    catch (e) { out.push('SKIP ' + label + ': ' + String((e && e.message) || e)); }
  };
  await run('coc_prices', `CREATE TABLE IF NOT EXISTS coc_prices (
    product_id TEXT NOT NULL, tier TEXT NOT NULL, headcount INTEGER NOT NULL,
    per_person INTEGER NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (product_id, tier, headcount))`);
  await run('coc_cost_config', `CREATE TABLE IF NOT EXISTS coc_cost_config (
    id TEXT PRIMARY KEY NOT NULL, config TEXT NOT NULL, updated_at TEXT DEFAULT CURRENT_TIMESTAMP)`);
  await run('quotes', `CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY, type TEXT, status TEXT, name TEXT, email TEXT,
    destination TEXT, period TEXT, headcount TEXT, travel_types TEXT, accommodations TEXT,
    vehicle TEXT, additional_request TEXT, budget TEXT, source TEXT, source_request_id TEXT,
    recommended_product TEXT, recommended_product_id TEXT, recommendation_region TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP)`);
  return json({ success: true, details: out });
}
