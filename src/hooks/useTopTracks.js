import { useState } from "react";

export function useTopTracks(API_KEY, USERNAME) {
  const [topTracks, setTopTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trackImages, setTrackImages] = useState({});

  // Helper to fetch track image
  const fetchTrackImage = async (track, artist) => {
    try {
      const url = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${API_KEY}&artist=${encodeURIComponent(
        artist
      )}&track=${encodeURIComponent(track)}&format=json`;
      const response = await fetch(url);
      const data = await response.json();
      const image = data.track?.album?.image?.[3] || data.track?.album?.image?.[2];
      return image?.["#text"] || null;
    } catch (err) {
      console.error("Error fetching track image:", err);
      return null;
    }
  };

  // Fetch recent tracks and compute top tracks
  const fetchTopTracks = async (startDate, endDate) => {
    if (!startDate || !endDate) return;

    setLoading(true);
    setError(null);
    setTrackImages({});

    try {
      const from = Math.floor(new Date(startDate).getTime() / 1000);
      const to = Math.floor(new Date(endDate).getTime() / 1000);

      let allTracks = [];
      let page = 1;
      let totalPages = 1;

      // Page through results
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

      // Count track plays
      const trackCountMap = {};
      allTracks.forEach((t) => {
        const artistName = t.artist?.["#text"] || t.artist;
        const key = `${t.name}-${artistName}`;
        if (!trackCountMap[key]) {
          trackCountMap[key] = { ...t, count: 1 };
        } else {
          trackCountMap[key].count += 1;
        }
      });

      // Sort by play count descending
      const sortedTracks = Object.values(trackCountMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 50); // limit to top 50

      setTopTracks(sortedTracks);

      // Fetch album art for top 20
      const imagePromises = sortedTracks.slice(0, 20).map(async (t) => {
        const artistName = t.artist?.["#text"] || t.artist;
        const key = `${t.name}-${artistName}`;
        const existingImage = t.image?.[2]?.["#text"];
        if (existingImage && !existingImage.includes("2a96cbd8b46e442fc41c2b86b821562f"))
          return { key, image: existingImage };
        const image = await fetchTrackImage(t.name, artistName);
        return { key, image };
      });

      const results = await Promise.all(imagePromises);
      const imageMap = {};
      results.forEach(({ key, image }) => image && (imageMap[key] = image));
      setTrackImages(imageMap);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
      setTopTracks([]);
    } finally {
      setLoading(false);
    }
  };

  // Get track image helper
  const getTrackImage = (track) => {
    const artist = track.artist?.["#text"] || track.artist;
    const key = `${track.name}-${artist}`;
    const img = trackImages[key];
    if (img) return img;
    const fallback = track.image?.[2]?.["#text"];
    if (fallback && !fallback.includes("2a96cbd8b46e442fc41c2b86b821562f")) return fallback;
    return null;
  };

  return { topTracks, loading, error, fetchTopTracks, getTrackImage };
}
