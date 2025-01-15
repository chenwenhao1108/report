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
      scenario: '日常通勤',
      description: '用于工作日上下班、城市内短途代步等日常出行场景。',
      posts: [],
    },
    {
      scenario: '接送孩子',
      description: '用于接送孩子上下学、参加课外活动、看病就医等家庭育儿场景。',
      posts: [],
    },
    {
      scenario: '商务出行',
      description: '用于商务会议、客户拜访、机场接送等专业商务场合。',
      posts: [],
    },
    {
      scenario: '周末休闲/自驾游',
      description: '用于周末郊游、景点游览、长途自驾等休闲娱乐活动。',
      posts: [],
    },
    {
      scenario: '网约车/共享出行',
      description: '用于网络预约载客、共享用车等现代化出行服务场景。',
      posts: [],
    },
    {
      scenario: '物流配送',
      description: '用于快递配送、商品运输、同城配送等物流服务场景。',
      posts: [],
    },
    {
      scenario: '户外运动',
      description: '用于越野探险、露营自驾、户外运动等休闲娱乐活动。',
      posts: [],
    },
    {
      scenario: '城市社交',
      description: '用于朋友聚会、约会交友、休闲娱乐等社交活动场景。',
      posts: [],
    },
    {
      scenario: '老年代步',
      description: '用于老年人购物、看病、探亲访友等日常出行场景。',
      posts: [],
    },
  ]

  const scenarioPosts: Record<string, string[]> = {}
  const scenarioCount: Record<string, number> = {}
  const scenarioTitles = scenarios.map((item) => item.scenario)
  const ownerPosts = resModule.filter(
    (item: PostInfo) => item.user_type === '车主',
  )
  ownerPosts.forEach((item: PostInfo) => {
    item.scenario.forEach((scenario) => {
      if (scenarioTitles.includes(scenario)) {
        if (scenarioCount[scenario]) {
          scenarioCount[scenario]++
        } else {
          scenarioCount[scenario] = 1
        }

        if (scenarioPosts[scenario]) {
          scenarioPosts[scenario].push(item.post)
        } else {
          scenarioPosts[scenario] = [item.post]
        }
      }
    })
  })

  const scenarioDataArray = scenarios
    .map((scenario: { scenario: string; description: string }) => {
      const percentage = scenarioCount[scenario.scenario]
        ? (scenarioCount[scenario.scenario] / ownerPosts.length) * 100
        : 0
      return {
        scenario: scenario.scenario,
        percentage: percentage,
        description: scenario.description,
        posts: scenarioPosts[scenario.scenario] || [],
      }
    })
    .sort((a, b) => b.percentage - a.percentage)

  const data = scenarioDataArray.map((scenarioData) => {
    const percentage = scenarioData.percentage
    return {
      scenario: scenarioData.scenario,
      value: Math.ceil(percentage),
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
    '#f38181',
    '#95e1d3',
  ]
  return (
    <div>
      <h1 className="my-4 text-2xl font-bold">购车场景分析</h1>
      <div className="my-4 flex flex-col gap-2">
        <span className="text-lg">数据说明：</span>
        <span className="pl-8">
          根据每条车主评论内容判断车主的购车场景，得出场景分布，由于部分车主评论中没有明确提及场景，因此场景分布数值综合可能不足100%。
        </span>
        <span className="pl-8">
          车主占比：{Math.ceil((ownerPosts.length / resModule.length) * 100)}%
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
