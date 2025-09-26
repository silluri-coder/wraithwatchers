'use client';

interface Sighting {
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

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  description?: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-orange-400 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {description && (
            <p className="text-gray-500 text-xs mt-1">{description}</p>
          )}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}

interface SightingsStatsProps {
  sightings: Sighting[];
}

export default function SightingsStats({ sightings }: SightingsStatsProps) {
  // Calculate real statistics from the data
  const totalSightings = sightings.length;
  const activeStates = new Set(sightings.map(s => s.state)).size;
  const sightingsWithImages = sightings.filter(s => s.imageLink && s.imageLink.trim() !== '').length;
  
  // Calculate this month's sightings (assuming current year)
  const currentYear = new Date().getFullYear();
  const thisMonthSightings = sightings.filter(s => {
    const sightingDate = new Date(s.date);
    const currentDate = new Date();
    return sightingDate.getFullYear() === currentDate.getFullYear() && 
           sightingDate.getMonth() === currentDate.getMonth();
  }).length;

  const stats = [
    {
      title: "Total Sightings",
      value: totalSightings.toLocaleString(),
      icon: "👻",
      description: "Since 2020"
    },
    {
      title: "Active States",
      value: activeStates,
      icon: "🗺️",
      description: "US States covered"
    },
    {
      title: "This Month",
      value: thisMonthSightings,
      icon: "📊",
      description: "New reports"
    },
    {
      title: "With Evidence",
      value: sightingsWithImages.toLocaleString(),
      icon: "✅",
      description: "Photos available"
    }
  ];

  // Console log to confirm stats component is loading
  console.log('📊 SightingsStats component loaded with', stats.length, 'stat cards');
  console.log('📈 Real statistics calculated:', { totalSightings, activeStates, sightingsWithImages, thisMonthSightings });

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Sightings Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>
    </div>
  );
}
