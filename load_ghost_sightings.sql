-- SQL script to load ghost sightings data into Supabase
-- This script creates the table and loads data from CSV format

-- Create the table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS ghost_sightings (
  id SERIAL PRIMARY KEY,
  sighting_date DATE NOT NULL,
  latitude DECIMAL(9,6) NOT NULL,
  longitude DECIMAL(9,6) NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  notes TEXT,
  time_of_day TEXT,
  apparition_tag TEXT,
  image_url TEXT, -- nullable if no image available
  created_at DATE DEFAULT CURRENT_DATE,
  updated_at DATE DEFAULT CURRENT_DATE
);

-- Insert data (you'll need to copy the CSV data and format it properly)
-- For Supabase, you can use the dashboard to import CSV or use COPY command
-- Here's the INSERT format for reference:

INSERT INTO ghost_sightings (
  sighting_date,
  latitude,
  longitude,
  city,
  state,
  notes,
  time_of_day,
  apparition_tag,
  image_url
) VALUES
('2024-12-13', 29.420517, -98.571016, 'San Antonio', 'Texas', 'Electronic devices malfunctioned during sighting.', 'Morning', 'Headless Spirit', NULL),
('2025-07-25', 30.192881, -89.90185, 'New Orleans', 'Louisiana', 'Apparition seen floating near old church grounds.', 'Afternoon', 'Poltergeist', NULL),
('2021-10-19', 29.627906, -95.431614, 'Houston', 'Texas', 'Local dog barking frantically before sighting.', 'Night', 'Poltergeist', 'https://cdn.midjourney.com/7f74bbd0-d240-4d74-bb2a-6330b163a3f6/0_2.png'),
('2021-03-19', 44.985306, -93.292082, 'Minneapolis', 'Minnesota', 'Phantom footsteps heard in empty hallway.', 'Dawn', 'Orbs', NULL),
('2025-02-27', 38.660078, -90.008209, 'St. Louis', 'Missouri', 'Apparition seen floating near old church grounds.', 'Night', 'Shadow Figure', 'https://cdn.midjourney.com/2519c7d3-5e9e-4691-8bad-a83ed41a3cb1/0_2.png'),
('2021-08-22', 38.367111, -90.453205, 'St. Louis', 'Missouri', 'Witness captured blurry image on phone.', 'Midnight', 'Shadow Figure', NULL),
('2022-03-17', 39.871272, -104.897556, 'Denver', 'Colorado', 'Apparition matched description of local legend.', 'Evening', 'White Lady', 'https://cdn.midjourney.com/c8b325d2-ed83-40b4-8825-34f61c53d744/0_1.png'),
('2024-02-10', 39.830527, -86.134163, 'Indianapolis', 'Indiana', 'Apparition seen floating near old church grounds.', 'Afternoon', 'Phantom Sounds', 'https://cdn.midjourney.com/c8b325d2-ed83-40b4-8825-34f61c53d744/0_2.png'),
('2024-10-26', 40.3666, -89.459016, 'Peoria', 'Illinois', 'Flickering streetlamp coincided with sighting.', 'Evening', 'Poltergeist', NULL),
('2022-04-26', 30.62725, -97.918376, 'Austin', 'Texas', 'Temperature dropped suddenly by 10°F.', 'Afternoon', 'White Lady', NULL);

-- Note: This is just a sample of the first 10 records
-- For the full dataset, you have several options:

-- Option 1: Use Supabase Dashboard
-- 1. Go to your Supabase project dashboard
-- 2. Navigate to Table Editor
-- 3. Select the ghost_sightings table
-- 4. Click "Insert" and choose "Import data from CSV"
-- 5. Upload your CSV file

-- Option 2: Use COPY command (if you have file access)
-- COPY ghost_sightings (sighting_date, latitude, longitude, city, state, notes, time_of_day, apparition_tag, image_url)
-- FROM '/path/to/ghost_sightings_12000_with_images.csv'
-- WITH (FORMAT csv, HEADER true, NULL '');

-- Option 3: Use a script to generate all INSERT statements
-- You can use the following Python script to convert the CSV to SQL INSERT statements:

/*
import csv
import sys

def csv_to_sql_insert(csv_file, table_name):
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        print(f"INSERT INTO {table_name} (")
        print("  sighting_date,")
        print("  latitude,")
        print("  longitude,")
        print("  city,")
        print("  state,")
        print("  notes,")
        print("  time_of_day,")
        print("  apparition_tag,")
        print("  image_url")
        print(") VALUES")
        
        rows = []
        for row in reader:
            # Handle empty image_url
            image_url = f"'{row['Image Link']}'" if row['Image Link'].strip() else 'NULL'
            
            # Escape single quotes in text fields
            notes = row['Notes about the sighting'].replace("'", "''")
            city = row['Nearest Approximate City'].replace("'", "''")
            state = row['US State'].replace("'", "''")
            time_of_day = row['Time of Day'].replace("'", "''")
            apparition_tag = row['Tag of Apparition'].replace("'", "''")
            
            rows.append(f"('{row['Date of Sighting']}', {row['Latitude of Sighting']}, {row['Longitude of Sighting']}, '{city}', '{state}', '{notes}', '{time_of_day}', '{apparition_tag}', {image_url})")
        
        print(",\n".join(rows) + ";")

# Usage: csv_to_sql_insert('ghost_sightings_12000_with_images.csv', 'ghost_sightings')
*/

-- Column mapping from CSV to database:
-- Date of Sighting -> sighting_date
-- Latitude of Sighting -> latitude  
-- Longitude of Sighting -> longitude
-- Nearest Approximate City -> city
-- US State -> state
-- Notes about the sighting -> notes
-- Time of Day -> time_of_day
-- Tag of Apparition -> apparition_tag
-- Image Link -> image_url (NULL if empty)

