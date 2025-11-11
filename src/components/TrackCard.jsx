import { Music } from 'lucide-react';

const TrackCard = ({ track, index, trackImage }) => (
  <div
    className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-purple-500/50 transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className="text-2xl font-bold text-gray-600 w-8 text-right group-hover:text-purple-400 transition-colors">
        {index + 1}
      </div>

      <div className="w-16 h-16 bg-zinc-800 rounded-md overflow-hidden flex-shrink-0 shadow-lg">
        {trackImage ? (
          <img src={trackImage} alt={track.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <Music size={24} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
          {track.name}
        </h3>
        <p className="text-gray-400 text-sm truncate">{track.artist?.name || track.artist}</p>
      </div>

      <div className="text-right">
        <div className="text-2xl font-bold text-purple-400">{parseInt(track.playcount).toLocaleString()}</div>
        <div className="text-xs text-gray-500">plays</div>
      </div>
    </div>
  </div>
);

export default TrackCard;
