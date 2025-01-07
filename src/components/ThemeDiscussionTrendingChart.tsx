import { useMemo } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Metric =
  | '外观内饰'
  | '智能系统'
  | '驾驶性能'
  | '空间舒适'
  | '价格成本'
  | '品牌口碑'
  | '购买体验'
  | '售后服务'

type ColorMap = {
  [K in Metric]: string
}

const ThemeDiscussionTrendingChart = ({
  data,
}: {
  data: Record<string, number | string>[]
}) => {
  const colors: ColorMap = {
    外观内饰: '#1890FF',
    智能系统: '#2FC25B',
    驾驶性能: '#FACC14',
    空间舒适: '#223273',
    价格成本: '#FF6D00',
    品牌口碑: '#CF1322',
    购买体验: '#13C2C2',
    售后服务: '#722ED1',
  }

  const metrics = useMemo(() => {
    if (data && data.length > 0) {
      return Object.keys(data[0]).filter((key) => key !== 'date') as Metric[]
    }
    return [] as Metric[]
  }, [data])

  return (
    <div className="h-96 min-h-[600px] w-full p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            stroke="#999"
            tick={{ fill: '#666' }}
            domain={['dataMin', 'dataMax']}
          />
          <YAxis stroke="#888" tick={{ fill: '#666' }} tickCount={8} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <Legend
            align="right"
            verticalAlign="top"
            iconType="circle"
            wrapperStyle={{
              paddingBottom: '20px',
            }}
          />
          {metrics.map((metric) => (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={colors[metric]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              name={metric}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ThemeDiscussionTrendingChart
