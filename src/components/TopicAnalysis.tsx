import { RawThemeAnalysis } from '@/types'
import { getTopicDiscussionArray } from '@/utils.client'
import Image from 'next/image'

export default function TopicAnalysis({
  themeAnalysisRaw,
  platform,
  product_name,
}: {
  themeAnalysisRaw: RawThemeAnalysis[]
  platform: string
  product_name: string
}) {
  const topicDiscussionArray = getTopicDiscussionArray(themeAnalysisRaw)
  const wordcloudSrc = `/${platform}-${product_name}-wordcloud.png`
  return (
    <div>
      <h1 className="my-4 text-2xl font-bold">话题分析</h1>
      <div className="flex w-full flex-grow justify-start gap-8">
        <div className="w-1/5 min-w-[400px] rounded-lg p-4 ring-2 ring-gray-200">
          <h2 className="text-xl font-bold">热点话题讨论度</h2>
          <ul>
            {topicDiscussionArray.slice(0, 10).map((item) => (
              <li key={item.topic} className="flex w-full justify-between py-4">
                <span
                  className={`${item.isAdvantage ? 'text-green-500' : 'text-red-600'}`}
                >
                  {item.topic}
                </span>
                <span>{Math.ceil(item.percentage)}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex w-fit flex-col gap-4 rounded-lg p-4 ring-2 ring-gray-200">
          <h1 className="text-xl font-bold">用户关注词云</h1>
          <Image src={wordcloudSrc} width={800} height={400} alt="wordcloud" />
        </div>
      </div>
    </div>
  )
}
