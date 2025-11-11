import { useState } from 'react';
import { Music, Grid3x3, List } from 'lucide-react';

const TrackList = ({ topTracks, getTrackImage }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  if (!topTracks || topTracks.length === 0) return null;

  // Helper to get artist name
  const getArtistName = (track) => track.artist?.["#text"] || track.artist || "Unknown Artist";

  // Calculate total plays
  const totalPlays = topTracks.reduce((acc, track) => acc + parseInt(track.count || track.playcount || 0), 0);

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

            return (
              <div
                key={key}
                className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg hover:border-purple-500/50 transition-all group relative"
              >
                {/* Rank Badge */}
                <div className="absolute top-2 right-2 z-10 w-8 h-8 bg-purple-600/90 backdrop-blur rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                
                {/* Album Art */}
                <div className="w-full aspect-square bg-zinc-800 overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={`${track.name} album art`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <Music size={48} />
                    </div>
                  )}
                </div>
                
                {/* Track Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                    {track.name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate mt-1">
                    {artistName}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-purple-400 font-bold">
                      {parseInt(playCount).toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">plays</span>
                  </div>
                </div>
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

            return (
              <div
                key={key}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-purple-500/50 transition-all group"
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TrackList;