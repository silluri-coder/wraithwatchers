export default function About() {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-[1920px] mx-auto px-6 sm:px-12 py-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            About WraithWatchers
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Documenting the unexplained, one sighting at a time
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Our Mission</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-300 text-lg leading-relaxed mb-6 text-center">
              WraithWatchers is dedicated to creating the most comprehensive database of paranormal 
              sightings across the United States. We believe that by collecting and analyzing these 
              experiences, we can better understand the unexplained phenomena that occur around us.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed text-center">
              Our platform allows users to report their encounters, explore patterns in paranormal 
              activity, and connect with others who have experienced similar phenomena.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-white mb-3">Interactive Map</h3>
              <p className="text-gray-400">
                Explore thousands of sightings on our interactive map with advanced clustering 
                technology for smooth navigation.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-white mb-3">Data Analysis</h3>
              <p className="text-gray-400">
                View statistics and patterns in paranormal activity across different states, 
                times, and apparition types.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">👻</div>
              <h3 className="text-xl font-bold text-white mb-3">Categorization</h3>
              <p className="text-gray-400">
                Sightings are classified by type including shadow figures, poltergeists, orbs, 
                and full-body apparitions.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 text-center">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-white mb-3">User Reports</h3>
              <p className="text-gray-400">
                Anyone can contribute to our database by submitting their own paranormal 
                experiences through our reporting system.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="bg-gradient-to-r from-orange-900/30 to-gray-900 border border-orange-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-400 mb-2">12,000+</div>
              <div className="text-gray-300 text-lg">Sightings</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-400 mb-2">50</div>
              <div className="text-gray-300 text-lg">States</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-400 mb-2">7</div>
              <div className="text-gray-300 text-lg">Apparition Types</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-orange-400 mb-2">24/7</div>
              <div className="text-gray-300 text-lg">Monitoring</div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Get Involved</h2>
          <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
            Have you experienced something unexplainable? Share your story with our community.
          </p>
          <a 
            href="/report" 
            className="inline-block bg-orange-400 hover:bg-orange-500 text-black font-medium px-8 py-3 text-lg rounded transition-colors"
          >
            Report a Sighting
          </a>
        </div>
      </div>
    </div>
  );
}
