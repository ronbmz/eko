import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PlayHistoryGraph({ data, loading, error }) {
  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-zinc-900/50 rounded-lg">
        <div className="text-zinc-400">Loading play history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-zinc-900/50 rounded-lg">
        <div className="text-red-400">Error: {error}</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-zinc-900/50 rounded-lg">
        <div className="text-zinc-400">No play history found for this date range</div>
      </div>
    );
  }

  // Format date for display (e.g., "Jan 15" or "1/15")
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 shadow-lg">
          <p className="text-zinc-300 text-sm font-medium">
            {formatDate(payload[0].payload.date)}
          </p>
          <p className="text-purple-400 text-sm font-bold mt-1">
            {payload[0].value} {payload[0].value === 1 ? 'play' : 'plays'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 bg-zinc-900/50 rounded-lg p-4 border border-zinc-800">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            stroke="#a1a1aa"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            tickLine={{ stroke: '#a1a1aa' }}
          />
          <YAxis
            stroke="#a1a1aa"
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            tickLine={{ stroke: '#a1a1aa' }}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="plays"
            stroke="#a855f7"
            strokeWidth={2}
            dot={{ fill: '#a855f7', r: 4 }}
            activeDot={{ r: 6, fill: '#c084fc' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
