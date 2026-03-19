export async function onRequestPost(context) {
  const { word } = await context.request.json();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': context.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `You are an English vocabulary assistant for Korean learners watching Netflix dramas. Given an English word, respond ONLY with a JSON object (no markdown, no preamble): {"word":"the word","meaning_ko":"한국어 뜻 (간결하게 1-2가지)","pos":"품사 (명사/동사/형용사/부사 등)","example":"short example sentence from a drama context","example_ko":"예문 한국어 번역"}`,
      messages: [{ role: 'user', content: word }]
    })
  });

  const data = await response.json();
  const text = data.content.map(c => c.text || '').join('');
  const result = JSON.parse(text.replace(/```json|```/g, '').trim());

  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
