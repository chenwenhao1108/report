'use client'

import {
  DimensionRatingChartFiled,
  PostInfo,
  RawThemeAnalysis,
  ThemeAnalysisData,
} from '@/types'
import {
  getChartData,
  getPostsWithUuid,
  getThemeAnalysisData,
  getThemeCount,
} from '@/utils.client'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ThemeDiscussionTrendingChart from './ThemeDiscussionTrendingChart'

export default function MultiDimensionAnalysis({
  resModule,
  themeAnalysisRaw,
  granularity,
}: {
  resModule: PostInfo[]
  themeAnalysisRaw: RawThemeAnalysis[]
  granularity: 'month' | 'day'
}) {
  const { themeCountArray, themeCountObj } = getThemeCount(resModule)

  const {
    dimensionRatingChart,
    discussionHeatChart,
    trendingChart,
    themeAttitudeTrendingChart,
    themeDiscussionTrendingChart,
  } = getChartData(resModule, themeCountArray, themeCountObj, granularity)

  const themes = [
    '外观内饰',
    '智能系统',
    '驾驶性能',
    '空间舒适',
    '价格成本',
    '品牌口碑',
    '购买体验',
    '售后服务',
  ]

  const indexMap = new Map(themes.map((theme, index) => [theme, index]))

  const posts = getPostsWithUuid(resModule)

  const themeAnalysisData: ThemeAnalysisData[] = getThemeAnalysisData(
    posts,
    themeAnalysisRaw,
  ).sort((a, b) => indexMap.get(a.theme)! - indexMap.get(b.theme)!)

  const themeRating: Record<string, number> = {}
  dimensionRatingChart.forEach((item: DimensionRatingChartFiled) => {
    themeRating[item.theme] = item.score
  })

  themeAnalysisData.forEach((item) => {
    let discussionCount = 0
    item.advantages.forEach((advantage) => {
      discussionCount += advantage.content.length
    })
    item.disadvantages.forEach((disadvantage) => {
      discussionCount += disadvantage.content.length
    })
    if (discussionCount === 0) {
      themeRating[item.theme] = 0
    }
  })

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="my-4 self-start text-2xl font-bold">多维度分析</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="min-w-[400px] overflow-hidden rounded-lg p-4 ring-2 ring-gray-200">
          <h2 className="mb-4 text-xl font-bold">维度评分</h2>

          <ResponsiveContainer width="100%" height={400}>
            <BarChart layout="vertical" data={dimensionRatingChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="score"
                domain={[0, 100]}
                tickFormatter={(value) => `${value}分`}
              />
              <YAxis type="category" dataKey="theme" width={100} />
              <Tooltip />
              <Bar dataKey="score" fill="#8884d8" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="min-w-[400px] overflow-hidden rounded-lg p-4 ring-2 ring-gray-200">
          <h2 className="mb-4 text-xl font-bold">讨论热度</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart layout="vertical" data={discussionHeatChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="percentage"
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis type="category" dataKey="theme" width={100} />
              <Tooltip />
              <Bar dataKey="percentage" fill="#2563eb" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {themeAnalysisData.map((data, index) => {
          let discussionCount = 0

          data.advantages.forEach((advantage) => {
            discussionCount += advantage.content.length
          })
          data.disadvantages.forEach((disadvantage) => {
            discussionCount += disadvantage.content.length
          })

          return (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-lg p-4 ring-2 ring-gray-200"
            >
              <div className="flex justify-between">
                <span className="my-2 text-lg font-bold">{data.theme}</span>
                <span className="text-lg font-bold text-gray-400">
                  {themeRating[data.theme] ?? 0}分
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-green-500">优点</h2>
                {data.advantages
                  .sort((a, b) => b.content.length - a.content.length)
                  .map((advantage, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-4 border-l-4 border-green-300 px-4"
                    >
                      <div className="flex justify-between">
                        <h3 className="text-base font-bold">
                          {advantage.summary}
                        </h3>
                        <span className="ml-2 h-fit text-nowrap rounded-xl px-2 font-semibold ring-1 ring-gray-300">
                          讨论度
                          {discussionCount
                            ? Math.ceil(
                                (advantage.content.length / discussionCount) *
                                  100,
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="flex gap-2 overflow-auto py-1 pl-2">
                        {advantage.keywords.slice(0, 5).map((keyword) => (
                          <span
                            key={keyword}
                            className="flex items-center justify-center text-nowrap rounded-xl px-2 text-sm font-semibold ring-1 ring-gray-300"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2 italic text-gray-600">
                        {advantage.content.length > 0 ? (
                          advantage.content.slice(0, 2).map((content) => {
                            return (
                              <p key={content} className="line-clamp-3">
                                {content}
                              </p>
                            )
                          })
                        ) : (
                          <p className="text-gray-400">
                            当前日期范围及用户类型下无评论
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-red-600">有待改进</h2>
                {data.disadvantages
                  .sort((a, b) => b.content.length - a.content.length)
                  .map((disadvantage, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-4 border-l-4 border-red-600 px-4"
                    >
                      <div className="flex justify-between">
                        <h3 className="text-base font-bold">
                          {disadvantage.summary}
                        </h3>
                        <span className="ml-2 h-fit text-nowrap rounded-xl px-2 font-semibold ring-1 ring-gray-300">
                          讨论度
                          {discussionCount
                            ? Math.ceil(
                                (disadvantage.content.length /
                                  discussionCount) *
                                  100,
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="flex gap-2 overflow-auto py-1 pl-2">
                        {disadvantage.keywords.slice(0, 5).map((keyword) => (
                          <span
                            key={keyword}
                            className="flex items-center justify-center text-nowrap rounded-xl px-2 text-sm font-semibold ring-1 ring-gray-300"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-col gap-2 italic text-gray-600">
                        {disadvantage.content.length > 0 ? (
                          disadvantage.content.slice(0, 2).map((content) => (
                            <p key={content} className="line-clamp-3">
                              {content}
                            </p>
                          ))
                        ) : (
                          <p className="text-gray-400">
                            当前日期范围及用户类型下暂无评论
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex w-full flex-col gap-4 rounded-lg p-4 ring-2 ring-gray-200">
        <h2 className="text-xl font-bold">讨论度趋势</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={trendingChart}
            margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
          >
            <Line type="monotone" dataKey="number" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex w-full flex-col gap-4 rounded-lg p-4 ring-2 ring-gray-200">
        <h2 className="text-xl font-bold">主题讨论度趋势</h2>
        {granularity === 'month' ? (
          <ThemeDiscussionTrendingChart data={themeDiscussionTrendingChart} />
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={themeDiscussionTrendingChart}
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
              <Bar dataKey="外观内饰" stackId="a" fill="#1890FF" />
              <Bar dataKey="智能系统" stackId="a" fill="#2FC25B" />
              <Bar dataKey="驾驶性能" stackId="a" fill="#FACC14" />
              <Bar dataKey="空间舒适" stackId="a" fill="#223273" />
              <Bar dataKey="价格成本" stackId="a" fill="#FF6D00" />
              <Bar dataKey="品牌口碑" stackId="a" fill="#CF1322" />
              <Bar dataKey="购买体验" stackId="a" fill="#13C2C2" />
              <Bar dataKey="售后服务" stackId="a" fill="#722ED1" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex w-full flex-col gap-4 rounded-lg p-4 ring-2 ring-gray-200">
        <h2 className="text-xl font-bold">讨论态度趋势</h2>

        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={themeAttitudeTrendingChart}
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
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
