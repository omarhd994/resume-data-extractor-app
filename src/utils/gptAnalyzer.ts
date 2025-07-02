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
You are an experienced HR professional and career coach who has reviewed thousands of resumes. Analyze this resume and provide practical, realistic feedback that anyone can understand and implement.

Resume Content:
"""
${this.content}
"""

Please analyze this resume and return a JSON response with the following structure. Be realistic in your scoring - most resumes have room for improvement:

{
  "score": {
    "overall": number (0-100, be realistic - average resumes score 60-75),
    "content": {
      "experience": number (0-100, based on how well work history is described),
      "skills": number (0-100, based on relevant skills listed),
      "education": number (0-100, based on educational background),
      "achievements": number (0-100, based on specific accomplishments mentioned)
    },
    "structure": {
      "formatting": number (0-100, how professional and organized it looks),
      "sections": number (0-100, has key sections like contact, experience, education),
      "length": number (0-100, appropriate length - not too short or long),
      "readability": number (0-100, easy to scan and read quickly)
    },
    "optimization": {
      "keywords": number (0-100, uses relevant job-related terms),
      "actionVerbs": number (0-100, uses strong verbs like "managed", "created"),
      "quantification": number (0-100, includes numbers, percentages, results),
      "relevance": number (0-100, content matches typical job requirements)
    }
  },
  "advice": [
    {
      "category": "string (e.g., 'Work Experience', 'Contact Info', 'Skills')",
      "issue": "string (clear, simple explanation of what's missing or wrong)",
      "suggestion": "string (specific, actionable advice anyone can follow)",
      "impact": "critical|high|medium|low",
      "examples": ["practical examples they can use"]
    }
  ],
  "insights": {
    "wordCount": number,
    "pageEstimate": number,
    "experienceYears": number (estimate from dates/content),
    "skillsCount": number (count of skills mentioned),
    "quantifiedAchievements": number (count of numbers/results mentioned),
    "actionVerbsUsed": number,
    "contactInfoComplete": boolean,
    "sectionsFound": ["list of sections like contact, experience, education, skills"]
  },
  "strengths": ["list of what this person is doing well"],
  "criticalIssues": ["list of major problems that need immediate attention"],
  "industryMatch": number (0-100, how well it matches common job requirements)
}

Focus on practical advice:
- Use simple language, not HR jargon
- Give specific examples they can copy
- Focus on what employers actually look for
- Be encouraging but honest
- Suggest realistic improvements
- Consider that most people aren't professional writers

Common issues to look for:
- Missing contact information
- Vague job descriptions
- No specific achievements or results
- Too long or too short
- Poor formatting or organization
- Generic skills lists
- Outdated information
- Spelling/grammar errors
- Missing key sections

Provide advice that helps them get interviews, not just pass automated systems.
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
            content: 'You are an experienced HR professional and career coach. Provide practical, realistic resume feedback that normal people can understand and implement. Focus on what actually helps people get jobs.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2500
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