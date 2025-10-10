export async function POST(req) {
  try {
    const { messages } = await req.json();

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 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',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Info492 Demo',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'z-ai/glm-4.5-air:free',
        messages: messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      return Response.json(
        { error: 'Failed to fetch from OpenRouter API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Error in chat API:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

