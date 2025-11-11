import { Calendar } from 'lucide-react';

const DateRangePicker = ({ startDate, endDate, setStartDate, setEndDate, fetchTopTracks, loading }) => (
  <div className="mb-8 flex gap-4 items-center flex-wrap">
    {['Start', 'End'].map((label, idx) => (
      <div key={label} className="relative">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 flex items-center gap-2 hover:border-purple-500 transition-colors">
          <Calendar size={18} className="text-purple-400" />
          <input
            type="date"
            value={idx === 0 ? startDate : endDate}
            onChange={(e) => (idx === 0 ? setStartDate(e.target.value) : setEndDate(e.target.value))}
            className="bg-transparent text-sm outline-none"
          />
        </div>
      </div>
    ))}
    <button
      onClick={fetchTopTracks}
      disabled={!startDate || !endDate || loading}
      className="bg-purple-600 hover:bg-purple-700 disabled:bg-zinc-800 disabled:text-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
    >
      {loading ? 'Loading...' : 'Get Stats'}
    </button>
  </div>
);
export default DateRangePicker;
