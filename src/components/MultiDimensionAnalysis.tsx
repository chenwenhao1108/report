'use client'

import {
  DimensionRatingChartFiled,
  MergedThemeAnalysis,
  PostInfo,
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
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import ThemeDiscussionTrendingChart from './ThemeDiscussionTrendingChart'

export default function MultiDimensionAnalysis({
  resModule,
  mergedThemeAnalysis,
  platforms,
  granularity,
  releaseDate,
  productName,
}: {
  resModule: PostInfo[]
  mergedThemeAnalysis: MergedThemeAnalysis[]
  platforms: string[]
  granularity: 'month' | 'day'
  releaseDate: string
  productName: string
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
    mergedThemeAnalysis,
    platforms,
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
          <div className="flex flex-col gap-2">
            <span className="text-lg">数据说明：</span>
            <span>
              根据每个维度下每条评论的情感态度进行统计，情感态度为positive则为100分，neutral则为50分，negative则为0分，取平均值得到。
            </span>
          </div>
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
          <div className="flex flex-col gap-2">
            <span className="text-lg">数据说明：</span>
            <span>
              根据每个维度下的评论数量所占总评论数的比例进行统计，得出用户对产品维度的关注度排序。由于同一个评论所讨论的维度可能不止一个，所以加和大于100%。
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col gap-2">
        <span className="text-lg">维度优缺点数据说明：</span>
        <span className="pl-8">
          右上角评分与上表维度评分一致，每个优缺点的讨论度则为对应优缺点下评论数量所占讨论该维度的评论数量的比例。
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
                            ? (
                                (advantage.content.length / discussionCount) *
                                100
                              ).toFixed(2)
                            : '0.00'}
                          %
                        </span>
                      </div>
                      <div className="flex gap-2 overflow-auto py-1 pl-2">
                        {advantage.keywords
                          .slice(0, 5)
                          .map((keyword, index) => (
                            <span
                              key={index}
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
                            ? (
                                (disadvantage.content.length /
                                  discussionCount) *
                                100
                              ).toFixed(2)
                            : 0}
                          %
                        </span>
                      </div>
                      <div className="flex gap-2 overflow-auto py-1 pl-2">
                        {disadvantage.keywords
                          .slice(0, 5)
                          .map((keyword, index) => (
                            <span
                              key={index}
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
        <div className="flex flex-col gap-2">
          <span className="text-lg">数据说明：</span>
          <span className="pl-8">在当月或当日发布的评论数量。</span>
        </div>
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
            {productName === 'byd_han' && (
              <ReferenceLine
                x={granularity === 'month' ? '2022-06' : '2022-06-15'}
                stroke="red"
                strokeDasharray="3 3"
                label={{
                  value: '改款日',
                  position: 'top',
                  fill: 'black',
                  offset: -15,
                  className: 'font-bold',
                }}
              />
            )}
            <ReferenceLine
              x={releaseDate}
              stroke="red"
              strokeDasharray="3 3"
              label={{
                value: '发布日',
                position: 'top',
                fill: 'black',
                offset: -15,
                className: 'font-bold',
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex w-full flex-col gap-4 rounded-lg p-4 ring-2 ring-gray-200">
        <h2 className="text-xl font-bold">主题讨论度趋势</h2>
        <div className="flex flex-col gap-2">
          <span className="text-lg">数据说明：</span>
          <span className="pl-8">
            在当月或当日发布的对应评价维度的评论数量。
          </span>
        </div>
        {granularity === 'month' ? (
          <ThemeDiscussionTrendingChart
            data={themeDiscussionTrendingChart}
            releaseDate={releaseDate}
            productName={productName}
          />
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
              {productName === 'byd_han' && (
                <ReferenceLine
                  x="2022-06-15"
                  stroke="red"
                  strokeDasharray="3 3"
                  label={{
                    value: '改款日',
                    position: 'top',
                    fill: 'black',
                    offset: -15,
                    className: 'font-bold',
                  }}
                />
              )}
              <ReferenceLine
                x={releaseDate}
                stroke="red"
                strokeDasharray="3 3"
                label={{
                  value: '发布日',
                  position: 'top',
                  fill: 'black',
                  offset: -15,
                  className: 'font-bold',
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="flex w-full flex-col gap-4 rounded-lg p-4 ring-2 ring-gray-200">
        <h2 className="text-xl font-bold">讨论态度趋势</h2>
        <div className="flex flex-col gap-2">
          <span className="text-lg">数据说明：</span>
          <span className="pl-8">在当月或当日所发布评论的态度分布。</span>
        </div>
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
            {productName === 'byd_han' && (
              <ReferenceLine
                x={granularity === 'day' ? '2022-06-15' : '2022-06'}
                stroke="red"
                strokeDasharray="3 3"
                label={{
                  value: '改款日',
                  position: 'top',
                  fill: 'black',
                  offset: -15,
                  className: 'font-bold',
                }}
              />
            )}
            <ReferenceLine
              x={releaseDate}
              stroke="red"
              strokeDasharray="3 3"
              label={{
                value: '发布日',
                position: 'top',
                fill: 'black',
                offset: -15,
                className: 'font-bold',
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
