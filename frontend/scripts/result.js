// frontend/scripts/result.js
if (document.getElementById('result-card')) {
  if (!getToken()) {
    showAlert('You must login first');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } else {
    async function loadAllResults() {
      try {
        const res = await fetch(`${API_BASE}/quiz/results/me`, {
          headers: authHeader()
        });

        const data = await res.json();
        const scoreHeading = document.getElementById('score-heading');
        const scoreDetails = document.getElementById('score-details');

        if (data.results && data.results.length > 0) {
          const latest = data.results[0];

          scoreHeading.textContent = `Latest Attempt: ${latest.score}/${latest.totalQuestions}`;

          scoreDetails.innerHTML = `
            <p><strong>All attempts (${data.results.length}):</strong></p>
            <ul style="margin-top:10px; padding-left:20px;">
              ${data.results
                .map(
                  r => `
                    <li style="margin-bottom:8px;">
                      ${r.score}/${r.totalQuestions}
                      (${new Date(r.createdAt).toLocaleString()})
                    </li>
                  `
                )
                .join('')}
            </ul>
          `;
        } else {
          scoreHeading.textContent = 'No quiz attempts found.';
          scoreDetails.textContent = 'Take a quiz first!';
        }
      } catch (err) {
        console.error(err);
        scoreHeading.textContent = 'Error loading results';
        scoreDetails.textContent = 'Could not fetch quiz attempts.';
      }
    }

    loadAllResults();

    document.getElementById('restart-btn').addEventListener('click', () => {
      window.location.href = 'quiz.html';
    });

    document.getElementById('home-btn').addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
}
