'use client'

import { ChartFiled, ThemeAnalysisData } from '@/types'
import { Bar } from '@ant-design/plots'
import { Line } from '@ant-design/charts'


export default function MultiDimensionAnalysis({
  chartData,
  themeAnalysisData,
}: {
  chartData: Record<string, ChartFiled[]>
  themeAnalysisData: ThemeAnalysisData[]
}) {

  const discussionHeatConfig = {
    data: chartData.discussionHeatChart,
    xField: 'name',
    yField: 'value',
    barSize: 70,
    maxBarWidth: 70,
  }

  const dimensionRatingConfig = {
    data: chartData.dimensionRatingChart,
    xField: 'name',
    yField: 'value',
    barSize: 70,
    maxBarWidth: 70
  }

  const trendingConfig = {
    data: chartData.trendingChart,
    xField: 'name',
    yField: 'value',
  }

  const themeRating: Record<string, number> = {}
  chartData.dimensionRatingChart.forEach((item: ChartFiled) => {
    themeRating[item.name] = item.value
  })

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <h1 className="my-4 text-2xl font-bold self-start">银河E8多维度分析</h1>
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
                      <span className="rounded-xl px-2 font-semibold ring-1 ring-gray-300 text-nowrap h-fit ml-2">
                        讨论度
                        {Math.ceil(
                          (advantage.content.length / discussionCount) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex gap-2 overflow-auto py-1 pl-2">
                      {advantage.keywords.map((keyword) => (
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
                      <span className="rounded-xl px-2 font-semibold ring-1 ring-gray-300 text-nowrap h-fit ml-2">
                        讨论度
                        {Math.ceil(
                          (disadvantage.content.length / discussionCount) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex gap-2 overflow-auto py-1 pl-2">
                      {disadvantage.keywords.map((keyword) => (
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
    </div>
  )
}