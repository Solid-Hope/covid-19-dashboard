let lineChartInstance = null;
let barChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  const countrySelect = document.getElementById("countrySelect");
  loadDashboardData(countrySelect.value);
  countrySelect.addEventListener("change", (e) => {
    loadDashboardData(e.target.value);
  });
});

async function loadDashboardData(selectedCountry) {
  try {
    const response = await fetch("covid-19.json");
    const jsonRoot = await response.json();

    const countryObject = jsonRoot.countries.find(
      (c) => c.country.toLowerCase() === selectedCountry.toLowerCase()
    );

    if (!countryObject || !countryObject.data) {
      console.warn("No data found for country:", selectedCountry);
      return;
    }

    const timeSeries = countryObject.data;

    const dates = timeSeries.map((d) => d.date);
    const confirmed = timeSeries.map((d) => d.confirmed);
    const deaths = timeSeries.map((d) => d.deaths);
    const recovered = timeSeries.map((d) => d.recovered);

    const latestConfirmed = confirmed[confirmed.length - 1] || 0;
    const latestDeaths = deaths[deaths.length - 1] || 0;
    const latestRecovered = recovered[recovered.length - 1] || 0;
    const activeCases = latestConfirmed - latestDeaths - latestRecovered;

    document.getElementById("totalConfirmed").textContent = latestConfirmed.toLocaleString();
    document.getElementById("totalDeaths").textContent = latestDeaths.toLocaleString();
    document.getElementById("totalRecovered").textContent = latestRecovered.toLocaleString();
    document.getElementById("activeCases").textContent = activeCases.toLocaleString();

    const dailyNewCases = confirmed.map((val, index) => {
      if (index === 0) return val;
      const diff = val - confirmed[index - 1];
      return diff < 0 ? 0 : diff;
    });

    renderLineChart(dates, confirmed, deaths, recovered);
    renderBarChart(dates, dailyNewCases);

  } catch (error) {
    console.error("Error loading JSON:", error);
  }
}

function renderLineChart(labels, confirmed, deaths, recovered) {
  const ctx = document.getElementById("lineChart").getContext("2d");

  if (lineChartInstance) {
    lineChartInstance.destroy();
  }

  lineChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        { label: "Confirmed", data: confirmed, borderColor: "#007bff", fill: false },
        { label: "Deaths", data: deaths, borderColor: "#dc3545", fill: false },
        { label: "Recovered", data: recovered, borderColor: "#28a745", fill: false }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: "Cumulative Cases Over Time" }
      }
    }
  });
}

function renderBarChart(labels, dailyNewCases) {
  const ctx = document.getElementById("barChart").getContext("2d");

  if (barChartInstance) {
    barChartInstance.destroy();
  }

  barChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Daily New Cases",
          data: dailyNewCases,
          backgroundColor: "#ffc107"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: "Daily New Confirmed Cases" }
      }
    }
  });
}
