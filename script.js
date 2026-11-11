let lineChartInstance = null;
let barChartInstance = null;

document.addEventListener("DOMContentLoaded", () => {
  const countrySelect = document.getElementById("countrySelect");

  // Load initial country (China)
  loadDashboardData(countrySelect.value);

  // Update when country dropdown changes
  countrySelect.addEventListener("change", (e) => {
    loadDashboardData(e.target.value);
  });
});

async function loadDashboardData(selectedCountry) {
  try {
    const response = await fetch("covid-19.json");
    const jsonRoot = await response.json();

    // 1. Find the country inside the 'countries' list
    const countryObject = jsonRoot.countries.find(
      (c) => c.country.toLowerCase() === selectedCountry.toLowerCase()
    );

    if (!countryObject || !countryObject.data) {
      console.warn("No data found for country:", selectedCountry);
      return;
    }

    const timeSeries = countryObject.data;

    // 2. Extract arrays for dates, confirmed, deaths, recovered
    const dates = timeSeries.map((d) => d.date);
    const confirmed = timeSeries.map((d) => d.confirmed);
    const deaths = timeSeries.map((d) => d.deaths);
    const recovered = timeSeries.map((d) => d.recovered);

    // 3. Update summary cards with the latest totals (last entry)
    const latestConfirmed = confirmed[confirmed.length - 1] || 0;
    const latestDeaths = deaths[deaths.length - 1] || 0;
    const latestRecovered = recovered[recovered.length - 1] || 0;
    const activeCases = latestConfirmed - latestDeaths - latestRecovered;

    document.getElementById("totalConfirmed").textContent = latestConfirmed.toLocaleString();
    document.getElementById("totalDeaths").textContent = latestDeaths.toLocaleString();
    document.getElementById("totalRecovered").textContent = latestRecovered.toLocaleString();
    document.getElementById("activeCases").textContent = activeCases.toLocaleString();

    // 4. Calculate daily new cases
    const dailyNewCases = confirmed.map((val, index) => {
      if (index === 0) return val;
      const diff = val - confirmed[index - 1];
      return diff < 0 ? 0 : diff;
    });
