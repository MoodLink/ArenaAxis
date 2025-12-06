const AUTH_API_URL = '/api/auth';

export async function validate() {
  const token = localStorage.getItem('token');

  if (!token) {
    return false;
  }

  const response = await fetch(`${AUTH_API_URL}/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({})
  });

  if (!response.ok) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }

  return true;
}

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

  const data = await response.json();
  localStorage.setItem('token', data.token);
  document.cookie = `token=${data.token}; path=/;`;

  // Lưu user data vào localStorage
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  return data;
}

export async function logout() {
  const token = localStorage.getItem('token');

  if (!token) {
    // If no token, just clear storage - already logged out
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    return { success: true };
  }

  try {
    const response = await fetch(`${AUTH_API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({})
    });

    if (response.ok || response.status === 204) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
      return { success: true };
    }

  } catch (error) {
    console.warn('Logout request failed:', error instanceof Error ? error.message : 'Unknown error');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
    return { success: true };
  }
  return true;
}

export async function refresh() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${AUTH_API_URL}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Refresh token thất bại');
  }

  const data = await response.json();
  localStorage.setItem('token', data.token);

  return data;
}