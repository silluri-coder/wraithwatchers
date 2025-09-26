'use client';

import { useState } from 'react';
import { Sighting } from '../utils/csvParser';

interface SightingsTableProps {
  sightings: Sighting[];
}

export default function SightingsTable({ sightings }: SightingsTableProps) {
  const [filter, setFilter] = useState({
    apparitionType: '',
    timeOfDay: '',
    state: ''
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Get unique values for filters
  const uniqueApparitionTypes = [...new Set(sightings.map(s => s.apparitionType))];
  const uniqueTimeOfDay = [...new Set(sightings.map(s => s.timeOfDay))];
  const uniqueStates = [...new Set(sightings.map(s => s.state))];

  // Filter and sort sightings
  const filteredSightings = sightings
    .filter(sighting => {
      return (
        (filter.apparitionType === '' || sighting.apparitionType === filter.apparitionType) &&
        (filter.timeOfDay === '' || sighting.timeOfDay === filter.timeOfDay) &&
        (filter.state === '' || sighting.state === filter.state)
      );
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof Sighting];
      let bValue: any = b[sortBy as keyof Sighting];
      
      if (sortBy === 'date') {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      }
      
      // Handle undefined values
      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredSightings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSightings = filteredSightings.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilter({ apparitionType: '', timeOfDay: '', state: '' });
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Recent Sightings</h2>
        <div className="text-sm text-gray-400">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSightings.length)} of {filteredSightings.length} sightings
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          value={filter.apparitionType}
          onChange={(e) => setFilter({ ...filter, apparitionType: e.target.value })}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        >
          <option value="">All Apparition Types</option>
          {uniqueApparitionTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select
          value={filter.timeOfDay}
          onChange={(e) => setFilter({ ...filter, timeOfDay: e.target.value })}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        >
          <option value="">All Times</option>
          {uniqueTimeOfDay.map(time => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>

        <select
          value={filter.state}
          onChange={(e) => setFilter({ ...filter, state: e.target.value })}
          className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm"
        >
          <option value="">All States</option>
          {uniqueStates.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <button
          onClick={clearFilters}
          className="bg-orange-400 hover:bg-orange-500 text-black px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th 
                className="text-left py-3 px-4 cursor-pointer hover:text-orange-400 transition-colors"
                onClick={() => handleSort('date')}
              >
                Date {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-left py-3 px-4 cursor-pointer hover:text-orange-400 transition-colors"
                onClick={() => handleSort('apparitionType')}
              >
                Type {sortBy === 'apparitionType' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-left py-3 px-4 cursor-pointer hover:text-orange-400 transition-colors"
                onClick={() => handleSort('city')}
              >
                Location {sortBy === 'city' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th 
                className="text-left py-3 px-4 cursor-pointer hover:text-orange-400 transition-colors"
                onClick={() => handleSort('timeOfDay')}
              >
                Time {sortBy === 'timeOfDay' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="text-left py-3 px-4">Notes</th>
              <th className="text-left py-3 px-4">Evidence</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSightings.map((sighting) => (
              <tr key={sighting.id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                <td className="py-3 px-4 text-gray-300">{sighting.date}</td>
                <td className="py-3 px-4">
                  <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs">
                    {sighting.apparitionType}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-300">{sighting.city}, {sighting.state}</td>
                <td className="py-3 px-4 text-gray-300">{sighting.timeOfDay}</td>
                <td className="py-3 px-4 text-gray-400 max-w-xs truncate">{sighting.notes}</td>
                <td className="py-3 px-4">
                  {sighting.imageLink ? (
                    <span className="text-green-400">📷</span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>
          
          {/* Show first page if not in current range */}
          {currentPage > 6 && (
            <>
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              >
                1
              </button>
              {currentPage > 7 && <span className="px-2 text-gray-400">...</span>}
            </>
          )}
          
          {/* Show pages around current page (max 10 pages) */}
          {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
            const startPage = Math.max(1, Math.min(currentPage - 4, totalPages - 9));
            const page = startPage + i;
            
            if (page > totalPages) return null;
            
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded transition-colors ${
                  currentPage === page
                    ? 'bg-orange-400 text-black'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          {/* Show last page if not in current range */}
          {currentPage < totalPages - 5 && (
            <>
              {currentPage < totalPages - 6 && <span className="px-2 text-gray-400">...</span>}
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-gray-800 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
