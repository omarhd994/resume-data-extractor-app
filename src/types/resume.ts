export interface ResumeScore {
  overall: number
  experience: number
  skills: number
  education: number
  formatting: number
  keywords: number
  achievements: number
}

export interface ResumeAdvice {
  category: string
  message: string
  priority: 'high' | 'medium' | 'low'
}

export interface ResumeAnalysis {
  score: ResumeScore
  advice: ResumeAdvice[]
  strengths: string[]
  weaknesses: string[]
}