export interface ReviewProp {
  username: string
  user_type: string
  content: string
  keywords: string[]
  themes: string[]
  sentiment: '中立' | '正面' | '负面'
  language: string
  hasNoMeaningComment: '是' | '否'
  url: string
}

export interface PostInfo {
  scenario: string
  user_type: string
  is_valuable: string
  reason: string
  keywords: string[]
  themes: string[]
  sentiment: 'neutral' | 'positive' | 'negative'
  language: string
  timestamp: string
  url: string
  uuid: string
  username: string
  post: string
}

export interface ThemeCount {
  theme: string
  percentage: number
}

export interface TopicCount {
  topic: string
  isAdvantage: boolean
  postsCount: number
}

export interface ChartFiled {
  x: string
  y: number
}

export interface DimensionRatingChartFiled {
  theme: string
  score: number
}

export interface DiscussionHeatChartFiled {
  theme: string
  percentage: number
}

export interface RawPost {
  uuid: string
  content: string
}

export interface RawAdvantage {
  summary: string
  summary_topic: string
  uuid: string[]
  keywords: string[]
}

export interface Advantage {
  summary: string
  content: string[]
  keywords: string[]
}

export interface ThemeAnalysisData {
  theme: string
  advantages: Advantage[]
  disadvantages: Advantage[]
}

export interface RawThemeAnalysis {
  theme: string
  advantage: RawAdvantage[]
  disadvantage: RawAdvantage[]
}

export interface MergedAdvantage {
  summary: string
  summary_topic: string
  platform_data: {
    [platform: string]: {
      keywords: string[]
      uuid: string[]
    }
  }
}

export interface MergedThemeAnalysis {
  theme: string
  advantage: MergedAdvantage[]
  disadvantage: MergedAdvantage[]
}

export interface ScenarioData {
  scenario: string
  percentage: number
  description: string
  overall_score: number
  keywords: string[]
  dimensions: { dimension: string; score: number }[] // 修改这里
  posts: string[]
}

export interface ScenarioRawData {
  scenario: string
  description: string
  overall_score: number
  keywords: string[]
  dimensions: Array<{
    dimension: string
    score: number
  }>
  uuid: string[]
}

export interface TrendingChartField {
  date: string
  number: number
}

export interface AllData {
  [platform: string]: {
    [productName: string]: {
      res_module: PostInfo[]
    }
  }
}

export interface ReleaseData {
  productName: string
  date: string
}
