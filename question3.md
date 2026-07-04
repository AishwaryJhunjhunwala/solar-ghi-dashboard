# Question 3: Thinking & System Design

### 1. What data sources are likely used to generate this red time-series?
The red price chart for STRC is likely powered by live financial feed APIs. In a standard setup, this data comes from:
- **Exchange APIs:** Direct feeds from the trading platforms or exchanges where the asset is listed.
- **Market Data Aggregators:** Commercial APIs like Bloomberg, Polygon.io, or Twelve Data that compile feeds from multiple sources.
- **Internal Databases:** If the platform hosts the trading pairs directly, it will use its own transaction databases.

The raw feed payload typically includes: timestamp, price, Open/High/Low/Close (OHLC), volume, and asset metadata.

---

### 2. How could this data be processed and updated in near real-time?
A typical low-latency streaming pipeline works as follows:
- **Ingestion & Validation:** A backend service ingests incoming ticks, standardizes the timestamps, filters out duplicates/anomalies, and saves them to a time-series database (like TimescaleDB, ClickHouse, or InfluxDB).
- **Live Distribution:** Instead of the frontend polling the server, the backend pushes new updates to clients in real-time using a persistent connection like **WebSockets** or **Server-Sent Events (SSE)**.
- **Frontend Updates:** The React app listens to the socket stream, appends new price ticks to its local state, and updates the chart line dynamically.

---

### 3. If you were asked to reduce visual noise without changing the raw data, what techniques would you apply and why?
- **Spline Interpolation:** Use smooth curves rather than sharp, jagged lines to make the macro trend easier to follow.
- **Interactive Tooltips:** Keep individual coordinate markers and text hidden by default, revealing exact numbers only when a user hovers over the line.
- **Zoom & Pan Controls:** Allow users to isolate specific time frames, spreading out dense clusters of data points.
- **Adaptive Axis Labels:** Reduce X-axis tick frequency automatically on smaller screens to prevent text overlap.
- **Highlight Extremes:** Display visual badges only for the most important data points, such as the highest, lowest, and latest price.

---

### 4. If the dataset grows to 10 million rows:

#### What breaks in the frontend?
- **Browser Crashes (OOM):** Storing 10 million JavaScript objects in memory will exhaust the browser's heap, freezing or crashing the tab.
- **UI Render Lag:** Charting engines that rely on SVG/DOM elements will freeze up if they try to render millions of nodes at once.
- **Network Timeouts:** The raw payload size for 10 million rows would be hundreds of megabytes, causing massive download latency and timeouts.

#### How would you fix it?
- **Server-Side Filtering:** Query and return only the specific date range currently in view using API query parameters (e.g., `?start=date&end=date`).
- **Server-Side Aggregation:** Let the database aggregate raw ticks into daily/hourly averages for wide timeframes so the client only downloads around 1,000 points.
- **Level of Detail (LOD):** Dynamically load coarser data when zoomed out (e.g., weekly averages for a 5-year chart) and fine-grained data when zooming in.
- **Lazy Loading:** Load historical segments incrementally as the user pans left.
- **Canvas or WebGL Charting:** Use performance-focused charting libraries (like uPlot or lightweight-charts) that render to Canvas/WebGL instead of rendering SVG elements.
- **Client Caching:** Cache fetched time windows locally in memory so navigating back and forth doesn't trigger redundant network requests.
