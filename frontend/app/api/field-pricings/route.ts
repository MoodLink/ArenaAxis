// File: app/api/field-pricings/route.ts
// Proxy API for field pricing management

// Dùng backend local khi dev, production khi deploy
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://arena-axis.vercel.app/api/v1';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fieldId = searchParams.get('field_id');

    if (!fieldId) {
      return new Response(
        JSON.stringify({ error: 'field_id is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 🎯 Call backend endpoint that returns pricings by day
    console.log(`[PROXY] Fetching pricings for field ${fieldId}...`);
    const response = await fetch(`${API_BASE_URL}/field-pricings/${fieldId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`[PROXY] Backend returned ${response.status}`);
      return new Response(
        JSON.stringify({ message: 'Field not found', data: [] }),
        { status: response.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const backendData = await response.json();
    console.log(`[PROXY] Got backend response:`, JSON.stringify(backendData).substring(0, 200));

    // 🎯 NORMALIZE: Convert backend format to flat array
    // Backend: { pricings: { monday: [...], thursday: [...], ... } }
    // Frontend expects: [ { dayOfWeek, specialPrice, startAt, endAt }, ... ]
    // Also convert time strings "17:00" to { hour, minute } objects

    const pricingsByDay = backendData.data?.pricings || {};
    const normalizedPricings: any[] = [];

    // Helper to parse time string "17:00" to { hour, minute }
    const parseTime = (timeStr: string) => {
      const [hour, minute] = timeStr.split(':').map(Number);
      return { hour, minute };
    };

    Object.entries(pricingsByDay).forEach(([day, priceList]: [string, any]) => {
      if (Array.isArray(priceList)) {
        priceList.forEach((price: any) => {
          normalizedPricings.push({
            dayOfWeek: day,
            specialPrice: price.specialPrice,
            startAt: parseTime(price.startAt),   // Convert "17:00" → { hour: 17, minute: 0 }
            endAt: parseTime(price.endAt),       // Convert "19:30" → { hour: 19, minute: 30 }
          });
        });
      }
    });

    console.log(`[PROXY] Normalized ${normalizedPricings.length} pricings`);

    return new Response(
      JSON.stringify({ message: 'Success', data: normalizedPricings }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch field pricings';
    console.error('GET /api/field-pricings error:', errorMessage);
    // Return empty array instead of error to allow app to continue
    return new Response(
      JSON.stringify({ message: 'No pricings found', data: [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(`${API_BASE_URL}/field-pricings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Backend error (${response.status}):`, errorText);
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
    const errorMessage = error instanceof Error ? error.message : 'Failed to create field pricing';
    console.error('POST /api/field-pricings error:', errorMessage);
    return new Response(
      JSON.stringify({ error: errorMessage, message: 'Failed to create field pricing' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
