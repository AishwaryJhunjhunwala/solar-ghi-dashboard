import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.jsx';
import StatsPanel from './components/StatsPanel.jsx';
import GhiChart from './components/GhiChart.jsx';
import './App.css';

function App() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('30D');
  const [anchorDate, setAnchorDate] = useState('2022-03-24');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('ghi-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      fetch('/ghi_data.json')
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setAllData(data);
          if (data.length > 0) {
            setAnchorDate(data[data.length - 1].date);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading GHI data:', err);
          setLoading(false);
        });
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const filteredData = useMemo(() => {
    if (allData.length === 0) return [];
    
    const anchorIndex = allData.findIndex((item) => item.date === anchorDate);
    if (anchorIndex === -1) return [];

    let days = 30;
    if (timeframe === '7D') days = 7;
    if (timeframe === '1D') days = 1;

    const startIndex = Math.max(0, anchorIndex - days + 1);
    return allData.slice(startIndex, anchorIndex + 1);
  }, [allData, timeframe, anchorDate]);

  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return { max: 0, min: 0, avg: 0 };
    }

    const values = filteredData.map((d) => d.ghi);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    const avgVal = sum / values.length;

    return {
      max: maxVal,
      min: minVal,
      avg: avgVal
    };
  }, [filteredData]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('ghi-theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div className="app-container">
      <Header theme={theme} onToggleTheme={toggleTheme} />
      
      <StatsPanel stats={stats} />

      <main className="main-content">
        <GhiChart
          filteredData={filteredData}
          loading={loading}
          timeframe={timeframe}
          onChangeTimeframe={setTimeframe}
          anchorDate={anchorDate}
          onChangeAnchorDate={setAnchorDate}
          stats={stats}
          theme={theme}
        />
      </main>
    </div>
  );
}

export default App;
