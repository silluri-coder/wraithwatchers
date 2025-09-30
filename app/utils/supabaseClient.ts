import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

interface DBSighting {
  id: number;
  sighting_date: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  notes: string;
  time_of_day: string;
  apparition_tag: string;
  image_url: string | null;
}

export async function loadSightingsData(): Promise<Sighting[]> {
  try {
    console.log('🔄 Loading sightings data from Supabase...');
    
    // First, get the total count
    const { count, error: countError } = await supabase
      .from('ghost_sightings')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('Error getting count from Supabase:', countError);
      throw countError;
    }

    console.log(`📊 Total records in database: ${count}`);

    // Fetch all records in batches (Supabase default limit is 1000)
    const PAGE_SIZE = 1000;
    const totalPages = Math.ceil((count || 0) / PAGE_SIZE);
    const allData: DBSighting[] = [];

    for (let page = 0; page < totalPages; page++) {
      const from = page * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      console.log(`🔄 Fetching records ${from} to ${to}...`);

      const { data, error } = await supabase
        .from('ghost_sightings')
        .select('*')
        .order('sighting_date', { ascending: false })
        .range(from, to);

      if (error) {
        console.error(`Error fetching page ${page + 1}:`, error);
        throw error;
      }

      if (data) {
        allData.push(...data);
      }
    }

    const sightings: Sighting[] = allData.map((row: DBSighting) => ({
      id: row.id,
      date: row.sighting_date,
      latitude: parseFloat(row.latitude as any),
      longitude: parseFloat(row.longitude as any),
      city: row.city,
      state: row.state,
      notes: row.notes,
      timeOfDay: row.time_of_day,
      apparitionType: row.apparition_tag,
      imageLink: row.image_url || undefined
    }));

    console.log('✅ Loaded', sightings.length, 'sightings from Supabase');
    return sightings;
  } catch (error) {
    console.error('Error loading sightings from Supabase:', error);
    throw error;
  }
}
