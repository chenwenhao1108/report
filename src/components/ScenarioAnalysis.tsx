'use client'

import { ScenarioData } from '@/types'
import { Pie } from '@ant-design/plots'

export default function ScenarioAnalysis({
  scenarioDataArray,
}: {
  scenarioDataArray: ScenarioData[]
}) {
  const data = scenarioDataArray.map((scenario: ScenarioData) => ({
    scenario: scenario.scenario,
    value: scenario.percentage,
  }))

  const config = {
    data,
    angleField: 'value',
    colorField: 'scenario',
    innerRadius: 0.6,
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
  }

  return (
    <div>
      <h1 className="my-4 text-2xl font-bold">购车场景分析</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col rounded-lg p-4 ring-2 ring-gray-200">
          <h2 className="text-xl font-bold">场景分布</h2>
          <Pie {...config} />
        </div>
        {scenarioDataArray.map((scenarioData: ScenarioData) => {
          return (
            <div
              key={scenarioData.scenario}
              className="flex flex-col gap-6 rounded-lg p-4 ring-2 ring-gray-200"
            >
              <div>
                <div className="flex justify-between">
                  <h2 className="text-xl font-bold">
                    主导场景：{scenarioData.scenario}
                  </h2>

                  <span className="h-fit rounded-3xl px-2 text-sm font-medium ring-1 ring-gray-300">
                    {scenarioData.percentage}%
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{scenarioData.description}</p>
              </div>

              <div className="flex justify-between">
                <h3 className="font-semibold">整体匹配度</h3>
                <span className="text-gray-700">
                  {scenarioData.overall_score}%
                </span>
              </div>
              <div className="flex gap-2">
                {scenarioData.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="flex items-center justify-center rounded-xl px-2 text-sm font-medium ring-2 ring-gray-200"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="font-semibold">维度匹配</h3>
                {scenarioData.dimensions.map((dimension) => (
                  <div
                    key={dimension.dimension}
                    className="flex justify-between"
                  >
                    <span className="text-gray-700">{dimension.dimension}</span>
                    <span className="text-sm text-gray-700">
                      {dimension.score}%
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="font-semibold">用户反馈</h3>
                <div className="mt-2 line-clamp-3 border-l-2 border-gray-400 pl-2 italic text-gray-700">
                  {scenarioData.posts[0]}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
