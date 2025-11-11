import { Disc } from 'lucide-react';

const LoadingState = () => (
  <div className="text-center py-12 text-gray-400">
    <Disc className="animate-spin mx-auto mb-4" size={32} />
    Fetching your top tracks...
  </div>
);

export default LoadingState;