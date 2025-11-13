const API_BASE_URL = `${process.env.USER_SERVICE_DOMAIN}/auth`;

export async function POST(request: Request) {
  const headers = { 'Content-Type': 'application/json' }

  try {
    const body = await request.json();
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(`Login error (${response.status}):${data}`);
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers,
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to login';
    console.error('Login error:', errorMessage);
    return new Response(
      JSON.stringify({ message: errorMessage, error: 'Internal Server Error' }),
      { status: 500, headers }
    );
  }
}
