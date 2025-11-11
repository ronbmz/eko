import { Music } from 'lucide-react';

const EmptyTracksMessage = ({ hasDates }) => (
  <div className="text-center py-12 text-gray-500">
    {hasDates ? (
      'No tracks found for this date range. Click "Get Stats" to fetch data.'
    ) : (
      <>
        <Music size={48} className="mx-auto mb-4 text-gray-700" />
        Select a date range to see your top tracks
      </>
    )}
  </div>
);

export default EmptyTracksMessage;