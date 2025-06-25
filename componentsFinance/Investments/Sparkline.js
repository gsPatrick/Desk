// componentsFinance/Investments/Sparkline.js
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const Sparkline = ({ data, color }) => (
  <div className="w-24 h-8">
    <ResponsiveContainer>
      <LineChart data={data.map(value => ({ value }))}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
export default Sparkline;