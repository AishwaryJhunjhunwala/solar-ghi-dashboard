# Solar GHI Dashboard & Data Processing Assignment

This repository contains the complete codebase and solutions for the solar Global Horizontal Irradiance (GHI) data engineering and visualization assignment. The assignment is split into three main components: data merging/consolidation, a React-based interactive dashboard, and a systems design analysis.

---

## 📂 Project Structure

```text
Pv intern task/
├── question1/                 # Data Processing (CSV Consolidation)
│   ├── src/
│   │   └── index.js           # Stream-based merging script
│   └── consolidated_GHI.csv   # Consolidated GHI dataset output
│
├── question2/                 # React & Vite Dashboard Application
│   ├── src/
│   │   ├── components/        # UI Components (GhiChart, Header, StatsPanel)
│   │   ├── App.jsx            # Main app shell and state coordination
│   │   └── App.css            # Stylesheets and dark/light variables
│   ├── preprocess.js          # CSV to JSON conversion script
│   └── README.md              # Dashboard-specific instructions
│
├── screenshots/               # Dashboard UI screenshots
├── question3.md               # Systems design & scaling strategies
└── README.md                  # Project root README (this file)
```

---

## 🛠️ Solutions Overview

### 📦 Question 1: CSV Data Consolidation
A Node.js utility script designed to process and merge nested historical CSV datasets.

* **Highlights:**
  * Utilizes Node.js stream-based file processing (`readline` and `fs.createReadStream`) to maintain low memory usage when handling large datasets.
  * Dynamically scans the nested directories chronologically (sorting year-month folders and daily files).
  * Cleans, validates, and filters headers from individual files to output a single, consistent `consolidated_GHI.csv` file.
* **How to run:**
  ```bash
  cd question1
  node src/index.js
  ```

---

### 📊 Question 2: GHI Interactive Dashboard
An interactive dashboard built with **React**, **Vite**, and **Chart.js** to visualize the GHI data.

* **Key Features:**
  * **Interactive Timeframe Selection:** Switch views between `1D`, `7D`, and `30D`.
  * **KPI Summary Cards:** Instant computation and display of Maximum, Minimum, and Average GHI values for the selected window.
  * **Dual-Theme Support:** Responsive Light and Dark mode options saved directly to LocalStorage.
  * **Interactive Charting:** Smooth line transitions, hover-triggered tooltip displays, and adaptive axis scaling.
* **How to run:**
  ```bash
  cd question2
  npm install
  node preprocess.js  # Preprocesses the consolidated CSV into optimized JSON
  npm run dev
  ```

---

### 🧠 Question 3: Thinking & System Design
A detailed technical writeup answering real-world system architecture challenges for financial market pricing feeds.

* **Key Topics Addressed:**
  * **Data Sources:** RPC nodes for on-chain events, commercial market aggregators, and internal platform transactional databases.
  * **Real-Time Pipelines:** Ingestion validation pipelines feeding into time-series databases (TimescaleDB, ClickHouse) and streaming out updates over WebSockets/SSE.
  * **Noise Reduction:** Applying spline interpolation, LTTB algorithms, adaptive labels, and zoom levels to filter noise while keeping raw values intact.
  * **Scaling to 10M Rows:** Frontend bottlenecks (memory heap exhaustion, rendering lag, network overhead) and architectural solutions (server-side pagination, on-demand loading, WebGL rendering, browser caching).
* **Read the full writeup:** [question3.md](file:///c:/Users/Hp/Desktop/Pv%20intern%20task/question3.md)
