import React from 'react';
import { Music, Grid3x3, List } from 'lucide-react';

const TracksView = ({ tracks, trackImages, getTrackImage }) => {
  const [viewMode, setViewMode] = React.useState('grid'); // 'grid' or 'list'

  return (
    <div>
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-200">
          Top Tracks
          <span className="text-sm text-gray-500 ml-3 font-normal">
            {tracks.length} tracks • {tracks.reduce((acc, t) => acc + parseInt(t.playcount), 0).toLocaleString()} total plays
          </span>
        </h2>
        
        {/* View Mode Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid' 
                ? 'bg-purple-600 text-white' 
                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white'
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
                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800 hover:text-white'
            }`}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((track, index) => {
            const trackImage = getTrackImage(track);
            return (
              <div
                key={`${track.name}-${track.artist?.name || track.artist}-${index}`}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-purple-500/50 transition-all group relative overflow-hidden"
              >
                {/* Background gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative">
                  {/* Rank Badge */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  
                  {/* Album Art */}
                  <div className="w-full aspect-square bg-zinc-800 rounded-lg overflow-hidden mb-3">
                    {trackImage ? (
                      <img
                        src={trackImage}
                        alt={track.name}
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
                  <div className="space-y-1">
                    <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                      {track.name}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">
                      {track.artist?.name || track.artist}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-purple-400 font-bold">
                        {parseInt(track.playcount).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">plays</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {tracks.map((track, index) => {
            const trackImage = getTrackImage(track);
            return (
              <div
                key={`${track.name}-${track.artist?.name || track.artist}-${index}`}
                className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-purple-500/50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="text-2xl font-bold text-gray-600 w-8 text-right group-hover:text-purple-400 transition-colors">
                    {index + 1}
                  </div>

                  {/* Album Art */}
                  <div className="w-16 h-16 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0 shadow-lg">
                    {trackImage ? (
                      <img
                        src={trackImage}
                        alt={track.name}
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
                      {track.artist?.name || track.artist}
                    </p>
                  </div>

                  {/* Play Count */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">
                      {parseInt(track.playcount).toLocaleString()}
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

export default TracksView;