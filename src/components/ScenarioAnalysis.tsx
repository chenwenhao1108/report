'use client'

import { PostInfo, ScenarioData, ScenarioRawData } from '@/types'
import { getPostsWithUuid, getScenarioAnalysisData } from '@/utils.client'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

export default function ScenarioAnalysis({
  resModule,
  scenarioAnalysisRaw,
}: {
  resModule: PostInfo[]
  scenarioAnalysisRaw: ScenarioRawData[]
}) {
  const posts = getPostsWithUuid(resModule)
  const scenarioDataArray: ScenarioData[] = getScenarioAnalysisData(
    resModule,
    scenarioAnalysisRaw,
    posts,
  )

  const data = scenarioDataArray.map((scenario: ScenarioData) => ({
    scenario: scenario.scenario,
    value: scenario.percentage,
  }))

  const COLORS = [
    '#1E90FF',
    '#40E0D0',
    '#FF7F50',
    '#DDA0DD',
    '#6A5ACD',
    '#32CD32',
    '#8B4513',
  ]
  return (
    <div>
      <h1 className="my-4 text-2xl font-bold">购车场景分析</h1>
      <div className="my-4 flex flex-col gap-2">
        <span className="text-lg">数据说明：</span>
        <span className="pl-8">
          根据每条评论内容判断评论人的购车场景，得出场景分布。
        </span>
      </div>
      <div className="mb-4 flex h-[500px] flex-col rounded-lg p-4 ring-2 ring-gray-200">
        <h2 className="text-xl font-bold">场景分布</h2>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="80%"
              dataKey="value"
              nameKey="scenario"
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" align="right" verticalAlign="top" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4">
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
                    场景比例 {Math.ceil(scenarioData.percentage)}%
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{scenarioData.description}</p>
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
