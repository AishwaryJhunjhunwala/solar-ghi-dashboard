import React, { useEffect, useRef, useState } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function GhiChart({
  filteredData,
  loading,
  timeframe,
  onChangeTimeframe,
  anchorDate,
  onChangeAnchorDate,
  stats,
  theme
}) {
  const [highlightPeaks, setHighlightPeaks] = useState(true);
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (filteredData.length === 0 || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const labels = filteredData.map((d) => {
      const [year, month, day] = d.date.split('-');
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const values = filteredData.map((d) => d.ghi);

    // Calculate max and min indices for peak highlights
    let maxIdx = -1;
    let minIdx = -1;
    if (filteredData.length > 1) {
      let maxVal = -Infinity;
      let minVal = Infinity;
      values.forEach((val, idx) => {
        if (val > maxVal) { maxVal = val; maxIdx = idx; }
        if (val < minVal) { minVal = val; minIdx = idx; }
      });
    }

    const isDark = theme === 'dark';
    const accentColor = '#ef4444';
    const gridColor = isDark ? '#1e293b' : '#e2e8f0';

    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.2)');
    gradient.addColorStop(1, 'rgba(239, 68, 68, 0.0)');

    const config = {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'GHI',
            data: values,
            borderColor: accentColor,
            borderWidth: 3,
            backgroundColor: gradient,
            fill: true,
            tension: 0.0,
            // Scriptable options for clean peak highlighting
            pointRadius: (context) => {
              if (filteredData.length <= 1) return 5;
              if (!highlightPeaks) return 3;
              const idx = context.dataIndex;
              return (idx === maxIdx || idx === minIdx) ? 7 : 0;
            },
            pointBackgroundColor: (context) => {
              if (!highlightPeaks) return accentColor;
              const idx = context.dataIndex;
              if (idx === maxIdx) return '#22c55e'; // Green for Peak Max
              if (idx === minIdx) return '#facc15'; // Yellow for Valley Min
              return accentColor;
            },
            pointBorderColor: isDark ? '#0f131a' : '#ffffff',
            pointBorderWidth: 2,
            pointHoverRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const val = context.parsed.y;
                let text = `GHI: ${val.toFixed(3)} kWh/m²/day`;
                
                if (stats.avg > 0) {
                  const diff = ((val - stats.avg) / stats.avg) * 100;
                  text += ` (${diff >= 0 ? '+' : ''}${diff.toFixed(1)}% vs Avg)`;
                }

                if (highlightPeaks && filteredData.length > 1) {
                  if (context.dataIndex === maxIdx) text += ' ⚡ PEAK MAX';
                  if (context.dataIndex === minIdx) text += ' ❄️ VALLEY MIN';
                }
                return text;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false }
          },
          y: {
            grid: { color: gridColor },
            title: {
              display: true,
              text: 'GHI (kWh/m²/day)'
            }
          }
        }
      }
    };

    chartInstanceRef.current = new Chart(ctx, config);

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [filteredData, theme, highlightPeaks, stats.avg]);

  return (
    <section className="card chart-card" aria-label="GHI Time series chart">
      <div className="chart-header">
        <div className="chart-title-section">
          <h2 className="chart-title">Solar Radiation Time Series</h2>
          <span className="chart-subtitle">
            Leading up to {anchorDate} ({filteredData.length} records)
          </span>
        </div>
        
        <div className="chart-controls-group">
          <div className="date-selector-group">
            <label className="date-selector-label" htmlFor="anchorDateInput">Date:</label>
            <input 
              type="date"
              id="anchorDateInput"
              className="datepicker-input"
              value={anchorDate}
              min="2019-07-01"
              max="2022-03-24"
              onChange={(e) => {
                if (e.target.value) onChangeAnchorDate(e.target.value);
              }}
            />
          </div>

          <label className="peaks-toggle-label">
            <input 
              type="checkbox"
              id="highlightPeaksCheck"
              className="peaks-toggle-checkbox"
              checked={highlightPeaks}
              onChange={(e) => setHighlightPeaks(e.target.checked)}
            />
            <span className="peaks-toggle-text">Highlight Peaks</span>
          </label>

          <div className="timeframe-group" role="group" aria-label="Timeframe filter">
            {['1D', '7D', '30D'].map((tf) => (
              <button 
                key={tf}
                className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => onChangeTimeframe(tf)}
              >
                {tf === '1D' ? '1 Day' : tf === '7D' ? '7 Days' : '30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-container">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner" aria-label="Loading data"></div>
          </div>
        )}
        <canvas ref={canvasRef} id="ghiChart"></canvas>
      </div>
    </section>
  );
}

export default GhiChart;
