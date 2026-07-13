import fs from 'fs';
import path from 'path';

// Paths
const csvFilePath = path.join('..', 'question1', 'consolidated_GHI.csv');
const publicDir = path.join('public');
const jsonFilePath = path.join(publicDir, 'ghi_data.json');

try {
  console.log(`Reading CSV data from: ${csvFilePath}`);
  const csvData = fs.readFileSync(csvFilePath, 'utf-8');
  
  const lines = csvData.split(/\r?\n/);
  const result = [];
  
  // Skip header: Date, GHI
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const [date, ghiStr] = line.split(',');
    if (!date || !ghiStr) continue;
    
    const ghi = parseFloat(ghiStr);
    if (isNaN(ghi)) continue;
    
    result.push({ date, ghi });
  }
  
  // Ensure public directory exists
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(jsonFilePath, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`Successfully generated JSON GHI data at: ${jsonFilePath}`);
  console.log(`Total records processed: ${result.length}`);
} catch (error) {
  console.error('Error preprocessing GHI CSV data:', error.message);
  process.exit(1);
}
