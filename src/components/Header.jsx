const Header = () => (
  <div className="mb-12">
    <div className="flex items-center gap-4 mb-8 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-2xl opacity-50"></div>
      <div className="relative flex items-center gap-1">
        <div className="flex gap-1">
          {[8, 12, 16, 20, 16, 12, 8].map((h, i) => (
            <div
              key={i}
              className={`w-1 h-${h} bg-gradient-to-t from-purple-400 to-pink-600 rounded-full animate-pulse delay-${i * 75}`}
            />
          ))}
        </div>
        <h1 className="text-6xl font-black ml-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent animate-gradient bg-300%">
            eko
          </span>
        </h1>
      </div>
    </div>
    <p className="text-gray-400">your listening history, visualized</p>
  </div>
);

export default Header;
