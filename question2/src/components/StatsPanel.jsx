import React from 'react';

function StatsPanel({ stats }) {
  return (
    <section className="stats-grid" aria-label="Statistical metrics summary">
      <div className="card stat-card max">
        <span className="stat-label">Maximum GHI</span>
        <span className="stat-value">
          {stats.max.toFixed(3)}
          <span className="stat-unit">kWh/m²</span>
        </span>
        <div className="stat-meta">
          <span className="badge max">Peak Day</span>
          <span>Highest solar yield in period</span>
        </div>
      </div>

      <div className="card stat-card min">
        <span className="stat-label">Minimum GHI</span>
        <span className="stat-value">
          {stats.min.toFixed(3)}
          <span className="stat-unit">kWh/m²</span>
        </span>
        <div className="stat-meta">
          <span className="badge min">Valley Day</span>
          <span>Lowest solar yield in period</span>
        </div>
      </div>

      <div className="card stat-card avg">
        <span className="stat-label">Average GHI</span>
        <span className="stat-value">
          {stats.avg.toFixed(3)}
          <span className="stat-unit">kWh/m²</span>
        </span>
        <div className="stat-meta">
          <span className="badge avg">Mean</span>
          <span>Yield average for period</span>
        </div>
      </div>
    </section>
  );
}

export default StatsPanel;
