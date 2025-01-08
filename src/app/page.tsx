'use client'

import MultiDimensionAnalysis from '@/components/MultiDimensionAnalysis'
import ScenarioAnalysis from '@/components/ScenarioAnalysis'
import TopicAnalysis from '@/components/TopicAnalysis'
import UserReviewsTable from '@/components/UserReviewsTable'
import { PostInfo, RawThemeAnalysis, ScenarioRawData } from '@/types'
import { useEffect, useState } from 'react'

export default function Page() {
  const [res_module, setRes_module] = useState<PostInfo[]>([])
  const [filteredResModule, setFilteredResModule] = useState<PostInfo[]>([])
  const [theme_analysis_raw, setTheme_analysis_raw] = useState<
    RawThemeAnalysis[]
  >([])
  const [scenario_analysis_raw, setScenario_analysis_raw] = useState<
    ScenarioRawData[]
  >([])
  const [platforms, setPlatforms] = useState<string[]>(['dongchedi'])
  const [productName, setProductName] = useState('yinhe_e8')
  const [granularity, setGranularity] = useState<'month' | 'day'>('month')

  const [startYear, setStartYear] = useState('')
  const [StartMonth, setStartMonth] = useState('')
  const [startDay, setStartDay] = useState('')
  const [endYear, setEndYear] = useState('')
  const [endMonth, setEndMonth] = useState('')
  const [endDay, setEndDay] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams()

      platforms.forEach((platform) => {
        searchParams.append('platform', platform)
      })

      searchParams.append('product_name', productName)

      try {
        const response = await fetch(`/api/data?${searchParams.toString()}`)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        setRes_module(result['res_module'])
        setFilteredResModule(result['res_module'])
        setTheme_analysis_raw(result['theme_analysis_raw'])
        setScenario_analysis_raw(result['scenario_analysis_raw'])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [platforms, productName])

  const options = [
    { id: 'dongchedi', label: '懂车帝' },
    { id: 'autohome', label: '汽车之家' },
    { id: 'bili', label: 'Bilibili' },
    { id: 'weibo', label: '微博' },
  ]

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const optionId = event.target.id
    if (event.target.checked) {
      setPlatforms((prevSelected) => [...prevSelected, optionId])
    } else {
      setPlatforms((prevSelected) =>
        prevSelected.filter((id) => id !== optionId),
      )
    }
  }

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i,
  )
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const handleDateChange = () => {
    const startDate = `${startYear}-${StartMonth}-${startDay}`
    const endDate = `${endYear}-${endMonth}-${endDay}`
    const filteredResModule = res_module.filter((post: PostInfo) => {
      const postDate = new Date(post.timestamp)
      return postDate >= new Date(startDate) && postDate <= new Date(endDate)
    })
    setFilteredResModule(filteredResModule)
    console.log(filteredResModule.length)
  }

  return (
    <div className="flex flex-col gap-8 px-16 py-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">选择平台：</h2>
          <div className="flex items-center gap-4 space-y-1">
            {options.map((option) => (
              <label key={option.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={option.id}
                  checked={platforms.includes(option.id)}
                  onChange={handleOptionChange}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">选择车型：</h2>
          <div className="flex items-center gap-4 space-y-1">
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 ${productName === 'yinhe_e8' ? 'shadow-inner' : 'shadow-md'}`}
              onClick={() => setProductName('yinhe_e8')}
            >
              银河E8
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 ${productName === 'byd_han' ? 'shadow-inner' : 'shadow-md'}`}
              onClick={() => setProductName('byd_han')}
            >
              比亚迪汉
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 ${productName === 'wenjie_m7' ? 'shadow-inner' : 'shadow-md'}`}
              onClick={() => setProductName('wenjie_m7')}
            >
              问界M7
            </button>
            <button
              className={`rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 ${productName === 'lixiang_l6' ? 'shadow-inner' : 'shadow-md'}`}
              onClick={() => setProductName('lixiang_l6')}
            >
              理想L6
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">选择日期粒度：</h2>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 ${granularity === 'month' ? 'shadow-inner' : 'shadow-md'}`}
            onClick={() => setGranularity('month')}
          >
            月度
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 ${granularity === 'day' ? 'shadow-inner' : 'shadow-md'}`}
            onClick={() => setGranularity('day')}
          >
            日度
          </button>
        </div>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">选择日期范围：</h2>
          <span>From：</span>
          <div className="flex space-x-2">
            <select
              value={startYear}
              onChange={(e) => setStartYear(e.target.value)}
              className="rounded border border-gray-300 p-2"
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={StartMonth}
              onChange={(e) => setStartMonth(e.target.value)}
              className="rounded border border-gray-300 p-2"
            >
              <option value="">Month</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={startDay}
              onChange={(e) => setStartDay(e.target.value)}
              className="rounded border border-gray-300 p-2"
            >
              <option value="">Day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <span>To：</span>
          <div className="flex space-x-2">
            <select
              value={endYear}
              onChange={(e) => setEndYear(e.target.value)}
              className="rounded border border-gray-300 p-2"
            >
              <option value="">Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={endMonth}
              onChange={(e) => setEndMonth(e.target.value)}
              className="rounded border border-gray-300 p-2"
            >
              <option value="">Month</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={endDay}
              onChange={(e) => setEndDay(e.target.value)}
              className="rounded border border-gray-300 p-2"
            >
              <option value="">Day</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleDateChange}
            className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Confirm
          </button>
        </div>
      </div>
      <UserReviewsTable resModule={filteredResModule} />
      <TopicAnalysis
        themeAnalysisRaw={theme_analysis_raw}
        platform={platforms[0]}
        product_name={productName}
      />
      <MultiDimensionAnalysis
        resModule={filteredResModule}
        resModuleRaw={res_module}
        themeAnalysisRaw={theme_analysis_raw}
        granularity={granularity}
      />
      <ScenarioAnalysis
        resModule={res_module}
        scenarioAnalysisRaw={scenario_analysis_raw}
      />
    </div>
  )
}
