'use client'

import { ChartFiled, ThemeAnalysisData } from '@/types'
import { Line } from '@ant-design/charts'
import { Bar } from '@ant-design/plots'
import ThemeAttitudeTrendingChart from './ThemeAttitudeTrendingChart'
import ThemeDiscussionTrendingChart from './ThemeDiscussionTrendingChart'

export default function MultiDimensionAnalysis({
  chartData,
  themeAnalysisData,
  themeTrendingChart,
}: {
  chartData: Record<string, ChartFiled[]>
  themeAnalysisData: ThemeAnalysisData[]
  themeTrendingChart: Record<string, number | string>[][]
}) {
  const discussionHeatConfig = {
    data: chartData.discussionHeatChart,
    xField: 'x',
    yField: 'y',
    barSize: 70,
    maxBarWidth: 70,
  }

  const dimensionRatingConfig = {
    data: chartData.dimensionRatingChart,
    xField: 'x',
    yField: 'y',
    barSize: 100,
    maxBarWidth: 100,
  }

  const trendingConfig = {
    data: chartData.trendingChart,
    xField: 'x',
    yField: 'y',
  }

  const themeRating: Record<string, number> = {}
  chartData.dimensionRatingChart.forEach((item: ChartFiled) => {
    themeRating[item.x] = item.y
  })

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="my-4 self-start text-2xl font-bold">银河E8多维度分析</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="min-w-[400px] overflow-hidden rounded-lg p-4 ring-2 ring-gray-200">
          <h2 className="text-xl font-bold">维度评分</h2>
          <Bar {...dimensionRatingConfig} colorField="#111827" />
        </div>
        <div className="min-w-[400px] overflow-hidden rounded-lg p-4 ring-2 ring-gray-200">
          <h2 className="text-xl font-bold">讨论热度</h2>
          <Bar {...discussionHeatConfig} colorField="#2563eb" />
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
                  {themeRating[data.theme]}分
                </span>
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-green-500">优点</h2>
                {data.advantages.map((advantage, index) => (
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
                        {Math.ceil(
                          (advantage.content.length / discussionCount) * 100,
                        )}
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
                      {advantage.content.slice(0, 3).map((content) => (
                        <p key={content} className="line-clamp-2">
                          {content}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-bold text-red-600">有待改进</h2>
                {data.disadvantages.map((disadvantage, index) => (
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
                        {Math.ceil(
                          (disadvantage.content.length / discussionCount) * 100,
                        )}
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
                      {disadvantage.content.slice(0, 3).map((content) => (
                        <p key={content} className="line-clamp-2">
                          {content}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex w-full flex-col gap-4 rounded-lg p-4 ring-2 ring-gray-200">
        <h2 className="text-xl font-bold">银河E8讨论度趋势</h2>
        <Line {...trendingConfig} />
      </div>
      <div className="flex w-full flex-col gap-4 rounded-lg p-4 ring-2 ring-gray-200">
        <h2 className="text-xl font-bold">主题讨论度趋势</h2>
        <ThemeDiscussionTrendingChart data={themeTrendingChart[0]} />
      </div>
      <div className="flex w-full flex-col gap-4 rounded-lg p-4 ring-2 ring-gray-200">
        <h2 className="text-xl font-bold">讨论态度趋势</h2>
        <ThemeAttitudeTrendingChart data={themeTrendingChart[1]} />
      </div>
    </div>
  )
}
