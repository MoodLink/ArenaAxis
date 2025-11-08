// File: app/api/field-pricings/[id]/route.ts
// Proxy API for field pricing detail, update, delete

const API_BASE_URL = process.env.ORDER_SERVICE_DOMAIN;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await Promise.resolve(params);

    const response = await fetch(`${API_BASE_URL}/field-pricings/${id}`, {
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
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch field pricing';
    console.error('GET /api/field-pricings/[id] error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, message: 'Failed to fetch field pricing' }),
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

    console.log(`PATCH /api/field-pricings/${id}`, JSON.stringify(body));

    const response = await fetch(`${API_BASE_URL}/field-pricings/${id}`, {
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
    const errorMessage = error instanceof Error ? error.message : 'Failed to update field pricing';
    console.error('PATCH error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, message: 'Failed to update field pricing' }),
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

    console.log(`DELETE /api/field-pricings/${id}`);

    const response = await fetch(`${API_BASE_URL}/field-pricings/${id}`, {
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
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete field pricing';
    console.error('DELETE error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, message: 'Failed to delete field pricing' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
