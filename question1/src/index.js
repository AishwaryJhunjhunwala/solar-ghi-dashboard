import fs from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

async function mergeGhiFiles() {
  const possiblePaths = [
    'C:/Users/Hp/Downloads/GHI/GHI',
    'C:/Users/Hp/Downloads/GHI',
    './GHI'
  ];

  let rootDir = '';
  for (const p of possiblePaths) {
    try {
      const stat = await fs.stat(p);
      if (stat.isDirectory()) {
        rootDir = p;
        break;
      }
    } catch {
      // Path doesn't exist, continue searching
    }
  }

  if (!rootDir) {
    console.error('Error: GHI dataset directory not found.');
    console.error('Please make sure the "GHI" folder exists in your Downloads or workspace folder.');
    return;
  }

  const outputFile = './consolidated_GHI.csv';

  try {
    console.log(`Starting merge. Source directory: ${rootDir}`);
    console.log(`Output file: ${outputFile}`);

    // 1. Scan the GHI directory for monthly folders
    const folders = await fs.readdir(rootDir);
    
    // Sort directories to process them chronologically (e.g. 2019-07, 2019-08...)
    folders.sort();

    // 2. Open the output file and write the CSV header
    const writer = createWriteStream(outputFile);
    writer.write('Date,GHI\n');

    for (const folder of folders) {
      const folderPath = path.join(rootDir, folder);
      
      // Ensure we are processing a directory, skipping files in the root folder
      const stat = await fs.stat(folderPath);
      if (!stat.isDirectory()) continue;

      // 3. Scan for CSV files inside each folder and sort them
      const files = await fs.readdir(folderPath);
      files.sort();

      for (const file of files) {
        if (!file.endsWith('.csv')) continue;

        const filePath = path.join(folderPath, file);
        const reader = createReadStream(filePath);
        
        // Read file line-by-line using a streams interface
        const rl = readline.createInterface({
          input: reader,
          crlfDelay: Infinity
        });

        let isHeader = true;
        for await (const line of rl) {
          if (isHeader) {
            isHeader = false; // Skip the CSV header row (Date,GHI) in each file
            continue;
          }

          const cleanLine = line.trim();
          if (cleanLine === '') continue; // Skip empty rows

          // Basic validation: ensure row has exactly 2 columns and GHI is a valid number
          const columns = cleanLine.split(',');
          if (columns.length === 2 && columns[0] !== '' && !isNaN(Number(columns[1]))) {
            writer.write(cleanLine + '\n');
          }
        }
      }
    }

    writer.end();
    console.log('Finished merging GHI data successfully!');
  } catch (error) {
    console.error('An error occurred during merging:', error.message);
  }
}

mergeGhiFiles();
