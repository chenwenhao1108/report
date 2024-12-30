export interface ReviewProp {
  username: string
  user_type: '车主' | '试驾' | '意向买家'
  content: string
  keywords: string[]
  themes: string[]
  sentiment: '中立' | '正面' | '负面'
  language: string
  hasNoMeaningComment: '是' | '否'
  url: string
}

export interface PostInfo {
  scenario: '独行侠' | '家庭出行' | '周末休闲'
  user_type: '车主' | '试驾' | '意向买家'
  is_valuable: boolean
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

export interface ChartFiled {
  name: string
  value: number
}

export interface RawPost {
  uuid: string
  content: string
}

export interface RawAdvantage {
  summary: string
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

export interface ScenarioData {
  scenario: string
  percentage: number
  description: string
  overall_score: number
  keywords: string[]
  dimensions: [
      {
          dimension:string
          score: number
      }
  ]
  posts: string[]
}

export interface ScenarioRawData {
  scenario: string
  description: string
  overall_score: number
  keywords: string[]
  dimensions: [
      {
          dimension:string
          score: number
      }
  ]
  uuid: string[]
}