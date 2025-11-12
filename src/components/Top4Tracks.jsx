import { Music, X } from 'lucide-react';

export default function Top4Tracks({ favoriteTracks, removeFavorite }) {
  // Create array of 4 slots, filling empty ones with null
  const slots = Array(4).fill(null).map((_, index) => favoriteTracks[index] || null);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 sticky top-8">
      <h2 className="text-xl font-semibold text-gray-200 mb-4">
        Top 4 Tracks
      </h2>

      <div className="grid grid-cols-2 gap-3">
        {slots.map((track, index) => (
          <div
            key={index}
            className="aspect-square bg-zinc-800 rounded-lg overflow-hidden border-2 border-zinc-700 relative group"
          >
            {track ? (
              <>
                {/* Track Image */}
                {track.imageUrl ? (
                  <img
                    src={track.imageUrl}
                    alt={`${track.name} by ${track.artist}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <Music size={32} />
                  </div>
                )}

                {/* Hover overlay with track info */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-3 text-center">
                  <p className="text-white font-semibold text-sm line-clamp-2">
                    {track.name}
                  </p>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                    {track.artist}
                  </p>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFavorite(index)}
                    className="mt-3 p-1.5 bg-red-600 hover:bg-red-700 rounded-full transition-colors"
                    title="Remove from favorites"
                  >
                    <X size={16} />
                  </button>
                </div>
              </>
            ) : (
              // Empty slot
              <div className="w-full h-full flex items-center justify-center text-gray-600">
                <div className="text-center">
                  <Music size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="text-xs text-gray-600">Empty slot</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        Click the heart icon on tracks to add them here
      </p>
    </div>
  );
}
