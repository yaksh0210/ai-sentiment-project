const API_BASE = "https://sentiment-backend-phbw.onrender.com"; 

async function analyze() {
  const review = document.getElementById("review").value.trim();
  if (!review) {
    alert("Please enter a review.");
    return;
  }

  const response = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: review })
  });

  const result = await response.json();
  document.getElementById("result").innerText = "Sentiment: " + result.sentiment;
  loadStats();
}

async function loadStats() {
  const res = await fetch(`${API_BASE}/stats`);
  const stats = await res.json();

  document.getElementById("total").innerText = stats.total;
  document.getElementById("positive").innerText = stats.positive;
  document.getElementById("neutral").innerText = stats.neutral;
  document.getElementById("negative").innerText = stats.negative;

  const ctx = document.getElementById("chart").getContext("2d");
  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [{
        label: 'Review Counts',
        data: [stats.positive, stats.neutral, stats.negative],
        backgroundColor: ['#28a745', '#6c757d', '#dc3545']
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } }
    }
  });
}

window.onload = loadStats;
