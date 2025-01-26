'use client'

import MultiDimensionAnalysis from '@/components/MultiDimensionAnalysis'
import PositionAnalysis from '@/components/PositionAnalysis'
import ScenarioAnalysis from '@/components/ScenarioAnalysis'
import TopicAnalysis from '@/components/TopicAnalysis'
import UserReviewsTable from '@/components/UserReviewsTable'
import { res_module_data, theme_analysis } from '@/data'
import { AllData, MergedThemeAnalysis, PostInfo } from '@/types'
import { useEffect, useState } from 'react'
export default function Page() {
  const typedThemeAnalysis = theme_analysis as Record<
    string,
    MergedThemeAnalysis[]
  >
  const [allData, setAllData] = useState<AllData>()
  const [res_module, setRes_module] = useState<PostInfo[]>([])
  const [filteredResModule, setFilteredResModule] = useState<PostInfo[]>([])
  const [mergedThemeAnalysis, setMergedThemeAnalysis] = useState<
    MergedThemeAnalysis[]
  >([])
  const [allThemeAnalysis] =
    useState<Record<string, MergedThemeAnalysis[]>>(typedThemeAnalysis)
  const [platforms, setPlatforms] = useState<string[]>([
    'dongchedi',
    'autohome',
    'bili',
    'weibo',
  ])
  const [productName, setProductName] = useState('yinhe_e8')
  const [granularity, setGranularity] = useState<'month' | 'day'>('month')

  const [startYear, setStartYear] = useState('')
  const [StartMonth, setStartMonth] = useState('')
  const [startDay, setStartDay] = useState('')
  const [endYear, setEndYear] = useState('')
  const [endMonth, setEndMonth] = useState('')
  const [endDay, setEndDay] = useState('')

  const [userType, setUserType] = useState('')

  const [releaseDate, setReleaseDate] = useState('')

  const [loading, setLoading] = useState(true)
  const releaseDates: Record<string, string> = {
    yinhe_e8: '2024-01-05',
    wenjie_m7: '2023-09-12',
    byd_han: '2020-07-12',
    lixiang_l6: '2024-04-18',
  }

  useEffect(() => {
    if (granularity === 'day') {
      setReleaseDate(releaseDates[productName])
    } else {
      setReleaseDate(releaseDates[productName].slice(0, 7))
    }
  }, [productName, granularity])

  useEffect(() => {
    setMergedThemeAnalysis(typedThemeAnalysis[productName])
  }, [typedThemeAnalysis, productName])

  useEffect(() => {
    setAllData(res_module_data)
  }, [])

  useEffect(() => {
    if (res_module.length > 0) {
      setLoading(false)
    }
  }, [res_module])

  useEffect(() => {
    const resModules: PostInfo[] = []

    platforms.forEach((platform) => {
      if (
        allData &&
        platform &&
        allData[platform] &&
        allData[platform][productName]
      ) {
        resModules.push(...allData[platform][productName])
      }
    })
    setRes_module(resModules)
    setFilteredResModule(resModules)

    setMergedThemeAnalysis(allThemeAnalysis[productName])
  }, [platforms, productName, allData, allThemeAnalysis])

  useEffect(() => {
    const startDate = `${startYear || '2016'}-${StartMonth || '01'}-${startDay || '01'}`
    const endDate = `${endYear || '2025'}-${endMonth || '12'}-${endDay || '31'}`

    const resModuleFilteredByDate = res_module.filter((post: PostInfo) => {
      const postDate = new Date(post.timestamp)
      return postDate >= new Date(startDate) && postDate <= new Date(endDate)
    })

    if (userType) {
      setFilteredResModule(
        resModuleFilteredByDate.filter(
          (post: PostInfo) => post.user_type === userType,
        ),
      )
    } else {
      setFilteredResModule(resModuleFilteredByDate)
    }
  }, [userType, res_module])

  const options = [
    { id: 'dongchedi', label: '懂车帝' },
    { id: 'autohome', label: '汽车之家' },
    { id: 'bili', label: 'Bilibili' },
    { id: 'weibo', label: '微博' },
  ]

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center text-4xl font-bold">
        Loading...
      </div>
    )
  }
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

  const handleDateReset = () => {
    setStartYear('')
    setStartMonth('')
    setStartDay('')
    setEndYear('')
    setEndMonth('')
    setEndDay('')

    if (userType) {
      setFilteredResModule(
        res_module.filter((post: PostInfo) => post.user_type === userType),
      )
    } else {
      setFilteredResModule(res_module)
    }
  }

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - i,
  )
  const months = Array.from({ length: 12 }, (_, i) => i + 1)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)

  const handleDateChange = () => {
    let resModuleFilteredByUserType = res_module
    if (userType) {
      resModuleFilteredByUserType = res_module.filter(
        (post: PostInfo) => post.user_type === userType,
      )
    }

    const startDate = `${startYear || '2016'}-${StartMonth || '01'}-${startDay || '01'}`
    const endDate = `${endYear || '2025'}-${endMonth || '12'}-${endDay || '31'}`

    const resModuleFilteredByDate = resModuleFilteredByUserType.filter(
      (post: PostInfo) => {
        const postDate = new Date(post.timestamp)
        return postDate >= new Date(startDate) && postDate <= new Date(endDate)
      },
    )
    setFilteredResModule(resModuleFilteredByDate)
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
          <button
            onClick={handleDateReset}
            className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Reset
          </button>
        </div>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">选择用户类型：</h2>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 ${userType ? 'shadow-md' : 'shadow-inner'}`}
            onClick={() => setUserType('')}
          >
            全部
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 ${userType === '车主' ? 'shadow-inner' : 'shadow-md'}`}
            onClick={() => setUserType('车主')}
          >
            车主
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 ${userType === '试驾' ? 'shadow-inner' : 'shadow-md'}`}
            onClick={() => setUserType('试驾')}
          >
            试驾
          </button>
          <button
            className={`rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 ${userType === '意向买家' ? 'shadow-inner' : 'shadow-md'}`}
            onClick={() => setUserType('意向买家')}
          >
            普通网友
          </button>
        </div>
      </div>
      <UserReviewsTable resModule={filteredResModule} />
      <TopicAnalysis
        mergedThemeAnalysis={mergedThemeAnalysis}
        platforms={platforms}
        resModule={filteredResModule}
      />
      <MultiDimensionAnalysis
        releaseDate={releaseDate}
        resModule={filteredResModule}
        mergedThemeAnalysis={mergedThemeAnalysis}
        platforms={platforms}
        granularity={granularity}
        productName={productName}
      />
      <ScenarioAnalysis resModule={filteredResModule} />
      <PositionAnalysis resModule={filteredResModule} />
    </div>
  )
}
