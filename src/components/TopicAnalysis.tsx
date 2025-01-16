'use client'

import { MergedThemeAnalysis, PostInfo } from '@/types'
import { getPostsWithUuid, getTopicDiscussionArray } from '@/utils.client'
import WordCloudComponent from './WordCloud'

export default function TopicAnalysis({
  resModule,
  mergedThemeAnalysis,
  platforms,
}: {
  resModule: PostInfo[]
  mergedThemeAnalysis: MergedThemeAnalysis[]
  platforms: string[]
}) {
  const posts = getPostsWithUuid(resModule)

  const topicDiscussionArray = getTopicDiscussionArray(
    mergedThemeAnalysis,
    posts,
    platforms,
  )

  const wordsCount = topicDiscussionArray.reduce(
    (acc, cur) => acc + cur.postsCount,
    0,
  )

  const words: [string, number][] = topicDiscussionArray.map((item) => [
    item.topic,
    (Math.ceil(item.postsCount) / wordsCount) * 100,
  ])

  return (
    <div>
      <h1 className="my-4 text-2xl font-bold">关键词分析</h1>
      <div className="flex w-full flex-grow justify-start gap-8">
        <div className="w-1/5 min-w-[400px] rounded-lg p-4 ring-2 ring-gray-200">
          <h2 className="text-xl font-bold">关键词讨论度</h2>
          <ul>
            {topicDiscussionArray.slice(0, 10).map((item) => (
              <li key={item.topic} className="flex w-full justify-between py-4">
                <span
                  className={`${item.isAdvantage ? 'text-green-500' : 'text-red-600'}`}
                >
                  {item.topic}
                </span>
                <span>{Math.ceil(item.postsCount)}条</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex w-fit flex-col gap-4 rounded-lg p-4 ring-2 ring-gray-200">
          <h1 className="text-xl font-bold">用户关注词云</h1>
          <WordCloudComponent words={words} />
        </div>
      </div>
    </div>
  )
}
