// File: app/api/fields/[id]/route.ts
// Proxy API cho detail, update, delete

const API_BASE_URL = process.env.ORDER_SERVICE_DOMAIN;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);

    const response = await fetch(`${API_BASE_URL}/fields/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`GET error (${response.status}):`, errorText);
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch field';
    console.error('GET /api/fields/[id] error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, message: 'Failed to fetch field' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);
    const body = await request.json();

    console.log(`PATCH /api/fields/${id}`, JSON.stringify(body));

    const response = await fetch(`${API_BASE_URL}/fields/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`PATCH error (${response.status}):`, errorText);
      throw new Error(`API responded with status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update field';
    console.error('PATCH error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, message: 'Failed to update field' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);

    console.log(`DELETE /api/fields/${id}`);

    const response = await fetch(`${API_BASE_URL}/fields/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`DELETE error (${response.status}):`, errorText);
      throw new Error(`API responded with status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete field';
    console.error('DELETE error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, message: 'Failed to delete field' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}