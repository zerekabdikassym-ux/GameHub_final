
function getUsers() {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
}

function getCurrentUser() {
  return localStorage.getItem('currentUser');
}

function setCurrentUser(email) {
  localStorage.setItem('currentUser', email);
}

// Submit score to backend
async function submitScore(game, score) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found, score not submitted');
      return false;
    }

    const response = await fetch(`http://localhost:5000/api/users/score/${game}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ score: parseInt(score) })
    });

    if (!response.ok) {
      console.error('Failed to submit score:', response.statusText);
      return false;
    }

    console.log(`Score submitted for ${game}: ${score}`);
    return true;
  } catch (error) {
    console.error('Error submitting score:', error);
    return false;
  }
}
