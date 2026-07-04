# GHI Visualization Dashboard

A modern, responsive, and interactive web application built with **React**, **Vite**, and **Chart.js** to visualize Global Horizontal Irradiance (GHI) historical timeseries data.

## 🚀 Features

- **Interactive Timeframe Selection:** Easily toggle between `1D` (Daily), `7D` (Weekly), and `30D` (Monthly) views of GHI data.
- **Dynamic Anchor Date Selection:** Pick any historical date from the dataset as the reference point to look backward in time.
- **Real-Time Key Metrics:** Displays computed metrics for the selected time window (Maximum, Minimum, and Average GHI) instantly.
- **Theme Customization:** Toggle between elegant Dark and clean Light modes, with your preference automatically persisted in LocalStorage.
- **Rich Visualization:** Smooth chart transitions, customized tooltips, and interactive legends powered by Chart.js.
- **Data Preprocessing:** Includes a dedicated Node.js utility script to parse raw CSV records and output optimized JSON datasets.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tooling:** Vite
- **Data Visualization:** Chart.js
- **Styling:** CSS3 Variables (Custom Properties) for theme tokens

---

## 📂 Project Structure

```text
question2/
├── public/                 # Static assets
│   └── ghi_data.json       # Preprocessed GHI JSON dataset
├── src/
│   ├── components/
│   │   ├── GhiChart.jsx    # Chart container & configuration
│   │   ├── Header.jsx      # Navigation, title, and theme toggle
│   │   └── StatsPanel.jsx  # KPI summary cards (Max, Min, Avg)
│   ├── App.jsx             # Main application state and orchestration
│   ├── App.css             # Main styling, typography, and theme definitions
│   └── main.jsx            # React application entrypoint
├── preprocess.js           # CSV to JSON conversion script
├── package.json            # NPM configuration and dependencies
└── vite.config.js          # Vite custom config
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
Ensure you have **Node.js** (v16+) and **npm** installed on your system.

### 2. Install Dependencies
Navigate to the `question2` directory and install the required modules:
```bash
npm install
```

### 3. Preprocess the Data
Run the preprocessing script to parse the raw CSV data into a JSON format used by the application:
```bash
node preprocess.js
```
*Note: The script expects the source CSV at `../pv task/consolidated_GHI.csv`.*

### 4. Run Development Server
Start the local server with hot-reload enabled:
```bash
npm run dev
```
Open your browser and navigate to the local address displayed in the terminal (typically `http://localhost:5173`).

### 5. Build for Production
To generate optimized production build assets in the `/dist` directory:
```bash
npm run build
```
