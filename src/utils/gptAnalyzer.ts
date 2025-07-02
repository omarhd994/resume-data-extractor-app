import { ResumeAnalysis } from '../types/resume'

export class GPTResumeAnalyzer {
  private apiKey: string
  private content: string

  constructor(content: string, apiKey: string) {
    this.content = content
    this.apiKey = apiKey
  }

  async analyze(): Promise<ResumeAnalysis> {
    try {
      const prompt = this.buildAnalysisPrompt()
      const response = await this.callGPTAPI(prompt)
      return this.parseGPTResponse(response)
    } catch (error) {
      console.error('GPT API Error:', error)
      throw new Error('Failed to analyze resume with AI. Please try again.')
    }
  }

  private buildAnalysisPrompt(): string {
    return `
You are an expert resume reviewer and career coach. Analyze the following resume content and provide a comprehensive evaluation in JSON format.

Resume Content:
"""
${this.content}
"""

Please analyze this resume and return a JSON response with the following structure:

{
  "score": {
    "overall": number (0-100),
    "content": {
      "experience": number (0-100),
      "skills": number (0-100),
      "education": number (0-100),
      "achievements": number (0-100)
    },
    "structure": {
      "formatting": number (0-100),
      "sections": number (0-100),
      "length": number (0-100),
      "readability": number (0-100)
    },
    "optimization": {
      "keywords": number (0-100),
      "actionVerbs": number (0-100),
      "quantification": number (0-100),
      "relevance": number (0-100)
    }
  },
  "advice": [
    {
      "category": "string",
      "issue": "string",
      "suggestion": "string",
      "impact": "critical|high|medium|low",
      "examples": ["string", "string"]
    }
  ],
  "insights": {
    "wordCount": number,
    "pageEstimate": number,
    "experienceYears": number,
    "skillsCount": number,
    "quantifiedAchievements": number,
    "actionVerbsUsed": number,
    "contactInfoComplete": boolean,
    "sectionsFound": ["string"]
  },
  "strengths": ["string"],
  "criticalIssues": ["string"],
  "industryMatch": number (0-100)
}

Scoring Guidelines:
- Overall: Weighted average (Content 40%, Structure 35%, Optimization 25%)
- Be realistic and constructive in scoring
- Consider ATS compatibility
- Focus on actionable feedback

Provide specific, actionable advice with examples. Be honest but constructive in your assessment.
`
  }

  private async callGPTAPI(prompt: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume reviewer and career coach. Provide detailed, actionable feedback in the exact JSON format requested.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`GPT API Error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || ''
  }

  private parseGPTResponse(response: string): ResumeAnalysis {
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response')
      }

      const analysis = JSON.parse(jsonMatch[0])
      
      // Validate required fields
      this.validateAnalysis(analysis)
      
      return analysis as ResumeAnalysis
    } catch (error) {
      console.error('Failed to parse GPT response:', error)
      throw new Error('Failed to parse AI analysis results')
    }
  }

  private validateAnalysis(analysis: any): void {
    const required = ['score', 'advice', 'insights', 'strengths', 'criticalIssues', 'industryMatch']
    
    for (const field of required) {
      if (!(field in analysis)) {
        throw new Error(`Missing required field: ${field}`)
      }
    }

    // Validate score structure
    if (!analysis.score.overall || !analysis.score.content || !analysis.score.structure || !analysis.score.optimization) {
      throw new Error('Invalid score structure')
    }
  }
}