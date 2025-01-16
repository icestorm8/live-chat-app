# for later - using the token 
// Store the token in localStorage
localStorage.setItem('token', response.data.token);

// Send token in Authorization header for protected routes
const token = localStorage.getItem('token');
axios.get('/api/protected-route', {
  headers: { Authorization: `Bearer ${token}` },
});
