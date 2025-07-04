// src/utils/auth.js
export function getCSRFToken() {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
}

export async function ensureCSRF() {
  await fetch('http://localhost:8000/api/csrf/', {
    credentials: 'include',
  });
}