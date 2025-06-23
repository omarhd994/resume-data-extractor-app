import { ResumeScore, ResumeAdvice, ResumeAnalysis } from '../types/resume'

export class ResumeAnalyzer {
  private content: string

  constructor(content: string) {
    this.content = content.toLowerCase()
  }

  analyze(): ResumeAnalysis {
    const score = this.calculateScore()
    const advice = this.generateAdvice(score)
    const strengths = this.identifyStrengths(score)
    const weaknesses = this.identifyWeaknesses(score)

    return { score, advice, strengths, weaknesses }
  }

  private calculateScore(): ResumeScore {
    const experience = this.scoreExperience()
    const skills = this.scoreSkills()
    const education = this.scoreEducation()
    const formatting = this.scoreFormatting()
    const keywords = this.scoreKeywords()
    const achievements = this.scoreAchievements()

    const overall = Math.round(
      (experience + skills + education + formatting + keywords + achievements) / 6
    )

    return {
      overall,
      experience,
      skills,
      education,
      formatting,
      keywords,
      achievements
    }
  }

  private scoreExperience(): number {
    const experienceKeywords = [
      'experience', 'worked', 'managed', 'led', 'developed', 'created',
      'implemented', 'designed', 'coordinated', 'supervised', 'years'
    ]
    
    const yearMatches = this.content.match(/\d{4}/g) || []
    const experienceMatches = experienceKeywords.filter(keyword => 
      this.content.includes(keyword)
    ).length

    let score = Math.min(experienceMatches * 8, 60)
    if (yearMatches.length >= 4) score += 20
    if (yearMatches.length >= 6) score += 20

    return Math.min(score, 99)
  }

  private scoreSkills(): number {
    const technicalSkills = [
      'javascript', 'python', 'java', 'react', 'node', 'sql', 'html', 'css',
      'git', 'docker', 'aws', 'azure', 'kubernetes', 'typescript', 'angular',
      'vue', 'mongodb', 'postgresql', 'mysql', 'redis', 'graphql', 'rest api'
    ]
    
    const softSkills = [
      'leadership', 'communication', 'teamwork', 'problem solving',
      'analytical', 'creative', 'adaptable', 'organized'
    ]

    const techSkillCount = technicalSkills.filter(skill => 
      this.content.includes(skill)
    ).length
    
    const softSkillCount = softSkills.filter(skill => 
      this.content.includes(skill)
    ).length

    const score = Math.min(techSkillCount * 6 + softSkillCount * 4, 99)
    return score
  }

  private scoreEducation(): number {
    const educationKeywords = [
      'university', 'college', 'degree', 'bachelor', 'master', 'phd',
      'certification', 'course', 'training', 'diploma', 'graduate'
    ]
    
    const matches = educationKeywords.filter(keyword => 
      this.content.includes(keyword)
    ).length

    let score = matches * 15
    if (this.content.includes('master') || this.content.includes('mba')) score += 20
    if (this.content.includes('phd') || this.content.includes('doctorate')) score += 30

    return Math.min(score, 99)
  }

  private scoreFormatting(): number {
    const sections = ['experience', 'education', 'skills', 'contact']
    const sectionCount = sections.filter(section => 
      this.content.includes(section)
    ).length

    const hasEmail = /@/.test(this.content)
    const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(this.content)
    
    let score = sectionCount * 20
    if (hasEmail) score += 10
    if (hasPhone) score += 10

    return Math.min(score, 99)
  }

  private scoreKeywords(): number {
    const industryKeywords = [
      'agile', 'scrum', 'devops', 'ci/cd', 'microservices', 'api',
      'database', 'frontend', 'backend', 'fullstack', 'mobile',
      'web development', 'software engineer', 'data analysis'
    ]
    
    const matches = industryKeywords.filter(keyword => 
      this.content.includes(keyword)
    ).length

    return Math.min(matches * 8, 99)
  }

  private scoreAchievements(): number {
    const achievementIndicators = [
      'increased', 'improved', 'reduced', 'achieved', 'awarded',
      'recognized', 'promoted', 'led team', 'saved', 'generated',
      '%', 'million', 'thousand', 'won', 'first place'
    ]
    
    const matches = achievementIndicators.filter(indicator => 
      this.content.includes(indicator)
    ).length

    return Math.min(matches * 12, 99)
  }

  private generateAdvice(score: ResumeScore): ResumeAdvice[] {
    const advice: ResumeAdvice[] = []

    if (score.experience < 60) {
      advice.push({
        category: 'Experience',
        message: 'Add more detailed work experience with specific responsibilities and achievements',
        priority: 'high'
      })
    }

    if (score.skills < 50) {
      advice.push({
        category: 'Skills',
        message: 'Include more relevant technical and soft skills for your target role',
        priority: 'high'
      })
    }

    if (score.achievements < 40) {
      advice.push({
        category: 'Achievements',
        message: 'Quantify your accomplishments with numbers, percentages, and specific results',
        priority: 'high'
      })
    }

    if (score.keywords < 30) {
      advice.push({
        category: 'Keywords',
        message: 'Include more industry-specific keywords relevant to your field',
        priority: 'medium'
      })
    }

    if (score.formatting < 70) {
      advice.push({
        category: 'Formatting',
        message: 'Ensure your resume has clear sections and complete contact information',
        priority: 'medium'
      })
    }

    if (score.education < 40) {
      advice.push({
        category: 'Education',
        message: 'Add relevant education, certifications, or training programs',
        priority: 'low'
      })
    }

    return advice
  }

  private identifyStrengths(score: ResumeScore): string[] {
    const strengths: string[] = []
    
    if (score.experience >= 80) strengths.push('Strong work experience')
    if (score.skills >= 80) strengths.push('Comprehensive skill set')
    if (score.education >= 80) strengths.push('Excellent educational background')
    if (score.formatting >= 80) strengths.push('Well-structured format')
    if (score.keywords >= 80) strengths.push('Industry-relevant keywords')
    if (score.achievements >= 80) strengths.push('Quantified achievements')

    return strengths
  }

  private identifyWeaknesses(score: ResumeScore): string[] {
    const weaknesses: string[] = []
    
    if (score.experience < 50) weaknesses.push('Limited work experience details')
    if (score.skills < 50) weaknesses.push('Insufficient skills listed')
    if (score.education < 50) weaknesses.push('Missing educational information')
    if (score.formatting < 50) weaknesses.push('Poor formatting structure')
    if (score.keywords < 50) weaknesses.push('Lacks industry keywords')
    if (score.achievements < 50) weaknesses.push('No quantified achievements')

    return weaknesses
  }
}