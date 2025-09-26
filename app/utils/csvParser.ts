import Papa from 'papaparse';

export interface Sighting {
  id: number;
  date: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  notes: string;
  timeOfDay: string;
  apparitionType: string;
  imageLink?: string;
}

export async function loadSightingsData(): Promise<Sighting[]> {
  try {
    const response = await fetch('/data/ghost_sightings_12000_with_images.csv');
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<any>) => {
          try {
            const sightings: Sighting[] = results.data.map((row: any, index: number) => ({
              id: index + 1,
              date: row['Date of Sighting'] || '',
              latitude: parseFloat(row['Latitude of Sighting']) || 0,
              longitude: parseFloat(row['Longitude of Sighting']) || 0,
              city: row['Nearest Approximate City'] || '',
              state: row['US State'] || '',
              notes: row['Notes about the sighting'] || '',
              timeOfDay: row['Time of Day'] || '',
              apparitionType: row['Tag of Apparition'] || '',
              imageLink: row['Image Link'] || ''
            })).filter((sighting: Sighting) => 
              sighting.latitude !== 0 && 
              sighting.longitude !== 0 && 
              sighting.date && 
              sighting.city && 
              sighting.state
            );
            
            console.log('📊 Loaded', sightings.length, 'sightings from CSV');
            resolve(sightings);
          } catch (error: any) {
            console.error('Error processing CSV data:', error);
            reject(error);
          }
        },
        error: (error: any) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error loading CSV file:', error);
    throw error;
  }
}
