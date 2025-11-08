import React, { useState, useEffect } from 'react';
import { Calendar, Music, Disc } from 'lucide-react';

const App = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [trackImages, setTrackImages] = useState({});

  const API_KEY = '1f8acaf15839f23cf61d58344486daaa';
  const USERNAME = 'ronbmz';

  // Fetch album art for a specific track
  const fetchTrackImage = async (track, artist) => {
    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}&format=json`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.track?.album?.image) {
        // Get the large image (index 2) or extra large (index 3)
        const largeImage = data.track.album.image[3] || data.track.album.image[2];
        return largeImage?.['#text'] || null;
      }
      return null;
    } catch (err) {
      console.error('Error fetching track image:', err);
      return null;
    }
  };

  const fetchTopTracks = async () => {
    if (!startDate || !endDate) return;
    
    setLoading(true);
    setError(null);
    setTrackImages({});
    
    try {
      const fromTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
      const toTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
      
      const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettoptracks&user=${USERNAME}&api_key=${API_KEY}&from=${fromTimestamp}&to=${toTimestamp}&format=json&limit=50`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        setError(`Last.fm error: ${data.message}`);
        setTopTracks([]);
      } else {
        const tracks = data.toptracks?.track || [];
        const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
        setTopTracks(tracksArray);
        
        // Fetch images for top 20 tracks asynchronously
        const imagePromises = tracksArray.slice(0, 20).map(async (track) => {
          const artistName = track.artist?.name || track.artist;
          const trackKey = `${track.name}-${artistName}`;
          
          // First check if track already has a good image
          const existingImage = track.image?.[2]?.['#text'];
          if (existingImage && existingImage !== '' && !existingImage.includes('2a96cbd8b46e442fc41c2b86b821562f')) {
            // That hash is the default Last.fm blank image
            return { key: trackKey, image: existingImage };
          }
          
          // Otherwise fetch from track.getInfo
          const image = await fetchTrackImage(track.name, artistName);
          return { key: trackKey, image };
        });
        
        Promise.all(imagePromises).then(results => {
          const imageMap = {};
          results.forEach(({ key, image }) => {
            if (image) imageMap[key] = image;
          });
          setTrackImages(imageMap);
        });
      }
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
      setTopTracks([]);
    } finally {
      setLoading(false);
    }
  };

  const getTrackImage = (track) => {
    const artistName = track.artist?.name || track.artist;
    const trackKey = `${track.name}-${artistName}`;
    
    // First check our fetched images
    if (trackImages[trackKey]) {
      return trackImages[trackKey];
    }
    
    // Then check if track has image data
    if (track.image && track.image[2]) {
      const imageUrl = track.image[2]['#text'];
      // Check if it's not the default blank image
      if (imageUrl && !imageUrl.includes('2a96cbd8b46e442fc41c2b86b821562f')) {
        return imageUrl;
      }
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Multiple Logo Options - Choose Your Favorite! */}
        <div className="mb-12">
          {/* Font Options - Uncomment your favorite! */}
          
          {/* OPTION 1: Orbitron - Futuristic/Tech (ACTIVE) */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-50"></div>
              <div className="relative flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-1 h-8 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
                  <div className="w-1 h-12 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1 h-16 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-20 bg-gradient-to-t from-purple-400 to-pink-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1 h-16 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-200"></div>
                  <div className="w-1 h-12 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-300"></div>
                  <div className="w-1 h-8 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-500"></div>
                </div>
                <h1 className="text-6xl font-black ml-4" style={{fontFamily: 'Orbitron, sans-serif'}}>
                  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent animate-gradient bg-300%">
                    eco
                  </span>
                </h1>
              </div>
            </div>
          </div>
          
          {/* OPTION 2: Audiowide - Bold Music Industry Style
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-50"></div>
              <div className="relative flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-1 h-8 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
                  <div className="w-1 h-12 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1 h-16 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-20 bg-gradient-to-t from-purple-400 to-pink-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1 h-16 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-200"></div>
                  <div className="w-1 h-12 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-300"></div>
                  <div className="w-1 h-8 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-500"></div>
                </div>
                <h1 className="text-5xl ml-4" style={{fontFamily: 'Audiowide, sans-serif'}}>
                  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent animate-gradient bg-300%">
                    EKO
                  </span>
                </h1>
              </div>
            </div>
          </div>
          */}
          
          {/* OPTION 3: Bungee - Chunky/Bold/Playful
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-50"></div>
              <div className="relative flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-1 h-8 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
                  <div className="w-1 h-12 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1 h-16 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-20 bg-gradient-to-t from-purple-400 to-pink-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1 h-16 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-200"></div>
                  <div className="w-1 h-12 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-300"></div>
                  <div className="w-1 h-8 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-500"></div>
                </div>
                <h1 className="text-5xl ml-4" style={{fontFamily: 'Bungee, sans-serif'}}>
                  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent animate-gradient bg-300%">
                    EKO
                  </span>
                </h1>
              </div>
            </div>
          </div>
          */}
          
          {/* OPTION 4: Teko - Tall/Modern/Sleek
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-50"></div>
              <div className="relative flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-1 h-8 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
                  <div className="w-1 h-12 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1 h-16 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-20 bg-gradient-to-t from-purple-400 to-pink-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1 h-16 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-200"></div>
                  <div className="w-1 h-12 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-300"></div>
                  <div className="w-1 h-8 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-500"></div>
                </div>
                <h1 className="text-7xl font-bold ml-4 -mt-2" style={{fontFamily: 'Teko, sans-serif', letterSpacing: '0.05em'}}>
                  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent animate-gradient bg-300%">
                    EKO
                  </span>
                </h1>
              </div>
            </div>
          </div>
          */}
          
          {/* OPTION 5: Russo One - Industrial/Tech
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-50"></div>
              <div className="relative flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-1 h-8 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse"></div>
                  <div className="w-1 h-12 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse delay-75"></div>
                  <div className="w-1 h-16 bg-gradient-to-t from-purple-400 to-purple-600 rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-20 bg-gradient-to-t from-purple-400 to-pink-500 rounded-full animate-pulse delay-150"></div>
                  <div className="w-1 h-16 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-200"></div>
                  <div className="w-1 h-12 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-300"></div>
                  <div className="w-1 h-8 bg-gradient-to-t from-pink-400 to-pink-600 rounded-full animate-pulse delay-500"></div>
                </div>
                <h1 className="text-5xl ml-4" style={{fontFamily: 'Russo One, sans-serif'}}>
                  <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent animate-gradient bg-300%">
                    EKO
                  </span>
                </h1>
              </div>
            </div>
          </div>
          */}


          <p className="text-gray-400">your listening history, visualized</p>
        </div>

        {/* Date Range Picker */}
        <div className="mb-8 flex gap-4 items-center flex-wrap">
          <div className="relative">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 flex items-center gap-2 hover:border-purple-500 transition-colors">
              <Calendar size={18} className="text-purple-400" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <span className="text-gray-500">to</span>

          <div className="relative">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 flex items-center gap-2 hover:border-purple-500 transition-colors">
              <Calendar size={18} className="text-purple-400" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <button
            onClick={fetchTopTracks}
            disabled={!startDate || !endDate || loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-800 disabled:text-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Loading...' : 'Get Stats'}
          </button>
        </div>

        {/* Quick Date Range Buttons */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <button
            onClick={() => {
              const today = new Date();
              const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
              setStartDate(lastWeek.toISOString().split('T')[0]);
              setEndDate(today.toISOString().split('T')[0]);
            }}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/50 rounded-lg text-sm transition-all"
          >
            Last 7 days
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
              setStartDate(lastMonth.toISOString().split('T')[0]);
              setEndDate(today.toISOString().split('T')[0]);
            }}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/50 rounded-lg text-sm transition-all"
          >
            Last 30 days
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const last3Months = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
              setStartDate(last3Months.toISOString().split('T')[0]);
              setEndDate(today.toISOString().split('T')[0]);
            }}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/50 rounded-lg text-sm transition-all"
          >
            Last 3 months
          </button>
          <button
            onClick={() => {
              const today = new Date();
              const lastYear = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
              setStartDate(lastYear.toISOString().split('T')[0]);
              setEndDate(today.toISOString().split('T')[0]);
            }}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/50 rounded-lg text-sm transition-all"
          >
            Last year
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-gray-400">
            <Disc className="animate-spin mx-auto mb-4" size={32} />
            Fetching your top tracks...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-900 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        {/* Top Tracks Grid */}
        {!loading && !error && topTracks.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-gray-200">
              Top Tracks
              <span className="text-sm text-gray-500 ml-3 font-normal">
                {topTracks.length} tracks • {topTracks.reduce((acc, t) => acc + parseInt(t.playcount), 0).toLocaleString()} total plays
              </span>
            </h2>
            <div className="space-y-3">
              {topTracks.map((track, index) => {
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
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && topTracks.length === 0 && startDate && endDate && (
          <div className="text-center py-12 text-gray-500">
            No tracks found for this date range. Click "Get Stats" to fetch data.
          </div>
        )}

        {/* Initial State */}
        {!loading && !error && !startDate && !endDate && (
          <div className="text-center py-12 text-gray-500">
            <Music size={48} className="mx-auto mb-4 text-gray-700" />
            Select a date range to see your top tracks
          </div>
        )}
      </div>
    </div>
  );
};

export default App;