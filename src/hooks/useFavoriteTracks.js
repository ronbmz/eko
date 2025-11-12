import { useState, useEffect } from 'react';

export function useFavoriteTracks() {
  const [favoriteTracks, setFavoriteTracks] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('favoriteTracks');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setFavoriteTracks(parsed);
      } catch (error) {
        console.error('Error loading favorite tracks:', error);
      }
    }
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('favoriteTracks', JSON.stringify(favoriteTracks));
  }, [favoriteTracks]);

  // Toggle a track as favorite
  const toggleFavorite = (track, imageUrl) => {
    const artist = track.artist?.["#text"] || track.artist;
    const trackId = `${track.name}-${artist}`;

    // Check if already a favorite
    const existingIndex = favoriteTracks.findIndex(
      (fav) => `${fav.name}-${fav.artist}` === trackId
    );

    if (existingIndex !== -1) {
      // Remove from favorites
      setFavoriteTracks((prev) => prev.filter((_, index) => index !== existingIndex));
    } else {
      // Add to favorites (limit to 4)
      if (favoriteTracks.length >= 4) {
        // Replace the oldest favorite
        setFavoriteTracks((prev) => [
          ...prev.slice(1),
          {
            name: track.name,
            artist: artist,
            imageUrl: imageUrl,
          },
        ]);
      } else {
        // Add new favorite
        setFavoriteTracks((prev) => [
          ...prev,
          {
            name: track.name,
            artist: artist,
            imageUrl: imageUrl,
          },
        ]);
      }
    }
  };

  // Check if a track is favorited
  const isFavorite = (track) => {
    const artist = track.artist?.["#text"] || track.artist;
    const trackId = `${track.name}-${artist}`;
    return favoriteTracks.some((fav) => `${fav.name}-${fav.artist}` === trackId);
  };

  // Remove a favorite by index
  const removeFavorite = (index) => {
    setFavoriteTracks((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    favoriteTracks,
    toggleFavorite,
    isFavorite,
    removeFavorite,
  };
}
