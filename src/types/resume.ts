export interface ResumeScore {
  overall: number
  content: {
    experience: number
    skills: number
    education: number
    achievements: number
  }
  structure: {
    formatting: number
    sections: number
    length: number
    readability: number
  }
  optimization: {
    keywords: number
    actionVerbs: number
    quantification: number
    relevance: number
  }
}

export interface ResumeAdvice {
  category: string
  issue: string
  suggestion: string
  impact: 'critical' | 'high' | 'medium' | 'low'
  examples?: string[]
}

export interface ResumeInsights {
  wordCount: number
  pageEstimate: number
  experienceYears: number
  skillsCount: number
  quantifiedAchievements: number
  actionVerbsUsed: number
  contactInfoComplete: boolean
  sectionsFound: string[]
}

export interface ResumeAnalysis {
  score: ResumeScore
  advice: ResumeAdvice[]
  insights: ResumeInsights
  strengths: string[]
  criticalIssues: string[]
  industryMatch: number
}