import { useState, useEffect } from 'react';
import { Music, Grid3x3, List, ChevronDown, ChevronUp } from 'lucide-react';
import { useTrackPlayHistory } from '../hooks/useTrackPlayHistory';
import PlayHistoryGraph from './PlayHistoryGraph';

const TrackList = ({ topTracks, getTrackImage, apiKey, username, startDate, endDate }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [expandedTrackKey, setExpandedTrackKey] = useState(null);

  const { playHistory, loading: historyLoading, error: historyError, fetchTrackHistory } =
    useTrackPlayHistory(apiKey, username);
  
  if (!topTracks || topTracks.length === 0) return null;

  // Helper to get artist name
  const getArtistName = (track) => track.artist?.["#text"] || track.artist || "Unknown Artist";

  // Calculate total plays
  const totalPlays = topTracks.reduce((acc, track) => acc + parseInt(track.count || track.playcount || 0), 0);

  // Handle track click
  const handleTrackClick = (track, index) => {
    const artistName = getArtistName(track);
    const key = `${track.name}-${artistName}-${index}`;

    // Toggle expansion
    if (expandedTrackKey === key) {
      setExpandedTrackKey(null);
    } else {
      setExpandedTrackKey(key);
      // Fetch play history for this track
      fetchTrackHistory(track.name, artistName, startDate, endDate);
    }
  };

  return (
    <div>
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-6 mt-6">
        <h2 className="text-2xl font-semibold text-gray-200">
          Top Tracks
          <span className="text-sm text-gray-500 ml-3 font-normal">
            {topTracks.length} tracks • {totalPlays.toLocaleString()} total plays
          </span>
        </h2>
        
        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid' 
                ? 'bg-purple-600 text-white' 
                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
            title="Grid View"
          >
            <Grid3x3 size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list' 
                ? 'bg-purple-600 text-white' 
                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
            }`}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topTracks.map((track, index) => {
            const artistName = getArtistName(track);
            const key = `${track.name}-${artistName}-${index}`;
            const imageUrl = getTrackImage(track);
            const playCount = track.count || track.playcount || 0;
            const isExpanded = expandedTrackKey === key;

            return (
              <div key={key} className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
                <div
                  onClick={() => handleTrackClick(track, index)}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg hover:border-purple-500/50 transition-all group relative cursor-pointer"
                >
                  {/* Rank Badge */}
                  <div className="absolute top-2 right-2 z-10 w-8 h-8 bg-purple-600/90 backdrop-blur rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>

                  {/* Expand/Collapse Icon */}
                  <div className="absolute top-2 left-2 z-10 w-8 h-8 bg-zinc-800/90 backdrop-blur rounded-full flex items-center justify-center">
                    {isExpanded ? <ChevronUp size={20} className="text-purple-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                  </div>

                  <div className="flex items-center">
                    {/* Album Art */}
                    <div className="w-24 h-24 bg-zinc-800 overflow-hidden flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${track.name} album art`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Music size={32} />
                        </div>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="p-4 flex-1">
                      <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                        {track.name}
                      </h3>
                      <p className="text-sm text-gray-400 truncate mt-1">
                        {artistName}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-purple-400 font-bold text-lg">
                          {parseInt(playCount).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500">plays</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Play History Graph */}
                {isExpanded && (
                  <div className="mt-2 mb-2">
                    <PlayHistoryGraph
                      data={playHistory}
                      loading={historyLoading}
                      error={historyError}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-2">
          {topTracks.map((track, index) => {
            const artistName = getArtistName(track);
            const key = `${track.name}-${artistName}-${index}`;
            const imageUrl = getTrackImage(track);
            const playCount = track.count || track.playcount || 0;
            const isExpanded = expandedTrackKey === key;

            return (
              <div key={key}>
                <div
                  onClick={() => handleTrackClick(track, index)}
                  className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-purple-500/50 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className="text-2xl font-bold text-gray-600 w-10 text-center group-hover:text-purple-400 transition-colors">
                      {index + 1}
                    </div>

                    {/* Album Art */}
                    <div className="w-16 h-16 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0 shadow-lg">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`${track.name} album art`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Music size={24} />
                        </div>
                      )}
                    </div>

                    {/* Track Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                        {track.name}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">
                        {artistName}
                      </p>
                    </div>

                    {/* Play Count */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400">
                        {parseInt(playCount).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">plays</div>
                    </div>

                    {/* Expand/Collapse Icon */}
                    <div className="flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp size={24} className="text-purple-400" />
                      ) : (
                        <ChevronDown size={24} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Play History Graph */}
                {isExpanded && (
                  <div className="mt-2 mb-2">
                    <PlayHistoryGraph
                      data={playHistory}
                      loading={historyLoading}
                      error={historyError}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackList;