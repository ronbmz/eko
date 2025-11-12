import { useState } from "react";

export function useTrackPlayHistory(API_KEY, USERNAME) {
  const [playHistory, setPlayHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch play history for a specific track
  const fetchTrackHistory = async (trackName, artistName, startDate, endDate) => {
    if (!trackName || !artistName || !startDate || !endDate) return;

    setLoading(true);
    setError(null);

    try {
      const from = Math.floor(new Date(startDate).getTime() / 1000);
      const to = Math.floor(new Date(endDate).getTime() / 1000);

      let allTracks = [];
      let page = 1;
      let totalPages = 1;

      // Fetch all recent tracks in the date range
      while (page <= totalPages) {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&from=${from}&to=${to}&format=json&limit=200&page=${page}`;
        const res = await fetch(url);
        const data = await res.json();

        const tracks = Array.isArray(data.recenttracks?.track)
          ? data.recenttracks.track
          : [data.recenttracks?.track].filter(Boolean);

        allTracks = allTracks.concat(tracks);

        totalPages = Number(data.recenttracks?.["@attr"]?.totalPages || 1);
        page++;
      }

      // Filter for the specific track
      const trackPlays = allTracks.filter((t) => {
        const tArtist = t.artist?.["#text"] || t.artist;
        return (
          t.name.toLowerCase() === trackName.toLowerCase() &&
          tArtist.toLowerCase() === artistName.toLowerCase()
        );
      });

      // Group by date
      const playsByDate = {};
      trackPlays.forEach((play) => {
        // Skip "now playing" tracks (they don't have a date)
        if (!play.date?.uts) return;

        const timestamp = parseInt(play.date.uts) * 1000;
        const date = new Date(timestamp);
        const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD

        if (!playsByDate[dateKey]) {
          playsByDate[dateKey] = {
            date: dateKey,
            plays: 0,
            timestamp: new Date(dateKey).getTime(),
          };
        }
        playsByDate[dateKey].plays += 1;
      });

      // Convert to array and sort by date
      const historyData = Object.values(playsByDate).sort(
        (a, b) => a.timestamp - b.timestamp
      );

      // Fill in missing dates with 0 plays for better visualization
      const filledHistory = fillMissingDates(historyData, startDate, endDate);

      setPlayHistory(filledHistory);
    } catch (err) {
      setError(`Failed to fetch play history: ${err.message}`);
      setPlayHistory([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to fill in dates with no plays
  const fillMissingDates = (data, startDate, endDate) => {
    if (data.length === 0) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateMap = {};

    // Create map from existing data
    data.forEach((item) => {
      dateMap[item.date] = item;
    });

    // Fill in all dates in range
    const result = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
      const dateKey = currentDate.toISOString().split("T")[0];
      if (dateMap[dateKey]) {
        result.push(dateMap[dateKey]);
      } else {
        result.push({
          date: dateKey,
          plays: 0,
          timestamp: new Date(dateKey).getTime(),
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return result;
  };

  return { playHistory, loading, error, fetchTrackHistory };
}
