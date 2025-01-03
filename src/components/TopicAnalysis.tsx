import { TopicCount } from '@/types'
import Image from 'next/image'

export default function TopicAnalysis({
  topicDiscussionArray,
}: {
  topicDiscussionArray: TopicCount[]
}) {
  return (
    <div>
      <h1 className="my-4 text-2xl font-bold">银河E8话题分析</h1>
      <div className="flex w-full flex-grow justify-start gap-8">
        <div className="w-1/5 min-w-[400px] rounded-lg p-4 ring-2 ring-gray-200">
          <h2 className="text-xl font-bold">热点话题讨论度</h2>
          <ul>
            {topicDiscussionArray.slice(0, 10).map((item) => (
              <li key={item.topic} className="flex w-full justify-between py-4">
                <span>{item.topic}</span>
                <span>{Math.ceil(item.percentage)}%</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex w-fit flex-col gap-4 rounded-lg p-4 ring-2 ring-gray-200">
          <h1 className="text-xl font-bold">用户关注词云</h1>
          <Image
            src={'/wordcloud.png'}
            width={800}
            height={400}
            alt="wordcloud"
          />
        </div>
      </div>
    </div>
  )
}
