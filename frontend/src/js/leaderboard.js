// Load and display leaderboard
async function loadLeaderboard() {
  try {
    const response = await fetch('http://localhost:5000/api/users/leaderboard');
    if (!response.ok) throw new Error('Failed to load leaderboard');
    
    const leaderboard = await response.json();
    const tbody = document.getElementById('leaderboardBody');
    
    if (leaderboard.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="padding: 20px; text-align: center; opacity: 0.7;">No players yet</td></tr>';
      return;
    }

    tbody.innerHTML = leaderboard.map(player => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid var(--border-color);">${player.rank}</td>
        <td style="padding: 12px; border-bottom: 1px solid var(--border-color); font-weight: 500;">${player.username}</td>
        <td style="padding: 12px; border-bottom: 1px solid var(--border-color); text-align: center; font-weight: bold;">${player.totalScore}</td>
        <td style="padding: 12px; border-bottom: 1px solid var(--border-color); text-align: center;">${player.tictactoe || 0}</td>
        <td style="padding: 12px; border-bottom: 1px solid var(--border-color); text-align: center;">${player.game2048 || 0}</td>
        <td style="padding: 12px; border-bottom: 1px solid var(--border-color); text-align: center;">${player.dino || 0}</td>
        <td style="padding: 12px; border-bottom: 1px solid var(--border-color); text-align: center;">${player.tanks || 0}</td>
        <td style="padding: 12px; border-bottom: 1px solid var(--border-color); text-align: center;">${player.sudoku || 0}</td>
      </tr>
    `).join('');
  } catch (error) {
    console.error('Leaderboard error:', error);
    const tbody = document.getElementById('leaderboardBody');
    tbody.innerHTML = '<tr><td colspan="8" style="padding: 20px; text-align: center; color: var(--error-color);">Error loading leaderboard</td></tr>';
  }
}

// Load leaderboard when page loads
document.addEventListener('DOMContentLoaded', loadLeaderboard);

// Refresh leaderboard every 30 seconds
setInterval(loadLeaderboard, 30000);
