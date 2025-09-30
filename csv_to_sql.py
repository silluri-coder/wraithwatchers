#!/usr/bin/env python3
"""
Script to convert ghost_sightings CSV to SQL INSERT statements
Usage: python csv_to_sql.py > ghost_sightings_insert.sql
"""

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

if __name__ == "__main__":
    csv_file = "public/data/ghost_sightings_12000_with_images.csv"
    table_name = "ghost_sightings"
    csv_to_sql_insert(csv_file, table_name)

