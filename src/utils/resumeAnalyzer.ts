import { ResumeScore, ResumeAdvice, ResumeAnalysis, ResumeInsights } from '../types/resume'

export class ResumeAnalyzer {
  private content: string
  private originalContent: string
  private lines: string[]

  constructor(content: string) {
    this.originalContent = content
    this.content = content.toLowerCase()
    this.lines = content.split('\n').filter(line => line.trim().length > 0)
  }

  analyze(): ResumeAnalysis {
    const insights = this.generateInsights()
    const score = this.calculateRealisticScore(insights)
    const advice = this.generateComprehensiveAdvice(score, insights)
    const strengths = this.identifyStrengths(score, insights)
    const criticalIssues = this.identifyCriticalIssues(score, insights)
    const industryMatch = this.calculateIndustryMatch()

    return { score, advice, insights, strengths, criticalIssues, industryMatch }
  }

  private generateInsights(): ResumeInsights {
    const wordCount = this.content.split(/\s+/).length
    const pageEstimate = Math.ceil(wordCount / 250) // Rough estimate
    const experienceYears = this.extractExperienceYears()
    const skillsCount = this.countSkills()
    const quantifiedAchievements = this.countQuantifiedAchievements()
    const actionVerbsUsed = this.countActionVerbs()
    const contactInfoComplete = this.checkContactInfo()
    const sectionsFound = this.identifySections()

    return {
      wordCount,
      pageEstimate,
      experienceYears,
      skillsCount,
      quantifiedAchievements,
      actionVerbsUsed,
      contactInfoComplete,
      sectionsFound
    }
  }

  private calculateRealisticScore(insights: ResumeInsights): ResumeScore {
    // Content scoring (40% of total)
    const experience = this.scoreExperience(insights)
    const skills = this.scoreSkills(insights)
    const education = this.scoreEducation()
    const achievements = this.scoreAchievements(insights)

    // Structure scoring (35% of total)
    const formatting = this.scoreFormatting(insights)
    const sections = this.scoreSections(insights)
    const length = this.scoreLength(insights)
    const readability = this.scoreReadability()

    // Optimization scoring (25% of total)
    const keywords = this.scoreKeywords()
    const actionVerbs = this.scoreActionVerbs(insights)
    const quantification = this.scoreQuantification(insights)
    const relevance = this.scoreRelevance()

    // Calculate weighted overall score
    const contentScore = (experience + skills + education + achievements) / 4
    const structureScore = (formatting + sections + length + readability) / 4
    const optimizationScore = (keywords + actionVerbs + quantification + relevance) / 4
    
    const overall = Math.round(
      contentScore * 0.4 + structureScore * 0.35 + optimizationScore * 0.25
    )

    return {
      overall,
      content: { experience, skills, education, achievements },
      structure: { formatting, sections, length, readability },
      optimization: { keywords, actionVerbs, quantification, relevance }
    }
  }

  private scoreExperience(insights: ResumeInsights): number {
    let score = 0
    
    // Years of experience (40 points max)
    if (insights.experienceYears >= 10) score += 40
    else if (insights.experienceYears >= 5) score += 35
    else if (insights.experienceYears >= 3) score += 25
    else if (insights.experienceYears >= 1) score += 15
    else score += 5

    // Job titles and companies (30 points max)
    const jobTitles = this.countJobTitles()
    score += Math.min(jobTitles * 6, 30)

    // Responsibilities depth (30 points max)
    const responsibilityKeywords = [
      'managed', 'led', 'developed', 'implemented', 'created', 'designed',
      'coordinated', 'supervised', 'executed', 'delivered', 'optimized'
    ]
    const responsibilityCount = responsibilityKeywords.filter(word => 
      this.content.includes(word)
    ).length
    score += Math.min(responsibilityCount * 3, 30)

    return Math.min(score, 100)
  }

  private scoreSkills(insights: ResumeInsights): number {
    let score = 0
    
    // Technical skills variety (50 points max)
    const techSkillsScore = Math.min(insights.skillsCount * 4, 50)
    score += techSkillsScore

    // Skill categorization (25 points max)
    const hasSkillsSection = insights.sectionsFound.includes('skills')
    if (hasSkillsSection) score += 25

    // Soft skills presence (25 points max)
    const softSkills = [
      'leadership', 'communication', 'teamwork', 'problem solving',
      'analytical', 'creative', 'adaptable', 'organized', 'collaborative'
    ]
    const softSkillCount = softSkills.filter(skill => 
      this.content.includes(skill)
    ).length
    score += Math.min(softSkillCount * 5, 25)

    return Math.min(score, 100)
  }

  private scoreEducation(): number {
    let score = 30 // Base score for having any education

    const educationKeywords = [
      'bachelor', 'master', 'phd', 'doctorate', 'degree', 'university', 'college'
    ]
    
    const certifications = [
      'certification', 'certified', 'certificate', 'license', 'accredited'
    ]

    // Degree level (40 points max)
    if (this.content.includes('phd') || this.content.includes('doctorate')) score += 40
    else if (this.content.includes('master') || this.content.includes('mba')) score += 35
    else if (this.content.includes('bachelor')) score += 25
    else if (educationKeywords.some(word => this.content.includes(word))) score += 15

    // Certifications (30 points max)
    const certCount = certifications.filter(cert => this.content.includes(cert)).length
    score += Math.min(certCount * 10, 30)

    return Math.min(score, 100)
  }

  private scoreAchievements(insights: ResumeInsights): number {
    let score = 0

    // Quantified achievements (60 points max)
    score += Math.min(insights.quantifiedAchievements * 12, 60)

    // Achievement indicators (40 points max)
    const achievementWords = [
      'increased', 'improved', 'reduced', 'achieved', 'awarded', 'recognized',
      'promoted', 'exceeded', 'delivered', 'saved', 'generated', 'won'
    ]
    const achievementCount = achievementWords.filter(word => 
      this.content.includes(word)
    ).length
    score += Math.min(achievementCount * 5, 40)

    return Math.min(score, 100)
  }

  private scoreFormatting(insights: ResumeInsights): number {
    let score = 0

    // Contact information (30 points)
    if (insights.contactInfoComplete) score += 30
    else score += 10

    // Section organization (35 points)
    const expectedSections = ['experience', 'education', 'skills']
    const foundExpectedSections = expectedSections.filter(section => 
      insights.sectionsFound.includes(section)
    ).length
    score += (foundExpectedSections / expectedSections.length) * 35

    // Consistency indicators (35 points)
    const hasConsistentDates = /\d{4}/.test(this.content)
    const hasProperStructure = insights.sectionsFound.length >= 3
    
    if (hasConsistentDates) score += 15
    if (hasProperStructure) score += 20

    return Math.min(score, 100)
  }

  private scoreSections(insights: ResumeInsights): number {
    const requiredSections = ['experience', 'education', 'skills', 'contact']
    const optionalSections = ['summary', 'projects', 'certifications', 'awards']
    
    const requiredFound = requiredSections.filter(section => 
      insights.sectionsFound.includes(section)
    ).length
    
    const optionalFound = optionalSections.filter(section => 
      insights.sectionsFound.includes(section)
    ).length

    const requiredScore = (requiredFound / requiredSections.length) * 70
    const optionalScore = Math.min(optionalFound * 7.5, 30)

    return Math.min(requiredScore + optionalScore, 100)
  }

  private scoreLength(insights: ResumeInsights): number {
    // Optimal length: 400-800 words (1-2 pages)
    if (insights.wordCount >= 400 && insights.wordCount <= 800) return 100
    if (insights.wordCount >= 300 && insights.wordCount <= 1000) return 85
    if (insights.wordCount >= 200 && insights.wordCount <= 1200) return 70
    if (insights.wordCount < 200) return 30
    return 50 // Too long
  }

  private scoreReadability(): number {
    let score = 50 // Base score

    // Sentence variety
    const avgWordsPerLine = this.content.split(/\s+/).length / this.lines.length
    if (avgWordsPerLine >= 8 && avgWordsPerLine <= 15) score += 25

    // Bullet points usage
    const bulletPoints = (this.originalContent.match(/[•·▪▫‣⁃]/g) || []).length
    score += Math.min(bulletPoints * 2, 25)

    return Math.min(score, 100)
  }

  private scoreKeywords(): number {
    const industryKeywords = [
      // Tech
      'software', 'development', 'programming', 'coding', 'database', 'api',
      'frontend', 'backend', 'fullstack', 'devops', 'cloud', 'agile', 'scrum',
      // Business
      'management', 'strategy', 'analysis', 'operations', 'marketing', 'sales',
      'finance', 'accounting', 'consulting', 'project management',
      // General professional
      'collaboration', 'innovation', 'efficiency', 'optimization', 'automation'
    ]
    
    const keywordCount = industryKeywords.filter(keyword => 
      this.content.includes(keyword)
    ).length

    return Math.min(keywordCount * 5, 100)
  }

  private scoreActionVerbs(insights: ResumeInsights): number {
    const maxScore = Math.min(insights.actionVerbsUsed * 8, 100)
    return maxScore
  }

  private scoreQuantification(insights: ResumeInsights): number {
    // Numbers, percentages, dollar amounts
    const numbers = (this.content.match(/\d+/g) || []).length
    const percentages = (this.content.match(/\d+%/g) || []).length
    const currency = (this.content.match(/\$\d+/g) || []).length
    
    const quantificationScore = Math.min((numbers + percentages * 2 + currency * 2) * 3, 100)
    return quantificationScore
  }

  private scoreRelevance(): number {
    // This is a simplified relevance score
    // In a real application, this would be based on job description matching
    let score = 60 // Base relevance score

    // Industry-specific terms boost relevance
    const hasIndustryTerms = this.scoreKeywords() > 30
    if (hasIndustryTerms) score += 25

    // Recent experience (last 5 years mentioned)
    const currentYear = new Date().getFullYear()
    const recentYears = [currentYear, currentYear - 1, currentYear - 2, currentYear - 3, currentYear - 4]
    const hasRecentExperience = recentYears.some(year => this.content.includes(year.toString()))
    if (hasRecentExperience) score += 15

    return Math.min(score, 100)
  }

  // Helper methods
  private extractExperienceYears(): number {
    const years = this.content.match(/\d{4}/g) || []
    if (years.length < 2) return 0
    
    const numericYears = years.map(y => parseInt(y)).filter(y => y >= 1990 && y <= new Date().getFullYear())
    if (numericYears.length < 2) return 0
    
    return Math.max(...numericYears) - Math.min(...numericYears)
  }

  private countSkills(): number {
    const commonSkills = [
      // Programming languages
      'javascript', 'python', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust', 'swift',
      // Frameworks/Libraries
      'react', 'angular', 'vue', 'node', 'express', 'django', 'flask', 'spring',
      // Databases
      'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle',
      // Tools/Platforms
      'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'jenkins', 'jira',
      // Other technical
      'html', 'css', 'sql', 'nosql', 'rest', 'graphql', 'microservices',
      // Soft skills
      'leadership', 'communication', 'teamwork', 'problem solving', 'analytical'
    ]
    
    return commonSkills.filter(skill => this.content.includes(skill)).length
  }

  private countQuantifiedAchievements(): number {
    const patterns = [
      /\d+%/, // percentages
      /\$\d+/, // dollar amounts
      /\d+\s*(million|thousand|k\b)/, // large numbers
      /\d+\s*(years?|months?)/, // time periods
      /\d+\s*(people|team|members)/, // team sizes
      /\d+\s*(projects?|clients?|customers?)/ // quantities
    ]
    
    let count = 0
    patterns.forEach(pattern => {
      const matches = this.content.match(pattern) || []
      count += matches.length
    })
    
    return count
  }

  private countActionVerbs(): number {
    const actionVerbs = [
      'achieved', 'managed', 'led', 'developed', 'created', 'implemented',
      'designed', 'coordinated', 'supervised', 'executed', 'delivered',
      'optimized', 'improved', 'increased', 'reduced', 'streamlined',
      'established', 'launched', 'built', 'maintained', 'collaborated'
    ]
    
    return actionVerbs.filter(verb => this.content.includes(verb)).length
  }

  private checkContactInfo(): boolean {
    const hasEmail = /@/.test(this.content)
    const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(this.content)
    return hasEmail && hasPhone
  }

  private identifySections(): string[] {
    const sections = []
    const sectionKeywords = {
      'experience': ['experience', 'work history', 'employment', 'professional experience'],
      'education': ['education', 'academic', 'degree', 'university', 'college'],
      'skills': ['skills', 'technical skills', 'competencies', 'expertise'],
      'contact': ['contact', 'email', 'phone', '@'],
      'summary': ['summary', 'profile', 'objective', 'about'],
      'projects': ['projects', 'portfolio', 'work samples'],
      'certifications': ['certifications', 'certificates', 'licenses'],
      'awards': ['awards', 'honors', 'achievements', 'recognition']
    }
    
    Object.entries(sectionKeywords).forEach(([section, keywords]) => {
      if (keywords.some(keyword => this.content.includes(keyword))) {
        sections.push(section)
      }
    })
    
    return sections
  }

  private countJobTitles(): number {
    const titleIndicators = [
      'engineer', 'developer', 'manager', 'analyst', 'specialist', 'coordinator',
      'director', 'lead', 'senior', 'junior', 'associate', 'consultant',
      'architect', 'designer', 'administrator', 'officer'
    ]
    
    return titleIndicators.filter(title => this.content.includes(title)).length
  }

  private calculateIndustryMatch(): number {
    // Simplified industry matching - in real app, this would be more sophisticated
    return Math.min(this.scoreKeywords() + this.scoreRelevance(), 100) / 2
  }

  private generateComprehensiveAdvice(score: ResumeScore, insights: ResumeInsights): ResumeAdvice[] {
    const advice: ResumeAdvice[] = []

    // Critical issues first
    if (!insights.contactInfoComplete) {
      advice.push({
        category: 'Contact Information',
        issue: 'Missing essential contact details',
        suggestion: 'Include your full name, professional email, phone number, and LinkedIn profile',
        impact: 'critical',
        examples: ['john.doe@email.com', '(555) 123-4567', 'linkedin.com/in/johndoe']
      })
    }

    if (score.content.experience < 50) {
      advice.push({
        category: 'Work Experience',
        issue: 'Insufficient work experience details',
        suggestion: 'Add more detailed descriptions of your roles, responsibilities, and accomplishments',
        impact: 'critical',
        examples: [
          'Led a team of 5 developers to deliver 3 major projects',
          'Increased system performance by 40% through code optimization',
          'Managed $2M budget for infrastructure improvements'
        ]
      })
    }

    if (insights.quantifiedAchievements < 3) {
      advice.push({
        category: 'Achievements',
        issue: 'Lack of quantified accomplishments',
        suggestion: 'Add specific numbers, percentages, and measurable results to your achievements',
        impact: 'high',
        examples: [
          'Reduced processing time by 35%',
          'Managed a team of 12 people',
          'Increased sales by $500K annually'
        ]
      })
    }

    if (score.optimization.actionVerbs < 60) {
      advice.push({
        category: 'Language',
        issue: 'Limited use of strong action verbs',
        suggestion: 'Start bullet points with powerful action verbs to demonstrate impact',
        impact: 'high',
        examples: ['Achieved', 'Implemented', 'Optimized', 'Spearheaded', 'Transformed']
      })
    }

    if (insights.wordCount < 300) {
      advice.push({
        category: 'Content Length',
        issue: 'Resume is too brief',
        suggestion: 'Expand your resume with more detailed descriptions and additional relevant experience',
        impact: 'high'
      })
    }

    if (insights.wordCount > 1000) {
      advice.push({
        category: 'Content Length',
        issue: 'Resume is too lengthy',
        suggestion: 'Condense your resume to 1-2 pages by focusing on most relevant and recent experience',
        impact: 'medium'
      })
    }

    if (score.content.skills < 60) {
      advice.push({
        category: 'Skills Section',
        issue: 'Limited skills listed',
        suggestion: 'Add more relevant technical and soft skills, organized by category',
        impact: 'medium',
        examples: ['Technical: Python, React, AWS', 'Soft: Leadership, Communication, Problem-solving']
      })
    }

    if (score.optimization.keywords < 50) {
      advice.push({
        category: 'Keywords',
        issue: 'Missing industry-relevant keywords',
        suggestion: 'Include more keywords from your target job descriptions and industry',
        impact: 'medium'
      })
    }

    if (score.structure.sections < 70) {
      advice.push({
        category: 'Structure',
        issue: 'Missing important resume sections',
        suggestion: 'Ensure your resume includes: Contact Info, Summary, Experience, Education, and Skills',
        impact: 'medium'
      })
    }

    return advice
  }

  private identifyStrengths(score: ResumeScore, insights: ResumeInsights): string[] {
    const strengths: string[] = []
    
    if (score.content.experience >= 80) strengths.push('Strong work experience with detailed accomplishments')
    if (score.content.skills >= 80) strengths.push('Comprehensive and relevant skill set')
    if (score.content.education >= 80) strengths.push('Excellent educational background and certifications')
    if (score.structure.formatting >= 80) strengths.push('Well-organized and professionally formatted')
    if (score.optimization.quantification >= 80) strengths.push('Excellent use of quantified achievements')
    if (score.optimization.actionVerbs >= 80) strengths.push('Strong use of action verbs and impactful language')
    if (insights.experienceYears >= 5) strengths.push(`Solid ${insights.experienceYears} years of professional experience`)
    if (insights.contactInfoComplete) strengths.push('Complete and professional contact information')

    return strengths
  }

  private identifyCriticalIssues(score: ResumeScore, insights: ResumeInsights): string[] {
    const issues: string[] = []
    
    if (!insights.contactInfoComplete) issues.push('Missing essential contact information')
    if (score.content.experience < 40) issues.push('Insufficient work experience details')
    if (insights.quantifiedAchievements === 0) issues.push('No quantified achievements or results')
    if (score.structure.sections < 50) issues.push('Missing critical resume sections')
    if (insights.wordCount < 200) issues.push('Resume is too short and lacks detail')
    if (score.optimization.actionVerbs < 30) issues.push('Weak language - needs stronger action verbs')

    return issues
  }
}