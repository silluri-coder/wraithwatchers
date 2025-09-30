export default function About() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About WraithWatchers
          </h1>
          <p className="text-xl text-gray-400">
            Documenting the unexplained, one sighting at a time
          </p>
        </div>

        {/* Mission */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            WraithWatchers is dedicated to creating the most comprehensive database of paranormal 
            sightings across the United States. We believe that by collecting and analyzing these 
            experiences, we can better understand the unexplained phenomena that occur around us.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Our platform allows users to report their encounters, explore patterns in paranormal 
            activity, and connect with others who have experienced similar phenomena.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-3xl mb-3">🗺️</div>
            <h3 className="text-xl font-bold text-white mb-2">Interactive Map</h3>
            <p className="text-gray-400">
              Explore thousands of sightings on our interactive map with advanced clustering 
              technology for smooth navigation.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-xl font-bold text-white mb-2">Data Analysis</h3>
            <p className="text-gray-400">
              View statistics and patterns in paranormal activity across different states, 
              times, and apparition types.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-3xl mb-3">👻</div>
            <h3 className="text-xl font-bold text-white mb-2">Categorization</h3>
            <p className="text-gray-400">
              Sightings are classified by type including shadow figures, poltergeists, orbs, 
              and full-body apparitions.
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-xl font-bold text-white mb-2">User Reports</h3>
            <p className="text-gray-400">
              Anyone can contribute to our database by submitting their own paranormal 
              experiences through our reporting system.
            </p>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-orange-900/30 to-gray-900 border border-orange-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">12,000+</div>
              <div className="text-gray-300">Sightings</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">50</div>
              <div className="text-gray-300">States</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">7</div>
              <div className="text-gray-300">Apparition Types</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-300">Monitoring</div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Get Involved</h2>
          <p className="text-gray-300 mb-6">
            Have you experienced something unexplainable? Share your story with our community.
          </p>
          <a 
            href="/report" 
            className="inline-block bg-orange-400 hover:bg-orange-500 text-black font-medium px-8 py-3 rounded transition-colors"
          >
            Report a Sighting
          </a>
        </div>
      </div>
    </div>
  );
}
