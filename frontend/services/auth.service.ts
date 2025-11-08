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

  const response = await fetch(`${AUTH_API_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ token })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Đăng xuất thất bại');
  }

  return response.json();
}