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
  const positions = [
    {
      position: '高性价比定位',
      description: '配置实用丰富、性能表现均衡、维护成本适中、性价比导向设计',
      posts: [],
    },
    {
      position: '高端奢华定位',
      description: '顶级材质内饰、定制化服务、手工精致工艺、极致舒适体验',
      posts: [],
    },
    {
      position: '运动性能定位',
      description: '强劲动力输出、精准操控表现、竞技级底盘、轻量化车身',
      posts: [],
    },
    {
      position: '商务行政定位',
      description: '后排享受导向、高端科技配置、稳重大气外观、优质用料内饰',
      posts: [],
    },
    {
      position: '科技智能定位',
      description: '智能互联系统、自动驾驶功能、人机交互创新、电动化技术',
      posts: [],
    },
    {
      position: '家用实用定位',
      description: '空间布局合理、可靠耐用性高、经济省油导向、维修保养便利',
      posts: [],
    },
    {
      position: '个性时尚定位',
      description: '独特设计语言、年轻化配置、潮流色彩搭配、个性品牌调性',
      posts: [],
    },
    {
      position: '越野硬派定位',
      description: '强悍通过性能、专业越野系统、坚固车身结构、全地形适应性',
      posts: [],
    },
  ]

  const positionPosts: Record<string, string[]> = {}
  const positionCount: Record<string, number> = {}
  const positionTitles = positions.map((item) => item.position)
  const ownerPosts = resModule.filter(
    (item: PostInfo) => item.user_type === '车主',
  )
  ownerPosts.forEach((item: PostInfo) => {
    item.positioning.forEach((position) => {
      if (positionTitles.includes(position)) {
        if (positionCount[position]) {
          positionCount[position]++
        } else {
          positionCount[position] = 1
        }

        if (positionPosts[position]) {
          positionPosts[position].push(item.post)
        } else {
          positionPosts[position] = [item.post]
        }
      }
    })
  })

  const positionDataArray = positions
    .map((position: { position: string; description: string }) => {
      const percentage = positionCount[position.position]
        ? (positionCount[position.position] / ownerPosts.length) * 100
        : 0
      return {
        position: position.position,
        percentage: percentage,
        description: position.description,
        posts: positionPosts[position.position] || [],
      }
    })
    .sort((a, b) => b.percentage - a.percentage)

  const data = positionDataArray.map((positionData) => {
    const percentage = positionData.percentage
    return {
      position: positionData.position,
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
      <h1 className="my-4 text-2xl font-bold">产品定位分析</h1>
      <div className="my-4 flex flex-col gap-2">
        <span className="text-lg">数据说明：</span>
        <span className="pl-8">
          根据每条车主评论内容判断车主对产品的定位，得出定位分布，由于部分车主帖子中没有明确提及定位，因此定位分布数值综合可能不足100%。
        </span>
        <span className="pl-8">
          车主占比：{Math.ceil((ownerPosts.length / resModule.length) * 100)}%
        </span>
      </div>
      <div className="mb-4 flex h-[500px] flex-col rounded-lg p-4 ring-2 ring-gray-200">
        <h2 className="text-xl font-bold">定位分布</h2>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="80%"
              dataKey="value"
              nameKey="position"
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
        {positionDataArray.map((positionData) => {
          const randomIndex = Math.floor(
            Math.random() * positionData.posts.length,
          )
          return (
            <div
              key={positionData.position}
              className="flex flex-col gap-6 rounded-lg p-4 ring-2 ring-gray-200"
            >
              <div>
                <div className="flex justify-between">
                  <h2 className="text-xl font-bold">{positionData.position}</h2>

                  <span className="h-fit rounded-3xl px-2 text-sm font-medium ring-1 ring-gray-300">
                    定位比例 {Math.ceil(positionData.percentage)}%
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{positionData.description}</p>
              </div>

              <div>
                <h3 className="font-semibold">用户反馈</h3>
                <div className="mt-2 line-clamp-3 border-l-2 border-gray-400 pl-2 italic text-gray-700">
                  {positionData.posts[randomIndex]}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
