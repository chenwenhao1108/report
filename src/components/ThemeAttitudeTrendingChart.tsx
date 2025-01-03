import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const ThemeAttitudeTrendingChart = ({
  data,
}: {
  data: Record<string, string | number>[]
}) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="yearMonth" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="negative" stackId="a" fill="#dc2626" />
      <Bar dataKey="neutral" stackId="a" fill="#D3D3D3" />
      <Bar dataKey="positive" stackId="a" fill="#86efac" />
    </BarChart>
  </ResponsiveContainer>
)

export default ThemeAttitudeTrendingChart
