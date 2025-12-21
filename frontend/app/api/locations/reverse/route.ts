const REVERSE_API_URL = 'https://nominatim.openstreetmap.org/reverse?format=json';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return new Response('Missing lat or lon parameter', { status: 400 });
    }

    const url = `${REVERSE_API_URL}&lat=${lat}&lon=${lon}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Reverse geocoding service responded with status: ${response.status}`);
    }
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('Reverse geocoding API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch location data' }), { status: 500 });
  }
}