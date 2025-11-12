const AUTH_API_URL = '/api/auth';

export async function login(email: string, password: string) {
  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng nhập thất bại');
  }

  return response.json();
}

export async function logout() {
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token, just clear storage - already logged out
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { success: true };
  }

  try {
    const response = await fetch(`${AUTH_API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({}),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    // Accept both 200 and 204 as success
    if (response.ok || response.status === 204) {
      return { success: true };
    }

    // Even if the response is not ok, attempt to parse it
    try {
      const data = await response.json();
      throw new Error(data.message || data.error || 'Đăng xuất thất bại');
    } catch (e) {
      throw new Error('Đăng xuất thất bại');
    }
  } catch (error) {
    console.warn('Logout request failed:', error instanceof Error ? error.message : 'Unknown error');
    // Even if logout fails, clear local storage so user can proceed
    return { success: true };
  }
}