import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const ThemeAttitudeTrendingChart = ({
  data,
}: {
  data: Record<string, string | number>[]
}) => {
  return (
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
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="negative" stackId="a" fill="#dc2626" />
        <Bar dataKey="neutral" stackId="a" fill="#D3D3D3" />
        <Bar dataKey="positive" stackId="a" fill="#86efac" />
        <ReferenceLine
          x="3月"
          stroke="red"
          strokeDasharray="3 3"
          label={{
            value: '发布日',
            position: 'top',
            fill: 'red',
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default ThemeAttitudeTrendingChart
