const API_BASE = "https://sentiment-backend-phbw.onrender.com";

async function analyze() {
  const reviewInput = document.getElementById("review");
  const analyzeBtn = document.querySelector("button");
  const loader = document.getElementById("loader");
  const result = document.getElementById("result");

  const review = reviewInput.value.trim();
  if (!review) {
    alert("Please enter a review.");
    return;
  }

  // Disable analyze button and show loader while processing
  analyzeBtn.disabled = true;
  loader.style.display = "block";
  result.innerText = "";

  try {
    const response = await fetch(`${API_BASE}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: review })
    });

    const data = await response.json();

    const emoji = {
      positive: "😊",
      neutral: "😐",
      negative: "😢"
    };

    // Show result with sentiment and emoji
    result.innerText = `Sentiment: ${data.sentiment.toUpperCase()} ${emoji[data.sentiment]}`;

    // Reload stats and charts
    await loadStats();

  } catch (error) {
    result.innerText = "Error analyzing review.";
    console.error(error);
  }

  // Re-enable button and hide loader
  analyzeBtn.disabled = false;
  loader.style.display = "none";
}

async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/stats`);
    const stats = await res.json();

    // Update stats numbers
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
        },
        animation: { duration: 600 }
      }
    });

    // Pie Chart
    // const pieCtx = document.getElementById("pieChart").getContext("2d");
    // if (window.myPieChart) window.myPieChart.destroy();
    // window.myPieChart = new Chart(pieCtx, {
    //   type: 'doughnut',
    //   data: {
    //     labels: ['Positive', 'Neutral', 'Negative'],
    //     datasets: [{
    //       data: [stats.positive, stats.neutral, stats.negative],
    //       backgroundColor: ['#28a745', '#6c757d', '#dc3545']
    //     }]
    //   },
    //   options: {
    //     responsive: true,
    //     plugins: { legend: { position: 'bottom' } },
    //     animation: { duration: 600 }
    //   }
    // });

  } catch (error) {
    console.error("Failed to load stats", error);
  }
}

window.onload = loadStats;
