import { useState } from 'react';
import Header from './components/Header';
import DateRangePicker from './components/DateRangePicker';
import QuickRangeButtons from './components/QuickRangeButtons';
import TrackList from './components/TrackList';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import EmptyTracksMessage from './components/EmptyTracksMessage';
import { useTopTracks } from './hooks/useTopTracks';

const App = () => {

  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(oneMonthAgo.toISOString().slice(0, 10)); // YYYY-MM-DD
  const [endDate, setEndDate] = useState(today.toISOString().slice(0, 10));
  


  const { topTracks, loading, error, fetchTopTracks, getTrackImage } =
    useTopTracks(import.meta.env.VITE_LASTFM_KEY, 'ronbmz');

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <Header />
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          fetchTopTracks={() => fetchTopTracks(startDate, endDate)}
          loading={loading}
        />
        <QuickRangeButtons setStartDate={setStartDate} setEndDate={setEndDate} />
        {loading && <LoadingState />}
        {error && <ErrorMessage error={error} />}
        {!loading && !error && topTracks.length > 0 && (
          <TrackList topTracks={topTracks} getTrackImage={getTrackImage} />
        )}
        {!loading && !error && topTracks.length === 0 && (
          <EmptyTracksMessage hasDates={startDate && endDate} />
        )}
      </div>
    </div>
  );
};

export default App;

