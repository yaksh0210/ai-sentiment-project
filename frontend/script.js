const API_BASE = "https://sentiment-backend-phbw.onrender.com";

async function analyze() {
  const review = document.getElementById("review").value.trim();
  if (!review) {
    alert("Please enter a review.");
    return;
  }

  // Show loader
  document.getElementById("loader").style.display = "block";
  document.getElementById("result").innerText = "";

  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: review })
    });

    const result = await response.json();

    const emoji = {
      positive: "😊",
      neutral: "😐",
      negative: "😢"
    };

    document.getElementById("result").innerText = 
      `Sentiment: ${result.sentiment.toUpperCase()} ${emoji[result.sentiment]}`;

    await loadStats();

  } catch (err) {
    document.getElementById("result").innerText = "Error analyzing review.";
    console.error(err);
  }

  document.getElementById("loader").style.display = "none";
}

async function loadStats() {
  const res = await fetch(`${API_BASE}/stats`);
  const stats = await res.json();

  document.getElementById("total").innerText = stats.total;
  document.getElementById("positive").innerText = stats.positive;
  document.getElementById("neutral").innerText = stats.neutral;
  document.getElementById("negative").innerText = stats.negative;

  // Bar Chart
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
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });

  // Pie Chart
  const pie = document.getElementById("pieChart").getContext("2d");
  if (window.myPieChart) window.myPieChart.destroy();
  window.myPieChart = new Chart(pie, {
    type: 'doughnut',
    data: {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [{
        data: [stats.positive, stats.neutral, stats.negative],
        backgroundColor: ['#28a745', '#6c757d', '#dc3545']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

window.onload = loadStats;
