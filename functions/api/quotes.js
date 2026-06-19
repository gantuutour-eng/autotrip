// /api/quotes — 고객 견적요청 저장(POST, 공개) / 목록(GET, 관리자 토큰).
const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
const authed = (request, env) => !!env.ADMIN_TOKEN && (request.headers.get('Authorization') || '') === 'Bearer ' + env.ADMIN_TOKEN;
const arr = (v) => (Array.isArray(v) ? JSON.stringify(v) : (v || ''));

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const id = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : ('q-' + Date.now() + '-' + Math.round(Math.random() * 1e6));
    await env.DB.prepare(
      `INSERT INTO quotes (id, type, status, name, email, destination, period, headcount, travel_types, accommodations, vehicle, additional_request, budget, source, source_request_id, recommended_product, recommended_product_id, recommendation_region, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`
    ).bind(
      id, b.type || 'personal', b.status || 'new', b.name || '', b.email || '', b.destination || '', b.period || '', b.headcount || '',
      arr(b.travel_types), arr(b.accommodations), b.vehicle || '', b.additional_request || '', b.budget || '',
      b.source || 'ai-coc-planner', b.source_request_id || '', b.recommended_product || '', b.recommended_product_id || '', b.recommendation_region || ''
    ).run();
    return json({ success: true, id });
  } catch (e) {
    return json({ success: false, error: String((e && e.message) || e) }, 400);
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!authed(request, env)) return json({ error: 'Unauthorized' }, 401);
  const res = await env.DB.prepare('SELECT * FROM quotes ORDER BY created_at DESC LIMIT 200').all();
  return json(res.results || []);
}
