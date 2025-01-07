'use client'

import { useSearchParams } from 'next/navigation' // 引入用来获取 URL 查询参数的 hook
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [platform, setPlatform] = useState('dongchedi')

  // 使用 useSearchParams 获取查询参数
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('query') // 获取名为 'query' 的查询参数

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/data?platform=${platform}`)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        setData(result) // 设置获取到的数据
      } catch (error) {
        setError((error as Error).message) // 设置错误信息
      }
    }

    fetchData()
  }, [searchQuery]) // 依赖 searchQuery，只有它改变时才重新发起请求

  return (
    <div>
      <h1>Search Results</h1>
      <input type="text" />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <pre>{data ? JSON.stringify(data, null, 2) : 'Loading...'}</pre>
    </div>
  )
}
