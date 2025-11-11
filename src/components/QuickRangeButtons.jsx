const QuickRangeButtons = ({ setStartDate, setEndDate }) => {
  const setRange = (days) => {
    const today = new Date();
    const past = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
    setStartDate(past.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  return (
    <div className="mb-8 flex gap-2 flex-wrap">
      {[7, 30, 90, 365].map((d, i) => (
        <button
          key={i}
          onClick={() => setRange(d)}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/50 rounded-lg text-sm transition-all"
        >
          Last {d === 365 ? 'year' : `${d} days`}
        </button>
      ))}
    </div>
  );
};

export default QuickRangeButtons;
