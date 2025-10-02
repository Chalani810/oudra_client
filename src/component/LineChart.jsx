import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 8200000 },
  { name: 'Feb', value: 8400000 },
  { name: 'Mar', value: 8300000 },
  { name: 'Apr', value: 8500000 },
  { name: 'May', value: 8700000 },
];

export default function LineChartComponent() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#6366f1" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
