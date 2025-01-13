'use client'

import { PostInfo } from '@/types'
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
}: {
  resModule: PostInfo[]
}) {
  const scenarios = [
    {
      scenario: '城市通勤',
      description: '用于日常上下班、短途出行等城市内活动。',
      posts: [],
    },
    {
      scenario: '年轻个性',
      description: '用于展示个性、社交、短途旅行等。',
      posts: [],
    },
    {
      scenario: '家庭出行',
      description: '用于日常通勤、周末郊游、长途旅行等家庭活动。',
      posts: [],
    },
    {
      scenario: '户外探险',
      description: '用于越野、露营、长途自驾等户外活动。',
      posts: [],
    },
    {
      scenario: '商务接待',
      description: '用于接送客户、商务会议、出差等正式场合。',
      posts: [],
    },
    {
      scenario: '高端奢华',
      description: '用于展示身份、享受驾驶乐趣、参加高端社交活动。',
      posts: [],
    },
  ]

  const scenarioPosts: Record<string, string[]> = {}
  const scenarioCount: Record<string, number> = {}
  resModule.forEach((item: PostInfo) => {
    if (scenarios.map((item) => item.scenario).includes(item.scenario)) {
      if (scenarioCount[item.scenario]) {
        scenarioCount[item.scenario]++
      } else {
        scenarioCount[item.scenario] = 1
      }

      if (scenarioPosts[item.scenario]) {
        scenarioPosts[item.scenario].push(item.post)
      } else {
        scenarioPosts[item.scenario] = [item.post]
      }
    }
  })

  const scenarioDataArray = scenarios.map(
    (scenario: { scenario: string; description: string }) => {
      const percentage = scenarioCount[scenario.scenario]
        ? (scenarioCount[scenario.scenario] / resModule.length) * 100
        : 0
      return {
        scenario: scenario.scenario,
        percentage: percentage,
        description: scenario.description,
        posts: scenarioPosts[scenario.scenario] || [],
      }
    },
  )

  const data = scenarioDataArray.map((scenarioData) => {
    const percentage = scenarioData.percentage
    return {
      scenario: scenarioData.scenario,
      value: percentage,
    }
  })

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
        {scenarioDataArray.map((scenarioData) => {
          const randomIndex = Math.floor(
            Math.random() * scenarioData.posts.length,
          )
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
                  {scenarioData.posts[randomIndex]}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
