const API_BASE = "https://sentiment-backend-phbw.onrender.com"; // Or your local API if testing

async function analyze() {
  const review = document.getElementById("review").value.trim();
  if (!review) {
    alert("Please enter a review.");
    return;
  }

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
    console.error("Error analyzing:", err);
    document.getElementById("result").innerText = "An error occurred.";
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
  const barCtx = document.getElementById("chart").getContext("2d");
  if (window.myChart) window.myChart.destroy();
  window.myChart = new Chart(barCtx, {
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
      scales: { y: { beginAtZero: true } }
    }
  });

  // Pie Chart
  const pieCtx = document.getElementById("pieChart").getContext("2d");
  if (window.myPieChart) window.myPieChart.destroy();
  window.myPieChart = new Chart(pieCtx, {
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

  // Line Chart (Timeline)
  if (stats.timeline) {
    const lineCtx = document.getElementById("lineChart").getContext("2d");
    if (window.myLineChart) window.myLineChart.destroy();

    const dates = stats.timeline.map(entry => entry.date);
    const pos = stats.timeline.map(entry => entry.positive);
    const neu = stats.timeline.map(entry => entry.neutral);
    const neg = stats.timeline.map(entry => entry.negative);

    window.myLineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Positive',
            data: pos,
            borderColor: '#28a745',
            fill: false,
            tension: 0.3
          },
          {
            label: 'Neutral',
            data: neu,
            borderColor: '#6c757d',
            fill: false,
            tension: 0.3
          },
          {
            label: 'Negative',
            data: neg,
            borderColor: '#dc3545',
            fill: false,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }
}

window.onload = loadStats;
