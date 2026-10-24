import { getStore } from '@netlify/blobs';

export default async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { text1, text2 } = await request.json();
    if (typeof text1 !== 'string' || typeof text2 !== 'string') {
      return Response.json({ error: '문자열 2개가 필요합니다.' }, { status: 400 });
    }
    const store = getStore('test-submissions');
    const id = crypto.randomUUID();
    await store.setJSON(id, { text1, text2, createdAt: new Date().toISOString() });
    return Response.json({ ok: true, id });
  } catch (error) {
    console.error(error);
    return Response.json({ error: '저장 실패' }, { status: 500 });
  }
};
