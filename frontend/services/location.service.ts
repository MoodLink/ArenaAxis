const LOCATION_API_URL = '/api/locations';

export async function fetchGeoLocation() {
  const response = await fetch(`${LOCATION_API_URL}/geo-location`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch geo location');
  }

  return response.json();
}

export async function reversePosition(lat: number, lon: number) : Promise<any> {
  const response = await fetch(
    `${LOCATION_API_URL}/reverse?lat=${lat}&lon=${lon}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reverse geocode coordinates');
  }

  return response.json();
}