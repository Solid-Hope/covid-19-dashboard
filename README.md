# COVID-19 Early Outbreak Dashboard (Feb–Mar 2020)

## Overview
This web dashboard visualizes the early stages of the COVID-19 outbreak across various countries using data from February to March 2020. It displays key summary metrics alongside cumulative and daily new case graphs.

## Features
- **Country Selector:** Filter metrics and charts by selecting a country from the dropdown.
- **Key Metric Cards:** View Total Confirmed, Total Deaths, Total Recovered, and Active Cases.
- **Cumulative Cases (Line Chart):** Visualizes overall trends over time.
- **Daily New Cases (Bar Chart):** Displays day-to-day changes in confirmed cases.

## How to Run the Project
1. Open the project folder in VS Code.
2. Ensure `covid-19.json` is located in the root directory.
3. Launch `index.html` using the **Live Server** extension (or run `npx serve .` in the terminal).
4. Open the provided local URL in your web browser.

## Calculation Logic
- **Active Cases:** Calculated as `Total Confirmed - Total Deaths - Total Recovered`.
- **Daily New Cases:** Computed by subtracting the previous date's cumulative confirmed total from the current date's total:
  `Daily New Cases (day i) = Confirmed (day i) - Confirmed (day i - 1)`