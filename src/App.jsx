import { useState } from 'react';
import Header from './components/Header';
import DateRangePicker from './components/DateRangePicker';
import QuickRangeButtons from './components/QuickRangeButtons';
import TrackList from './components/TrackList';
import LoadingState from './components/LoadingState';
import ErrorMessage from './components/ErrorMessage';
import EmptyTracksMessage from './components/EmptyTracksMessage';
import Top4Tracks from './components/Top4Tracks';
import { useTopTracks } from './hooks/useTopTracks';
import { useFavoriteTracks } from './hooks/useFavoriteTracks';

const App = () => {

  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(oneMonthAgo.toISOString().slice(0, 10)); // YYYY-MM-DD
  const [endDate, setEndDate] = useState(today.toISOString().slice(0, 10));
  


  const API_KEY = import.meta.env.VITE_LASTFM_KEY;
  const USERNAME = 'ronbmz';

  const { topTracks, loading, error, fetchTopTracks, getTrackImage } =
    useTopTracks(API_KEY, USERNAME);

  const { favoriteTracks, toggleFavorite, isFavorite, removeFavorite } =
    useFavoriteTracks();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <Header />

        <div className="flex gap-8">
          {/* Main content area */}
          <div className="flex-1 min-w-0">
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
              <TrackList
                topTracks={topTracks}
                getTrackImage={getTrackImage}
                apiKey={API_KEY}
                username={USERNAME}
                startDate={startDate}
                endDate={endDate}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
              />
            )}
            {!loading && !error && topTracks.length === 0 && (
              <EmptyTracksMessage hasDates={startDate && endDate} />
            )}
          </div>

          {/* Top 4 Tracks sidebar */}
          <div className="w-80 flex-shrink-0">
            <Top4Tracks
              favoriteTracks={favoriteTracks}
              removeFavorite={removeFavorite}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

